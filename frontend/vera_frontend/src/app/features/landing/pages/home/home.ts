// src/app/features/landing/pages/home/home.ts
import { Component } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input';  // ← Importez le composant ici

@Component({
  selector: 'app-home',
  imports: [InputComponent],  // ← Ajoutez ici
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})

export class Home {
  handleMessage(message: string): void {
    console.log('Message reçu:', message);
    // Votre logique ici
  }

  handleAttachment(): void {
    console.log('Fichier attaché');
    // Votre logique ici
  }
}