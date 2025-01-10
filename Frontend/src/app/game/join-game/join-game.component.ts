import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../api/api.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { LogoComponent } from '../../shared/logo/logo.component';
import { JoinGameCacheService } from './join-game-cache.service';

@Component({
  selector: 'app-join-game',
  imports: [ReactiveFormsModule, ButtonComponent, NgClass, LogoComponent],
  templateUrl: './join-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinGameComponent implements OnInit {
  @Input({ required: true }) gameId!: string;
  @Output() readonly nameSelected = new EventEmitter<string>();

  loading = false;
  errorMessage: string | null = null;

  formControl = new FormControl<string>('', Validators.required);

  constructor(
    private readonly apiService: ApiService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly joinGameCacheService: JoinGameCacheService,
  ) {}

  ngOnInit(): void {
    const cache = this.joinGameCacheService.getCache(this.gameId);

    if (cache) {
      this.apiService.rejoinGame(
        cache.gameId,
        cache.playerName,
        cache.connectionId,
      );
      const newConnectionId = this.apiService.getConnectionId();
      this.joinGameCacheService.setCache({
        gameId: cache.gameId,
        playerName: cache.playerName,
        connectionId: newConnectionId,
      });
      this.nameSelected.emit(cache.playerName);
    }
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
        this.joinGameCacheService.setCache({
          gameId: this.gameId,
          playerName: name,
          connectionId: this.apiService.getConnectionId(),
        });
        this.loading = false;
        this.nameSelected.emit(name);
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
