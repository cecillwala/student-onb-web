import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { ChatbotButton } from '../../../shared/components/chatbot-button/chatbot-button';
import { TrackingStage } from '../../../shared/models/onboarding.models';
import { OnboardingApiService } from '../../../shared/services/api/onboarding-api';

@Component({
  selector: 'app-status-tracking',
  standalone: true,
  imports: [CommonModule, Navbar, ChatbotButton],
  templateUrl: './status-tracking.html',
  styleUrl: './status-tracking.scss',
})
export class StatusTracking implements OnInit {

  studentName = signal('');
  regNo = signal('');
  programme = signal('');
  stages = signal<TrackingStage[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  private token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private api: OnboardingApiService,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    const studentId = this.route.snapshot.queryParamMap.get('studentId');

    if (!this.token && !studentId) {
      this.errorMessage.set('No tracking link provided. Please use the link sent to your email.');
      this.isLoading.set(false);
      return;
    }

    this.loadTracking(studentId);
  }

  private loadTracking(studentId?: string | null): void {
    const params: any = {};
    if (studentId) {
      params.studentId = studentId;
    } else if (this.token) {
      params.token = this.token;
    }

    this.api.getTracking(params).subscribe({
      next: (data) => {
        this.studentName.set(data.name?.split(' ')[0] || 'Student');
        this.regNo.set(data.regNo || '');
        this.programme.set(data.programme || '');

        // Map backend response to TrackingStage interface
        const stages: TrackingStage[] = (data.stages || []).map((s: any) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          icon: s.icon,
          status: s.status as 'completed' | 'in-progress' | 'pending' | 'flagged',
          date: s.date ? this.formatDate(s.date) : undefined,
          note: s.note || undefined,
        }));

        this.stages.set(stages);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message || 'Unable to load your application status. Please try again or contact support.'
        );
        this.isLoading.set(false);
      },
    });
  }

  get currentStageIndex(): number {
    return this.stages().findIndex(s => s.status === 'in-progress');
  }

  get completedCount(): number {
    return this.stages().filter(s => s.status === 'completed').length;
  }

  get progressPercentage(): number {
    const total = this.stages().length;
    if (total === 0) return 0;
    return Math.round((this.completedCount / total) * 100);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed':   return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'flagged':     return 'Action Required';
      case 'pending':     return 'Pending';
      default:            return status;
    }
  }

  private formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  }
}