import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedImports } from '../../../../../shared/modules/shared.imports';

@Component({
  selector: 'app-step-documents',
  standalone: true,
  imports: [...SharedImports],
  templateUrl: './step-documents.html',
  styleUrls: ['../shared-step.scss'],
})
export class StepDocuments {

  documents = [
    { name: 'KCSE Certificate',     required: true,  description: 'Upload your KCSE certificate' },
    { name: 'KCSE Result Slip',     required: true,  description: 'Upload your KCSE result slip' },
    { name: 'Birth Certificate',    required: true,  description: 'Upload your birth certificate' },
    { name: 'Chief Details Form',   required: true,  description: 'Signed form from your area chief' },
    { name: 'Leaving Certificate',  required: true,  description: 'Upload your school leaving certificate' },
    { name: 'Letter of Acceptance', required: false, description: 'Upload your letter of acceptance if available' },
  ];

  uploadedFiles: Record<string, File> = {};

  triggerInput(docName: string): void {
    const input = document.getElementById(docName) as HTMLInputElement;
    input?.click();
  }

  onFileChange(event: Event, docName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadedFiles[docName] = input.files[0];
    }
  }
}