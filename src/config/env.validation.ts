const requiredEnv = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
] as const;

export const validateEnv = (): void => {
  const missing = requiredEnv.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
};
