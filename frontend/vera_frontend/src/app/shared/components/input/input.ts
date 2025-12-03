// chat-input.component.ts
import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full max-w-3xl mx-auto p-4">
      <div class="flex items-center gap-2 bg-white rounded-lg border border-gray-300 p-2 focus-within:border-blue-500">
        
        <!-- Bouton d'attachement à gauche -->
        <button 
          type="button"
          (click)="onAttach()"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <!-- Textarea -->
        <textarea
          #textareaRef
          [(ngModel)]="message"
          (input)="autoResize()"
          (keydown)="onKeyDown($event)"
          placeholder="Écrivez votre message..."
          rows="1"
          class="flex-1 resize-none border-none outline-none p-2 max-h-32 overflow-y-auto">
        </textarea>

        <!-- Bouton envoyer à droite -->
        <button 
          type="button"
          (click)="sendMessage()"
          [disabled]="!canSend"
          [ngClass]="{
            'bg-blue-500 hover:bg-blue-600 text-white': canSend,
            'bg-gray-200 text-gray-400 cursor-not-allowed': !canSend
          }"
          class="p-2 rounded transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class InputComponent {
  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;
  
  @Output() messageSent = new EventEmitter<string>();
  @Output() fileAttached = new EventEmitter<void>();
  
  message = '';

  get canSend(): boolean {
    return this.message.trim().length > 0;
  }

  autoResize(): void {
    const textarea = this.textareaRef?.nativeElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.messageSent.emit(this.message.trim());
      this.message = '';
      setTimeout(() => {
        const textarea = this.textareaRef?.nativeElement;
        if (textarea) {
          textarea.style.height = 'auto';
        }
      }, 0);
    }
  }

  onAttach(): void {
    this.fileAttached.emit();
  }
}

// ============================================
// Exemple d'utilisation

/*
// Dans votre composant parent
import { ChatInputComponent } from './shared/components/chat-input/chat-input.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ChatInputComponent],
  template: `
    <app-chat-input 
      (messageSent)="handleMessage($event)"
      (fileAttached)="handleAttachment()">
    </app-chat-input>
  `
})
export class ChatComponent {
  handleMessage(message: string): void {
    console.log('Message:', message);
  }

  handleAttachment(): void {
    console.log('Attach file');
  }
}
*/