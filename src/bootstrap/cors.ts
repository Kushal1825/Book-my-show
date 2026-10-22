import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { config } from '../config/env.js';

/** Whether the current environment is development */
const IS_DEV = config.env === 'development';

/**
 * Registers @fastify/cors with environment-aware origin settings.
 * - Development: allows all origins for local testing.
 * - Production: restricts to a configurable allowed origin list.
 */
export async function registerCors(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: IS_DEV ? true : (process.env.ALLOWED_ORIGINS?.split(',') ?? false),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
}
