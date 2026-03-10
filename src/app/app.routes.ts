import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'onboarding/welcome', pathMatch: 'full' },
  {
    path: 'onboarding/welcome',
    loadComponent: () =>
      import('./features/onboarding/welcome/welcome').then(m => m.Welcome),
  },
  {
    path: 'onboarding/wizard',
    loadComponent: () =>
      import('./features/onboarding/wizard-container/wizard-container').then(
        m => m.WizardContainer
      ),
  },
  {
    path: 'onboarding/congratulations',
    loadComponent: () =>
      import('./features/onboarding/congratulations/congratulations').then(
        m => m.Congratulations
      ),
  },
  {
    path: 'onboarding/status',
    loadComponent: () =>
      import('./features/onboarding/status-tracking/status-tracking').then(
        m => m.StatusTracking
      ),
  },
];