import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { City } from '../../api/models/city.model';
import { ButtonComponent } from '../../shared/button/button.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { SecondaryButtonComponent } from '../../shared/secondary-button/secondary-button.component';

@Component({
  selector: 'app-create-game',
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    SecondaryButtonComponent,
    SecondaryButtonComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './create-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateGameComponent {
  public loading = false;
  public creatingGame = false;
  public errorMessage: string | null = null;
  public searchResults: City[] = [];

  public formControl = new FormControl<string>('');

  constructor(
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  selectCity(city: City): void {
    this.creatingGame = true;
    this.apiService.createGame(city.osmId, city.name).subscribe({
      next: (gameId) => {
        this.loading = false;
        this.router.navigate(['/game', gameId]);
      },
      error: () => {
        this.creatingGame = false;
      },
    });
  }

  clearSearch(): void {
    this.searchResults = [];
    this.formControl.setValue('');
  }

  search(): void {
    if (this.formControl.value === '') {
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.apiService.findCities(this.formControl.value!).subscribe({
      next: (cities) => {
        this.loading = false;
        this.searchResults = cities;
        if (cities.length === 0) {
          this.errorMessage = 'No cities matched your search term.';
        }

        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Error searching for cities, please try again';
        this.searchResults = [];
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
