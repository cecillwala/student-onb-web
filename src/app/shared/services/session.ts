import { Injectable, signal, computed } from '@angular/core';

export interface StudentSession {
  sessionToken: string;
  studentId: string;
  firstName: string;
  lastName: string;
  regNo: string;
  programme: string;
  currentStep: number;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class SessionService {

  private sessionSignal = signal<StudentSession | null>(null);

  // ── Public state ──
  session = computed(() => this.sessionSignal());
  isAuthenticated = computed(() => this.sessionSignal() !== null);
  token = computed(() => this.sessionSignal()?.sessionToken ?? null);
  currentStep = computed(() => this.sessionSignal()?.currentStep ?? 0);
  studentName = computed(() => {
    const s = this.sessionSignal();
    return s ? `${s.firstName} ${s.lastName}` : '';
  });

  // ── Set session after magic link verification ──
  setSession(session: StudentSession): void {
    this.sessionSignal.set(session);
  }

  // ── Update current step as student progresses ──
  updateCurrentStep(step: number): void {
    const current = this.sessionSignal();
    if (current) {
      this.sessionSignal.set({ ...current, currentStep: step });
    }
  }

  // ── Clear on logout / session expiry ──
  clearSession(): void {
    this.sessionSignal.set(null);
  }
}