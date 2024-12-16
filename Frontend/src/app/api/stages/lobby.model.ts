import { Bounds } from '../models/bounds.model';

export interface Lobby {
  type: 'Lobby';
  gameId: string;
  bounds: Bounds;
}
