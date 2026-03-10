import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chatbot-button',
  imports: [CommonModule],
  templateUrl: './chatbot-button.html',
  styleUrl: './chatbot-button.scss',
})
export class ChatbotButton {
  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    // Will integrate with ChatbotService + AI API later
  }
}
