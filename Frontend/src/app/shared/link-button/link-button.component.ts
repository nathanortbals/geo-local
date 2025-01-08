import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-link-button',
  imports: [RouterLink, NgClass],
  templateUrl: './link-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkButtonComponent {
  @Input({ required: true }) routerLink!: string;
  @Input() color: 'gray' | 'yellow' = 'gray';
}
