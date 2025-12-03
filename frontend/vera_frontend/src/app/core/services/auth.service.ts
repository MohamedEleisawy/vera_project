import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
// 👇 IMPORT IMPORTANT : On récupère la config (Local ou Prod)
import { environment } from '../../../environnements/environnement';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Injection de l'ID de plateforme (pour savoir si on est sur le serveur ou le navigateur)
  private platformId = inject(PLATFORM_ID); 
  
  // 👇 MODIFICATION ICI : On utilise la variable d'environnement dynamique
  // Cela donnera 'http://localhost:3000/auth' en dev
  // Et 'https://ton-app-railway.app/auth' en production
  private apiUrl = `${environment.apiUrl}/auth`; 

  // --- GESTION DE L'ÉTAT (State Management) ---
  // Initialisé à false pour éviter les erreurs côté serveur (SSR)
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Vérification du token UNIQUEMENT côté navigateur
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  // --- 1. INSCRIPTION ---
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // --- 2. CONNEXION ---
  login(credentials: { email: string; motDePasse: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.access_token) {
          // Sécurité SSR : On touche au localStorage seulement dans le navigateur
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.access_token);
          }
          this.isAuthenticatedSubject.next(true); 
        }
      })
    );
  }

  // --- 3. LOGOUT ---
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  // --- 4. UTILITAIRES ---
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null; // Retourne null si exécuté côté serveur
  }
}