import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || '0.0.0.0',
  logLevel: process.env.LOG_LEVEL || 'info',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/book_my_show',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined
  },
  elasticsearchNode: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200'
} as const;

export type Config = typeof config;
