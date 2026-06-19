import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { AppError } from "../application/AppError.js";
import type { UserRecord, UserRepository } from "../application/repositories.js";

interface StoredUsers {
  users: UserRecord[];
}

export class JsonUserRepository implements UserRepository {
  constructor(private readonly filePath: string) {}

  async findByUsername(username: string): Promise<UserRecord | null> {
    const stored = await this.readStored();
    return stored.users.find((user) => user.username.toLowerCase() === username.toLowerCase()) ?? null;
  }

  async create(user: UserRecord): Promise<UserRecord> {
    const stored = await this.readStored();
    if (stored.users.some((existing) => existing.username.toLowerCase() === user.username.toLowerCase())) {
      throw new AppError(409, "Username already exists", "USER_EXISTS");
    }

    stored.users.push(user);
    await this.writeStored(stored);
    return user;
  }

  private async readStored(): Promise<StoredUsers> {
    try {
      const parsed = JSON.parse(await readFile(this.filePath, "utf8")) as Partial<StoredUsers>;
      return { users: Array.isArray(parsed.users) ? parsed.users : [] };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        const stored = { users: [] };
        await this.writeStored(stored);
        return stored;
      }
      throw error;
    }
  }

  private async writeStored(stored: StoredUsers): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, `${JSON.stringify(stored, null, 2)}\n`, "utf8");
  }
}