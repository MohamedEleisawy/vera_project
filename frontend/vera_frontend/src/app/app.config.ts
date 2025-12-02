import 'zone.js';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './core/interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 👇 C'EST CETTE LIGNE QUI MANQUAIT OU ÉTAIT MAL PLACÉE
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),

    provideHttpClient(
      withFetch(), 
      withInterceptors([tokenInterceptor])
    ),
  ],
};