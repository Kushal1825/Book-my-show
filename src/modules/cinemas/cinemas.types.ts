import { Document } from 'mongoose';

/**
 * Represents a Cinema document stored in MongoDB.
 * A cinema belongs to a city and contains multiple screens.
 */
export interface ICinemaDocument extends Document {
  /** Unique cinema identifier (matches seed data id) */
  id: string;

  /** Display name of the cinema */
  name: string;

  /** Reference to the city this cinema belongs to */
  cityId: string;

  /** Physical address of the cinema */
  address: string;

  /** Total number of screens in this cinema */
  totalScreens: number;

  /** Supported viewing formats (e.g. "2D", "3D", "IMAX", "4DX") */
  supportedFormats: string[];

  /** Whether the cinema is currently active and visible to users */
  isActive: boolean;

  /** Timestamps managed by Mongoose */
  createdAt: Date;
  updatedAt: Date;
}
