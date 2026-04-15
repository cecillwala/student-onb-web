import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ── Response types ──────────────────────────

export interface VerifyTokenResponse {
  fullName: string;
  indexNumber: string;
  regNo: string;
  programme: string;
  department: string;
  faculty: string;
  maskedNationalId: string;
}

export interface SessionResponse {
  sessionToken: string;
  studentId: string;
  firstName: string;
  lastName: string;
  regNo: string;
  programme: string;
  currentStep: number;
  status: string;
}

export interface PersonalDetailsRequest {
  gender: string;
  religion: string;
  nationality: string;
  email: string;
  phone: string;
  county: string;
  constituency: string;
  ward: string;
  postalCode: string;
  guardianFirstName: string;
  guardianLastName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianOccupation: string;
  guardianRelationship: string;
}

export interface AcademicDetailsRequest {
  modeOfStudy: string;
  specialSupportNeeds: string;
  extracurricularActivities: string;
}

export interface AccommodationRequest {
  residenceType: string;
  hostelPreference: string;
  roomType: string;
  room: string;
  specialNeeds: string;
  offCampusReason: string;
  guardianAware: string;
  buildingName: string;
  floor: string;
  offCampusLocation: string;
  offCampusRoomType: string;
  landlordFirstName: string;
  landlordLastName: string;
  landlordPhone: string;
  roommateFirstName: string;
  roommateLastName: string;
  roommatePhone: string;
}

export interface HostelDetailsRequest{
    hostel: string;
    hostel_id: string;
    gender_allocation: 'MALE' | 'FEMALE';
    total_capacity: number;
    floors: number[];
    roomTypes: string[];
    rooms: RoomModel[];
}

export interface RoomModel{
  id: string;
  hostel_id: string;
  room_number: string;
  floor: number;
  room_type: string;
  capacity: number;
  available_beds: number;
}

export interface HealthDetailsRequest {
  bloodGroup: string;
  medicalConditions: string;
  allergies: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  preferredHospital: string;
  emergencyFirstName: string;
  emergencyLastName: string;
  emergencyPhone: string;
  emergencyEmail: string;
}

export interface OnboardingSummary {
  personalDetails: PersonalDetailsRequest;
  academicDetails: AcademicDetailsRequest;
  accommodation: AccommodationRequest;
  healthDetails: HealthDetailsRequest;
  documents: DocumentInfo[];
  status: string;
  currentStep: number;
}

export interface DocumentInfo {
  id: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  status: string;
  uploadedAt: string;
}

export interface IdVerificationRequest {
  nationalIdImage: string;  // base64
  selfieImage: string;      // base64
}

export interface OnboardingStatus {
  currentStep: number;
  status: string;
  stepsCompleted: Record<string, boolean>;
}

// ── Service ─────────────────────────────────

@Injectable({ providedIn: 'root' })
export class OnboardingApiService {

  private readonly baseUrl = `${environment.apiUrl}/api/v1/onboarding`;
  studentId = signal(localStorage.getItem('token'));

  constructor(private http: HttpClient) {}

  // ── Magic Link ──
  verifyToken(token: string): Observable<VerifyTokenResponse> {
    return this.http.get<VerifyTokenResponse>(`${this.baseUrl}/verify`, {
      params: { token },
    });
  }

  verifyIdentity(token: string, nationalId: string): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(`${this.baseUrl}/verify-identity`, {
      token, nationalId,
    });
  }

  // ── Progress ──
  getStatus(): Observable<OnboardingStatus> {
    return this.http.get<OnboardingStatus>(`${this.baseUrl}/status`);
  }

  // ── Step 1: Personal Details ──
  getPersonalDetails(): Observable<PersonalDetailsRequest> {
    return this.http.get<PersonalDetailsRequest>(`${this.baseUrl}/personal-details`);
  }

  savePersonalDetails(data: PersonalDetailsRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/personal-details`, data);
  }

  updatePersonalDetails(data: PersonalDetailsRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/personal-details`, data);
  }

  // ── Step 2: ID Verification (files handled separately) ──
  getIdVerification(): Observable<any> {
    return this.http.get(`${this.baseUrl}/id-verification`);
  }

  saveIdVerification(data: IdVerificationRequest, token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/id-verification`, data, {
      params: { token }});
  }

  // ── Step 3: Academic Details ──
  getAcademicDetails(): Observable<AcademicDetailsRequest> {
    return this.http.get<AcademicDetailsRequest>(`${this.baseUrl}/academic-details`);
  }

  saveAcademicDetails(data: AcademicDetailsRequest, token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/academic-details`, data, {
      params: { token }});
  }

  updateAcademicDetails(data: AcademicDetailsRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/academic-details`, data);
  }

  // ── Step 4: Accommodation ──
  getAccommodation(): Observable<AccommodationRequest> {
    return this.http.get<AccommodationRequest>(`${this.baseUrl}/accommodation`);
  }

  getHostelDetails(): Observable<HostelDetailsRequest[]>{
    return this.http.get<HostelDetailsRequest[]>(`${this.baseUrl}/hostels`);
  }

  saveAccommodation(data: AccommodationRequest, token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/accommodation`, data, {
      params: { token }
    });
  }

  updateAccommodation(data: AccommodationRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/accommodation`, data);
  }

  // ── Step 5: Health Details ──
  getHealthDetails(): Observable<HealthDetailsRequest> {
    return this.http.get<HealthDetailsRequest>(`${this.baseUrl}/health`);
  }

  saveHealthDetails(data: HealthDetailsRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/health`, data);
  }

  updateHealthDetails(data: HealthDetailsRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/health`, data);
  }

  // ── Step 6: Documents ──
  getDocuments(): Observable<DocumentInfo[]> {
    return this.http.get<DocumentInfo[]>(`${this.baseUrl}/documents`);
  }

  uploadDocument(documentType: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    return this.http.post(`${this.baseUrl}/documents`, formData);
  }

  deleteDocument(documentId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/documents/${documentId}`);
  }

  // ── Step 7: Summary + Submit ──
  getSummary(): Observable<OnboardingSummary> {
    return this.http.get<OnboardingSummary>(`${this.baseUrl}/summary`);
  }

  submit(): Observable<any> {
    return this.http.post(`${this.baseUrl}/submit`, {});
  }

  getCurrentStep(token: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/current-step`, {
      params: { token }
    });
  }
}