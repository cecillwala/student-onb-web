import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SessionService } from '../services/session';

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  // Attach session token if available
  const token = sessionService.token();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Session expired or invalid — redirect to welcome
        sessionService.clearSession();
        router.navigate(['/onboarding/welcome']);
      }
      return throwError(() => error);
    })
  );
};