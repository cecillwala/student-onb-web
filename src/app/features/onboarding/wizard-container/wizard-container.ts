import { Component, OnDestroy, OnInit, inject, ChangeDetectorRef, signal } from '@angular/core';
import { StepSidebar } from "../step-sidebar/step-sidebar";
import { ChatbotButton } from "../../../shared/components/chatbot-button/chatbot-button";
import { OnboardingStep } from '../../../shared/models/onboarding.models';
import { OnboardingStateService, SaveStatus } from '../../../shared/services/onboarding-state';
import { Subscription } from 'rxjs';
import { Navbar } from "../../../shared/components/navbar/navbar";
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { SessionService } from '../../../shared/services/session';
import { OnboardingApiService } from '../../../shared/services/api/onboarding-api';

@Component({
  selector: 'app-wizard-container',
  imports: [StepSidebar, ChatbotButton, Navbar, CommonModule, RouterOutlet],
  templateUrl: './wizard-container.html',
  styleUrl: './wizard-container.scss',
})
export class WizardContainer implements OnInit, OnDestroy {
  state = inject(OnboardingStateService);
  currentStep = signal(this.state.currentStep);
  currentStepData: OnboardingStep | undefined;
  saveStatus: SaveStatus = 'idle';
  lastStep = signal(this.currentStep() == 7 ? true : false);
  session = inject(SessionService);
  errorMessage = signal('');
  private subs: Subscription[] = [];
  cd = inject(ChangeDetectorRef);
  api = inject(OnboardingApiService);
  isNavigating = signal(false);
  navigate = inject(Router);


  async ngOnInit(): Promise<void> {
    
    this.api.getCurrentStep(localStorage.getItem('token') ?? '').subscribe((res) => {
      this.state.setCurrentStep(res + 1);
      this.state.markCompletedSteps(res);
      this.cd.detectChanges();
      this.subs.push(
        this.state.currentStep$.subscribe(step => {
          this.currentStep.set(step);
          this.currentStepData = this.state.steps.find(s => s.id === step);
        }),
        this.state.saveStatus$.subscribe(status => (this.saveStatus = status))
      );

      this.state.isNavigating$.subscribe(v => this.isNavigating.set(v));   
      console.log(this.currentStepData);
      this.navigate.navigate([`/onboarding/${this.currentStepData?.route}`])
    });


    this.api.verifyIdentity(localStorage.getItem("token") ?? '', '').subscribe({
      next: (session) => {
        this.session.setSession({
          sessionToken: session.sessionToken,
          studentId: session.studentId,
          firstName: session.firstName,
          lastName: session.lastName,
          regNo: session.regNo,
          programme: session.programme,
          currentStep: session.currentStep,
          status: session.status,
        });
      },
      error: (err) => {
        const message = err.error?.message ?? 'Failed to start onboarding. Please try again.';
        this.errorMessage.set(message);
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  onNext(): void {
    this.state.completeCurrentAndNext();
    this.isNavigating.set(true);
  }

  onBack(): void {
    this.state.goBack();
  }

  onPillClick(step: OnboardingStep): void {
    if (this.state.isStepAccessible(step.id)) {
      this.state.goToStep(step.id);
    }
  }
}

