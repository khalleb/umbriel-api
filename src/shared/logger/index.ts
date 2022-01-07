import pino from 'pino';

import { env } from '@shared/env';

import { Logger, LogData } from './types';

const pinoLogger = pino({
  level: env.LOG_LEVEL || 'info',
});

const parseLoggerInputToPinoFormat = <T>({ message, error, ...data }: LogData<T>) => ({
  msg: message,
  err: error,
  ...data,
});

const AppLogger: Logger = {
  debug: <T>(logData: LogData<T>) => pinoLogger.debug(parseLoggerInputToPinoFormat(logData)),
  info: <T>(logData: LogData<T>) => pinoLogger.info(parseLoggerInputToPinoFormat(logData)),
  warn: <T>(logData: LogData<T>) => pinoLogger.warn(parseLoggerInputToPinoFormat(logData)),
  error: <T>(logData: LogData<T>) => pinoLogger.error(parseLoggerInputToPinoFormat(logData)),
  fatal: <T>(logData: LogData<T>) => pinoLogger.fatal(parseLoggerInputToPinoFormat(logData)),
};

export { AppLogger };
