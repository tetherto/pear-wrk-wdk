import { ERROR_CODES } from './error-codes';

export interface RpcExceptionPayload {
  code?: ERROR_CODES;
  message?: string;
  error: any;
}

export interface RpcExceptionResponse {
  code: ERROR_CODES;
  message: string;
  error: string;
}

/**
 * Check if we're in development mode
 */
export function isDevelopmentMode(): boolean;

/**
 * Sanitize error message to prevent information leakage
 */
export function stringifyError(error: any): string;

/**
 * Converts an error payload to a JSON string representing a rpcExceptionResponse.
 */
export function rpcException(payload: RpcExceptionPayload): RpcExceptionResponse;

/**
 * Create a structured error response that preserves error codes and metadata
 */
export function createStructuredError(
  error: any,
  code?: ERROR_CODES,
  message?: string
): RpcExceptionResponse;
