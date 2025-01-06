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
import { JoinGameComponent } from './join-game/join-game.component';
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
    JoinGameComponent,
  ],
  templateUrl: './game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  stage$: Observable<GameStage | null>;
  gameId: string;

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

    this.stage$ = apiService.gameStage$.pipe(startWith(null));
  }
}
