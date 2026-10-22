import { ApiResponse } from '../types/common.types.js';

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    message,
    data
  };
}

export function errorResponse(message: string, code?: string, details?: unknown): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      details
    }
  };
}
