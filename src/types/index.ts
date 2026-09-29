/**
 * Global TypeScript definitions and shared domain entities.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
}

export type RideStatus = 'idle' | 'searching' | 'driver_assigned' | 'in_progress' | 'completed' | 'cancelled';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}
