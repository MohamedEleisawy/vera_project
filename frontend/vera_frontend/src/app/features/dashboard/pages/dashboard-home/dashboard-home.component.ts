import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // <--- OBLIGATOIRE
import { Sidebar } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  templateUrl: './dashboard-home.html',
  // Ajoute les imports ici pour qu'ils soient reconnus dans le HTML
  imports: [
    RouterOutlet,     // Nécessaire pour les routes enfants
    Sidebar  // Nécessaire pour afficher la sidebar
  ]
})
export class DashboardHome {}