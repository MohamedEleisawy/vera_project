// frontend/src/app/core/interceptors/token.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  const token = authService.getToken();

  // 1. Cloner la requête pour ajouter le token (comme avant)
  let request = req;
  if (token) {
    request = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  // 2. Gérer la réponse et les erreurs
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur inconnue est survenue';

      // Gestion des erreurs côté Client (ex: pas d'internet)
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erreur réseau : ${error.error.message}`;
      }
      // Gestion des erreurs côté Serveur (ce qui vient de NestJS)
      else {
        // Grâce à notre filtre Backend, error.error.message contient le message propre
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }

        // --- SCÉNARIOS SPÉCIAUX ---

        // Cas 401 : Token expiré ou invalide
        if (error.status === 401) {
          notificationService.showError('Session expirée, veuillez vous reconnecter.');
          authService.logout(); // Déconnecte proprement
          router.navigate(['/login']);
        }

        // Cas 403 : Interdit (ex: User veut accéder à une page Admin)
        if (error.status === 403) {
          notificationService.showError("Vous n'avez pas les droits pour effectuer cette action.");
        }

        // Cas 500 : Serveur planté
        if (error.status === 500) {
          errorMessage = 'Problème technique sur nos serveurs. Réessayez plus tard.';
        }
      }

      // Si ce n'est pas une 401 (qu'on a déjà gérée), on affiche l'erreur
      if (error.status !== 401) {
        notificationService.showError(errorMessage);
      }

      // On renvoie l'erreur pour que le composant puisse aussi réagir (ex: arrêter le spinner)
      return throwError(() => error);
    }),
  );
};
