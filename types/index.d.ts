import { RpcContext } from './rpc';

export { HRPC } from './hrpc/hrpc';
export * from './rpc';

/**
 * Register all RPC handlers with the provided RPC instance
 */
export function registerRpcHandlers(rpc: any, context: RpcContext): void;

export const utils: {
  crypto: typeof import('./utils/crypto');
  logger: typeof import('./utils/logger').default;
  validation: typeof import('./utils/validation');
};

export const exceptions: {
  errorCodes: typeof import('./exceptions/error-codes').default;
  rpcExceptionPayload: typeof import('./exceptions/rpc-exception');
};
