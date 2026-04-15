export type PaymentConfig = {
  stripePublishableKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
};

export const getPaymentConfig = (): PaymentConfig => ({
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
});
