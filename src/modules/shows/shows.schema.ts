import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';
import { IShowDocument, ShowStatus } from './shows.types.js';

// ---------------------------------------------------------------------------
// Mongoose Sub-schema for pricing tiers
// ---------------------------------------------------------------------------

const pricingSchema = new Schema(
  {
    silver: { type: Number, min: 0 },
    gold: { type: Number, min: 0 },
    platinum: { type: Number, min: 0 },
  },
  { _id: false }, // no separate ObjectId for sub-document
);

// ---------------------------------------------------------------------------
// Mongoose Schema — defines the shape of a Show document in MongoDB
// ---------------------------------------------------------------------------

const showSchema = new Schema<IShowDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    cinemaId: {
      type: String,
      required: true,
      index: true, // frequent lookups by cinema
    },
    movieTitle: {
      type: String,
      required: true,
      trim: true,
    },
    screenNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    format: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    pricing: {
      type: pricingSchema,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(ShowStatus),
      default: ShowStatus.SCHEDULED,
    },
  },
  {
    timestamps: true,
  },
);

// ---------------------------------------------------------------------------
// Mongoose Model
// ---------------------------------------------------------------------------

export const ShowModel = mongoose.model<IShowDocument>('Show', showSchema);

// ---------------------------------------------------------------------------
// Zod Validation — query param schema for GET /shows?cinemaId=xxx
// ---------------------------------------------------------------------------

/** cinemaId is required when fetching shows */
export const showQuerySchema = z.object({
  cinemaId: z
    .string({ required_error: 'cinemaId query parameter is required' })
    .min(1, 'cinemaId must not be empty'),
});

export type ShowQuery = z.infer<typeof showQuerySchema>;
