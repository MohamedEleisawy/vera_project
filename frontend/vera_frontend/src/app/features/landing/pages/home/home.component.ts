import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ApiService } from '../../../../core/services/api.service';
import {
  InputComponent,
  AttachedFile,
  Suggestion,
} from '../../../../shared/components/input/input.component';
import { ChatBubbles, ChatMessage, SourceLink } from '../../components/chat-bubbles/chat-bubbles';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, InputComponent, ChatBubbles],
  templateUrl: './home.html',
})
export class HomeComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;

  messages: ChatMessage[] = [];
  suggestions: Suggestion[] = [
    { text: 'Le café est-il bon pour la santé ?' },
    { text: 'Est-ce que la 5G cause le cancer ?' },
    { text: "Boire 2L d'eau par jour est-il obligatoire ?" },
    { text: 'Les vaccins contiennent-ils des puces ?' },
  ];
  showSuggestions = false;
  private shouldScrollToBottom = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
  }

  onInputFocus(): void {
    this.showSuggestions = true;
  }

  onInputBlur(): void {
    setTimeout(() => {
        this.showSuggestions = false;
    }, 200);
  }

  onMessage(data: { message: string; files: AttachedFile[] }): void {
    if (!data.message.trim() && data.files.length === 0) return;

    this.showSuggestions = false;

    // --- 1. MESSAGE UTILISATEUR ---
    const userContent = data.files.length > 0 
      ? `${data.message} ${data.files[0].name ? '[Fichier: ' + data.files[0].name + ']' : '[Média joint]'}`
      : data.message;

    this.messages.push({
      id: crypto.randomUUID(),
      role: 'user',
      content: userContent,
      timestamp: new Date(),
    });

    this.shouldScrollToBottom = true;

    // --- 2. MESSAGE LOADING ---
    const loadingMessageId = crypto.randomUUID();
    this.messages.push({
        id: loadingMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true
    });

    // --- 3. DÉTECTION ---
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;
    const isYoutube = youtubeRegex.test(data.message);
    const hasFile = data.files.length > 0;

    let analysisObservable;

    if (isYoutube) {
        console.log('📺 Mode YouTube');
        analysisObservable = this.apiService.analyzeYoutube(data.message);
    } else if (hasFile) {
        console.log('📁 Mode Fichier');
        
        // 🛠️ TENTATIVE DE RÉCUPÉRATION DU FICHIER RÉEL 🛠️
        const rawItem: any = data.files[0];
        console.log('🔍 Inspection Objet Fichier:', rawItem);

        let fileToSend: Blob | File | null = null;

        // Cas 1 : L'objet est directement un File
        if (rawItem instanceof File || rawItem instanceof Blob) {
            fileToSend = rawItem;
        } 
        // Cas 2 : Propriété .file (Standard)
        else if (rawItem.file && (rawItem.file instanceof File || rawItem.file instanceof Blob)) {
            fileToSend = rawItem.file;
        }
        // Cas 3 : Propriété .originFileObj (Ant Design / Certaines libs)
        else if (rawItem.originFileObj && (rawItem.originFileObj instanceof File)) {
            fileToSend = rawItem.originFileObj;
        }
        // Cas 4 : Base64 (Format data:image/png;base64,...)
        else if (rawItem.base64 || (typeof rawItem.content === 'string' && rawItem.content.startsWith('data:'))) {
            console.log('🔄 Conversion Base64 détectée...');
            const base64Data = rawItem.base64 || rawItem.content;
            fileToSend = this.base64ToBlob(base64Data);
        }

        if (!fileToSend) {
             console.error('🚨 ÉCHEC : Impossible de trouver le binaire du fichier dans l\'objet.', rawItem);
             // On annule tout pour ne pas crasher le back
             this.updateAssistantMessage(loadingMessageId, {
                content: "Erreur interne : Format de fichier non reconnu par l'interface. (Voir console F12)",
                verdict: "ERREUR FRONTEND",
                confidence: 0,
                isLoading: false
             });
             return;
        }

        console.log('📤 Envoi au Backend (Binaire valide) :', fileToSend);
        analysisObservable = this.apiService.analyzeMedia(fileToSend as File);
    } else {
        console.log('📝 Mode Texte');
        analysisObservable = this.apiService.analyzeText(data.message);
    }

    // --- 4. RÉCEPTION ---
    analysisObservable.subscribe({
        next: (response) => {
            const extractedSources = this.extractSources(response.details);
            let cleanedContent = response.details;
            extractedSources.forEach(source => {
                cleanedContent = cleanedContent.replace(source.url, '');
            });
            cleanedContent = cleanedContent
                .replace(/Sources?\s*:\s*$/gmi, '')
                .replace(/\(\s*\)/g, '')
                .replace(/\s\s+/g, ' ')
                .trim();

            this.updateAssistantMessage(loadingMessageId, {
                content: cleanedContent,
                verdict: response.verdict,
                confidence: response.confidence,
                sources: extractedSources,
                isLoading: false
            });
        },
        error: (err) => {
            console.error('Erreur Vera:', err);
            this.updateAssistantMessage(loadingMessageId, {
                content: "Une erreur est survenue lors de l'envoi du fichier au serveur.",
                verdict: "ERREUR",
                confidence: 0,
                isLoading: false
            });
        }
    });
  }

  // Utilitaire pour convertir Base64 en Blob (si nécessaire)
  private base64ToBlob(dataURI: string): Blob {
    const splitDataURI = dataURI.split(',');
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  private extractSources(text: string): SourceLink[] {
    const urlRegex = /(https?:\/\/[^\s\)]+)/g;
    const matches = text.match(urlRegex);
    
    if (!matches) return [];

    return [...new Set(matches)].map(url => {
      const cleanUrl = url.replace(/[\)\.,]$/, ''); 
      let domain = '';
      try {
        domain = new URL(cleanUrl).hostname.replace('www.', '');
      } catch (e) {
        domain = 'Source externe';
      }
      return {
        url: cleanUrl,
        domain: domain,
        title: `Lien cité : ${domain}`
      };
    });
  }

  private updateAssistantMessage(id: string, update: Partial<ChatMessage>) {
      const index = this.messages.findIndex(m => m.id === id);
      if (index !== -1) {
          this.messages[index] = { ...this.messages[index], ...update };
          this.shouldScrollToBottom = true;
      }
  }

  onSuggestion(text: string): void {
    this.onMessage({ message: text, files: [] });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      setTimeout(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          });
      }, 100);
    }
  }

  resetChat(): void {
    this.messages = [];
    this.showSuggestions = false;
  }
}