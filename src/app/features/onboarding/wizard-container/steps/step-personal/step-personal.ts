import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { SharedImports } from '../../../../../shared/modules/shared.imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KENYA_COUNTIES, CONSTITUENCIES, WARDS, NATIONALITIES, GUARDIAN_RELATIONSHIPS } from './step-personal.data';
import { DropdownSelect } from '../../../../../shared/components/dropdown-select/dropdown-select';
import { OnboardingStateService } from '../../../../../shared/services/onboarding-state';
import { OnboardingApiService, PersonalDetailsRequest } from '../../../../../shared/services/api/onboarding-api';
import { Observable, of, map, catchError } from 'rxjs';
import { SessionService } from '../../../../../shared/services/session';

@Component({
  selector: 'app-step-personal',
  standalone: true,
  imports: [...SharedImports, DropdownSelect],
  templateUrl: './step-personal.html',
  styleUrls: ['../shared-step.scss'],
})
export class StepPersonal implements OnInit, OnDestroy {
  form!: FormGroup;

  // Dropdown data sources
  nationalities = NATIONALITIES;
  counties = KENYA_COUNTIES;
  constituencies: any[] = [];
  wards: any[] = [];
  guardianRelationships = GUARDIAN_RELATIONSHIPS;

  phoneNumber: string = '';
  guardianPhoneNumber: string = '';

  isLoading = true;

  sessionService = inject(SessionService);

  // Phone input config
  phoneConfig = {
    preferredCountries: ['ke'],
    enablePlaceholder: true,
    enableSearch: true,
  };

  // Static fields that remain as plain inputs
  genderOptions = [
    { id: 'MALE', name: 'Male' },
    { id: 'FEMALE', name: 'Female' },
    { id: 'OTHER', name: 'Other' },
  ];

  religionOptions = [
    { id: 'CHRISTIANITY', name: 'Christianity' },
    { id: 'ISLAM', name: 'Islam' },
    { id: 'HINDUISM', name: 'Hinduism' },
    { id: 'TRADITIONAL', name: 'Traditional' },
    { id: 'OTHER', name: 'Other' },
    { id: 'NONE', name: 'Prefer not to say' },
  ];

  constructor(
    private fb: FormBuilder,
    private state: OnboardingStateService,
    private api: OnboardingApiService,
  ) {}

  ngOnInit(): void {
    // Add this temporarily in step-personal.ts ngOnInit:
    console.log('Session token:', this.sessionService?.token());
    this.form = this.fb.group({
      // Student Information
      gender: ['', Validators.required],
      religion: [''],
      nationality: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],

      // Address Details
      county: ['', Validators.required],
      constituency: ['', Validators.required],
      ward: ['', Validators.required],
      postalCode: [''],

      // Guardian Details
      guardianFirstName: ['', Validators.required],
      guardianLastName: ['', Validators.required],
      guardianPhone: ['', Validators.required],
      guardianEmail: ['', Validators.email],
      guardianOccupation: ['', Validators.required],
      guardianRelationship: ['', Validators.required],
    });

    // Load saved data from backend
    this.api.getPersonalDetails(localStorage.getItem("token") ?? '').subscribe({
      next: (data) => {
        console.log(`DATA: ${data}`);
        if (data && data.gender) {
          this.form.patchValue(data);

          // Restore cascading dropdowns
          if (data.county) {
            const county = KENYA_COUNTIES.find(c => c.name === data.county || c.name === data.county);
            if (county) {
              this.constituencies = CONSTITUENCIES.filter(c => c.countyId === county.id);
            }
          }
          if (data.constituency) {
            const constituency = CONSTITUENCIES.find(c => c.name === data.constituency || c.name === data.constituency);
            if (constituency) {
              this.wards = WARDS.filter(w => w.constituencyId === constituency.id);
            }
          }
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });

    // Register save function with wizard
    this.state.registerSaveFn(() => this.save());
  }

  ngOnDestroy(): void {
    this.state.clearSaveFn();
  }

  // ── Save function called by wizard's "Save & Continue" ──
  private save(): Observable<boolean> {
    console.log('Form valid:', this.form.valid);
    console.log('Form values:', this.form.getRawValue());
    console.log('Invalid controls:', Object.keys(this.form.controls).filter(k => this.form.controls[k].invalid));

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return of(false);
    }

    const data: PersonalDetailsRequest = this.form.getRawValue();

    return this.api.savePersonalDetails(data).pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  // --- Phone handlers ---

  onPhoneChange(event: any, field: 'phone' | 'guardianPhone'): void {
    console.log('Phone event:', field, event);
    console.log('Phone event type:', typeof event);
    const value = event?.e164Number || event?.internationalNumber || event?.number || event;
    if (field === 'phone') {
      this.phoneNumber = value;
      this.form.get('phone')?.setValue(value);
    } else {
      this.guardianPhoneNumber = value;
      this.form.get('guardianPhone')?.setValue(value);
    }
  }

  // --- Cascading dropdown handlers ---

  onCountyChange(selectedCounty: any): void {
    // Reset dependent fields
    this.form.get('constituency')?.reset();
    this.form.get('ward')?.reset();
    this.wards = [];

    // Filter constituencies by selected county
    this.constituencies = CONSTITUENCIES.filter(
      (c) => c.countyId === selectedCounty.id
    );
  }

  onConstituencyChange(selectedConstituency: any): void {
    // Reset ward
    this.form.get('ward')?.reset();

    // Filter wards by selected constituency
    this.wards = WARDS.filter(
      (w) => w.constituencyId === selectedConstituency.id
    );
  }
}