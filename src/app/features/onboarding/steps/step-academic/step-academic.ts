import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-step-academic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-academic.html',
  styleUrls: ['../shared-step.scss'],
})
export class StepAcademic {
  textareaFields = ['Academic Interests', 'Learning & Support Needs', 'Extracurricular Activities'];
}