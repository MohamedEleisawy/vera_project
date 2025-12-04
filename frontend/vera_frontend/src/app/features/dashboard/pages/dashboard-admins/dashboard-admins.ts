import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Important pour afficher les dates
import { AdminService } from '../../../../core/services/admin.service'; // Adapte le chemin
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule, DatePipe], // DatePipe permet d'utiliser le pipe | date
  templateUrl: './dashboard-admins.html',
})
export class AdminsComponent implements OnInit {
  adminsList: User[] = [];
  isLoading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.adminService.getAdmins().subscribe({
      next: (data) => {
        this.adminsList = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des admins', err);
        this.isLoading = false;
      }
    });
  }
}