import { Component, OnDestroy, OnInit } from '@angular/core';
import { StepSidebar } from "../step-sidebar/step-sidebar";
import { ChatbotButton } from "../../../shared/components/chatbot-button/chatbot-button";
import { OnboardingStep } from '../../../shared/models/onboarding.models';
import { OnboardingStateService, SaveStatus } from '../../../shared/services/onboarding-state';
import { Subscription } from 'rxjs';
import { StepPersonal } from "../steps/step-personal/step-personal";
import { StepIdVerification } from "../steps/step-id-verification/step-id-verification";
import { StepAcademic } from "../steps/step-academic/step-academic";
import { StepAccommodation } from "../steps/step-accommodation/step-accommodation";
import { StepHealth } from "../steps/step-health/step-health";
import { StepDocuments } from "../steps/step-documents/step-documents";
import { StepSummary } from "../steps/step-summary/step-summary";
import { Navbar } from "../../../shared/components/navbar/navbar";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wizard-container',
  imports: [StepSidebar, ChatbotButton, StepPersonal, StepIdVerification, StepAcademic, StepAccommodation, StepHealth, StepDocuments, StepSummary, Navbar, CommonModule],
  templateUrl: './wizard-container.html',
  styleUrl: './wizard-container.scss',
})
export class WizardContainer implements OnInit, OnDestroy {
  currentStep = 1;
  currentStepData: OnboardingStep | undefined;
  saveStatus: SaveStatus = 'idle';

  private subs: Subscription[] = [];

  constructor(public state: OnboardingStateService) {}

  ngOnInit(): void {
    this.subs.push(
      this.state.currentStep$.subscribe(step => {
        this.currentStep = step;
        this.currentStepData = this.state.steps.find(s => s.id === step);
      }),
      this.state.saveStatus$.subscribe(status => (this.saveStatus = status))
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  onNext(): void {
    this.state.completeCurrentAndNext();
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

