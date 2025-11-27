import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div class="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6 border border-blue-100">
        <h2 class="text-3xl font-extrabold text-gray-900 text-center">Connexion</h2>

        <div *ngIf="errorMessage" class="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg text-center">
            {{ errorMessage }}
        </div>

        <form (ngSubmit)="onLogin()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" required [(ngModel)]="email"
                   class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input name="password" type="password" required [(ngModel)]="password"
                   class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg">
          </div>
          
          <button type="submit" [disabled]="isLoading"
                  class="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <div class="text-center text-sm">
           <a routerLink="/register" class="text-blue-600 hover:underline">Pas de compte ? S'inscrire</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  onLogin() {
    if (this.email && this.password) {
      this.isLoading = true;
      this.authService.login(this.email, this.password).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = "Identifiants incorrects.";
          console.error(err);
        }
      });
    }
  }
}