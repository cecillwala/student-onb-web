import { inject, Injectable, signal } from '@angular/core';
import { ModalData } from '../models/onboarding.models';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SelfieModal } from '../components/selfie-modal/selfie-modal';
import { QrCode } from '../components/qr-code/qr-code';
import { IdModal } from '../components/id-modal/id-modal';


@Injectable({
  providedIn: 'root',
})
export class ModalService {

  breakpointObserver = inject(BreakpointObserver);
  dialog = inject(MatDialog);
  selfieUploadDialogRef = signal<MatDialogRef<SelfieModal> | null>(null);
  qrCodeDialogRef = signal<MatDialogRef<QrCode> | null>(null);
  nationalIdDialogRef = signal<MatDialogRef<IdModal> | null>(null);
  
  takeSelfie(data: ModalData) {
    const dialogConfig = this.getDialogConfig(data);
    const dialogRef = this.dialog.open(SelfieModal, dialogConfig);
    this.selfieUploadDialogRef.set(dialogRef);
    return dialogRef;
  }

  takeNationalId(data: ModalData){
    const dialogConfig = this.getDialogConfig(data);
    const dialogRef = this.dialog.open(IdModal, dialogConfig);
    this.nationalIdDialogRef.set(dialogRef);
    return dialogRef;
  }

  qrCodeModal(data: ModalData) {
    const dialogConfig = this.getDialogConfig(data);
    const dialogRef = this.dialog.open<QrCode>(
      QrCode,
      dialogConfig
    );
    this.qrCodeDialogRef.set(dialogRef);
  }

  private getDialogConfig(data: ModalData): MatDialogConfig {
    const isXSmall = this.breakpointObserver.isMatched(Breakpoints.XSmall);
    const isSmall = this.breakpointObserver.isMatched(Breakpoints.Small);
    const isMedium = this.breakpointObserver.isMatched(Breakpoints.Medium);

    let config: MatDialogConfig = {
      data,
      disableClose: true,
    };

    if (isXSmall) {
      config = {
        ...config,
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
      };
    } else if (isSmall) {
      config = {
        ...config,
        maxWidth: '90vw',
        maxHeight: '90vh',
        height: '90%',
        width: '90%',
      };
    } else if (isMedium) {
      config = {
        ...config,
        maxWidth: '50vw',
        width: '30%',
      };
    } else {
      config = {
        ...config,
        maxWidth: '50vw',
        width: '30%',
      };
    }

    return config;
  }
}