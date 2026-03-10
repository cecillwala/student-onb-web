import { Component, OnInit } from '@angular/core';
import { SharedImports } from '../../../../shared/modules/shared.imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KENYA_COUNTIES, CONSTITUENCIES, WARDS, NATIONALITIES } from './step-personal.data';
import { DropdownSelect } from '../../../../shared/components/dropdown-select/dropdown-select';

@Component({
  selector: 'app-step-personal',
  standalone: true,
  imports: [...SharedImports, DropdownSelect],
  templateUrl: './step-personal.html',
  styleUrls: ['../shared-step.scss'],
})
export class StepPersonal implements OnInit {
  form!: FormGroup;

  // Dropdown data sources
  nationalities = NATIONALITIES;
  counties = KENYA_COUNTIES;
  constituencies: any[] = [];
  wards: any[] = [];

  phoneNumber: string = '';
  guardianPhoneNumber: string = '';

  // Phone input config
  phoneConfig = {
    preferredCountries: ['ke'],
    enablePlaceholder: true,
    enableSearch: true,
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
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
    });
  }

  onPhoneChange(event: any, field: 'phone' | 'guardianPhone'): void {
    const value = event?.e164Number || event?.internationalNumber || event?.number || event;
    if (field === 'phone') {
      this.phoneNumber = value;
    } else {
      this.guardianPhoneNumber = value;
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
}
