import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-home',
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
}