import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingStateService } from '../../../../../shared/services/onboarding-state';
import { OnboardingApiService } from '../../../../../shared/services/api/onboarding-api';
import { Observable, of, map, catchError } from 'rxjs';

interface SummarySection {
  title: string;
  icon: string;
  stepId: number;
  isOpen: boolean;
  fields: { label: string; value: string }[];
}

@Component({
  selector: 'app-step-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-summary.html',
  styleUrl: './step-summary.scss',
})
export class StepSummary implements OnInit, OnDestroy {

  state = inject(OnboardingStateService);
  api = inject(OnboardingApiService);

  sections = signal<SummarySection[]>([]);
  isLoading = true;

  ngOnInit(): void {
    this.loadSummary();
    this.state.registerSaveFn(() => this.submit());
  }

  ngOnDestroy(): void {
    this.state.clearSaveFn();
  }

  toggle(section: SummarySection): void {
    section.isOpen = !section.isOpen;
  }

  editSection(stepId: number): void {
    this.state.goToStep(stepId);
  }

  private loadSummary(): void {
    this.api.getSummary(localStorage.getItem("token") ?? '').subscribe({
      next: (data) => {
        console.log(data);
        this.sections.set(this.buildSections(data));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private submit(): Observable<boolean> {
    return this.api.submitApplication(localStorage.getItem("token") ?? '').pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  private buildSections(data: any): SummarySection[] {
    const sections: SummarySection[] = [];

    // ── Personal Details ──
    const p = data.personalDetails;
    if (p) {
      const guardianName = [p.guardianFirstName, p.guardianLastName].filter(Boolean).join(' ');
      sections.push({
        title: 'Personal Details',
        icon: 'person',
        stepId: 1,
        isOpen: true,
        fields: [
          { label: 'Gender', value: p.gender || '—' },
          { label: 'Religion', value: p.religion || '—' },
          { label: 'Nationality', value: p.nationality || '—' },
          { label: 'Email', value: p.email || '—' },
          { label: 'Phone', value: p.phone || '—' },
          { label: 'County', value: p.county || '—' },
          { label: 'Constituency', value: p.constituency || '—' },
          { label: 'Ward', value: p.ward || '—' },
          { label: 'Postal Code', value: p.postalCode || '—' },
          { label: 'Guardian', value: guardianName || '—' },
          { label: 'Guardian Phone', value: p.guardianPhone || '—' },
          { label: 'Guardian Email', value: p.guardianEmail || '—' },
          { label: 'Guardian Occupation', value: p.guardianOccupation || '—' },
          { label: 'Relationship', value: p.guardianRelationship || '—' },
        ].filter(f => f.value !== '—'),
      });
    }

    // ── ID Verification ──
    const id = data.idVerification;
    if (id) {
      sections.push({
        title: 'ID Verification',
        icon: 'badge',
        stepId: 2,
        isOpen: false,
        fields: [
          { label: 'ID Match', value: this.formatStatus(id.idMatchStatus) },
          { label: 'Liveness Check', value: this.formatStatus(id.livenessResult) },
        ],
      });
    }

    // ── Academic Details ──
    const a = data.academicDetails;
    if (a) {
      sections.push({
        title: 'Academic Details',
        icon: 'school',
        stepId: 3,
        isOpen: false,
        fields: [
          { label: 'Mode of Study', value: a.modeOfStudy || '—' },
          { label: 'Academic Interests', value: a.academicInterests || '—' },
          { label: 'Support Needs', value: a.learningSupportNeeds || 'None' },
          { label: 'Extracurriculars', value: a.extracurricularActivities || 'None' },
        ].filter(f => f.value !== '—'),
      });
    }

    // ── Accommodation ──
    const acc = data.accommodation;
    if (acc) {
      const isResident = acc.residenceType === '1' || acc.residenceType === 'Resident';
      const fields: { label: string; value: string }[] = [
        { label: 'Residence Type', value: isResident ? 'Resident (On-Campus)' : 'Non-Resident (Off-Campus)' },
      ];

      if (isResident) {
        fields.push(
          { label: 'Hostel', value: acc.hostelName || '—' },
          { label: 'Room Type', value: acc.roomType || '—' },
          { label: 'Room', value: acc.roomNumber || '—' },
          { label: 'Floor', value: acc.floor || '—' },
          { label: 'Special Needs', value: acc.specialNeeds || 'None' },
        );
      } else {
        fields.push(
          { label: 'Reason', value: acc.offCampusReason || '—' },
          { label: 'Building', value: acc.buildingName || '—' },
          { label: 'Location', value: acc.offCampusLocation || '—' },
          { label: 'Room Type', value: acc.offCampusRoomType || '—' },
          { label: 'Landlord', value: [acc.landlordFirstName, acc.landlordLastName].filter(Boolean).join(' ') || '—' },
          { label: 'Landlord Phone', value: acc.landlordPhone || '—' },
        );
        if (acc.roommateFirstName) {
          fields.push(
            { label: 'Roommate', value: [acc.roommateFirstName, acc.roommateLastName].filter(Boolean).join(' ') },
            { label: 'Roommate Phone', value: acc.roommatePhone || '—' },
          );
        }
      }

      sections.push({
        title: 'Accommodation',
        icon: 'home',
        stepId: 4,
        isOpen: false,
        fields: fields.filter(f => f.value !== '—'),
      });
    }

    // ── Health Details ──
    const h = data.healthDetails;
    if (h) {
      const emergencyName = [h.emergencyFirstName, h.emergencyLastName].filter(Boolean).join(' ');
      sections.push({
        title: 'Health Details',
        icon: 'local_hospital',
        stepId: 5,
        isOpen: false,
        fields: [
          { label: 'Blood Group', value: h.bloodGroup || '—' },
          { label: 'Medical Conditions', value: h.medicalConditions || 'None' },
          { label: 'Allergies', value: h.allergies || 'None' },
          { label: 'Insurance', value: h.insuranceProvider ? `${h.insuranceProvider} — ${h.policyNumber}` : 'None' },
          { label: 'Preferred Hospital', value: h.preferredHospital || '—' },
          { label: 'Emergency Contact', value: emergencyName ? `${emergencyName} (${h.emergencyRelationship || ''})` : '—' },
          { label: 'Emergency Phone', value: h.emergencyPhone || '—' },
          { label: 'Emergency Email', value: h.emergencyEmail || '—' },
          { label: 'Medical Report', value: h.medicalReportPath ? 'Uploaded ✓' : 'Not uploaded' },
        ].filter(f => f.value !== '—'),
      });
    }

    // ── Documents ──
    const docs = data.documents as { documentType: string; fileName: string; status: string }[];
    if (docs && docs.length > 0) {
      sections.push({
        title: 'Documents',
        icon: 'upload_file',
        stepId: 6,
        isOpen: false,
        fields: docs.map(d => ({
          label: d.documentType.replace(/_/g, ' '),
          value: `${d.fileName} ${ '✓'}`,
        })),
      });
    }

    return sections;
  }

  private formatStatus(status: string): string {
    return 'Submitted ✓';
  }
}