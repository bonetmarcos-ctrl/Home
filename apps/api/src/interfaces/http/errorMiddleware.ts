import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../../application/AppError.js";

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(422).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload",
        issues: error.issues
      }
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message
      }
    });
    return;
  }

  response.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Unexpected server error"
    }
  });
};