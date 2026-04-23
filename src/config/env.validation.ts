const requiredEnv = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRES_IN',
  'JWT_REFRESH_EXPIRES_IN',
  'SWAGGER_ENABLED',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
] as const;

export const validateEnv = (): void => {
  const missing = requiredEnv.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return;
  }

  let parsedDatabaseUrl: URL;

  try {
    parsedDatabaseUrl = new URL(databaseUrl);
  } catch {
    throw new Error('DATABASE_URL is invalid. Expected a valid PostgreSQL URL.');
  }

  const allowedProtocols = new Set(['postgresql:', 'postgres:']);

  if (!allowedProtocols.has(parsedDatabaseUrl.protocol)) {
    throw new Error(
      `DATABASE_URL protocol must be postgresql or postgres. Received: ${parsedDatabaseUrl.protocol}`,
    );
  }

  if (!parsedDatabaseUrl.hostname) {
    throw new Error('DATABASE_URL must include a hostname.');
  }
};
