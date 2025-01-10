import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';

interface GameCache {
  gameId: string;
  playerName: string;
  connectionId: string;
}

@Injectable({
  providedIn: 'root',
})
export class JoinGameCacheService {
  constructor(private readonly apiService: ApiService) {}

  getCache(gameId: string): GameCache | null {
    const cache = localStorage.getItem(gameId);
    if (cache) {
      return JSON.parse(cache);
    }
    return null;
  }

  setCache(gameCache: GameCache): void {
    const cachedValue = JSON.stringify(gameCache);
    localStorage.setItem(gameCache.gameId, cachedValue);
  }
}
