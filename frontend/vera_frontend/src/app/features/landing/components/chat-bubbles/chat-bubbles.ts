// chat-bubble.component.ts
import { Component, Input } from '@angular/core';

/**
 * Type de message dans la conversation
 * - 'user' : Message envoyé par l'utilisateur
 * - 'assistant' : Message reçu du chatbot
 */
export type MessageRole = 'user' | 'assistant';

/**
 * Interface représentant un message dans la conversation
 * @property id - Identifiant unique du message
 * @property role - Rôle de l'expéditeur (user ou assistant)
 * @property content - Contenu textuel du message
 * @property timestamp - Date et heure d'envoi du message
 * @property isLoading - Indique si le message est en cours de chargement (pour l'assistant)
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

/**
 * Composant d'affichage d'une bulle de chat
 * Affiche différemment les messages utilisateur et assistant
 *
 * @example
 * ```html
 * <app-chat-bubble [message]="message"></app-chat-bubble>
 * ```
 */
@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [],
  templateUrl: './chat-bubbles.html',
  styles: [],
})
export class ChatBubbles {
  /**
   * Message à afficher dans la bulle
   */
  @Input({ required: true }) message!: ChatMessage;

  /**
   * Formate l'heure du message
   * @returns Heure formatée (ex: "14:30")
   */
  getFormattedTime(): string {
    return this.message.timestamp.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
