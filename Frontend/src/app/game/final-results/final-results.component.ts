import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { FinalResults } from '../../api/stages/final-results.model';
import { ButtonComponent } from '../../shared/button/button.component';
import { LinkButtonComponent } from '../../shared/link-button/link-button.component';

@Component({
  selector: 'app-final-results',
  imports: [LinkButtonComponent, ButtonComponent],
  templateUrl: './final-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalResultsComponent {
  @Input({ required: true }) finalResults!: FinalResults;

  constructor(private readonly apiService: ApiService) {}

  playAgain() {
    this.apiService.playAgain(this.finalResults.gameId);
  }
}
