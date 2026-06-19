import type { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { AppError } from "../../application/AppError.js";
import type { AuthConfig, AuthSession } from "../../application/AuthService.js";

const tokenPayloadSchema = z.object({
  sub: z.string().min(1),
  username: z.string().min(1)
});

export type RequestWithAuth = Request & { auth?: AuthSession };

export function createAuthMiddleware(config: AuthConfig): RequestHandler {
  return (request: RequestWithAuth, _response, next) => {
    const token = request.cookies?.[config.cookieName] as string | undefined;
    if (!token) {
      next(new AppError(401, "Authentication required", "AUTH_REQUIRED"));
      return;
    }

    try {
      const payload = tokenPayloadSchema.parse(jwt.verify(token, config.jwtSecret));
      request.auth = { ownerId: payload.sub, username: payload.username };
      next();
    } catch {
      next(new AppError(401, "Invalid session", "INVALID_SESSION"));
    }
  };
}

export function getAuth(request: Request): AuthSession {
  const auth = (request as RequestWithAuth).auth;
  if (!auth) {
    throw new AppError(401, "Authentication required", "AUTH_REQUIRED");
  }

  return auth;
}

export function issueSessionCookie(response: Response, config: AuthConfig, session: AuthSession): void {
  const token = jwt.sign({ username: session.username }, config.jwtSecret, {
    subject: session.ownerId,
    expiresIn: config.ttlSeconds
  });

  response.cookie(config.cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.secureCookie,
    maxAge: config.ttlSeconds * 1000,
    path: "/"
  });
}

export function clearSessionCookie(response: Response, config: AuthConfig): void {
  response.clearCookie(config.cookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.secureCookie,
    path: "/"
  });
}