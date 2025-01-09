import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interval, map, Observable, take } from 'rxjs';
import { LinkButtonComponent } from '../shared/link-button/link-button.component';
import { LogoComponent } from '../shared/logo/logo.component';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, LinkButtonComponent, LinkButtonComponent, LogoComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private fullTitle = 'How well do you know your city?';

  public currentTitle$: Observable<string> = interval(75).pipe(
    take(this.fullTitle.length + 1),
    map((i) => this.fullTitle.slice(0, i)),
  );
}
