export interface IMailAddress {
  name: string;
  email: string;
}

export interface IMailMessage<T = Record<string, unknown>> {
  to: IMailAddress;
  subject: string;
  from?: IMailAddress;
  variables: T;
  path: string;
}

export interface IMailMessageQueue {
  from: IMailAddress;
  to: IMailAddress;
  subject: string;
  body: string;
}
