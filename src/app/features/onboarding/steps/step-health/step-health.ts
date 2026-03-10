import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-step-health',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-health.html',
  styleUrls: ['../shared-step.scss'],
})
export class StepHealth {
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  emergencyFields = [
    { label: 'First Name', required: true },
    { label: 'Last Name', required: true },
    { label: 'Phone Number', required: true },
    { label: 'Email Address', required: false },
  ];
}