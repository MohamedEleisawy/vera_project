import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service'; // 👈 NOUVEL IMPORT

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage = ''; // ⚠️ Ce champ sera désormais utilisé UNIQUEMENT pour les erreurs LOCALES

  // Injection du service, du router et du CDR (on ajoute le service de notification)
  constructor(
    private authService: AuthService, 
    private router: Router, 
    private cdr: ChangeDetectorRef,
    // On peut aussi utiliser inject() comme dans les Interceptors
    private notificationService: NotificationService = inject(NotificationService)
  ) {}

  onSubmit(): void {
    // 1. Dégager l'erreur précédente s'il y en a une
    this.errorMessage = '';
    
    // 2. VALIDATIONS LOCALES (celles qui ne nécessitent pas d'API)

    if (!this.name || this.name.trim().length < 2) {
      this.errorMessage = 'Le nom est trop court.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Format d\'email invalide (ex: test@vera.com).';
      return;
    }

    if (!this.password || this.password.length < 8) {
      this.errorMessage = 'Le mot de passe doit faire au moins 8 caractères.';
      return;
    }
    
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }
    
    // 3. ENVOI API
    this.isLoading = true;
    this.cdr.detectChanges(); // Force le spinner à apparaître immédiatement

    this.authService.register({
      nom: this.name,
      email: this.email,
      motDePasse: this.password
    }).subscribe({
      next: () => { 
        // ✅ SUCCÈS : L'intercepteur n'a rien vu de grave
        
        this.isLoading = false;
        
        // 🚀 Notification de succès (par notre service)
        this.notificationService.showSuccess('Compte créé avec succès ! Veuillez vous connecter.');
        
        this.cdr.detectChanges(); 
        
        // Redirection vers la page de connexion
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        // ❌ ERREUR : L'intercepteur a affiché l'erreur (409, 400, 500)
        
        this.isLoading = false;
        
        // C'est tout ! L'affichage du message rouge dans une popup est géré ailleurs.
        // On utilise le CDR juste au cas où l'on utilise 'errorMessage' pour une erreur locale
        // ou si l'on souhaite forcer la mise à jour des données (mais ici, on n'en a plus besoin !)
        this.cdr.detectChanges(); 
      }
    });
  }
}