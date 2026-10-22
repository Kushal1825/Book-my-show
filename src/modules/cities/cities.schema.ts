import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';
import { ICityDocument } from './cities.types.js';

// ---------------------------------------------------------------------------
// Mongoose Schema — defines the shape of a City document in MongoDB
// ---------------------------------------------------------------------------

const citySchema = new Schema<ICityDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true, // auto-manage createdAt / updatedAt
  },
);

// ---------------------------------------------------------------------------
// Mongoose Model
// ---------------------------------------------------------------------------

export const CityModel = mongoose.model<ICityDocument>('City', citySchema);

// ---------------------------------------------------------------------------
// Zod Validation — query param schema for GET /cities
// ---------------------------------------------------------------------------

/** Optional query filter: ?isActive=true|false */
export const cityQuerySchema = z.object({
  isActive: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => (val === undefined ? undefined : val === 'true')),
});

export type CityQuery = z.infer<typeof cityQuerySchema>;
