import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  imports: [],
  templateUrl: './progress-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    #progress {
      animation: countdown linear forwards;
    }

    @keyframes countdown {
      from {
        width: var(--start-width, 100%);
      }
      to {
        width: 0%;
      }
    }
  `,
})
export class ProgressBarComponent implements OnInit {
  @Input({ required: true }) targetTime!: Date;
  @Input({ required: true }) totalDuration!: number;

  remainingDuration!: number; // Remaining time in seconds
  startingWidth!: number; // Starting percentage width
  animationDuration!: string; // CSS animation duration

  ngOnInit() {
    const now = new Date().getTime();
    const target = this.targetTime.getTime();

    // Calculate the remaining time in seconds
    this.remainingDuration = Math.max(Math.floor((target - now) / 1000), 0);

    // Calculate the starting width (percentage completed)
    this.startingWidth = (this.remainingDuration / this.totalDuration) * 100;

    // Set the animation duration dynamically
    this.animationDuration = `${this.remainingDuration}s`;
  }
}
