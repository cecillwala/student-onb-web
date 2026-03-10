import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-congratulations-page',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './congratulations.html',
  styleUrl: './congratulations.scss',
})
export class Congratulations {
  submittedAt = new Date();

  nextSteps = [
    {
      title: 'Admin Review',
      description:
        'University administrators will review your submitted documents for completeness and accuracy.',
    },
    {
      title: 'Department Verification',
      description:
        'Your department head will verify your academic details and programme placement.',
    },
    {
      title: 'Medical Clearance',
      description:
        'The medical team will review your health information and may request additional documents.',
    },
    {
      title: 'Accommodation Assignment',
      description:
        'If you selected on-campus housing, the hostel team will assign you a room.',
    },
    {
      title: 'Onboarding Complete',
      description:
        "Once all stages are approved, you'll receive your university credentials via email.",
    },
  ];

  constructor(private router: Router) {}

  goToStatus(): void {
    this.router.navigate(['/onboarding/status']);
  }
}
