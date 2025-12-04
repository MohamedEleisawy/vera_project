// chat-bubble.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type MessageRole = 'user' | 'assistant';

// Nouvelle interface pour une source
export interface SourceLink {
  url: string;
  domain: string;
  title: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  verdict?: string;
  confidence?: number;
  // Ajout du tableau de sources
  sources?: SourceLink[];
}

@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-bubbles.html',
  styles: [],
})
export class ChatBubbles {
  @Input({ required: true }) message!: ChatMessage;

  getConfidenceColor(confidence: number | undefined): string {
    if (!confidence) return 'bg-stone-200';
    if (confidence > 0.8) return 'bg-primary-green-100';
    if (confidence > 0.5) return 'bg-yellow-100';
    return 'bg-red-100';
  }

  getFormattedTime(): string {
    return this.message.timestamp.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
