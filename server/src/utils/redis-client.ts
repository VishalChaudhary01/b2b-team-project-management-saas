import Redis from 'ioredis';
import { config } from '@config/env.config';

const redisURL = `redis://${
  config.REDIS_PASSWORD ? `:${config.REDIS_PASSWORD}@` : ''
}${config.REDIS_HOST}:${config.REDIS_PORT}`;
console.log('Redis URL:', redisURL);

export const redisClient = new Redis(redisURL);

redisClient.on('connect', () => console.log('✅ Redis connected'));
redisClient.on('error', (err) => console.error('❌ Redis error:', err));
