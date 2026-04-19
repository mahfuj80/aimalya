export type SendMailCommand = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export const AUTH_MAIL_SENDER = Symbol('AUTH_MAIL_SENDER');

export interface IAuthMailSender {
  send(command: SendMailCommand): Promise<void>;
}
