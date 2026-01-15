import type {
  LogRequest,
  WorkletStartRequest,
  WorkletStartResponse,
  DisposeRequest,
  CallMethodRequest,
  CallMethodResponse,
  WdkInitializeParams,
  WdkGenerateEntropyParams,
  WdkEntropyResult,
  WdkGetMnemonicParams
} from '../rpc';

/**
 * Stream interface for RPC communication
 */
export interface RPCStream {
  data?: unknown;
  [key: string]: unknown;
}

/**
 * Request stream interface for RPC communication
 */
export interface RPCRequestStream {
  [key: string]: unknown;
}

/**
 * HRPC class for handling RPC communication with the worklet
 */
export class HRPC {
  constructor(stream: unknown);

  /**
   * Send a log message
   * @param args - Log request
   */
  log(args: LogRequest): void;

  /**
   * @deprecated
   * Start the worklet
   * @param args - Worklet start request
   * @returns Promise resolving to worklet start response
   */
  workletStart(args: WorkletStartRequest): Promise<WorkletStartResponse>;

  /**
   * Initialize WDK
   * @param args - Initialization parameters
   */
  initializeWDK(args: WdkInitializeParams): Promise<{ status: string }>;

  /**
   * Generate entropy and encrypt it
   * @param args - Generation parameters
   */
  generateEntropyAndEncrypt(args: WdkGenerateEntropyParams): Promise<WdkEntropyResult>;

  /**
   * Get mnemonic from encrypted entropy
   * @param args - Parameters
   */
  getMnemonicFromEntropy(args: WdkGetMnemonicParams): Promise<{ mnemonic: string }>;

  /**
   * Get encrypted seed and entropy from mnemonic
   * @param args - Parameters
   */
  getSeedAndEntropyFromMnemonic(args: { mnemonic: string }): Promise<WdkEntropyResult>;

  /**
   * Dispose of the worklet
   * @param args - Dispose request
   */
  dispose(args: DisposeRequest): void;

  /**
   * Call a method on a wallet account
   * @param args - Call method request
   * @returns Promise resolving to call method response
   */
  callMethod(args: CallMethodRequest): Promise<CallMethodResponse>;

  /**
   * Register a handler for log messages
   */
  onLog(responseFn: (request: LogRequest) => Promise<void>): void;

  /**
   * Register a handler for worklet start
   */
  onWorkletStart(
    responseFn: (request: WorkletStartRequest) => Promise<WorkletStartResponse>
  ): void;

  /**
   * Register a handler for WDK initialization
   */
  onInitializeWDK(
    responseFn: (request: WdkInitializeParams) => Promise<{ status: string }>
  ): void;

  /**
   * Register a handler for entropy generation
   */
  onGenerateEntropyAndEncrypt(
    responseFn: (request: WdkGenerateEntropyParams) => Promise<WdkEntropyResult>
  ): void;

  /**
   * Register a handler for getting mnemonic
   */
  onGetMnemonicFromEntropy(
    responseFn: (request: WdkGetMnemonicParams) => Promise<{ mnemonic: string }>
  ): void;

  /**
   * Register a handler for getting seed/entropy from mnemonic
   */
  onGetSeedAndEntropyFromMnemonic(
    responseFn: (request: { mnemonic: string }) => Promise<WdkEntropyResult>
  ): void;

  /**
   * Register a handler for dispose
   */
  onDispose(responseFn: (request: DisposeRequest) => Promise<void>): void;

  /**
   * Register a handler for call method
   */
  onCallMethod(
    responseFn: (request: CallMethodRequest) => Promise<CallMethodResponse>
  ): void;
}

export default HRPC;