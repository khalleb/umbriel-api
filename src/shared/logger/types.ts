export type LogData<T> = {
  type?: string;
  message?: any;
  payload?: T;
  error?: Error;
} & (
  | {
      message: any;
    }
  | {
      error: Error;
    }
);

export type LogMethod = <T>(logData: LogData<T>) => void;

export type Logger = {
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  fatal: LogMethod;
};
