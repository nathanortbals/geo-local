import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { catchError, from, map, Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateGame } from './models/create-game.model';
import { Place } from './models/place.model';
import { GameStage } from './stages/game-stage.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements OnDestroy {
  private hubConnection: HubConnection;

  private gameStage = new Subject<GameStage>();
  gameStage$ = this.gameStage.asObservable();

  constructor(private httpClient: HttpClient) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/game-hub`, { withCredentials: false })
      .build();

    this.registerMessageHandlers();
  }

  ngOnDestroy(): void {
    this.hubConnection.stop();
  }

  async connectToHub(): Promise<void> {
    await this.hubConnection.start();
  }

  public findPlaces(search: string): Observable<Place[]> {
    return this.httpClient.get<Place[]>(
      `${environment.apiUrl}/find-places?search=${search}`,
    );
  }

  public createGame(placeId: string): Observable<string> {
    return this.httpClient
      .post<CreateGame>(`${environment.apiUrl}/create-game`, {
        placeId,
      })
      .pipe(map((response) => response.gameId));
  }

  public joinGame(gameId: string, playerName: string): Observable<void> {
    return from(this.hubConnection.invoke('JoinGame', gameId, playerName)).pipe(
      catchError((error: Error) => throwError(() => this.handleError(error))),
    );
  }

  public startGame(gameId: string): void {
    this.hubConnection.send('StartGame', gameId);
  }

  public submitGuess(
    gameId: string,
    roundNumber: number,
    coordinates: { latitude: number; longitude: number },
  ): void {
    this.hubConnection.send('SubmitGuess', gameId, roundNumber, coordinates);
  }

  public startNextRound(gameId: string, roundNumber: number) {
    this.hubConnection.send('StartNextRound', gameId, roundNumber);
  }

  public showFinalResults(gameId: string): void {
    this.hubConnection.send('ShowFinalResults', gameId);
  }

  public playAgain(gameId: string): void {
    this.hubConnection.send('PlayAgain', gameId);
  }

  private registerMessageHandlers() {
    this.hubConnection.on('ReceiveGameStage', (stage: GameStage) => {
      this.gameStage.next(stage);
    });
  }

  private handleError(error: Error): Error {
    const match = error.message.match(/HubException:\s*(.+)/);

    return match ? new Error(match[1]) : new Error('An unknown error occurred');
  }
}
