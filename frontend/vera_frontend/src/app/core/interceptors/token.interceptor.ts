import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
<<<<<<< HEAD
import { AuthService } from '../services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // On injecte le token si on appelle notre API Backend (localhost:3000)
  const isApiUrl = req.url.includes('localhost:3000');

  if (token && isApiUrl) {
=======
import { AuthService } from '../services/auth.service'; // Le service est dans le dossier parent (src/app/)

/**
 * TokenInterceptor : Intercepteur fonctionnel pour ajouter le jeton JWT.
 * Ce format est requis par la fonction provideHttpClient(withInterceptors([...]))
 * utilisée dans app.config.ts.
 */
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Utilisation de inject() pour obtenir le service (méthode moderne)
  const authService = inject(AuthService);
  const token = authService.getToken();

  // 1. Vérifie si un jeton existe et si la requête est destinée à notre backend (ex: /api/)
  // Ceci empêche l'ajout du token à des services externes (ex: Google, etc.)
  if (token && req.url.includes('/api/')) {
    console.log(`Interceptor: Ajout du jeton à la requête vers ${req.url}`);
    
    // 2. Clone la requête et ajoute l'en-tête 'Authorization: Bearer <token>'
>>>>>>> refs/remotes/origin/main
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
<<<<<<< HEAD
    return next(clonedRequest);
  }

=======

    // 3. Poursuit la requête modifiée
    return next(clonedRequest);
  }

  // 4. Poursuit la requête originale si pas de jeton ou si l'URL n'est pas une API interne
>>>>>>> refs/remotes/origin/main
  return next(req);
};