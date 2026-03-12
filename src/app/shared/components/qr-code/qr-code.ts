import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { SharedImports } from '../../modules/shared.imports';
import { ModalService } from '../../services/modal-service';
import { interval, Subscription, switchMap, takeWhile } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  imports: [...SharedImports],
  templateUrl: './qr-code.html',
  styleUrl: './qr-code.scss',
})
export class QrCode implements AfterViewInit {
  private modalService = inject(ModalService)
  scannedImage: string | null = null;
  private sessionId: string = '';
  pollingSub!: Subscription;
  uploadedImageUrl: string | null = null;
  image: File | null = null;
  data = inject(MAT_DIALOG_DATA); // entity and data
  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;
  private ws: WebSocket | null = null;

  isLoading = signal(false);

  constructor(private snackBar: MatSnackBar) {}

  async ngOnInit() {}

  async ngAfterViewInit() {
    await this.generateNewScanSession();
    this.startPolling();
  }

  async generateNewScanSession() {
    this.sessionId = Math.random().toString(36).substring(2, 15);

    if (this.qrCanvas) {
      // Instead of window.location.origin, use your computer's local IP
      const scanUrl = 'this.urlService.generateScanUrl';
      // console.log(scanUrl);
      console.log('Generated QR URL for:', this.data.entity, scanUrl);
      await QRCode.toCanvas(this.qrCanvas.nativeElement, scanUrl, {
        width: 250,
        margin: 1,
        color: { light: '#000000', dark: '#ededed' },
      });
    }
  }

  private setupWebSocketConnection() {
    // Set up WebSocket connection for real-time image transfer
    console.log(this.sessionId);

    // Use secure WebSocket if available, fallback to insecure for development
    this.ws = new WebSocket(`web-socket-url`);

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.type === 'image') {
        this.scannedImage = data.imageData;
        this.snackBar.open('Document scanned successfully!', 'Close', {
          duration: 3000,
        });
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.snackBar.open('Connection error', 'Close', {
        duration: 3000,
      });
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  convertImageToBase64(imagePath: string): Promise<string> {
    return fetch(imagePath)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  }

  startPolling() {
    this.pollingSub = interval(5000)
      .pipe()
      .subscribe({
        next: async (response: any) => {
          console.log('Polling response:', response);

          const payload = response?.data || {};
          const fileData = payload?.data;
          const fileName = payload?.fileName;
          const nationalId = payload?.nationalId;
          const extractedData = {
            nationalId: payload?.nationalId || '',
            idNumber: payload?.idNumber || payload?.nationalId || '',
            dateOfBirth: payload?.dateOfBirth || '',
            sex: payload?.sex || '',
            placeOfBirth: payload?.placeOfBirth || '',
            dateIssued: payload?.dateIssued || '',
            dateOfExpiry: payload?.dateOfExpiry || '',
          };

          if (fileData && fileName) {
            console.log('File received:', fileName);

            this.modalService.qrCodeDialogRef()?.close({
              data: fileData,
              sessionId: this.sessionId,
              nationalId: nationalId,
              fileName: fileName,
              extractedData,
            });

            this.stopPolling();
          } else {
            console.log('No image found yet, continuing to poll...');
          }
        },
        error: (err) => {
          console.error('Polling error:', err);
        },
      });
  }

  stopPolling() {
    if (this.pollingSub) {
      this.isLoading.set(true);
      this.pollingSub.unsubscribe();
    }
  }

  async base64ToFile(base64: string, filename: string): Promise<File> {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[arr.length - 1]); // base64 payload
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

closeAndUpload() {
  const entityType = this.data.entity;
  const originalData = this.data.data; // Get the original data that was passed to QR modal
  
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

  ngOnDestroy(): void {
    this.stopPolling();
  }
}

