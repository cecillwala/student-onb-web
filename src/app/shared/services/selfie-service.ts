import { computed, inject, Injectable, signal } from '@angular/core';
import { OcrResponse, SelfieResult } from '../models/onboarding.models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SelfieService {
  private selfieResult = signal<SelfieResult | null>(null);
  http = inject(HttpClient);
  readonly getSelfieResult = computed(() => this.selfieResult());
  readonly getSelfieImage = computed(() => this.selfieResult()?.data || null);
  readonly isLivenessVerified = computed(
    () => this.selfieResult()?.livenessVerified || false
  );

  setSelfieResult(result: SelfieResult) {
    this.selfieResult.set(result);
    console.log(result);
  }

  clearSelfieResult() {
    this.selfieResult.set(null);
  }

  scanGhanaCard(imageFile: File, documentType: string): Observable<OcrResponse> {
    const formData = new FormData();

    formData.append('file', imageFile);
    formData.append('country_code', 'GH');
    formData.append('document_type', documentType);
    // formData.append('include_raw_text', 'true');
    // formData.append('include_bboxes', 'true');
    // formData.append('confidence_threshold', '0.85');

    return this.http.post<OcrResponse>(`ocr-endpoint`, formData);
  }
}
