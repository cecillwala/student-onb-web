import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingStateService } from '../../../../../shared/services/onboarding-state';

interface SummarySection {
  title: string;
  icon: string;
  stepId: number;
  isOpen: boolean;
  fields: { label: string; value: string }[];
}

@Component({
  selector: 'app-step-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-summary.html',
  styleUrl: './step-summary.scss',
})
export class StepSummary {
  // In a real app these values would come from the OnboardingStateService / API
  sections: SummarySection[] = [
    {
      title: 'Personal Details',
      icon: 'person',
      stepId: 1,
      isOpen: true,
      fields: [
        { label: 'Gender', value: 'Male' },
        { label: 'Religion', value: 'Christian' },
        { label: 'Nationality', value: 'Kenyan' },
        { label: 'Email', value: 'cecil.lwala@example.com' },
        { label: 'Phone', value: '+254 712 345 678' },
        { label: 'County', value: 'Nakuru' },
        { label: 'Constituency', value: 'Njoro' },
        { label: 'Ward', value: 'Njoro' },
        { label: 'Guardian', value: 'John Munala — +254 711 222 333' },
      ],
    },
    {
      title: 'ID Verification',
      icon: 'badge',
      stepId: 2,
      isOpen: false,
      fields: [
        { label: 'National ID', value: '34567890' },
        { label: 'ID Match', value: 'Verified ✓' },
        { label: 'Liveness Check', value: 'Passed ✓' },
      ],
    },
    {
      title: 'Academic Details',
      icon: 'school',
      stepId: 3,
      isOpen: false,
      fields: [
        { label: 'Mode of Study', value: 'Full-time' },
        { label: 'Academic Interests', value: 'Machine Learning, Web Development' },
        { label: 'Support Needs', value: 'None' },
        { label: 'Extracurriculars', value: 'Football, Coding Club' },
      ],
    },
    {
      title: 'Accommodation',
      icon: 'home',
      stepId: 4,
      isOpen: false,
      fields: [
        { label: 'Residency', value: 'Resident (On-Campus)' },
        { label: 'Hostel Preference', value: 'Hostel A' },
        { label: 'Room Type', value: 'Shared' },
        { label: 'Special Needs', value: 'None' },
      ],
    },
    {
      title: 'Health Details',
      icon: 'local_hospital',
      stepId: 5,
      isOpen: false,
      fields: [
        { label: 'Blood Group', value: 'O+' },
        { label: 'Conditions', value: 'None' },
        { label: 'Allergies', value: 'Penicillin' },
        { label: 'Insurance', value: 'NHIF — Policy #12345' },
        { label: 'Hospital', value: 'Nakuru Level 5 Hospital' },
        { label: 'Emergency Contact', value: 'Jane Munala — +254 722 111 000' },
        { label: 'Medical Report', value: 'medical_report.pdf ✓' },
      ],
    },
    {
      title: 'Documents',
      icon: 'upload_file',
      stepId: 6,
      isOpen: false,
      fields: [
        { label: 'KCSE Certificate', value: 'kcse_cert.pdf ✓' },
        { label: 'Chief\'s Letter', value: 'chief_letter.pdf ✓' },
        { label: 'Sub-Chief\'s Letter', value: 'subchief_letter.pdf ✓' },
      ],
    },
  ];

  state: OnboardingStateService = inject(OnboardingStateService);

  toggle(section: SummarySection): void {
    section.isOpen = !section.isOpen;
  }

  editSection(stepId: number): void {
    this.state.goToStep(stepId);
  }
}