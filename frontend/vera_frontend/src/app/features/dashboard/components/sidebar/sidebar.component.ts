import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  // 1. On retire 'Router' d'ici
  imports: [CommonModule, RouterLink, RouterLinkActive], 
  templateUrl: './sidebar.html',
})
export class Sidebar {
  isExpanded = false;

  // 2. On injecte le Router ici en 'public' pour que le HTML puisse l'utiliser
  constructor(public router: Router) {}

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }

  collapseSidebar(): void {
    this.isExpanded = false;
  }

  expandSidebar(): void {
    this.isExpanded = true;
  }
}