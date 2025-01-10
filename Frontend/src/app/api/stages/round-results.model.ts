import { Coordinates } from '../models/coordinates.model';

export interface RoundResults {
  type: 'RoundResults';
  gameId: string;
  roundNumber: number;
  target: Coordinates;
  players: PlayerRoundResults[];
  isFinalRound: boolean;
}

export interface PlayerRoundResults {
  playerName: string;
  playerColor: string;
  isHost: boolean;
  roundScore: number;
  totalScore: number;
  guess?: Coordinates;
  distanceInMeters?: number;
}
