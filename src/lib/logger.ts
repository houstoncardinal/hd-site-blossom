/**
 * Production-safe logger utility
 *
 * In development: All logs are shown
 * In production: Only errors and warnings are shown
 *
 * Usage:
 * import { logger } from '@/lib/logger';
 * logger.debug('Debug info');  // Only shown in dev
 * logger.info('Info message'); // Only shown in dev
 * logger.warn('Warning');      // Shown in prod
 * logger.error('Error');       // Shown in prod
 */

const isDev = import.meta.env.DEV;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  prefix?: string;
  enabled?: boolean;
}

class Logger {
  private prefix: string;
  private enabled: boolean;

  constructor(options: LoggerOptions = {}) {
    this.prefix = options.prefix || '';
    this.enabled = options.enabled ?? true;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const prefix = this.prefix ? `[${this.prefix}]` : '';
    return `${timestamp} ${prefix}[${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, ...args: unknown[]): void {
    if (!this.enabled || !isDev) return;
    // eslint-disable-next-line no-console
    console.log(this.formatMessage('debug', message), ...args);
  }

  info(message: string, ...args: unknown[]): void {
    if (!this.enabled || !isDev) return;
    // eslint-disable-next-line no-console
    console.info(this.formatMessage('info', message), ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    if (!this.enabled) return;
    console.warn(this.formatMessage('warn', message), ...args);
  }

  error(message: string, ...args: unknown[]): void {
    if (!this.enabled) return;
    console.error(this.formatMessage('error', message), ...args);
  }

  /**
   * Create a child logger with a specific prefix
   */
  child(prefix: string): Logger {
    return new Logger({
      prefix: this.prefix ? `${this.prefix}:${prefix}` : prefix,
      enabled: this.enabled,
    });
  }
}

// Default logger instance
export const logger = new Logger();

// Named loggers for different parts of the app
export const authLogger = logger.child('auth');
export const apiLogger = logger.child('api');
export const adminLogger = logger.child('admin');

export default logger;
