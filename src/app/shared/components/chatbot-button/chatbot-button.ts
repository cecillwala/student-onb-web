import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OnboardingApiService } from '../../services/api/onboarding-api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot-button',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-button.html',
  styleUrl: './chatbot-button.scss',
})
export class ChatbotButton {
  @ViewChild('chatBody') chatBody!: ElementRef;

  private api = inject(OnboardingApiService);

  isOpen = false;
  userInput = '';
  isLoading = signal(false);

  messages = signal<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi there! 👋 I\'m your onboarding assistant. I can help you with the enrolment process, document requirements, accommodation, and more. What would you like to know?',
      timestamp: new Date(),
    },
  ]);

  quickQuestions = [
    'What documents do I need?',
    'How do I choose a hostel?',
    'What are the onboarding steps?',
    'How do I track my application?',
  ];

  private sessionId = crypto.randomUUID();

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  askQuestion(question: string): void {
    this.userInput = question;
    this.sendMessage();
  }

  sendMessage(): void {
    const message = this.userInput.trim();
    if (!message || this.isLoading()) return;

    this.messages.update(msgs => [
      ...msgs,
      { role: 'user', content: message, timestamp: new Date() },
    ]);
    this.userInput = '';
    this.isLoading.set(true);
    this.scrollToBottom();

    this.api.sendChatMessage(message, this.sessionId).subscribe({
      next: (res) => {
        this.messages.update(msgs => [
          ...msgs,
          { role: 'assistant', content: res.response, timestamp: new Date() },
        ]);
        this.isLoading.set(false);
        this.scrollToBottom();
      },
      error: () => {
        this.messages.update(msgs => [
          ...msgs,
          {
            role: 'assistant',
            content: 'Sorry, I\'m having trouble right now. Please try again or contact support@egerton.ac.ke for help.',
            timestamp: new Date(),
          },
        ]);
        this.isLoading.set(false);
        this.scrollToBottom();
      },
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatBody?.nativeElement) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    }, 50);
  }
}