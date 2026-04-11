import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SharedImports } from '../../../../../shared/modules/shared.imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnboardingStateService } from '../../../../../shared/services/onboarding-state';
import { Subscription } from 'rxjs';
import { DropdownSelect } from '../../../../../shared/components/dropdown-select/dropdown-select';

@Component({
  selector: 'app-step-accommodation',
  standalone: true,
  imports: [...SharedImports, DropdownSelect],
  templateUrl: './step-accommodation.html',
  styleUrls: ['../shared-step.scss'],
})
export class StepAccommodation implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  state = inject(OnboardingStateService);

  form!: FormGroup;
  isResident = true; // default to resident
  private subs: Subscription[] = [];

  isSharedRoom = false;

  offCampusLocations = [
    { id: 1, name: 'Njokerio' },
    { id: 2, name: 'Gate' },
    { id: 3, name: "Ng'ondu" },
    { id: 4, name: 'Other' },
  ];

  offCampusRoomTypes = [
    { id: 1, name: 'Single' },
    { id: 2, name: 'Shared' },
  ];

  // ── Dropdown data ────────────────────────────────

  residenceTypes = [
    { id: 1, name: 'Resident' },
    { id: 2, name: 'Non-Resident' },
  ];

  offCampusReasons = [
    { id: 1,  name: 'Family Obligations' },
    { id: 2,  name: 'Medical Condition' },
    { id: 3,  name: 'Financial Constraints' },
    { id: 4,  name: 'Religious Reasons' },
    { id: 5,  name: 'Already Have Accommodation' },
    { id: 6,  name: 'Prefer More Privacy' },
    { id: 7,  name: 'Closer to Family' },
    { id: 8,  name: 'Disability or Special Needs' },
    { id: 9,  name: 'Married' },
    { id: 10, name: 'Other' },
  ];

  transportModes = [
    { id: 1, name: 'Personal Vehicle' },
    { id: 2, name: 'Public Matatu' },
    { id: 3, name: 'Bus' },
    { id: 4, name: 'Motorcycle (Boda Boda)' },
    { id: 5, name: 'Walking' },
    { id: 6, name: 'Cycling' },
    { id: 7, name: 'Other' },
  ];

  hostelOptions = [
    { id: 1, name: 'Hostel A — Male' },
    { id: 2, name: 'Hostel B — Male' },
    { id: 3, name: 'Hostel C — Female' },
    { id: 4, name: 'Hostel D — Female' },
    { id: 5, name: 'No Preference' },
  ];

  roomTypes = [
    { id: 1, name: 'Single' },
    { id: 2, name: 'Double' },
    { id: 3, name: 'Triple' },
    { id: 4, name: 'No Preference' },
  ];

  // ── Lifecycle ────────────────────────────────────

  ngOnInit(): void {
    this.buildForm();
    this.watchResidenceType();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  // ── Form ─────────────────────────────────────────

  private buildForm(): void {
    this.form = this.fb.group({
      residenceType:      [1, Validators.required],

      // Resident
      hostelPreference:   [null],
      roomType:           [null],
      specialNeeds:       [''],

      // Non-resident
      offCampusReason:    [''],
      guardianAware:      [null],

      // Off campus location
      buildingName:         [''],
      offCampusLocation:    [null],
      offCampusRoomType:    [null],

      // Landlord
      landlordFirstName:  [''],
      landlordLastName:   [''],
      landlordPhone:      [''],

      // Roommate
      roommateFirstName:  [''],
      roommateLastName:   [''],
      roommatePhone:      [''],
    });
  }

  // ── Watch residence type ──────────────────────────

  private watchResidenceType(): void {
    this.subs.push(
      this.form.get('residenceType')!.valueChanges.subscribe(value => {
        this.isResident = value === 1;

        if (this.isResident) {
          // Clear non-resident fields
          this.form.patchValue({
            townOfResidence:    '',
            distanceFromCampus: null,
            transportMode:      null,
          });
        } else {
          // Clear resident fields
          this.form.patchValue({
            hostelPreference: null,
            roomType:         null,
            specialNeeds:     '',
          });
        }
      })
    );
  }

  onPhoneChange(value: any, field: string): void {
    this.form.get(field)?.setValue(value);
    this.form.get(field)?.markAsTouched();
  }

  onRoomTypeChange(value: any): void {
  this.isSharedRoom = value?.id === 2;

  if (!this.isSharedRoom) {
    this.form.patchValue({
      roommateFirstName: '',
      roommateLastName:  '',
      roommatePhone:     '',
    });
  }
}
}
