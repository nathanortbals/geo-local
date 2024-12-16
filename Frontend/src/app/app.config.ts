import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './api/api.service';
import { routes } from './app.routes';
import { GoogleMapsService } from './google-maps.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => {
      const googlesMapsService = inject(GoogleMapsService);
      return googlesMapsService.loadLibraries();
    }),
    provideAppInitializer(() => {
      const apiService = inject(ApiService);
      return apiService.connectToHub();
    }),
  ],
};
