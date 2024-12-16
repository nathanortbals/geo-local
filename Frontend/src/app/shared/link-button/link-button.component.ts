import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-link-button',
  imports: [RouterLink],
  templateUrl: './link-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkButtonComponent {
  @Input({ required: true }) routerLink!: string;
}
