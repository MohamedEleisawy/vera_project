import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

/**
 * AuthGuard: CanActivateFn
 * Protège les routes en vérifiant l'état d'authentification de l'utilisateur. Connecté ou pas
 */
export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Vérifie l'état de connexion via l'Observable du service
  return authService.isAuthenticated$.pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true; // Accès autorisé
      } else {
        // Accès refusé : rediriger l'utilisateur vers la page d'accueil (ou de connexion)
        console.warn("Accès au Dashboard refusé. Redirection vers la page d'accueil.");
        router.navigate(['/']); // Redirection vers la route racine (Home)
        return false;
      }
    }),
  );
};
