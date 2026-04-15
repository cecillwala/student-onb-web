import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { SharedImports } from '../../../../../shared/modules/shared.imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnboardingStateService } from '../../../../../shared/services/onboarding-state';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { DropdownSelect } from '../../../../../shared/components/dropdown-select/dropdown-select';
import { AccommodationRequest, HostelDetailsRequest, OnboardingApiService, RoomModel } from '../../../../../shared/services/api/onboarding-api';

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
  api = inject(OnboardingApiService);

  // Raw data from API
  allHostels = signal<HostelDetailsRequest[]>([]);

  // Dropdown options (transformed to {id, name} for app-dropdown-select)
  hostelOptions = signal<{ id: string; name: string }[]>([]);
  floorOptions = signal<{ id: number; name: string }[]>([]);
  roomTypeOptions = signal<{name: string }[]>([]);
  roomOptions = signal<{ id: string; name: string }[]>([]);

  // Currently selected hostel's rooms (for filtering)
  private selectedHostel = signal<HostelDetailsRequest>({
    hostel: "",
    hostel_id: "",
    gender_allocation: "MALE",
    total_capacity: 0,
    floors: [],
    roomTypes: [],
    rooms: []
});
  private selectedHostelRooms = signal<RoomModel[]>([]);

  private selectedFloor: number | null = null;
  private selectedRoomType = signal("");

  form!: FormGroup;
  isResident = true;
  isSharedRoom = signal(false);
  private subs: Subscription[] = [];

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

  // ── Lifecycle ──

  ngOnInit(): void {
    this.buildForm();
    this.watchResidenceType();
    this.loadHostelData();
    this.state.registerSaveFn(() => this.save());
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.state.clearSaveFn();
  }

  // ── Form ──

  private buildForm(): void {
    this.form = this.fb.group({
      residenceType:      ['Resident', Validators.required],

      // Resident
      hostelPreference:   [null],
      floor:              [null],
      roomType:           [null],
      room:               [null],
      specialNeeds:       [null],

      // Non-resident
      offCampusReason:    [null],
      guardianAware:      [null],
      buildingName:       [null],
      offCampusLocation:  [null],
      offCampusRoomType:  [null],

      // Landlord
      landlordFirstName:  [null],
      landlordLastName:   [null],
      landlordPhone:      [null],

      // Roommate
      roommateFirstName:  [null],
      roommateLastName:   [null],
      roommatePhone:      [null],
    });
  }

  // ── Load hostel data (one API call) ──

  private loadHostelData(): void {
    this.api.getHostelDetails().subscribe({
      next: (res) => {
        this.allHostels.set(res);

        // Transform to dropdown format
        this.hostelOptions.set(
          res.map(h => ({ id: h.hostel_id, name: h.hostel }))
        );

        console.log(this.hostelOptions());
      },
      error: () => {},
    });
  }

  // ── Cascading dropdown handlers ──

  onHostelChange(selected: any): void {
    // Reset downstream
    this.form.patchValue({ roomType: null, floor: null, room: null });
    this.roomTypeOptions.set([]);
    this.roomOptions.set([]);

    const hostel = this.allHostels().find(h => h.hostel_id === selected.id);
    if (!hostel) return;

    this.selectedHostel.set(hostel);

    this.floorOptions.set(hostel.floors.map(f  => ({id:f, name:`${f}${f == 1 ? 'st' : f == 2 ? 'nd' : f == 3 ? 'rd' : 'th'} Floor`})));

    this.selectedHostelRooms.set(hostel.rooms);

    // Populate room types from this hostel
    this.roomTypeOptions.set(
      hostel.roomTypes.map(t => ({ id: t, name: t }))
    );
}

onRoomTypeChange(selected: any): void {
    // Reset downstream
    this.form.patchValue({ floor: null, room: null });
    this.roomOptions.set([]);

    this.selectedRoomType.set(selected.id ?? selected.name);
}

onOffCampusRoomTypeChange(value: any): void{
  if(value.name == 'Shared'){
    this.isSharedRoom.set(true);
  }
  else{
    this.isSharedRoom.set(false);
  }
}

onFloorChange(selected: any): void {
    // Reset room
    this.form.patchValue({ room: null });
    this.roomOptions.set([]);

    this.selectedFloor = selected.id;

    // Filter rooms by room type + floor
    const filtered = this.selectedHostelRooms().filter(
      r => r.room_type === this.selectedRoomType() && r.floor === this.selectedFloor
    );
    console.log(filtered);

    this.roomOptions.set(
      filtered.map(r => ({
        id: r.id,
        name: `${r.room_number} (${r.available_beds} bed${r.available_beds !== 1 ? 's' : ''} available)`,
      }))
    );

    console.log(this.roomOptions());
}

onRoomChange(selected: any): void {
    // Room selected — nothing more to cascade
}
  // ── Watch residence type ──
  private watchResidenceType(): void {
    this.subs.push(
      this.form.get('residenceType')!.valueChanges.subscribe(value => {
        this.isResident = value === 1;

        if (this.isResident) {
          this.form.patchValue({
            offCampusReason: '', guardianAware: null,
            buildingName: '', offCampusLocation: null, offCampusRoomType: null,
            landlordFirstName: '', landlordLastName: '', landlordPhone: '',
            roommateFirstName: '', roommateLastName: '', roommatePhone: '',
          });
        } else {
          this.form.patchValue({
            hostelPreference: null, floor: null, roomType: null,
            room: null, specialNeeds: '',
          });
        }
      })
    );
  }

  onPhoneChange(value: any, field: string): void {
    this.form.get(field)?.setValue(value);
    this.form.get(field)?.markAsTouched();
  }

  // ── Save ──

  private save(): Observable<boolean> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return of(false);
    }

    const data: AccommodationRequest = this.form.getRawValue();
    return this.api.saveAccommodation(data, localStorage.getItem('token') ?? '').pipe(
        map(() => true),
        catchError(() => of(false)),
      );
  }
}