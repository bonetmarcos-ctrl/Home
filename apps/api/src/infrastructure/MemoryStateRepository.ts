import { createInitialState, parseAppState, type AppState } from "@habitacion/domain";
import type { StateRepository } from "../application/repositories.js";

const DEFAULT_OWNER = "__default__";

export class MemoryStateRepository implements StateRepository {
  private readonly states = new Map<string, AppState>();

  constructor(initialState: AppState = createInitialState()) {
    this.states.set(DEFAULT_OWNER, parseAppState(initialState));
  }

  async read(ownerId = DEFAULT_OWNER): Promise<AppState> {
    const key = ownerId || DEFAULT_OWNER;
    if (!this.states.has(key)) {
      this.states.set(key, parseAppState(createInitialState()));
    }

    return structuredClone(this.states.get(key)!);
  }

  async write(state: AppState, ownerId = DEFAULT_OWNER): Promise<void> {
    this.states.set(ownerId || DEFAULT_OWNER, structuredClone(parseAppState(state)));
  }
}