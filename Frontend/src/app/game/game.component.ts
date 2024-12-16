import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, startWith } from 'rxjs';
import { ApiService } from '../api/api.service';
import { GameStage } from '../api/stages/game-stage.model';
import { FinalResultsComponent } from './final-results/final-results.component';
import { GuessingComponent } from './guessing/guessing.component';
import { LobbyComponent } from './lobby/lobby.component';
import { RoundResultsComponent } from './round-results/round-results.component';

@Component({
  selector: 'app-game',
  imports: [
    LobbyComponent,
    AsyncPipe,
    GuessingComponent,
    RoundResultsComponent,
    FinalResultsComponent,
  ],
  templateUrl: './game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  gameId: string;
  stage$: Observable<GameStage | null>;

  @ViewChild('previewMap', { read: ElementRef })
  previewMap: ElementRef<HTMLElement> | undefined;

  constructor(
    readonly route: ActivatedRoute,
    readonly apiService: ApiService,
    readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    const gameId = route.snapshot.paramMap.get('gameId');

    if (!gameId) {
      throw new Error('Game Id is required');
    }

    this.gameId = gameId;
    this.apiService.joinGame(gameId);
    this.stage$ = apiService.gameStage$.pipe(startWith(null));
  }

  startGame(): void {
    this.apiService.startGame(this.gameId);
  }
}
