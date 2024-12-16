import { Bounds } from '../models/bounds.model';
import { Coordinates } from '../models/coordinates.model';

export interface Guessing {
  type: 'Guessing';
  gameId: string;
  roundNumber: number;
  location: Coordinates;
  bounds: Bounds;
  roundEndsAt: string;
  timeLimitSeconds: number;
}
