import { ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { SharedImports } from '../../modules/shared.imports';
import { SelfieService } from '../../services/selfie-service';
import { ModalService } from '../../services/modal-service';
import { NotificationService } from '../../services/notification-service';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GhanaCardExtractedData, IDResult, OcrResponse, SelfieResult } from '../../models/onboarding.models';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-id-modal',
  imports: [...SharedImports],
  templateUrl: './id-modal.html',
  styleUrl: './id-modal.scss',
})
export class IdModal {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  private changeDetectorRef = inject(ChangeDetectorRef);
  private selfieService = inject(SelfieService);
  private modalService = inject(ModalService);
  private messageService = inject(NotificationService);
  // private messageService = inject(ToastNotificationService);
  private livenessApiUrl = 'https://ai.giktek.io/tinga';
  checkingLiveness: boolean = false;
  imageVerified: boolean = false;
  private http = inject(HttpClient);

  data = inject(MAT_DIALOG_DATA);
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isLoading: boolean = false;
  isPdfFile: boolean = false;

  // New properties for different states
  showConfirmation: boolean = false;
  showNoNationalId: boolean = false;
  extractedNationalId: string = '';
  ocrResult: OcrResponse | null = null;
  livenessError: boolean = false;
  livenessErrorMessage: string = '';

  extractedData: any = {
    nationalId: '',
    idNumber: '',
    dateOfBirth: '',
    sex: '',
    placeOfBirth: '',
    dateIssued: '',
    dateOfExpiry: '',
    fullName: '',
    firstName: '',
    nationality: '',
  };

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      this.selectedFile = file;

      // Handle preview based on file type
      if (file.type === 'application/pdf') {
        // For PDF files, don't create image preview
        this.previewUrl = null;
        this.isPdfFile = true;
        this.changeDetectorRef.detectChanges();
      } else {
        // For image files, create preview as usual
        this.isPdfFile = false;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrl = e.target?.result as string;
          this.changeDetectorRef.detectChanges();
        };
        reader.readAsDataURL(file);
      }
    }
  }

  uploadFile(): void {
    if (!this.selectedFile || !this.previewUrl) {
      // this.messageService.showInfo('Please select a file first');
      return;
    }
    this.processImageWithOcr();
  }

  private extractGhanaCardData(
    ocrResponse: OcrResponse
  ): GhanaCardExtractedData {
    const fields = ocrResponse?.data?.fields;
    console.log('OCR Fields:', fields);

    if (!fields) {
      console.log('No fields found in OCR response');
      return {
        nationalId: '',
        idNumber: '',
        dateOfBirth: '',
        sex: '',
        placeOfBirth: '',
        dateIssued: '',
        dateOfExpiry: '',
        fullName: '',
        firstName: '',
        nationality: '',
      };
    }

    return {
      nationalId:
        fields.id_number?.value || fields.document_number?.value || '',
      idNumber: fields.id_number?.value || fields.document_number?.value || '',
      dateOfBirth: fields.date_of_birth?.value || '',
      sex: fields.sex?.value || '',
      placeOfBirth: fields.place_of_birth?.value || '',
      dateIssued: fields.date_of_issue?.value || '',
      dateOfExpiry: fields.date_of_expiry?.value || '',
      fullName: fields.full_name?.value || fields.first_name?.value || '',
      firstName: fields.first_name?.value || '',
      nationality: fields.nationality?.value || '',
    };
  }

  // === OCR PROCESSING ===
  private processImageWithOcr() {
    if (!this.selectedFile) {
      // this.messageService.showError('No file selected');
      return;
    }

    this.isLoading = true;
    // this.messageService.showInfo('Processing document with OCR...');

    console.log('Modal data received:', this.data);

    // FIX: Access documentType from the correct path
    // The data structure is: { entity: "...", data: { documentType: "..." } }
    const documentType = this.data.data?.documentType;

    console.log('Document type from data:', documentType);

    // FIX: Use the correct mapping for nonCitizenId
    const ocrDocumentType =
      documentType === 'nonCitizenId' ? 'non_citizen_card' : 'ghana_card';

    console.log('Using document type for OCR:', ocrDocumentType);

    this.selfieService
      .scanGhanaCard(this.selectedFile, ocrDocumentType)
      .subscribe({
        next: (ocrResponse: OcrResponse) => {
          this.isLoading = false;

          if (ocrResponse.success) {
            this.extractedData = this.extractGhanaCardData(ocrResponse);

            if (this.extractedData.nationalId) {
              this.messageService.showSuccess(
                'National ID detected successfully!'
              );
              this.extractedNationalId = this.extractedData.nationalId;
              this.ocrResult = ocrResponse;
              this.showConfirmation = true;
              this.showNoNationalId = false;
            } else {
              this.messageService.showError(
                'No national ID found in the document. Please upload a valid ID.'
              );
              this.showNoNationalId = true;
              this.showConfirmation = false;
            }

            this.changeDetectorRef.detectChanges();
          } else {
            this.messageService.showError(
              ocrResponse.error ||
                'Failed to process document. Please ensure you uploaded a clear image of your ID.'
            );
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error);
          this.messageService.showError(
            'Error processing document. Please try again.'
          );
        },
      });
  }

  

  // === RETRY UPLOAD === (ADD THIS MISSING METHOD)
  retryUpload(): void {
    this.showNoNationalId = false;
    this.selectedFile = null;
    this.previewUrl = null;
    this.extractedNationalId = '';
    this.ocrResult = null;

    if (this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.changeDetectorRef.detectChanges();
  }

  removeFile(): void {

    this.selectedFile = null;
    this.previewUrl = null;
    this.showConfirmation = false;
    this.showNoNationalId = false;
    this.extractedNationalId = '';
    this.ocrResult = null;

    if (this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.changeDetectorRef.detectChanges();
  }

  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('frameCanvas') frameCanvasElement!: ElementRef<HTMLCanvasElement>;

  capturedImage: boolean = false;
  private stream: MediaStream | null = null;

  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    // Add this debug logging
    console.log('=== UPLOADDIRECTLY COMPONENT INIT ===');
    console.log('Complete modal data:', this.data);
    
      this.initializeCamera();
  }

  private async initializeCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          aspectRatio: 4 / 3,
        },
      });

      if (this.videoElement?.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
      }
    } catch (err) {
      this.snackBar.open('Camera access denied', 'Close', {
        duration: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 15000);
    }
  }

  captureImage() {
    if (
      !this.videoElement?.nativeElement ||
      !this.canvasElement?.nativeElement ||
      !this.frameCanvasElement?.nativeElement
    ) {
      return;
    }

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const frameCanvas = this.frameCanvasElement.nativeElement;

    // Set full video dimensions for the main canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Calculate frame dimensions and position
    const videoAspectRatio = video.videoWidth / video.videoHeight;
    const frameAspectRatio = 4 / 3;

    let frameWidth, frameHeight, frameX, frameY;

    if (videoAspectRatio > frameAspectRatio) {
      frameHeight = video.videoHeight * 0.6;
      frameWidth = frameHeight * frameAspectRatio;
      frameX = (video.videoWidth - frameWidth) / 2;
      frameY = (video.videoHeight - frameHeight) / 2;
    } else {
      frameWidth = video.videoWidth * 0.8;
      frameHeight = frameWidth / frameAspectRatio;
      frameX = (video.videoWidth - frameWidth) / 2;
      frameY = (video.videoHeight - frameHeight) / 2;
    }

    // Draw the full image first
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    // Set up the frame canvas for the cropped image
    frameCanvas.width = frameWidth;
    frameCanvas.height = frameHeight;
    const frameCtx = frameCanvas.getContext('2d');

    // Draw only the frame area to the frame canvas
    frameCtx?.drawImage(
      video,
      frameX,
      frameY,
      frameWidth,
      frameHeight,
      0,
      0,
      frameWidth,
      frameHeight
    );

    this.capturedImage = true;
  }

  sendImage() {
    console.log('The "sendImage" function is working!');
    console.log('sendImage', this.frameCanvasElement?.nativeElement);
    if (!this.frameCanvasElement?.nativeElement) {
      return;
    }

    this.frameCanvasElement.nativeElement.toBlob(
      async (blob) => {
        if (blob) {
          const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });

          await this.checkLiveness(file);
        }
      },
      'image/jpeg',
      0.8
    );
  }

  private async checkLiveness(file: File) {
    this.checkingLiveness = true;
    this.changeDetectorRef.detectChanges();

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res: any = await this.http
        .post(this.livenessApiUrl, formData)
        .toPromise();

      if (!res.is_live) {
        this.checkingLiveness = false;
        this.imageVerified = false;
        this.changeDetectorRef.detectChanges();
        this.messageService.showError(res.message || 'Liveness check failed');
        this.retake();
      } else if (res.is_live) {
        this.checkingLiveness = false;
        this.imageVerified = true;
        this.changeDetectorRef.detectChanges();
        this.messageService.showSuccess(
          res.message || 'Liveness verified successfully!'
        );
        this.sendToSelfieResultService();
      }
    } catch (err) {
      this.checkingLiveness = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  private sendToSelfieResultService() {
    if (!this.frameCanvasElement?.nativeElement) {
      console.error('Frame canvas not available');
      return;
    }

    // Convert canvas to data URL
    const imageData = this.frameCanvasElement.nativeElement.toDataURL(
      'image/jpeg',
      0.8
    );

    // Create the selfie result object
    const selfieResult: SelfieResult = {
      data: imageData,
      fileName: 'selfie.jpg',
      livenessVerified: true,
      success: true,
      confirmed: true,
    };

    // Store in the selfie service
    this.selfieService.setSelfieResult(selfieResult);

    console.log('Selfie result stored successfully:', selfieResult);

    // Optional: You can also close the modal automatically
    this.modalService.selfieUploadDialogRef()?.close(selfieResult);
  }
  
  retake() {
    this.capturedImage = false;
  }

  ngOnDestroy() {
    this.stream?.getTracks().forEach((track) => track.stop());
  }

  saveImage(){
    if (!this.frameCanvasElement?.nativeElement) {
      console.error('Frame canvas not available');
      return;
    }

    // Convert canvas to data URL
    
    const imageData = this.frameCanvasElement.nativeElement.toDataURL(
      'image/jpeg',
      0.8
    );

    // Create the selfie result object
    const idResult: IDResult = {
      data: imageData,
      fileName: 'selfie.jpg',
      livenessVerified: true,
      success: true,
      confirmed: true,
    };

    // Store in the selfie service
    this.selfieService.setSelfieResult(idResult);

    console.log('Selfie result stored successfully:', idResult);

    // Optional: You can also close the modal automatically
    this.modalService.nationalIdDialogRef()?.close(idResult);
  }
}
