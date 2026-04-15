import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ONBOARDING_STEPS, OnboardingStep } from '../models/onboarding.models';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Each step component registers a save function that:
 * - Validates the form
 * - Calls the API
 * - Returns an Observable<boolean> (true = success, false = validation failed)
 */
export type StepSaveFn = () => Observable<boolean>;

@Injectable({ providedIn: 'root' })
export class OnboardingStateService {
  private currentStepSubject = new BehaviorSubject<number>(1);
  private summaryStep = new BehaviorSubject<boolean>(false);
  private completedStepsSubject = new BehaviorSubject<Set<number>>(new Set());
  private saveStatusSubject = new BehaviorSubject<SaveStatus>('idle');
  private isNavigatingSubject = new BehaviorSubject<boolean>(false);

  isNavigating$ = this.isNavigatingSubject.asObservable();
  currentStep$ = this.currentStepSubject.asObservable();
  completedSteps$ = this.completedStepsSubject.asObservable();
  saveStatus$ = this.saveStatusSubject.asObservable();
  isSummaryStep = this.summaryStep.asObservable();

  router = inject(Router);

  readonly steps: OnboardingStep[] = ONBOARDING_STEPS;
  readonly totalSteps = ONBOARDING_STEPS.length;

  /**
   * The currently registered save function.
   * Each step component sets this on init and clears it on destroy.
   */
  private currentSaveFn: StepSaveFn | null = null;

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.isNavigatingSubject.next(false);
    });
  }

  // ── Step registration ──

  /**
   * Called by each step component in ngOnInit.
   * Registers a function that validates + saves the step data.
   */
  registerSaveFn(fn: StepSaveFn): void {
    this.currentSaveFn = fn;
  }

  /**
   * Called by each step component in ngOnDestroy.
   */
  clearSaveFn(): void {
    this.currentSaveFn = null;
  }

  // ── Getters ──

  get currentStep(): number {
    return this.currentStepSubject.value;
  }

  get completedSteps(): Set<number> {
    return this.completedStepsSubject.value;
  }

  set completedSteps(step: number){
    
  }

  get isFirstStep(): boolean {
    return this.currentStep === 1;
  }

  get isLastStep(): boolean {
    return this.currentStep === this.totalSteps;
  }

  get completionPercentage(): number {
    return Math.round((this.completedSteps.size / this.totalSteps) * 100);
  }

  isStepAccessible(stepId: number): boolean {
    if (this.completedSteps.has(stepId)) return true;
    if (stepId === this.currentStep) return true;
    const maxCompleted = Math.max(0, ...Array.from(this.completedSteps));
    return stepId <= maxCompleted + 1;
  }

  isStepCompleted(stepId: number): boolean {
    return this.completedSteps.has(stepId);
  }

  setCurrentStep(step: number): void {
    this.currentStepSubject.next(step);
  }

  goToStep(stepId: number): void {
    if (this.isStepAccessible(stepId)) {
      this.currentStepSubject.next(stepId);
    }
  }

  // ── Save & Navigate ──

  completeCurrentAndNext(): void {
    console.log('Save function registered:', this.currentSaveFn !== null);  // ← add this
    this.isNavigatingSubject.next(true);
    this.saveStatusSubject.next('saving');

    // If a step has registered a save function, call it
    const saveFn = this.currentSaveFn;
    const save$: Observable<boolean> = saveFn ? saveFn() : of(true);

    save$.subscribe({
      next: (success) => {
        // Mark current step as complete
        const updated = new Set(this.completedStepsSubject.getValue());
        updated.add(this.currentStepSubject.getValue());
        this.completedStepsSubject.next(updated);
        this.saveStatusSubject.next('saved');

        if (!this.isLastStep) {
          const nextStep = this.currentStepSubject.getValue() + 1;
          const nextRoute = ONBOARDING_STEPS.find(s => s.id === nextStep)?.route;

          this.currentStepSubject.next(nextStep);

          if (nextRoute) {
            this.router.navigate(['/onboarding', nextRoute]);
          }
        } else {
          this.router.navigate(['/onboarding/congratulations']);
        }
      },
      error: () => {
        this.saveStatusSubject.next('error');
        this.isNavigatingSubject.next(false);
        this.resetSaveStatus();
      },
    });
  }

  goBack(): void {
    if (!this.isFirstStep) {
      const prevStep = this.currentStepSubject.getValue() - 1;
      const prevRoute = ONBOARDING_STEPS.find(s => s.id === prevStep)?.route;

      this.currentStepSubject.next(prevStep);

      if (prevRoute) {
        this.router.navigate(['/onboarding', prevRoute]);
      }
    }
  }

  resetSaveStatus(): void {
    setTimeout(() => this.saveStatusSubject.next('idle'), 2000);
  }


  markCompletedSteps(currentStep: number){
    let completedSteps = new Set<number>();

    for(let i = 0; i < currentStep; i++){
      completedSteps.add(i + 1);
    }
    this.completedStepsSubject.next(completedSteps);   
  }
}