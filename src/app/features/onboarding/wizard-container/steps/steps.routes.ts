import { Routes } from '@angular/router';

// steps.routes.ts
export const STEPS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../wizard-container').then(m => m.WizardContainer), // ← layout wrapper
    children: [
      {
        path: '',
        redirectTo: 'personal-details',
        pathMatch: 'full'
      },
      {
        path: 'personal-details',
        loadComponent: () =>
          import('./step-personal/step-personal').then(m => m.StepPersonal),
      },
      {
        path: 'id-verification',
        loadComponent: () =>
          import('./step-id-verification/step-id-verification').then(m => m.StepIdVerification),
      },
      {
        path: 'academic-details',
        loadComponent: () =>
          import('./step-academic/step-academic').then(m => m.StepAcademic),
      },
      {
        path: 'accommodation-details',
        loadComponent: () =>
          import('./step-accommodation/step-accommodation').then(m => m.StepAccommodation),
      },
      {
        path: 'health-information',
        loadComponent: () =>
          import('./step-health/step-health').then(m => m.StepHealth),
      },
      {
        path: 'documents-upload',
        loadComponent: () =>
          import('./step-documents/step-documents').then(m => m.StepDocuments),
      },
      {
        path: 'application-summary',
        loadComponent: () =>
          import('./step-summary/step-summary').then(m => m.StepSummary),
      }
    ]
  }
];