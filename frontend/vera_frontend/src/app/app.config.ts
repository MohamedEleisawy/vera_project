import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { Routes, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// Import de l'AuthGuard pour protéger la route
import { AuthGuard } from './core/guards/auth.guard'; 
// CORRECTION : Utiliser le chemin et la casse corrects pour le fichier 'token.interceptor.ts'
import { tokenInterceptor } from './core/interceptors/token.interceptor';
// Import des Composants pour le Routage
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from './core/services/auth.service';

// --- Définition des Routes ---
export const routes: Routes = [
  // Route publique (Home)
  { path: '', component: HomeComponent }, 
  
  // Route privée (Dashboard) protégée par le AuthGuard
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard] 
  },
  
  // Redirection par défaut
  { path: '**', redirectTo: '' } 
];


/**
 * ApplicationConfig : Définit tous les fournisseurs globaux de l'application.
 */
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
