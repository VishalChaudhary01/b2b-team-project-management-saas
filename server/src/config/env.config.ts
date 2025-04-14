import { getEnv } from '@utils/get-env';

type EnvConfig = ReturnType<typeof envConfig>;

export const envConfig = () => ({
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: getEnv('PORT', '5001'),
  MONGODB_URI: getEnv('MONGODB_URI'),
  BASE_PATH: getEnv('BASE_PATH', '/api/v1'),
  SESSION_SECRET: getEnv('SESSION_SECRET'),
  SESSION_EXPIRES_IN: getEnv('SESSION_EXPIRES_IN'),
  FRONTEND_ORIGIN: getEnv('FRONTEND_ORIGIN'),
  FRONTEND_GOOGLE_CALLBACK_URL: getEnv('FRONTEND_GOOGLE_CALLBACK_URL'),
  GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET'),
  GOOGLE_CALLBACK_URL: getEnv('GOOGLE_CALLBACK_URL'),
});

export const config: EnvConfig = envConfig();
