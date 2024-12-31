import { Bounds } from '../models/bounds.model';
import { Player } from '../models/players.model';

export interface Lobby {
  type: 'Lobby';
  gameId: string;
  bounds: Bounds;
  players: Player[];
}
