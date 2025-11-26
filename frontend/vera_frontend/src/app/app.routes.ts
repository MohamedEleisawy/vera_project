// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './features/landing/pages/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardHome } from './features/dashboard/pages/dashboard-home/dashboard-home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  // Route privée (Dashboard) protégée par le AuthGuard
  { 
    path: 'dashboard', 
    component: DashboardHome,
    canActivate: [AuthGuard]
  },
  // Redirection par défaut
  { path: '**', redirectTo: '' }
];
