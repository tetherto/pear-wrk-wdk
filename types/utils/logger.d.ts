/**
 * Simple logger with log levels
 */
export interface Logger {
  /**
   * Log debug message
   * @param args - Arguments to log
   */
  debug(...args: any[]): void;

  /**
   * Log info message
   * @param args - Arguments to log
   */
  info(...args: any[]): void;

  /**
   * Log warning message
   * @param args - Arguments to log
   */
  warn(...args: any[]): void;

  /**
   * Log error message
   * @param args - Arguments to log
   */
  error(...args: any[]): void;
}

declare const logger: Logger;
export default logger;
