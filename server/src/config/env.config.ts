import { getEnv } from '@utils/get-env';

type EnvConfig = ReturnType<typeof envConfig>;

export const envConfig = () => ({
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: getEnv('PORT', '5001'),
  BASE_PATH: getEnv('BASE_PATH', '/api/v1'),
  MONGODB_URI: getEnv('MONGODB_URI'),
});

export const config: EnvConfig = envConfig();
