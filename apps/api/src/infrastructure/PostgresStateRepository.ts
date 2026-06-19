import { createInitialState, parseAppState, type AppState } from "@habitacion/domain";
import pg from "pg";
import type { StateRepository } from "../application/repositories.js";

const DEFAULT_OWNER = "__default__";

export class PostgresStateRepository implements StateRepository {
  private readonly pool: pg.Pool;
  private ready?: Promise<void>;

  constructor(connectionString: string) {
    this.pool = new pg.Pool({ connectionString });
  }

  async read(ownerId = DEFAULT_OWNER): Promise<AppState> {
    await this.ensureReady();
    const ownerKey = ownerId || DEFAULT_OWNER;
    const result = await this.pool.query("select state from app_states where owner_id = $1", [ownerKey]);

    if (result.rowCount && result.rows[0]?.state) {
      return parseAppState(result.rows[0].state);
    }

    const state = createInitialState();
    await this.write(state, ownerKey);
    return state;
  }

  async write(state: AppState, ownerId = DEFAULT_OWNER): Promise<void> {
    await this.ensureReady();
    await this.pool.query(
      `insert into app_states (owner_id, state, updated_at)
       values ($1, $2::jsonb, now())
       on conflict (owner_id)
       do update set state = excluded.state, updated_at = now()`,
      [ownerId || DEFAULT_OWNER, JSON.stringify(parseAppState(state))]
    );
  }

  private async ensureReady(): Promise<void> {
    this.ready ??= this.pool
      .query(
        `create table if not exists app_states (
          owner_id text primary key,
          state jsonb not null,
          updated_at timestamptz not null default now()
        )`
      )
      .then(() => undefined);
    return this.ready;
  }
}