import { Coordinates } from '../models/coordinates.model';

export interface RoundResults {
  type: 'RoundResults';
  gameId: string;
  roundNumber: number;
  location: Coordinates;
  guess?: Coordinates;
  score: number;
  isFinalRound: boolean;
  distanceInMeters?: number;
}
