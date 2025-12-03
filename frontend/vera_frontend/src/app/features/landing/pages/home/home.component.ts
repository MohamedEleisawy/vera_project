// home.component.ts
import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // 👈 1. Ajout de Router
import { AuthService } from '../../../../core/services/auth.service';
import {
  InputComponent,
  AttachedFile,
  Suggestion,
} from '../../../../shared/components/input/input.component';
import { ChatBubbles, ChatMessage } from '../../components/chat-bubbles/chat-bubbles';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, InputComponent, ChatBubbles],
  templateUrl: './home.html',
})
export class HomeComponent implements AfterViewChecked {
  /** Référence au conteneur des messages pour le scroll automatique */
  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;

  /** Liste des messages de la conversation */
  messages: ChatMessage[] = [];

  /** Liste des suggestions */
  suggestions: Suggestion[] = [
    { text: 'Le café est-il bon pour la santé ?' },
    { text: 'Est-ce que la 5G cause le cancer ?' },
    { text: "Boire 2L d'eau par jour est-il obligatoire ?" },
    { text: 'Les vaccins contiennent-ils des puces ?' },
  ];

  /** Indique si les suggestions doivent être affichées (contrôlé par le focus) */
  showSuggestions = false;

  /** Flag pour déclencher le scroll automatique */
  private shouldScrollToBottom = false;

  // 👇 2. Injection du Router ici
  constructor(
    public authService: AuthService,
    private router: Router 
  ) {}

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  // 👇 3. CORRECTION : On redirige vers la page de login
  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
  }

  /**
   * Gère le focus sur l'input - affiche les suggestions
   */
  onInputFocus(): void {
    this.showSuggestions = true;
  }

  /**
   * Gère la perte de focus - cache les suggestions
   */
  onInputBlur(): void {
    // Petit délai pour permettre le clic sur une suggestion avant qu'elle disparaisse
    setTimeout(() => {
        this.showSuggestions = false;
    }, 200);
  }

  /**
   * Gère l'envoi d'un message
   */
  onMessage(data: { message: string; files: AttachedFile[] }): void {
    if (!data.message.trim()) return;

    // Cacher les suggestions
    this.showSuggestions = false;

    // Ajouter le message utilisateur
    this.messages.push({
      id: crypto.randomUUID(),
      role: 'user',
      content: data.message,
      timestamp: new Date(),
    });

    // Déclencher le scroll vers le bas
    this.shouldScrollToBottom = true;

    console.log('Message:', data.message);
    console.log('Fichiers:', data.files);

    // Placeholder : simuler une réponse du chatbot
    this.simulateBotResponse();
  }

  /**
   * Gère le clic sur une suggestion
   */
  onSuggestion(text: string): void {
    console.log('Suggestion sélectionnée:', text);
    this.onMessage({ message: text, files: [] });
  }

  /**
   * Simule une réponse du chatbot (placeholder)
   */
  private simulateBotResponse(): void {
    const loadingMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
    this.messages.push(loadingMessage);
    this.shouldScrollToBottom = true;

    setTimeout(() => {
      const index = this.messages.findIndex((m) => m.id === loadingMessage.id);
      if (index !== -1) {
        this.messages[index] = {
          ...loadingMessage,
          content: 'Ceci est une réponse placeholder. Connectez votre chatbot ici.',
          isLoading: false,
        };
        this.shouldScrollToBottom = true;
      }
    }, 1500);
  }

  /**
   * Scroll automatiquement vers le bas de la conversation
   */
  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  /**
   * Réinitialise la conversation
   */
  resetChat(): void {
    this.messages = [];
    this.showSuggestions = false;
  }
}