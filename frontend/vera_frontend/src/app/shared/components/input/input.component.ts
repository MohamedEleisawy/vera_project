// input.component.ts
import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Interface représentant un fichier attaché
 */
export interface AttachedFile {
  name: string;
  size: string;
  type: string;
  file?: File; // 👈 AJOUT CRUCIAL : On stocke le vrai fichier ici !
}

export interface Suggestion {
  text: string;
}

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input.html',
  styles: [],
})
export class InputComponent {
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @Input() suggestions: Suggestion[] = [];
  @Input() showSuggestions: boolean = true;

  @Output() messageSent = new EventEmitter<{ message: string; files: AttachedFile[] }>();
  @Output() attachClicked = new EventEmitter<void>();
  @Output() suggestionClicked = new EventEmitter<string>();
  @Output() inputFocused = new EventEmitter<void>();
  @Output() inputBlurred = new EventEmitter<void>();
  
  // Nouveaux outputs pour le micro
  @Output() micClicked = new EventEmitter<void>();
  @Output() recordingStopped = new EventEmitter<void>();


  message = '';
  private isClickingSuggestion = false;
  attachedFiles: AttachedFile[] = [];
  selectedSuggestionIndex: number | null = null;
  isRecording = false;

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

  onAttach(): void {
    this.fileInput?.nativeElement?.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
        this.attachedFiles.push({
          name: this.truncateFileName(file.name),
          size: this.formatFileSize(file.size),
          type: this.getFileType(file.name),
          file: file, // 👈 CORRECTION : On sauvegarde le fichier binaire !
        });
      });
      input.value = '';
    }
  }

  removeFile(index: number): void {
    this.attachedFiles.splice(index, 1);
  }

  onSuggestionClick(suggestion: Suggestion, index: number): void {
    this.isClickingSuggestion = true;
    this.selectedSuggestionIndex = index;
    this.message = suggestion.text;
    this.suggestionClicked.emit(suggestion.text);
    this.isClickingSuggestion = false;
  }

  onSuggestionMouseDown(): void {
    this.isClickingSuggestion = true;
  }

  focus(): void {
    this.inputRef?.nativeElement?.focus();
  }

  onFocus(): void {
    this.inputFocused.emit();
  }

  onBlur(): void {
    setTimeout(() => {
      if (!this.isClickingSuggestion) {
        this.inputBlurred.emit();
      }
      this.isClickingSuggestion = false;
    }, 150);
  }

  clear(): void {
    this.message = '';
    this.attachedFiles = [];
    this.selectedSuggestionIndex = null;
  }

  onMicClick(): void {
    this.isRecording = !this.isRecording;
    if (this.isRecording) {
      this.micClicked.emit();
    } else {
      this.recordingStopped.emit();
    }
  }

  private truncateFileName(name: string): string {
    if (name.length <= 20) return name;
    const ext = name.split('.').pop();
    const baseName = name.substring(0, name.lastIndexOf('.'));
    return baseName.substring(0, 12) + '...' + (ext ? '.' + ext : '');
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  private getFileType(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return 'pdf';
    if (['doc', 'docx'].includes(ext || '')) return 'doc';
    if (['xls', 'xlsx'].includes(ext || '')) return 'excel';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    return 'file';
  }
}
