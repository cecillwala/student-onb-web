import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ModalService } from '../../../../../shared/services/modal-service';
import { NotificationService } from '../../../../../shared/services/notification-service';
import { SelfieService } from '../../../../../shared/services/selfie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedImports } from '../../../../../shared/modules/shared.imports';
import { SelfieResult } from '../../../../../shared/models/onboarding.models';
import { catchError, map, Observable, of } from 'rxjs';
import { IdVerificationRequest, OnboardingApiService } from '../../../../../shared/services/api/onboarding-api';
import { OnboardingStateService } from '../../../../../shared/services/onboarding-state';

const PLACEHOLDER_ID = 'https://res.cloudinary.com/drkmm8xka/image/upload/v1775986345/kenyan_national_ID_v7ywkx.jpg';
const PLACEHOLDER_SELFIE = 'https://res.cloudinary.com/drkmm8xka/image/upload/q_auto/f_auto/v1775986903/File_Profile_avatar_placeholder_large_png_-_Wikimedia_Commons_rzavep.jpg';

@Component({
  selector: 'app-step-id-verification',
  standalone: true,
  imports: [...SharedImports, CommonModule],
  templateUrl: './step-id-verification.html',
  styleUrls: ['../shared-step.scss', './step-id-verification.scss'],
})
export class StepIdVerification implements OnInit, OnDestroy {

  modalService = inject(ModalService);
  messageService = inject(NotificationService);
  selfieService = inject(SelfieService);
  api = inject(OnboardingApiService);
  fb = inject(FormBuilder);
  state = inject(OnboardingStateService);

  nationalId = signal(PLACEHOLDER_ID);
  selfie = signal(PLACEHOLDER_SELFIE);
  nationalIdCaptured = signal(false);
  selfieCaptured = signal(false);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      nationalId: [null, Validators.required],
      selfie: [null, Validators.required],
    });

    this.state.registerSaveFn(() => this.save());     // ← add
  }

  ngOnDestroy(): void {
    this.state.clearSaveFn();                          // ← add
  }

  private save(): Observable<boolean> {
      console.log('Form valid:', this.form.valid);
      console.log('Form values:', this.form.getRawValue());
      console.log('Invalid controls:', Object.keys(this.form.controls).filter(k => this.form.controls[k].invalid));
  
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return of(false);
      }
  
      const data: IdVerificationRequest = this.form.getRawValue();
      return this.api.saveIdVerification(data, localStorage.getItem('token') ?? '').pipe(
        map(() => true),
        catchError(() => of(false)),
      );
    }

  // ── Selfie capture ──
  openCamera(): void {
    const dialogRef = this.modalService.takeSelfie({
      entity: 'selfie',
      data: {},
      panelClass: 'upload-directly-dialog',
    });

    dialogRef.afterClosed().subscribe((result: SelfieResult | undefined) => {
      if (result?.success && result.data) {
        // Update the image preview
        this.selfie.set(result.data);
        this.selfieCaptured.set(true);

        // Update the form control
        this.form.get('selfie')?.setValue(result.data);

        this.messageService.showSuccess('Selfie captured successfully');
      }
    });
  }

  // ── National ID capture ──
  captureNationalId(): void {
    const dialogRef = this.modalService.takeNationalId({
      entity: 'national-id',
      data: {},
      panelClass: 'upload-directly-dialog',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.data) {
        // Update the image preview
        this.nationalId.set(result.data);
        this.nationalIdCaptured.set(true);

        // Update the form control
        this.form.get('nationalId')?.setValue(result.data);

        this.messageService.showSuccess('National ID captured successfully');
      }
    });
  }
}