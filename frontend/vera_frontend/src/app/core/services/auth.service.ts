import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // URL de ton backend NestJS
  private apiUrl = 'http://localhost:3000/auth';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // On ne touche au localStorage que si on est dans le navigateur
    if (this.isBrowser) {
      const token = localStorage.getItem('access_token');
      this.isAuthenticatedSubject.next(!!token);
    }
  }

  // --- LOGIN ---
  login(email: string, motDePasse: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, motDePasse }).pipe(
      tap(response => {
        if (this.isBrowser && response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  // --- REGISTER ---
  register(nom: string, email: string, motDePasse: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { nom, email, motDePasse });
  }

  // --- LOGOUT ---
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/login']);
    }
  }

  // --- TOKEN UTILS ---
  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('access_token');
    }
    return null;
  }
}