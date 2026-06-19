import type { AppState } from "@habitacion/domain";

export interface StateRepository {
  read(ownerId?: string): Promise<AppState>;
  write(state: AppState, ownerId?: string): Promise<void>;
}

export interface UserRecord {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

export interface UserRepository {
  findByUsername(username: string): Promise<UserRecord | null>;
  create(user: UserRecord): Promise<UserRecord>;
}