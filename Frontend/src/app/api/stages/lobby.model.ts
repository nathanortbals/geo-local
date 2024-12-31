import { Bounds } from '../models/bounds.model';

export interface Lobby {
  type: 'Lobby';
  gameId: string;
  bounds: Bounds;
  players: LobbyPlayer[];
}

export interface LobbyPlayer {
  name: string;
  color: string;
  isHost: boolean;
}
