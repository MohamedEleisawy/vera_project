import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule], // CommonModule contient le pipe 'async'
  templateUrl: './navbar.html',
})
export class Navbar {
  isMenuOpen = false;

  // 👇 CORRECTION ICI : On injecte 'private router: Router'
  constructor(
    public authService: AuthService, 
    private router: Router
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Pas besoin de goToLogin() car routerLink le fait déjà dans le HTML !

  logout() {
    this.authService.logout();
    this.isMenuOpen = false; // On ferme le menu mobile après déconnexion
  }
}