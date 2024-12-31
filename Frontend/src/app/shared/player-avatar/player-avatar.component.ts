import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { Player } from '../../api/models/players.model';

@Component({
  selector: 'app-player-avatar',
  imports: [],
  templateUrl: './player-avatar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerAvatarComponent implements OnChanges {
  @Input({ required: true }) player!: Player;

  textColor = 'black';
  firstInitial = '';

  ngOnChanges(): void {
    this.textColor = this.getContrastingTextColor(this.player.color);
    this.firstInitial = this.player.name.at(0)?.toUpperCase() ?? '';
  }

  private getContrastingTextColor(hexColor: string) {
    hexColor = hexColor.replace('#', '');

    // Convert hex to RGB
    const r = parseInt(hexColor.slice(0, 2), 16);
    const g = parseInt(hexColor.slice(2, 4), 16);
    const b = parseInt(hexColor.slice(4, 6), 16);

    // Simpler heuristic method
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    if (brightness > 128) {
      return 'black'; // Bright background, use black text
    } else {
      return 'white'; // Dark background, use white text
    }
  }
}
