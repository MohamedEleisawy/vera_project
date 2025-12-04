// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './features/landing/pages/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardHome } from './features/dashboard/pages/dashboard-home/dashboard-home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  // Route privée (Dashboard) protégée par le AuthGuard
  {
    path: 'dashboard',
    component: DashboardHome,
    canActivate: [AuthGuard],
  },
  // Route de connexion
  {
    path: 'login',
    component: LoginComponent,
  },
  // Route d'inscription
  {
    path: 'register',
    component: RegisterComponent,
  },
  // Redirection par défaut
  { path: '**', redirectTo: '' },
];
