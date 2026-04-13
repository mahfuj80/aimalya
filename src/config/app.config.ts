export type AppConfig = {
  appName: string;
  port: number;
  env: string;
};

export const getAppConfig = (): AppConfig => ({
  appName: process.env.APP_NAME ?? 'aimalya',
  port: Number(process.env.PORT ?? 3000),
  env: process.env.NODE_ENV ?? 'development',
});
