import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService } from '../../../../core/services/admin.service'; // Vérifie ton chemin
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-dashboard-admins',
  standalone: true,
  imports: [CommonModule, DatePipe], 
  templateUrl: './dashboard-admins.html', // Vérifie que c'est bien .html et pas .component.html
  styleUrls: ['./dashboard-admins.css']
})
export class DashboardAdminsComponent implements OnInit { 
  // ^^^ C'EST ICI QUE L'ERREUR SE CORRIGE (Le nom doit être exact)
  
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
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}