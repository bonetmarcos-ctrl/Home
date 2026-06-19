import pg from "pg";
import { AppError } from "../application/AppError.js";
import type { UserRecord, UserRepository } from "../application/repositories.js";

export class PostgresUserRepository implements UserRepository {
  private readonly pool: pg.Pool;
  private ready?: Promise<void>;

  constructor(connectionString: string) {
    this.pool = new pg.Pool({ connectionString });
  }

  async findByUsername(username: string): Promise<UserRecord | null> {
    await this.ensureReady();
    const result = await this.pool.query(
      `select id, username, password_hash as "passwordHash", created_at as "createdAt"
       from app_users
       where lower(username) = lower($1)`,
      [username]
    );
    return result.rows[0] ?? null;
  }

  async create(user: UserRecord): Promise<UserRecord> {
    await this.ensureReady();
    try {
      await this.pool.query(
        "insert into app_users (id, username, password_hash, created_at) values ($1, $2, $3, $4)",
        [user.id, user.username, user.passwordHash, user.createdAt]
      );
    } catch (error) {
      if ((error as { code?: string }).code === "23505") {
        throw new AppError(409, "Username already exists", "USER_EXISTS");
      }
      throw error;
    }
    return user;
  }

  private async ensureReady(): Promise<void> {
    this.ready ??= this.pool
      .query(
        `create table if not exists app_users (
          id text primary key,
          username text not null unique,
          password_hash text not null,
          created_at timestamptz not null
        )`
      )
      .then(() => undefined);
    return this.ready;
  }
}