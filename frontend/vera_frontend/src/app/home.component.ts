<<<<<<< HEAD
import { Component, inject } from '@angular/core';
=======
import { Component } from '@angular/core';
>>>>>>> refs/remotes/origin/main
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-home',
<<<<<<< HEAD
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div class="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg w-full">
        <h1 class="text-4xl font-bold text-blue-800 mb-4">Vera Project</h1>
        <p class="text-gray-600 mb-8">Plateforme de Fact-Checking.</p>

        <ng-container *ngIf="authService.isAuthenticated$ | async; else guestButtons">
          <p class="text-green-600 font-semibold mb-4">Vous êtes connecté !</p>
          <a routerLink="/dashboard" class="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg mb-3">
            Accéder au Dashboard
          </a>
          <button (click)="logout()" class="w-full py-3 px-4 bg-red-100 text-red-700 rounded-lg">
            Se déconnecter
          </button>
        </ng-container>

        <ng-template #guestButtons>
          <div class="space-y-3">
            <a routerLink="/login" class="block w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Se connecter
            </a>
            <a routerLink="/register" class="block w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg">
              Créer un compte
            </a>
          </div>
        </ng-template>

      </div>
    </div>
  `
})
export class HomeComponent {
  public authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
=======
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
>>>>>>> refs/remotes/origin/main
}