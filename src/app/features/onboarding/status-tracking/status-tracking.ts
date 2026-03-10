import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { ChatbotButton } from '../../../shared/components/chatbot-button/chatbot-button';
import { TrackingStage } from '../../../shared/models/onboarding.models';

@Component({
  selector: 'app-status-tracking',
  standalone: true,
  imports: [CommonModule, Navbar, ChatbotButton],
  templateUrl: './status-tracking.html',
  styleUrl: './status-tracking.scss',
})
export class StatusTracking {
  studentName = 'Cecil';

  // This would come from the API in a real app
  stages: TrackingStage[] = [
    {
      id: 'submitted',
      title: 'Application Submitted',
      description: 'Your onboarding application has been received.',
      icon: 'send',
      status: 'completed',
      date: 'March 4, 2026 at 2:30 PM',
    },
    {
      id: 'admin-review',
      title: 'Admin Review',
      description: 'University administrators are reviewing your documents for completeness.',
      icon: 'admin_panel_settings',
      status: 'completed',
      date: 'March 5, 2026 at 10:15 AM',
    },
    {
      id: 'dept-verification',
      title: 'Department Head Verification',
      description: 'Your department head is verifying your academic details and programme placement.',
      icon: 'school',
      status: 'in-progress',
      note: 'Currently being reviewed by Dr. Kemei — Computer Science Department',
    },
    {
      id: 'medical',
      title: 'Medical Clearance',
      description: 'The medical team will review your health information and uploaded medical report.',
      icon: 'local_hospital',
      status: 'pending',
    },
    {
      id: 'accommodation',
      title: 'Accommodation Assignment',
      description: 'The hostel management team will assign you a room based on your preferences.',
      icon: 'home',
      status: 'pending',
    },
    {
      id: 'complete',
      title: 'Onboarding Complete',
      description: 'All stages approved. Your university credentials will be sent to your email.',
      icon: 'verified',
      status: 'pending',
    },
  ];

  get currentStageIndex(): number {
    return this.stages.findIndex(s => s.status === 'in-progress');
  }

  get completedCount(): number {
    return this.stages.filter(s => s.status === 'completed').length;
  }

  get progressPercentage(): number {
    return Math.round((this.completedCount / this.stages.length) * 100);
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
}