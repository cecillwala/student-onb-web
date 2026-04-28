import { Component, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ONBOARDING_STEPS, OnboardingStep, StudentInfo } from '../../../shared/models/onboarding.models';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { OnboardingApiService, VerifyTokenResponse } from '../../../shared/services/api/onboarding-api';
import { SessionService } from '../../../shared/services/session';

@Component({
  selector: 'app-welcome',
  imports: [Navbar, CommonModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome implements OnInit {
  steps: OnboardingStep[] = ONBOARDING_STEPS;

  student = signal<StudentInfo | null>(null);
  studentDetails = signal<{ label: string; value: string }[]>([]);

  isLoading = signal(true);
  isStarting = signal(false);
  errorMessage = signal('');

  private token = signal<string | null>('');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private onboardingApi: OnboardingApiService,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    this.token.set(this.route.snapshot.queryParamMap.get('token'));

    if (!this.token) {
      this.errorMessage.set('No onboarding link provided. Please use the link sent to your email.');
      this.isLoading.set(false);
      return;
    }

    this.onboardingApi.verifyToken(this.token() ?? '').subscribe({
      next: (res: VerifyTokenResponse) => {
        const info: StudentInfo = {
          name: res.fullName,
          regNo: res.regNo,
          programme: res.programme,
          department: res.department,
          faculty: res.faculty,
          indexNo: res.indexNumber,
        };

        this.student.set(info);
        localStorage.setItem('token', this.token() ?? '');

        this.studentDetails.set([
          { label: 'Programme', value: info.programme },
          { label: 'Index Number', value: info.indexNo },
          { label: 'Department', value: info.department },
          { label: 'Faculty', value: info.faculty },
        ]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err.status);
        const message = err.error?.message ?? 'Unable to verify your onboarding link. Please try again or contact support.';
        this.errorMessage.set(message);
        this.isLoading.set(false);
      },
    });
  }

  getInitials(name: string | undefined): string {

    let initials = "";
    if(name != undefined){
      const initials = name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('');
      console.log(initials);
      return initials;
    }
    return "";
  }

  startOnboarding(): void {
    if (!this.token) return;

    this.isStarting.set(true);

    // For now, we pass a placeholder national ID — 
    // the identity confirmation step will be added later.
    // The backend still requires it, so we use the masked ID hint.
    this.onboardingApi.verifyIdentity(this.token() ?? '', '').subscribe({
      next: (session) => {
        this.sessionService.setSession({
          sessionToken: session.sessionToken,
          studentId: session.studentId,
          firstName: session.firstName,
          lastName: session.lastName,
          regNo: session.regNo,
          programme: session.programme,
          currentStep: session.currentStep,
          status: session.status,
        });
        this.router.navigate(['/onboarding/personal-details']);
      },
      error: (err) => {
        console.log(err);
        this.isStarting.set(false);
        const message = err.error?.message ?? 'Failed to start onboarding. Please try again.';
        this.errorMessage.set(message);
      },
    });
  }
}