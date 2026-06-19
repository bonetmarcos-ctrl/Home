import { AppError } from "../application/AppError.js";
import type { UserRecord, UserRepository } from "../application/repositories.js";

export class MemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, UserRecord>();

  async findByUsername(username: string): Promise<UserRecord | null> {
    return this.users.get(username.toLowerCase()) ?? null;
  }

  async create(user: UserRecord): Promise<UserRecord> {
    const key = user.username.toLowerCase();
    if (this.users.has(key)) {
      throw new AppError(409, "Username already exists", "USER_EXISTS");
    }

    this.users.set(key, { ...user });
    return { ...user };
  }
}