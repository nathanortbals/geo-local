import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { catchError, from, map, Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { City } from './models/city.model';
import { CreateGame } from './models/create-game.model';
import { GameStage } from './stages/game-stage.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements OnDestroy {
  private hubConnection: HubConnection;

  private gameStage = new Subject<GameStage>();
  gameStage$ = this.gameStage.asObservable();

  private currentPlayerName: string | null = null;
  public get playerName(): string | null {
    return this.currentPlayerName;
  }

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

  public getConnectionId(): string {
    const connectionId = this.hubConnection.connectionId;
    if (!connectionId) {
      throw new Error('Not connected to the hub');
    }

    return connectionId;
  }

  public findCities(search: string): Observable<City[]> {
    return this.httpClient.get<City[]>(
      `${environment.apiUrl}/find-cities?search=${search}`,
    );
  }

  public createGame(osmId: number, name: string): Observable<string> {
    return this.httpClient
      .post<CreateGame>(`${environment.apiUrl}/create-game`, {
        osmId,
        name,
      })
      .pipe(map((response) => response.gameId));
  }

  public joinGame(gameId: string, playerName: string): Observable<void> {
    return from(this.hubConnection.invoke('JoinGame', gameId, playerName)).pipe(
      catchError((error: Error) => throwError(() => this.handleError(error))),
    );
  }

  public rejoinGame(
    gameId: string,
    playerName: string,
    connectionId: string,
  ): void {
    this.hubConnection.send('RejoinGame', gameId, playerName, connectionId);
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

  public finalizeGuess(gameId: string, roundNumber: number): void {
    this.hubConnection.send('FinalizeGuess', gameId, roundNumber);
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

    this.hubConnection.on('ReceiveIdentity', (playerName: string) => {
      this.currentPlayerName = playerName;
    });
  }

  private handleError(error: Error): Error {
    const match = error.message.match(/HubException:\s*(.+)/);

    return match ? new Error(match[1]) : new Error('An unknown error occurred');
  }
}
