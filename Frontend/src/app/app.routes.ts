import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./game/create-game/create-game.component').then(
        (m) => m.CreateGameComponent,
      ),
  },
  {
    path: 'game/:gameId',
    loadComponent: () =>
      import('./game/game.component').then((m) => m.GameComponent),
  },
];
