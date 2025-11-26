import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// Import de l'AuthGuard pour protéger la route
import { AuthGuard } from './core/guards/auth.guard'; 
// CORRECTION : Utiliser le chemin et la casse corrects pour le fichier 'token.interceptor.ts'
import { tokenInterceptor } from './core/interceptors/token.interceptor';
// Import des Composants pour le Routage
import { AuthService } from './core/services/auth.service';


export const appConfig: ApplicationConfig = {
  providers: [
    // CORRECTION CLÉ : Désactiver Zone.js, car nous utilisons l'architecture standalone
    // La suppression de cet appel résout le NG0908.
    // provideZoneChangeDetection({ eventCoalescing: true }), // <--- LIGNE À SUPPRIMER

    // 1. Fournit la configuration du routage
    provideRouter(routes), 
    
    // 2. Fournit HttpClient et enregistre les Interceptors
    provideHttpClient(
      withInterceptors([
        tokenInterceptor // Enregistrement de notre Interceptor
      ])
    ),
    
    // 3. Fournit les Services (et le Guard qui en dépend)
    AuthService
  ]
};
