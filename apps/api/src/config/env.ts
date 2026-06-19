import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  DATA_FILE: z.string().default("./apps/api/data/state.json"),
  USERS_FILE: z.string().default("./apps/api/data/users.json"),
  DATABASE_URL: z.string().optional().default(""),
  AUTH_USERNAME: z.string().default("admin"),
  AUTH_PASSWORD: z.string().default("admin"),
  AUTH_PASSWORD_HASH: z.string().optional().default(""),
  AUTH_JWT_SECRET: z.string().default("dev-secret-change-me"),
  AUTH_COOKIE_NAME: z.string().default("app_session"),
  AUTH_SESSION_TTL_SECONDS: z.coerce.number().int().positive().default(604800)
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);