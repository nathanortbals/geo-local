import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../api/api.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { JoinGameCacheService } from './join-game-cache.service';

@Component({
  selector: 'app-join-game',
  imports: [ReactiveFormsModule, ButtonComponent, NgClass],
  templateUrl: './join-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinGameComponent implements OnInit {
  @Input({ required: true }) gameId!: string;

  loading = false;
  errorMessage: string | null = null;

  formControl = new FormControl<string>('', Validators.required);

  constructor(
    private readonly apiService: ApiService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly joinGameCacheService: JoinGameCacheService,
  ) {}

  ngOnInit(): void {
    this.joinGameCacheService.rejoinGameIfCached(this.gameId);
  }

  joinGame() {
    if (this.formControl.invalid) {
      this.errorMessage = 'Please enter a name';
      return;
    }

    const name = this.formControl.value!;

    this.loading = true;
    this.apiService.joinGame(this.gameId, name).subscribe({
      next: () => {
        this.joinGameCacheService.setCache(this.gameId, name);
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
