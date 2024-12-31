import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../api/api.service';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-join-game',
  imports: [ReactiveFormsModule, ButtonComponent, NgClass],
  templateUrl: './join-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinGameComponent {
  @Input({ required: true }) gameId!: string;

  loading = false;
  errorMessage: string | null = null;

  formControl = new FormControl<string>('', Validators.required);

  constructor(
    private readonly apiService: ApiService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  joinGame() {
    if (this.formControl.invalid) {
      this.errorMessage = 'Please enter a name';
      return;
    }

    this.loading = true;

    this.apiService.joinGame(this.gameId, this.formControl.value!).subscribe({
      next: () => {
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: (error: Error) => {
        this.loading = false;
        this.errorMessage = error.message;
        this.changeDetectorRef.markForCheck();
      },
    });
  }
}
