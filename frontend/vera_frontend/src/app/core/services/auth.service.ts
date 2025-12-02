// src/app/core/services/auth.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common'; // 👈 IMPORTANT

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // 👇 On injecte l'ID de la plateforme pour savoir où on est (Serveur ou Navigateur)
  private platformId = inject(PLATFORM_ID); 
  
  private apiUrl = 'http://localhost:3000/auth'; 

  // --- GESTION DE L'ÉTAT (State Management) ---
  
  // ⚠️ CORRECTION ICI : On initialise à false par défaut pour ne pas faire planter le serveur
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // On vérifie le token UNIQUEMENT si on est dans le navigateur
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
          // ⚠️ Sécurité SSR : On sauvegarde seulement si on est côté navigateur
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
    // ⚠️ Sécurité SSR
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null; // Si on est sur le serveur, on renvoie null
  }
}