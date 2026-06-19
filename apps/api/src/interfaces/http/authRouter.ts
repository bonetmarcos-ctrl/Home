import { Router } from "express";
import { z } from "zod";
import type { AuthConfig, AuthService } from "../../application/AuthService.js";
import { asyncHandler } from "./asyncHandler.js";
import {
  clearSessionCookie,
  createAuthMiddleware,
  getAuth,
  issueSessionCookie
} from "./authMiddleware.js";

const credentialsSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1)
});

export function createAuthRouter(authService: AuthService, config: AuthConfig): Router {
  const router = Router();
  const requireAuth = createAuthMiddleware(config);

  router.get(
    "/me",
    requireAuth,
    asyncHandler(async (request, response) => {
      response.json({ user: getAuth(request) });
    })
  );

  router.post(
    "/login",
    asyncHandler(async (request, response) => {
      const credentials = credentialsSchema.parse(request.body);
      const session = await authService.login(credentials.username, credentials.password);
      issueSessionCookie(response, config, session);
      response.json({ user: session });
    })
  );

  router.post(
    "/register",
    asyncHandler(async (request, response) => {
      const credentials = credentialsSchema.parse(request.body);
      const session = await authService.register(credentials.username, credentials.password);
      issueSessionCookie(response, config, session);
      response.status(201).json({ user: session });
    })
  );

  router.post("/logout", (_request, response) => {
    clearSessionCookie(response, config);
    response.json({ ok: true });
  });

  return router;
}