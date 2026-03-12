import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ONBOARDING_STEPS, OnboardingStep, StudentInfo } from '../../../shared/models/onboarding.models';
import { Navbar } from "../../../shared/components/navbar/navbar";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  imports: [Navbar, CommonModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {
  steps: OnboardingStep[] = ONBOARDING_STEPS;

  // This would come from the API after magic link verification
  student: StudentInfo = {
    name: 'Lwala Cecil Joel Munala',
    regNo: 'S13/07742/22',
    programme: 'BSc. Computer Science',
    department: 'Computer Science',
    faculty: 'Faculty of Science',
    indexNo: '28200001045',
  };

  studentDetails = [
    { label: 'Programme', value: this.student.programme },
    { label: 'Index Number', value: this.student.indexNo },
    { label: 'Department', value: this.student.department },
    { label: 'Faculty', value: this.student.faculty },
  ];

  constructor(private router: Router) {}

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('');
  }

  startOnboarding(): void {
    this.router.navigate(['/onboarding/personal-details']);
  }
}
