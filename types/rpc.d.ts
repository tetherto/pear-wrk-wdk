/**
 * Log type enumeration
 */
export enum LogType {
  INFO = 1,
  ERROR = 2,
  DEBUG = 3
}

/**
 * Log request message
 */
export interface LogRequest {
  type?: LogType;
  data?: string | null;
}

/**
 * Worklet start request
 */
export interface WorkletStartRequest {
  enableDebugLogs?: number;
  seedPhrase?: string | null;
  seedBuffer?: string | null;
  config: string; // JSON string of network configurations
}

/**
 * Worklet start response
 */
export interface WorkletStartResponse {
  status?: string | null;
}

/**
 * Dispose request (empty)
 */
export interface DisposeRequest {
  // Empty request
}

/**
 * Call method request
 */
export interface CallMethodRequest {
  methodName: string;
  network: string;
  accountIndex: number;
  args?: string | null; // JSON string of method arguments
}

/**
 * Call method response
 */
export interface CallMethodResponse {
  result?: string | null; // JSON string of method result
}

export interface WdkInitializeParams {
  encryptionKey: string;
  encryptedSeed: string;
  config: string;
}

export interface WdkGenerateEntropyParams {
  wordCount: 12 | 24;
}

export interface WdkEntropyResult {
  encryptionKey: string;
  encryptedSeedBuffer: string;
  encryptedEntropyBuffer: string;
}

export interface WdkGetMnemonicParams {
  encryptedEntropy: string;
  encryptionKey: string;
}

/**
 * Network configuration map
 * Keys are network names (e.g., 'ethereum', 'spark')
 * Values are network-specific configuration objects
 */
export interface NetworkConfigs {
  [networkName: string]: unknown;
}