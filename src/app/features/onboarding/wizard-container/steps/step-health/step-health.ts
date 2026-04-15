import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedImports } from '../../../../../shared/modules/shared.imports';
import { DropdownSelect } from '../../../../../shared/components/dropdown-select/dropdown-select';
import { DropdownSelectMultiple } from '../../../../../shared/components/dropdown-select-multiple/dropdown-select-multiple';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnboardingStateService } from '../../../../../shared/services/onboarding-state';
import { OnboardingApiService, HealthDetailsRequest } from '../../../../../shared/services/api/onboarding-api';
import { Observable, of, map, catchError, switchMap } from 'rxjs';

@Component({
  selector: 'app-step-health',
  standalone: true,
  imports: [...SharedImports, DropdownSelectMultiple, DropdownSelect],
  templateUrl: './step-health.html',
  styleUrls: ['../shared-step.scss'],
})
export class StepHealth implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private fb = inject(FormBuilder);
  state = inject(OnboardingStateService);
  api = inject(OnboardingApiService);

  form!: FormGroup;
  preferredCountries = ['ke'];
  uploadedFile: File | null = null;
  uploadedFileName = '';
  isLoading = true;

  // ── Dropdown data ──

  bloodGroups = [
    { id: 'A+', name: 'A+' },   { id: 'A-', name: 'A-' },
    { id: 'B+', name: 'B+' },   { id: 'B-', name: 'B-' },
    { id: 'AB+', name: 'AB+' }, { id: 'AB-', name: 'AB-' },
    { id: 'O+', name: 'O+' },   { id: 'O-', name: 'O-' },
  ];

  medicalConditionsList = [
    { id: 'Asthma', name: 'Asthma' },
    { id: 'Diabetes Type 1', name: 'Diabetes Type 1' },
    { id: 'Diabetes Type 2', name: 'Diabetes Type 2' },
    { id: 'Hypertension', name: 'Hypertension' },
    { id: 'Epilepsy', name: 'Epilepsy' },
    { id: 'Sickle Cell Disease', name: 'Sickle Cell Disease' },
    { id: 'HIV/AIDS', name: 'HIV/AIDS' },
    { id: 'Tuberculosis', name: 'Tuberculosis' },
    { id: 'Heart Disease', name: 'Heart Disease' },
    { id: 'Kidney Disease', name: 'Kidney Disease' },
    { id: 'Arthritis', name: 'Arthritis' },
    { id: 'Depression', name: 'Depression' },
    { id: 'Anxiety Disorder', name: 'Anxiety Disorder' },
    { id: 'Bipolar Disorder', name: 'Bipolar Disorder' },
    { id: 'Cancer', name: 'Cancer' },
    { id: 'Cerebral Palsy', name: 'Cerebral Palsy' },
    { id: 'Physical Disability', name: 'Physical Disability' },
    { id: 'Visual Impairment', name: 'Visual Impairment' },
    { id: 'Hearing Impairment', name: 'Hearing Impairment' },
    { id: 'None', name: 'None' },
  ];

  allergiesList = [
    { id: 'Peanuts', name: 'Peanuts' },
    { id: 'Tree Nuts', name: 'Tree Nuts' },
    { id: 'Milk / Dairy', name: 'Milk / Dairy' },
    { id: 'Eggs', name: 'Eggs' },
    { id: 'Wheat / Gluten', name: 'Wheat / Gluten' },
    { id: 'Soy', name: 'Soy' },
    { id: 'Fish', name: 'Fish' },
    { id: 'Shellfish', name: 'Shellfish' },
    { id: 'Pollen', name: 'Pollen' },
    { id: 'Dust Mites', name: 'Dust Mites' },
    { id: 'Mold', name: 'Mold' },
    { id: 'Latex', name: 'Latex' },
    { id: 'Penicillin', name: 'Penicillin' },
    { id: 'Aspirin', name: 'Aspirin' },
    { id: 'Ibuprofen', name: 'Ibuprofen' },
    { id: 'None', name: 'None' },
  ];

  relationships = [
    { id: 'Father', name: 'Father' },
    { id: 'Mother', name: 'Mother' },
    { id: 'Stepfather', name: 'Stepfather' },
    { id: 'Stepmother', name: 'Stepmother' },
    { id: 'Brother', name: 'Brother' },
    { id: 'Sister', name: 'Sister' },
    { id: 'Grandfather', name: 'Grandfather' },
    { id: 'Grandmother', name: 'Grandmother' },
    { id: 'Uncle', name: 'Uncle' },
    { id: 'Aunt', name: 'Aunt' },
    { id: 'Legal Guardian', name: 'Legal Guardian' },
    { id: 'Sponsor', name: 'Sponsor' },
    { id: 'Other', name: 'Other' },
  ];

  // ── Lifecycle ──

  ngOnInit(): void {
    this.buildForm();
    this.loadSavedData();
    this.state.registerSaveFn(() => this.save());
  }

  ngOnDestroy(): void {
    this.state.clearSaveFn();
  }

  // ── Form ──

  private buildForm(): void {
    this.form = this.fb.group({
      bloodGroup:            [null, Validators.required],
      preferredHospital:     [''],
      medicalConditions:     [[]],
      allergies:             [[]],
      insuranceProvider:     [''],
      policyNumber:          [''],
      emergencyFirstName:    ['', Validators.required],
      emergencyLastName:     ['', Validators.required],
      emergencyRelationship: [null, Validators.required],
      emergencyPhone:        ['', Validators.required],
      emergencyEmail:        [''],
    });
  }

  // ── Load saved data ──

  private loadSavedData(): void {
    this.api.getHealthDetails(localStorage.getItem("token") ?? '').subscribe({
      next: (data) => {
        if (data && data.bloodGroup) {
          this.form.patchValue(data);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  // ── Save ──

  private save(): Observable<boolean> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return of(false);
    }

    const data: HealthDetailsRequest = this.form.getRawValue();

    // Save form data first, then upload file if present
    return this.api.saveHealthDetails(data, localStorage.getItem("token") ?? '').pipe(
      switchMap(() => {
        if (this.uploadedFile) {
          return this.api.uploadMedicalReport(this.uploadedFile, localStorage.getItem("token") ?? '').pipe(
            map(() => true),
            catchError(() => of(true)), // form saved, file failed — still continue
          );
        }
        return of(true);
      }),
      catchError(() => of(false)),
    );
  }

  // ── Phone ──

  onPhoneChange(value: any): void {
    this.form.get('emergencyPhone')?.setValue(value);
    this.form.get('emergencyPhone')?.markAsTouched();
  }

  // ── File upload ──

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadedFile = input.files[0];
      this.uploadedFileName = this.uploadedFile.name;
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
      this.uploadedFileName = file.name;
    }
  }
}