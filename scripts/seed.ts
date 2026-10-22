import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/book_my_show';

interface SeedDataset {
  name: string;
  collectionName: string;
  filePath: string;
}

const seedDatasets: SeedDataset[] = [
  {
    name: 'Cities',
    collectionName: 'cities',
    filePath: path.resolve(__dirname, '../database/seeds/cities.seed.json')
  },
  {
    name: 'Cinemas',
    collectionName: 'cinemas',
    filePath: path.resolve(__dirname, '../database/seeds/cinemas.seed.json')
  },
  {
    name: 'Shows',
    collectionName: 'shows',
    filePath: path.resolve(__dirname, '../database/seeds/shows.seed.json')
  }
];

async function loadSeedFile<T>(filePath: string): Promise<T[]> {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content) as T[];
}

function sanitizeUri(uri: string): string {
  try {
    return uri.replace(/\/\/(.*):(.*)@/, '//***:***@');
  } catch {
    return 'mongodb://[credentials-hidden]';
  }
}

async function runSeeder(): Promise<void> {
  const isAtlas = MONGO_URI.startsWith('mongodb+srv://') || MONGO_URI.includes('mongodb.net');
  console.log('--- BookMyShow Database Seeder ---');
  console.log(`Target: ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'Local/Custom MongoDB'}`);
  console.log(`Connecting to: ${sanitizeUri(MONGO_URI)}`);

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('Successfully connected to MongoDB.');

    for (const dataset of seedDatasets) {
      console.log(`\nLoading ${dataset.name} from: ${dataset.filePath}`);
      const records = await loadSeedFile<Record<string, unknown>>(dataset.filePath);

      if (!Array.isArray(records) || records.length === 0) {
        console.warn(`[WARN] No records found in ${dataset.name} seed file.`);
        continue;
      }

      const collection = mongoose.connection.collection(dataset.collectionName);

      // Perform upsert on each item based on 'id' to ensure idempotent execution
      const operations = records.map((record) => ({
        updateOne: {
          filter: { id: record.id },
          update: { $set: record },
          upsert: true
        }
      }));

      const result = await collection.bulkWrite(operations);
      console.log(
        `✓ ${dataset.name} seeded: ${records.length} records processed ` +
        `(${result.upsertedCount} inserted, ${result.modifiedCount} updated)`
      );
    }

    console.log('\nAll seed datasets processed successfully.');
  } catch (error) {
    console.error('\n[ERROR] Seeding process failed.');
    if (error instanceof Error) {
      console.error(`Message: ${error.message}`);
    }
    if (isAtlas) {
      console.error(
        '\nAtlas Tip: Ensure your current IP is whitelisted under Network Access in MongoDB Atlas and user credentials in MONGO_URI are correct.'
      );
    } else {
      console.error(
        '\nTip: Ensure MongoDB is running (e.g. via Docker: docker compose -f docker/mongo/compose.yml up -d).'
      );
    }
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB.');
    }
  }
}

void runSeeder();
