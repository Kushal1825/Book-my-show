import { Document } from 'mongoose';

/** Possible statuses for a show */
export enum ShowStatus {
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

/** Pricing tiers for a show — each tier is optional */
export interface ShowPricing {
  silver?: number;
  gold?: number;
  platinum?: number;
}

/**
 * Represents a Show document stored in MongoDB.
 * A show is a specific screening of a movie at a cinema screen.
 */
export interface IShowDocument extends Document {
  /** Unique show identifier (matches seed data id) */
  id: string;

  /** Reference to the cinema hosting this show */
  cinemaId: string;

  /** Title of the movie being screened */
  movieTitle: string;

  /** Screen number within the cinema */
  screenNumber: number;

  /** Viewing format (e.g. "2D", "3D", "IMAX") */
  format: string;

  /** Language of the screening */
  language: string;

  /** Scheduled start time of the show */
  startTime: Date;

  /** Scheduled end time of the show */
  endTime: Date;

  /** Ticket pricing per tier */
  pricing: ShowPricing;

  /** Total seat capacity for this show */
  totalSeats: number;

  /** Number of seats still available for booking */
  availableSeats: number;

  /** Current status of the show */
  status: ShowStatus;

  /** Timestamps managed by Mongoose */
  createdAt: Date;
  updatedAt: Date;
}
