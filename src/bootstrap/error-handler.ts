import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../shared/errors/app-error.js';
import { errorResponse } from '../shared/utils/response.util.js';
import { HttpStatus } from '../shared/constants/status-codes.js';

/**
 * Registers a centralised error handler on the Fastify instance.
 * - Known operational errors (AppError) return the appropriate status code.
 * - Unexpected errors are logged and return a generic 500 response.
 */
export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler(
    (error: Error, request: FastifyRequest, reply: FastifyReply) => {
      // Handle known operational errors
      if (error instanceof AppError) {
        request.log.warn(
          { err: error, statusCode: error.statusCode },
          error.message,
        );

        return reply
          .status(error.statusCode)
          .send(errorResponse(error.message, error.statusCode.toString()));
      }

      // Handle Fastify validation errors (statusCode is set by Fastify)
      const statusCode =
        (error as unknown as { statusCode?: number }).statusCode ??
        HttpStatus.INTERNAL_SERVER_ERROR;

      if (statusCode < HttpStatus.INTERNAL_SERVER_ERROR) {
        request.log.warn({ err: error, statusCode }, error.message);
        return reply
          .status(statusCode)
          .send(errorResponse(error.message, statusCode.toString()));
      }

      // Unexpected / programmer errors – log full stack, hide details from client
      request.log.error({ err: error }, 'Unhandled error');

      return reply
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(
          errorResponse(
            'Internal server error',
            HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          ),
        );
    },
  );
}
