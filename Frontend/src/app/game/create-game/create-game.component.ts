import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  debounceTime,
  interval,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { ApiService } from '../../api/api.service';
import { Place } from '../../api/models/place.model';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-create-game',
  imports: [AsyncPipe, ReactiveFormsModule, NgClass, ButtonComponent],
  templateUrl: './create-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateGameComponent {
  private fullTitle = 'How well do you know your city?';

  public loading = false;

  public currentTitle$: Observable<string> = interval(75).pipe(
    take(this.fullTitle.length + 1),
    map((i) => this.fullTitle.slice(0, i)),
  );

  public formGroup = new FormGroup({
    searchTerm: new FormControl<string>(''),
    selectedPlaceId: new FormControl<string | null>(null, Validators.required),
  });

  public searchResults$: Observable<Place[] | null> =
    this.formGroup.controls.searchTerm.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((searchTerm) => {
        if (!searchTerm || searchTerm === '') {
          return of(null);
        }

        return this.apiService.findPlaces(searchTerm);
      }),
    );

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
  ) {}

  selectPlace(place: Place): void {
    this.formGroup.patchValue({
      searchTerm: place.name,
      selectedPlaceId: place.id,
    });
  }

  clearSearch(): void {
    this.formGroup.patchValue({
      searchTerm: '',
      selectedPlaceId: null,
    });
  }

  createGame(): void {
    if (this.formGroup.invalid) {
      return;
    }

    this.loading = true;
    this.apiService
      .createGame(this.formGroup.value.selectedPlaceId!)
      .subscribe({
        next: (gameId) => {
          this.loading = false;
          this.router.navigate(['/game', gameId]);
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
