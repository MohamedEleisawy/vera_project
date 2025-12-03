// src/app/features/landing/pages/home/home.ts
import { Component } from '@angular/core';
import { InputComponent } from '../../../../shared/components/input/input';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [InputComponent],  // ← Ajoutez ici
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})

export class HomeComponent {
  handleMessage(message: string): void {
    console.log('Message reçu:', message);
    // Votre logique ici
  }

  handleAttachment(): void {
    console.log('Fichier attaché');
    // Votre logique ici
  }

  constructor(public authService: AuthService) {}
  login() { this.authService.login(); }
  logout() { this.authService.logout(); }
}