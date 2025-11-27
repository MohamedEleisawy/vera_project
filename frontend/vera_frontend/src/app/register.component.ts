import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  // 🚨 ATTENTION : Le template doit OBLIGATOIREMENT utiliser des backticks (`)
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div class="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6 border border-yellow-100">
        <h2 class="text-3xl font-extrabold text-gray-900 text-center">Créer un Compte</h2>

        <div *ngIf="errorMessage" class="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg text-center">
            {{ errorMessage }}
        </div>

        <form (ngSubmit)="onRegister()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom complet</label>
            <input name="name" type="text" required [(ngModel)]="name"
                   class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg">
          </div>
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
                  class="w-full py-3 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium">
            {{ buttonText }} 
          </button>
        </form>

        <div class="text-center text-sm">
           <a routerLink="/login" class="text-blue-600 hover:underline">Déjà un compte ? Se connecter</a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  // ✅ FIX : Création d'une propriété calculée (getter)
  get buttonText(): string {
    return this.isLoading ? 'Création en cours...' : 'S\'inscrire';
  }

  onRegister() {
    if (this.name && this.email && this.password) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.authService.register(this.name, this.email, this.password).subscribe({
        next: () => {
          this.isLoading = false;
          alert('Compte créé ! Veuillez vous connecter.');
          this.router.navigate(['/login']); 
        },
        error: (err) => {
          this.isLoading = false;
          // Gère le code 409 (Conflict) renvoyé par NestJS si l'email existe déjà
          this.errorMessage = err.status === 409 ? "Cet email est déjà utilisé." : "Erreur réseau ou serveur.";
          console.error(err);
        }
      });
    } else {
      this.errorMessage = "Veuillez remplir tous les champs.";
    }
  }
}