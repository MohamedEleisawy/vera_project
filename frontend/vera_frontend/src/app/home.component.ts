import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="p-8 bg-gray-100 min-h-screen">
      <h1 class="text-4xl font-bold text-blue-800 mb-6">Page d'Accueil Publique (Phase 1)</h1>
      <p class="mb-4">Bienvenue sur la plateforme de Fact-Checking.</p>
      <button (click)="login()" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mr-4">
        Simuler Connexion Vérificateur
      </button>
      <button (click)="logout()" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
        Déconnexion
      </button>
      <p class="mt-8 text-lg font-semibold text-gray-700">Statut: {{ (authService.isAuthenticated$ | async) ? 'CONNECTÉ' : 'DÉCONNECTÉ' }}</p>
      <a routerLink="/dashboard" class="mt-4 block text-blue-600 hover:text-blue-800 underline">Tenter d'accéder au Dashboard</a>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule] 
})
export class HomeComponent {
  constructor(public authService: AuthService) {}
  login() { this.authService.login(); }
  logout() { this.authService.logout(); }
}