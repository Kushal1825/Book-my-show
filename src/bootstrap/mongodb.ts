import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { logger } from './logger.js';

/**
 * Sanitizes MongoDB connection string by masking user credentials for safe logging.
 */
function sanitizeMongoUri(uri: string): string {
  try {
    return uri.replace(/\/\/(.*):(.*)@/, '//***:***@');
  } catch {
    return 'mongodb://[credentials-hidden]';
  }
}

/**
 * Connects to MongoDB (local or MongoDB Atlas Cloud) using Mongoose.
 * Configured with timeouts, connection pool, and event listeners optimal for Atlas.
 */
export async function connectMongoDB(): Promise<void> {
  const isAtlas = config.mongoUri.startsWith('mongodb+srv://') || config.mongoUri.includes('mongodb.net');
  const sanitizedUri = sanitizeMongoUri(config.mongoUri);

  logger.info(
    { target: isAtlas ? 'MongoDB Atlas (Cloud)' : 'MongoDB (Local/Custom)', uri: sanitizedUri },
    'Connecting to MongoDB...',
  );

  // Connection event handlers
  mongoose.connection.on('connected', () => {
    logger.info(
      { cluster: isAtlas ? 'MongoDB Atlas' : 'Local/Custom' },
      'MongoDB connected successfully',
    );
  });

  mongoose.connection.on('error', (err: Error) => {
    logger.error({ err }, 'MongoDB connection error');
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  try {
    await mongoose.connect(config.mongoUri, {
      // 10s timeout to allow DNS SRV resolution and Atlas replica set discovery
      serverSelectionTimeoutMS: 10000,
      // Cloud database connection pool defaults
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
    });
  } catch (err: unknown) {
    logger.error(
      { err, uri: sanitizedUri },
      'Failed to connect to MongoDB',
    );

    if (isAtlas) {
      logger.error(
        'MongoDB Atlas Troubleshooting Tip: Verify that (1) your current IP address is whitelisted in MongoDB Atlas Network Access, (2) database user credentials in MONGO_URI are correct, and (3) network allows outbound port 27017.',
      );
    }
    throw err;
  }
}

/**
 * Gracefully disconnects from MongoDB.
 */
export async function disconnectMongoDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected gracefully');
  }
}
