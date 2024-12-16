import { Coordinates } from './coordinates.model';

export interface Bounds {
  name: string;
  center: Coordinates;
  radius: number;
  radiusInMeters: number;
}
