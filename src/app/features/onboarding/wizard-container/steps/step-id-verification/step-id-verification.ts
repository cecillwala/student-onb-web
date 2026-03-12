import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ModalService } from '../../../../../shared/services/modal-service';
import { NotificationService } from '../../../../../shared/services/notification-service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-step-id-verification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-id-verification.html',
  styleUrls: ['../shared-step.scss'],
})
export class StepIdVerification {

  modalService = inject(ModalService);
  messageService = inject(NotificationService);
  selfieData = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  nationalIdData = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  
  openCamera(){
    const entityType = this.selfieData.entity;
    const originalData = this.selfieData.data; // Get the original data that was passed to QR modal
    
    // Close QR modal and open upload modal
    this.modalService.qrCodeDialogRef()?.close();

    // Open the upload modal with the same entity type AND original data
    setTimeout(() => {
      this.modalService.takeSelfie({
        entity: entityType,
        data: originalData || {}, // Pass the original data including documentType
        panelClass: 'upload-directly-dialog',
      });
    }, 100);
  }

  captureNationalId(){
    const entityType = this.nationalIdData.entity;
    const originalData = this.nationalIdData.data; // Get the original data that was passed to QR modal
    
    // Close QR modal and open upload modal
    this.modalService.qrCodeDialogRef()?.close();

    // Open the upload modal with the same entity type AND original data
    setTimeout(() => {
      this.modalService.takeNationalId({
        entity: entityType,
        data: originalData || {}, // Pass the original data including documentType
        panelClass: 'upload-directly-dialog',
      });
    }, 100);
  }

  openQrCodeModal(type: string) {

    // FIX: Use consistent entity naming and pass documentType correctly
    let entityType = type;
    let documentType = type;

    console.log('=== PERSONAL DOCUMENTS MODAL DEBUG ===');
    console.log('Opening modal with entity:', entityType);
    console.log('Document type from form:', documentType);
    console.log('Passing data:', { documentType: documentType });
    console.log('====================================');

    this.modalService.qrCodeModal({
      entity: entityType,
      data: { documentType: documentType },
    });

    this.modalService
      .qrCodeDialogRef()
      ?.afterClosed()
      .subscribe(async (res) => {
        console.log('Modal closed with result:', res);
        if (!res?.data) return;

        if (type === 'selfie') {
          this.messageService.showSuccess('Selfie captured successfully');
        }
      });
  }
}