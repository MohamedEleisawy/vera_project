// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './features/landing/pages/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardHome } from './features/dashboard/pages/dashboard-home/dashboard-home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
<<<<<<< HEAD
import { DashboardAdminsComponent } from './features/dashboard/pages/dashboard-admins/dashboard-admins';
import { DashboardSondageComponent } from './features/dashboard/pages/dashboard-sondage/dashboard-sondage';
=======
import { Confidentialite } from './features/landing/pages/confidentialite/confidentialite';
import { MentionsLegales } from './features/landing/pages/CGU-mentionslegales/mentionslegales.component';
>>>>>>> b39c2ffa90710d37494a838fd6548463299f74b7

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
    children: [
      // Quand on va sur /dashboard, on redirige vers /dashboard/sondage par défaut
      { path: '', redirectTo: 'sondage', pathMatch: 'full' },
      
      // Route: /dashboard/sondage
      { path: 'sondage', component: DashboardSondageComponent },
      
      // Route: /dashboard/admins
      { path: 'admins', component: DashboardAdminsComponent }
    ]
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
<<<<<<< HEAD
=======
  {
    path: 'confidentialite',
    component: Confidentialite,
  },
  {
    path: 'CGU-mentionslegales',
    component: MentionsLegales,
  },

>>>>>>> b39c2ffa90710d37494a838fd6548463299f74b7
  // Redirection par défaut
  { path: '**', redirectTo: '' },
];
