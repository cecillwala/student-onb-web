import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messageService: MessageService = inject(MessageService);

  showSuccess(
    detail: string,
    summary: string = 'Success',
    life: number = 3000
  ) {
    this.messageService.add({ severity: 'success', summary, detail, life });
  }

  showError(detail: string, summary: string = 'Error', life: number = 5000) {
    this.messageService.add({ severity: 'error', summary, detail, life });
  }

  showInfo(detail: string, summary: string = 'Info', life: number = 3000) {
    this.messageService.add({ severity: 'info', summary, detail, life });
  }

  showWarning(
    detail: string,
    summary: string = 'Warning',
    life: number = 5000
  ) {
    this.messageService.add({ severity: 'warn', summary, detail, life });
  }
}

