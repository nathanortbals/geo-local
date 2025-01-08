import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ApiService } from '../../api/api.service';
import { Coordinates } from '../../api/models/coordinates.model';
import { Guessing } from '../../api/stages/guessing.model';
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';
import { FinalizedGuessComponent } from './finalized-guess/finalized-guess.component';
import { GuessingMapComponent } from './guessing-map/guessing-map.component';

@Component({
  selector: 'app-guessing',
  imports: [
    GuessingMapComponent,
    FinalizedGuessComponent,
    ProgressBarComponent,
  ],
  templateUrl: './guessing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuessingComponent implements OnInit {
  @Input({ required: true }) guessing!: Guessing;

  currentGuess: Coordinates | null = null;
  guessFinalized = false;

  targetTime!: Date;

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.targetTime = new Date(this.guessing.roundEndsAt);
  }

  guessUpdated(coordinates: Coordinates) {
    this.currentGuess = coordinates;
    this.apiService.submitGuess(
      this.guessing.gameId,
      this.guessing.roundNumber,
      coordinates,
    );
  }

  finalizeGuess() {
    this.guessFinalized = true;
    this.apiService.finalizeGuess(
      this.guessing.gameId,
      this.guessing.roundNumber,
    );
  }
}
