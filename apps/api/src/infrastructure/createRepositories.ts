import type { Env } from "../config/env.js";
import { JsonStateRepository } from "./JsonStateRepository.js";
import { JsonUserRepository } from "./JsonUserRepository.js";
import { PostgresStateRepository } from "./PostgresStateRepository.js";
import { PostgresUserRepository } from "./PostgresUserRepository.js";

export function createRepositories(env: Env) {
  if (env.DATABASE_URL) {
    return {
      repository: new PostgresStateRepository(env.DATABASE_URL),
      userRepository: new PostgresUserRepository(env.DATABASE_URL)
    };
  }

  return {
    repository: new JsonStateRepository(env.DATA_FILE),
    userRepository: new JsonUserRepository(env.USERS_FILE)
  };
}