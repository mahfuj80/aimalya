export type SendSmsCommand = {
  phoneNumber: string;
  message: string;
};

export const AUTH_SMS_SENDER = Symbol('AUTH_SMS_SENDER');

export interface IAuthSmsSender {
  send(command: SendSmsCommand): Promise<void>;
}
