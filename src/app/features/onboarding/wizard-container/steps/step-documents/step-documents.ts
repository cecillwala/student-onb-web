import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-step-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-documents.html',
  styleUrls: ['../shared-step.scss'],
})
export class StepDocuments {
  documents = [
    { name: 'KCSE Certificate', required: true, description: 'Upload your KCSE result slip' },
    { name: 'Letter from Chief', required: true, description: 'Signed letter from your area chief' },
    { name: 'Letter from Sub-Chief', required: true, description: 'Signed letter from your area sub-chief' },
  ];
}

