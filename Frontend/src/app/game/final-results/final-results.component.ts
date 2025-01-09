import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { ApiService } from '../../api/api.service';
import {
  FinalResults,
  PlayerFinalResults,
} from '../../api/stages/final-results.model';
import { ButtonComponent } from '../../shared/button/button.component';
import { LinkButtonComponent } from '../../shared/link-button/link-button.component';
import { LogoComponent } from '../../shared/logo/logo.component';
import { NumberPipe } from '../../shared/number-pipe/number.pipe';
import { PlayerAvatarComponent } from '../../shared/player-avatar/player-avatar.component';

@Component({
  selector: 'app-final-results',
  imports: [
    LinkButtonComponent,
    ButtonComponent,
    PlayerAvatarComponent,
    NumberPipe,
    LogoComponent,
  ],
  templateUrl: './final-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalResultsComponent implements OnChanges {
  @Input({ required: true }) finalResults!: FinalResults;

  myFinalResults: PlayerFinalResults | undefined;

  startingNewGame = false;

  constructor(private readonly apiService: ApiService) {}

  ngOnChanges(): void {
    this.myFinalResults = this.finalResults.players.find(
      (player) => player.playerName === this.apiService.playerName,
    );
  }

  playAgain() {
    this.startingNewGame = true;
    this.apiService.playAgain(this.finalResults.gameId);
  }
}
