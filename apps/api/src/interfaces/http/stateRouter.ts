import { Router } from "express";
import type { AppStateService } from "../../application/AppStateService.js";
import type { AuthConfig } from "../../application/AuthService.js";
import { asyncHandler } from "./asyncHandler.js";
import { createAuthMiddleware, getAuth } from "./authMiddleware.js";

export function createStateRouter(service: AppStateService, config: AuthConfig): Router {
  const router = Router();
  const requireAuth = createAuthMiddleware(config);

  router.get(
    "/state",
    requireAuth,
    asyncHandler(async (request, response) => {
      response.json(await service.getState(getAuth(request).ownerId));
    })
  );

  router.put(
    "/state",
    requireAuth,
    asyncHandler(async (request, response) => {
      response.json(await service.replaceState(request.body, getAuth(request).ownerId));
    })
  );

  router.post(
    "/state/reset",
    requireAuth,
    asyncHandler(async (request, response) => {
      response.json(await service.reset(getAuth(request).ownerId));
    })
  );

  return router;
}