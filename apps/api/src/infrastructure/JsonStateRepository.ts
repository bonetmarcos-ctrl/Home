import { appStateSchema, createInitialState, parseAppState, type AppState } from "@habitacion/domain";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { StateRepository } from "../application/repositories.js";

const DEFAULT_OWNER = "__default__";

interface StoredStates {
  owners: Record<string, unknown>;
}

function isStoredStates(value: unknown): value is StoredStates {
  return typeof value === "object" && value !== null && "owners" in value;
}

export class JsonStateRepository implements StateRepository {
  constructor(private readonly filePath: string) {}

  async read(ownerId = DEFAULT_OWNER): Promise<AppState> {
    const stored = await this.readStored();
    const key = ownerId || DEFAULT_OWNER;

    if (isStoredStates(stored)) {
      const state = stored.owners[key] ?? stored.owners[DEFAULT_OWNER] ?? createInitialState();
      if (!stored.owners[key]) {
        stored.owners[key] = state;
        await this.writeStored(stored);
      }
      return parseAppState(state);
    }

    const migratedState = appStateSchema.parse(stored);
    await this.writeStored({ owners: { [key]: migratedState } });
    return migratedState;
  }

  async write(state: AppState, ownerId = DEFAULT_OWNER): Promise<void> {
    const key = ownerId || DEFAULT_OWNER;
    const stored = await this.readStored();
    const owners = isStoredStates(stored) ? stored.owners : { [DEFAULT_OWNER]: appStateSchema.parse(stored) };
    owners[key] = parseAppState(state);
    await this.writeStored({ owners });
  }

  private async readStored(): Promise<unknown> {
    try {
      return JSON.parse(await readFile(this.filePath, "utf8"));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        const stored = { owners: { [DEFAULT_OWNER]: createInitialState() } };
        await this.writeStored(stored);
        return stored;
      }
      throw error;
    }
  }

  private async writeStored(stored: StoredStates): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, `${JSON.stringify(stored, null, 2)}\n`, "utf8");
  }
}