export type DatabaseConfig = {
  url: string;
};

export const getDatabaseConfig = (): DatabaseConfig => ({
  url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/aimalya',
});
