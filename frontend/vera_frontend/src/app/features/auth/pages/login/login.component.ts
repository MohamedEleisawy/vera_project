import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;

    const credentials = {
      email: this.email,
      motDePasse: this.password, // Mapping important
    };

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Login réussi, token stocké');
        // Redirection vers le dashboard admin
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error(error);
        if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        } else {
          this.errorMessage = 'Problème de connexion serveur.';
        }
      },
    });
  }
}
