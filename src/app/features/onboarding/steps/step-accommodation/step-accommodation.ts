import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-step-accommodation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-accommodation.html',
  styleUrls: ['../shared-step.scss'],
})
export class StepAccommodation {
  residency: 'resident' | 'non-resident' | null = null;
}
