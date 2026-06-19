import { Router } from "express";
import type { AppStateService } from "../../application/AppStateService.js";
import type { AuthConfig } from "../../application/AuthService.js";
import { asyncHandler } from "./asyncHandler.js";
import { createAuthMiddleware, getAuth } from "./authMiddleware.js";

export function createCollectionRouter(service: AppStateService, config: AuthConfig): Router {
  const router = Router();
  const requireAuth = createAuthMiddleware(config);

  router.get(
    "/:collection",
    requireAuth,
    asyncHandler(async (request, response) => {
      response.json(await service.list(request.params.collection, getAuth(request).ownerId));
    })
  );

  router.post(
    "/:collection",
    requireAuth,
    asyncHandler(async (request, response) => {
      const item = await service.create(request.params.collection, request.body, getAuth(request).ownerId);
      response.status(201).json(item);
    })
  );

  router.put(
    "/:collection/:id",
    requireAuth,
    asyncHandler(async (request, response) => {
      response.json(
        await service.update(request.params.collection, request.params.id, request.body, getAuth(request).ownerId)
      );
    })
  );

  router.delete(
    "/:collection/:id",
    requireAuth,
    asyncHandler(async (request, response) => {
      await service.delete(request.params.collection, request.params.id, getAuth(request).ownerId);
      response.status(204).end();
    })
  );

  return router;
}