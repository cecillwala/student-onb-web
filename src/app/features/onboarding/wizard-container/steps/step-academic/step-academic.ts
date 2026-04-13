import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnboardingStateService } from '../../../../../shared/services/onboarding-state';
import { SharedImports } from '../../../../../shared/modules/shared.imports';
import { DropdownSelect } from '../../../../../shared/components/dropdown-select/dropdown-select';
import { DropdownSelectMultiple } from '../../../../../shared/components/dropdown-select-multiple/dropdown-select-multiple';
import { catchError, map, Observable, of } from 'rxjs';
import { AcademicDetailsRequest, OnboardingApiService } from '../../../../../shared/services/api/onboarding-api';

@Component({
  selector: 'app-step-academic',
  standalone: true,
  imports: [...SharedImports, DropdownSelect, DropdownSelectMultiple],
  templateUrl: './step-academic.html',
  styleUrls: ['../shared-step.scss'],
})
export class StepAcademic implements OnInit {

  private fb = inject(FormBuilder);
  state = inject(OnboardingStateService);
  api = inject(OnboardingApiService);

  form!: FormGroup;

  studyModes = [
    { id: 1, name: 'Full-time' },
    { id: 2, name: 'Part-time' },
    { id: 3, name: 'Distance Learning' },
  ];

  ngOnInit(): void {
    this.buildForm();
    this.state.registerSaveFn(() => this.save());
  }

   ngOnDestroy(): void {
      this.state.clearSaveFn();
    }
  
  private save(): Observable<boolean> {
      console.log('Form valid:', this.form.valid);
      console.log('Form values:', this.form.getRawValue());
      console.log('Invalid controls:', Object.keys(this.form.controls).filter(k => this.form.controls[k].invalid));
  
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        console.log("Invalid")
        return of(false);
      }
  
      const data: AcademicDetailsRequest = this.form.getRawValue();
      return this.api.saveAcademicDetails(data, localStorage.getItem('token') ?? '').pipe(
        map(() => true),
        catchError(() => of(false)),
      );
  }

  private buildForm(): void {
  this.form = this.fb.group({
    modeOfStudy:      [null, Validators.required],
    specialSupportNeeds:     [''],
    extraCurricularActivities: [[]],
  });
}

  extracurricularsList = [
  // Sports
  { id: 1,  name: 'Football' },
  { id: 2,  name: 'Basketball' },
  { id: 3,  name: 'Athletics' },
  { id: 4,  name: 'Swimming' },
  { id: 5,  name: 'Volleyball' },
  { id: 6,  name: 'Rugby' },
  { id: 7,  name: 'Tennis' },
  { id: 8,  name: 'Badminton' },
  // Arts & Culture
  { id: 9,  name: 'Music' },
  { id: 10, name: 'Drama & Theatre' },
  { id: 11, name: 'Dance' },
  { id: 12, name: 'Fine Art & Painting' },
  { id: 13, name: 'Photography' },
  // Clubs & Societies
  { id: 14, name: 'Debate Club' },
  { id: 15, name: 'Science Club' },
  { id: 16, name: 'Entrepreneurship Club' },
  { id: 17, name: 'Environmental Club' },
  { id: 18, name: 'Community Service' },
  { id: 19, name: 'Student Government' },
  { id: 20, name: 'Chess Club' },
  { id: 21, name: 'Coding Club' },
];
}