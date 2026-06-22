import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { AppStateService } from "./application/AppStateService.js";
import { AuthService, type AuthConfig } from "./application/AuthService.js";
import type { StateRepository, UserRepository } from "./application/repositories.js";
import { createAuthRouter } from "./interfaces/http/authRouter.js";
import { createCollectionRouter } from "./interfaces/http/collectionRouter.js";
import { errorMiddleware } from "./interfaces/http/errorMiddleware.js";
import { createStateRouter } from "./interfaces/http/stateRouter.js";

export interface CreateAppOptions {
  repository: StateRepository;
  userRepository?: UserRepository;
  authConfig: AuthConfig;
  webDistPath?: string;
}

export function createApp({ repository, userRepository, authConfig, webDistPath }: CreateAppOptions) {
  const app = express();
  const stateService = new AppStateService(repository);
  const authService = new AuthService(authConfig, userRepository);

  app.use(
    cors({
      origin: authConfig.corsOrigin,
      credentials: true
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "2mb" }));

  app.get("/api/health", (_request, response) => {
    response.json({ ok: true });
  });
  app.use("/api/auth", createAuthRouter(authService, authConfig));
  app.use("/api", createStateRouter(stateService, authConfig));
  app.use("/api", createCollectionRouter(stateService, authConfig));

  if (authConfig.nodeEnv === "production") {
    const apiDir = dirname(fileURLToPath(import.meta.url));
    const webDist = webDistPath ?? resolve(apiDir, "../../web/dist");
    if (existsSync(webDist)) {
      app.use(express.static(webDist));
      app.get("*", (_request, response) => {
        response.sendFile(resolve(webDist, "index.html"));
      });
    }
  }

  app.use(errorMiddleware);
  return app;
}