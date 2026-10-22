import { Document } from 'mongoose';

/**
 * Represents a City document stored in MongoDB.
 * Each city is a location where cinemas and shows are available.
 */
export interface ICityDocument extends Document {
  /** Unique city identifier (matches seed data id) */
  id: string;

  /** Display name of the city */
  name: string;

  /** URL-friendly slug for the city (e.g. "mumbai", "new-delhi") */
  slug: string;

  /** State or province the city belongs to */
  state: string;

  /** Country the city belongs to */
  country: string;

  /** Whether the city is currently active and visible to users */
  isActive: boolean;

  /** Timestamps managed by Mongoose */
  createdAt: Date;
  updatedAt: Date;
}

/** Filter options for querying cities */
export interface CityFilter {
  isActive?: boolean;
}
