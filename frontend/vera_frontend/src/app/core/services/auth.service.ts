import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Fonction de vérification de plateforme
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject pour l'état de connexion, permettant aux autres composants de s'abonner
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Simule le stockage du jeton JWT après connexion réussie
  private currentToken: string | null = null; 
  
  // Injection du jeton de plateforme pour vérifier l'environnement d'exécution
  private platformId = inject(PLATFORM_ID);
  
  // Indicateur si nous sommes dans un navigateur
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    // CORRECTION CRITIQUE : N'accéder à localStorage que si nous sommes dans le navigateur
    if (this.isBrowser) {
        // Initialisation : vérifie si un jeton existe déjà (dans le localStorage)
        this.currentToken = localStorage.getItem('auth_token');
        this.isAuthenticatedSubject.next(!!this.currentToken);
    }
  }

  // Simule une tentative de connexion réussie
  login(token: string = 'simulated_jwt_12345'): void {
    if (this.isBrowser) {
        this.currentToken = token;
        localStorage.setItem('auth_token', token);
        this.isAuthenticatedSubject.next(true);
        console.log('Utilisateur connecté. Token stocké.');
    }
  }

  // Simule la déconnexion
  logout(): void {
    if (this.isBrowser) {
        this.currentToken = null;
        localStorage.removeItem('auth_token');
        this.isAuthenticatedSubject.next(false);
        console.log('Utilisateur déconnecté.');
    }
  }

  // Retourne le jeton actuel pour l'Interceptor
  getToken(): string | null {
    // Si nous sommes sur le serveur (SSR), le token est null, ce qui est correct.
    return this.currentToken; 
  }
}