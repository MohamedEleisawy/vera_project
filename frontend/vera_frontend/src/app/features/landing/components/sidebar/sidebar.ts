import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  isExpanded = false; // Démarre collapsed par défaut

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