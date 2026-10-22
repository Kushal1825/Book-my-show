import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';
import { ICinemaDocument } from './cinemas.types.js';

// ---------------------------------------------------------------------------
// Mongoose Schema — defines the shape of a Cinema document in MongoDB
// ---------------------------------------------------------------------------

const cinemaSchema = new Schema<ICinemaDocument>(
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
    cityId: {
      type: String,
      required: true,
      index: true, // frequent lookups by city
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    totalScreens: {
      type: Number,
      required: true,
      min: 1,
    },
    supportedFormats: {
      type: [String],
      required: true,
      default: [],
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// ---------------------------------------------------------------------------
// Mongoose Model
// ---------------------------------------------------------------------------

export const CinemaModel = mongoose.model<ICinemaDocument>('Cinema', cinemaSchema);

// ---------------------------------------------------------------------------
// Zod Validation — query param schema for GET /cinemas?cityId=xxx
// ---------------------------------------------------------------------------

/** cityId is required when fetching cinemas */
export const cinemaQuerySchema = z.object({
  cityId: z
    .string({ required_error: 'cityId query parameter is required' })
    .min(1, 'cityId must not be empty'),
});

export type CinemaQuery = z.infer<typeof cinemaQuerySchema>;
