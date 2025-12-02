// input.component.ts
import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Interface représentant un fichier attaché
 * @property name - Nom du fichier (tronqué si trop long)
 * @property size - Taille formatée du fichier (ex: "650.7 KB")
 * @property type - Type de fichier (pdf, doc, excel, image, file)
 */
export interface AttachedFile {
  name: string;
  size: string;
  type: string;
}

/**
 * Interface représentant une suggestion de question
 * @property text - Texte de la suggestion à afficher
 */
export interface Suggestion {
  text: string;
}

/**
 * Composant Input de type chat avec support pour :
 * - Saisie de texte
 * - Attachement de fichiers multiples
 * - Suggestions de questions cliquables
 *
 * @requires Angular 17+ (utilise la nouvelle syntaxe de contrôle de flux @if, @for)
 *
 * @example
 * ```html
 * <app-input
 *   [suggestions]="[
 *     { text: 'Le café est-il bon pour la santé ?' },
 *     { text: 'Est-ce que la 5G cause le cancer ?' }
 *   ]"
 *   [showSuggestions]="true"
 *   (messageSent)="onMessage($event)"
 *   (suggestionClicked)="onSuggestion($event)">
 * </app-input>
 * ```
 */
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input.html',
  styles: [],
})
export class InputComponent {
  /** Référence à l'élément input texte */
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  /** Référence à l'élément input file caché */
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  /**
   * Liste des suggestions à afficher sous l'input
   * @default []
   */
  @Input() suggestions: Suggestion[] = [];

  /**
   * Afficher ou masquer les suggestions
   * @default true
   */
  @Input() showSuggestions: boolean = true;

  /**
   * Événement émis lors de l'envoi d'un message
   * Contient le message et les fichiers attachés
   */
  @Output() messageSent = new EventEmitter<{ message: string; files: AttachedFile[] }>();

  /**
   * Événement émis lors du clic sur le bouton d'attachement
   */
  @Output() attachClicked = new EventEmitter<void>();

  /**
   * Événement émis lors du clic sur une suggestion
   * Contient le texte de la suggestion
   */
  @Output() suggestionClicked = new EventEmitter<string>();

  /**
   * Événement émis lors du focus sur l'input
   */
  @Output() inputFocused = new EventEmitter<void>();

  /**
   * Événement émis lors de la perte de focus de l'input
   */
  @Output() inputBlurred = new EventEmitter<void>();

  /** Contenu du message saisi */
  message = '';

  /** Empêche le blur lors du clic sur une suggestion */
  private isClickingSuggestion = false;

  /** Liste des fichiers attachés */
  attachedFiles: AttachedFile[] = [];

  /** Index de la suggestion actuellement sélectionnée */
  selectedSuggestionIndex: number | null = null;

  /**
   * Envoie le message et les fichiers attachés
   * Réinitialise l'input après l'envoi
   */
  onSend(): void {
    if (this.message.trim() || this.attachedFiles.length > 0) {
      this.messageSent.emit({
        message: this.message.trim(),
        files: [...this.attachedFiles],
      });
      this.message = '';
      this.attachedFiles = [];
      this.selectedSuggestionIndex = null;
    }
  }

  /**
   * Ouvre le sélecteur de fichiers
   */
  onAttach(): void {
    this.fileInput?.nativeElement?.click();
  }

  /**
   * Gère la sélection de fichiers
   * @param event - Événement change de l'input file
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
        this.attachedFiles.push({
          name: this.truncateFileName(file.name),
          size: this.formatFileSize(file.size),
          type: this.getFileType(file.name),
        });
      });
      // Réinitialise l'input pour permettre de resélectionner le même fichier
      input.value = '';
    }
  }

  /**
   * Supprime un fichier de la liste des fichiers attachés
   * @param index - Index du fichier à supprimer
   */
  removeFile(index: number): void {
    this.attachedFiles.splice(index, 1);
  }

  /**
   * Gère le clic sur une suggestion
   * Remplit l'input avec le texte de la suggestion et émet l'événement
   * @param suggestion - Suggestion cliquée
   * @param index - Index de la suggestion
   */
  onSuggestionClick(suggestion: Suggestion, index: number): void {
    this.isClickingSuggestion = true;
    this.selectedSuggestionIndex = index;
    this.message = suggestion.text;
    this.suggestionClicked.emit(suggestion.text);
    this.isClickingSuggestion = false;
  }

  /**
   * Gère le mousedown sur une suggestion (empêche le blur)
   */
  onSuggestionMouseDown(): void {
    this.isClickingSuggestion = true;
  }

  /**
   * Met le focus sur l'input texte
   */
  focus(): void {
    this.inputRef?.nativeElement?.focus();
  }

  /**
   * Gère le focus sur l'input
   */
  onFocus(): void {
    this.inputFocused.emit();
  }

  /**
   * Gère la perte de focus de l'input
   * Délai pour permettre le clic sur les suggestions
   */
  onBlur(): void {
    setTimeout(() => {
      if (!this.isClickingSuggestion) {
        this.inputBlurred.emit();
      }
      this.isClickingSuggestion = false;
    }, 150);
  }

  /**
   * Réinitialise l'input (message et fichiers)
   */
  clear(): void {
    this.message = '';
    this.attachedFiles = [];
    this.selectedSuggestionIndex = null;
  }

  /**
   * Tronque le nom du fichier s'il dépasse 20 caractères
   * @param name - Nom original du fichier
   * @returns Nom tronqué avec "..." au milieu
   * @private
   */
  private truncateFileName(name: string): string {
    if (name.length <= 20) return name;
    const ext = name.split('.').pop();
    const baseName = name.substring(0, name.lastIndexOf('.'));
    return baseName.substring(0, 12) + '...' + (ext ? '.' + ext : '');
  }

  /**
   * Formate la taille du fichier en unité lisible
   * @param bytes - Taille en octets
   * @returns Taille formatée (ex: "1.5 MB")
   * @private
   */
  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /**
   * Détermine le type de fichier à partir de son extension
   * @param name - Nom du fichier
   * @returns Type de fichier (pdf, doc, excel, image, file)
   * @private
   */
  private getFileType(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return 'pdf';
    if (['doc', 'docx'].includes(ext || '')) return 'doc';
    if (['xls', 'xlsx'].includes(ext || '')) return 'excel';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    return 'file';
  }
}
