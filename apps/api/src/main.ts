import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { createRepositories } from "./infrastructure/createRepositories.js";

const { repository, userRepository } = createRepositories(env);

const app = createApp({
  repository,
  userRepository,
  authConfig: {
    username: env.AUTH_USERNAME,
    password: env.AUTH_PASSWORD,
    passwordHash: env.AUTH_PASSWORD_HASH,
    jwtSecret: env.AUTH_JWT_SECRET,
    cookieName: env.AUTH_COOKIE_NAME,
    ttlSeconds: env.AUTH_SESSION_TTL_SECONDS,
    secureCookie: env.NODE_ENV === "production",
    corsOrigin: env.CORS_ORIGIN,
    nodeEnv: env.NODE_ENV
  }
});

app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});