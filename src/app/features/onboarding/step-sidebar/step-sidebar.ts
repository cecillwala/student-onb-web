import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OnboardingStateService } from '../../../shared/services/onboarding-state';
import { OnboardingStep } from '../../../shared/models/onboarding.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-sidebar',
  imports: [CommonModule],
  templateUrl: './step-sidebar.html',
  styleUrl: './step-sidebar.scss',
})
export class StepSidebar implements OnInit, OnDestroy {
  currentStep = 1;
  completedCount = 0;

  private subs: Subscription[] = [];

  constructor(public state: OnboardingStateService) {}

  ngOnInit(): void {
    this.subs.push(
      this.state.currentStep$.subscribe(step => (this.currentStep = step)),
      this.state.completedSteps$.subscribe(set => (this.completedCount = set.size))
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  onStepClick(step: OnboardingStep): void {
    if (this.state.isStepAccessible(step.id)) {
      this.state.goToStep(step.id);
    }
  }
}
