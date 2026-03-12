import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { SharedImports } from '../../../../../shared/modules/shared.imports';
import { DropdownSelect } from '../../../../../shared/components/dropdown-select/dropdown-select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnboardingStateService } from '../../../../../shared/services/onboarding-state';
import { DropdownSelectMultiple } from '../../../../../shared/components/dropdown-select-multiple/dropdown-select-multiple';

@Component({
  selector: 'app-step-health',
  standalone: true,
  imports: [...SharedImports, DropdownSelectMultiple, DropdownSelect],
  templateUrl: './step-health.html',
  styleUrls: ['../shared-step.scss'],
})
export class StepHealth implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private fb = inject(FormBuilder);
  state = inject(OnboardingStateService);

  form!: FormGroup;
  preferredCountries = ['ke'];
  uploadedFile: File | null = null;

  // ── Dropdown data ────────────────────────────────

  bloodGroups = [
    { id: 1, name: 'A+' },
    { id: 2, name: 'A-' },
    { id: 3, name: 'B+' },
    { id: 4, name: 'B-' },
    { id: 5, name: 'AB+' },
    { id: 6, name: 'AB-' },
    { id: 7, name: 'O+' },
    { id: 8, name: 'O-' },
  ];

  medicalConditionsList = [
    { id: 1,  name: 'Asthma' },
    { id: 2,  name: 'Diabetes Type 1' },
    { id: 3,  name: 'Diabetes Type 2' },
    { id: 4,  name: 'Hypertension' },
    { id: 5,  name: 'Epilepsy' },
    { id: 6,  name: 'Sickle Cell Disease' },
    { id: 7,  name: 'HIV/AIDS' },
    { id: 8,  name: 'Tuberculosis' },
    { id: 9,  name: 'Heart Disease' },
    { id: 10, name: 'Kidney Disease' },
    { id: 11, name: 'Arthritis' },
    { id: 12, name: 'Depression' },
    { id: 13, name: 'Anxiety Disorder' },
    { id: 14, name: 'Bipolar Disorder' },
    { id: 15, name: 'Schizophrenia' },
    { id: 16, name: 'Cancer' },
    { id: 17, name: 'Cerebral Palsy' },
    { id: 18, name: 'Physical Disability' },
    { id: 19, name: 'Visual Impairment' },
    { id: 20, name: 'Hearing Impairment' },
    { id: 21, name: 'None' },
  ];

  allergiesList = [
    // Food
    { id: 1,  name: 'Peanuts' },
    { id: 2,  name: 'Tree Nuts' },
    { id: 3,  name: 'Milk / Dairy' },
    { id: 4,  name: 'Eggs' },
    { id: 5,  name: 'Wheat / Gluten' },
    { id: 6,  name: 'Soy' },
    { id: 7,  name: 'Fish' },
    { id: 8,  name: 'Shellfish' },
    { id: 9,  name: 'Sesame' },
    // Environmental
    { id: 10, name: 'Pollen' },
    { id: 11, name: 'Dust Mites' },
    { id: 12, name: 'Mold' },
    { id: 13, name: 'Pet Dander' },
    { id: 14, name: 'Insect Stings' },
    { id: 15, name: 'Latex' },
    // Medication
    { id: 16, name: 'Penicillin' },
    { id: 17, name: 'Aspirin' },
    { id: 18, name: 'Ibuprofen' },
    { id: 19, name: 'Sulfonamides' },
    { id: 20, name: 'Codeine' },
    { id: 21, name: 'None' },
  ];

  relationships = [
    { id: 1,  name: 'Father' },
    { id: 2,  name: 'Mother' },
    { id: 3,  name: 'Stepfather' },
    { id: 4,  name: 'Stepmother' },
    { id: 5,  name: 'Brother' },
    { id: 6,  name: 'Sister' },
    { id: 7,  name: 'Grandfather' },
    { id: 8,  name: 'Grandmother' },
    { id: 9,  name: 'Uncle' },
    { id: 10, name: 'Aunt' },
    { id: 11, name: 'Legal Guardian' },
    { id: 12, name: 'Sponsor' },
    { id: 13, name: 'Other' },
  ];

  // ── Lifecycle ────────────────────────────────────

  ngOnInit(): void {
    this.buildForm();
  }

  // ── Form ─────────────────────────────────────────

  private buildForm(): void {
    this.form = this.fb.group({
      // Health Information
      bloodGroup:          [null, Validators.required],
      preferredHospital:   [''],
      medicalConditions:   [''],
      allergies:           [''],

      // Insurance
      insuranceProvider:   [''],
      policyNumber:        [''],

      // Emergency Contact
      emergencyFirstName:  ['', Validators.required],
      emergencyLastName:   ['', Validators.required],
      emergencyRelationship: [null, Validators.required],
      emergencyPhone:      ['', Validators.required],
    });
  }


  onPhoneChange(value: any): void {
    this.form.get('emergencyPhone')?.setValue(value);
    this.form.get('emergencyPhone')?.markAsTouched();
  }

  // ── File upload ───────────────────────────────────

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadedFile = input.files[0];
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.uploadedFile = file;
    }
  }
}