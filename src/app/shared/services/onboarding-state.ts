import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ONBOARDING_STEPS, OnboardingStep } from '../models/onboarding.models';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

@Injectable({ providedIn: 'root' })
export class OnboardingStateService {
  private currentStepSubject = new BehaviorSubject<number>(1);
  private summaryStep = new BehaviorSubject<boolean>(false);
  private completedStepsSubject = new BehaviorSubject<Set<number>>(new Set());
  private saveStatusSubject = new BehaviorSubject<SaveStatus>('idle');

  currentStep$ = this.currentStepSubject.asObservable();
  completedSteps$ = this.completedStepsSubject.asObservable();
  saveStatus$ = this.saveStatusSubject.asObservable();
  isSummaryStep = this.summaryStep.asObservable();

  readonly steps: OnboardingStep[] = ONBOARDING_STEPS;
  readonly totalSteps = ONBOARDING_STEPS.length;

  get currentStep(): number {
    return this.currentStepSubject.value;
  }

  get completedSteps(): Set<number> {
    return this.completedStepsSubject.value;
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

  /**
   * Check whether a given step can be navigated to.
   * A step is accessible if it's the current step, already completed,
   * or the very next step after the last completed one.
   */
  isStepAccessible(stepId: number): boolean {
    if (this.completedSteps.has(stepId)) return true;
    if (stepId === this.currentStep) return true;
    // Allow the next step after the highest completed step
    const maxCompleted = Math.max(0, ...Array.from(this.completedSteps));
    return stepId <= maxCompleted + 1;
  }

  isStepCompleted(stepId: number): boolean {
    return this.completedSteps.has(stepId);
  }

  goToStep(stepId: number): void {
    if (this.isStepAccessible(stepId)) {
      this.currentStepSubject.next(stepId);
    }
  }

  /**
   * Mark the current step as complete and advance to the next.
   * In a real app this would first call the API to save the step data.
   */
  completeCurrentAndNext(): void {
    const updated = new Set(this.completedSteps);
    updated.add(this.currentStep);
    this.completedStepsSubject.next(updated);

    // Simulate auto-save
    this.saveStatusSubject.next('saving');
    setTimeout(() => {
      this.saveStatusSubject.next('saved');
      if (!this.isLastStep) {
        this.currentStepSubject.next(this.currentStep + 1);
      }
    }, 600);
  }

  goBack(): void {
    if (!this.isFirstStep) {
      this.currentStepSubject.next(this.currentStep - 1);
    }
  }

  /** Reset save indicator after a delay */
  resetSaveStatus(): void {
    setTimeout(() => this.saveStatusSubject.next('idle'), 2000);
  }
}