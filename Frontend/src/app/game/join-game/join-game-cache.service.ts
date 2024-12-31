import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class JoinGameCacheService {
  constructor(private readonly apiService: ApiService) {}

  rejoinGameIfCached(gameId: string): void {
    const cache = localStorage.getItem(gameId);
    if (cache) {
      const cachedValue = JSON.parse(cache);
      this.apiService.rejoinGame(
        gameId,
        cachedValue.playerName,
        cachedValue.connectionId,
      );

      // Refresh cache with new connection id
      this.setCache(gameId, cachedValue.playerName);
    }
  }

  setCache(gameId: string, playerName: string): void {
    const cachedValue = JSON.stringify({
      playerName,
      connectionId: this.apiService.getConnectionId(),
    });
    localStorage.setItem(gameId, cachedValue);
  }
}
