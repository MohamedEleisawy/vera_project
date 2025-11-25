import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
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
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // 3. Poursuit la requête modifiée
    return next(clonedRequest);
  }

  // 4. Poursuit la requête originale si pas de jeton ou si l'URL n'est pas une API interne
  return next(req);
};