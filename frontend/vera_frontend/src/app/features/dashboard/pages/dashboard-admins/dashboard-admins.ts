import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-admins',
  templateUrl: './dashboard-admins.html',
  styleUrls: ['./dashboard-admins.css']
})
export class DashboardAdminsComponent implements OnInit {
  // Exemple de données
  admins = [
    { id: 1, nom: 'Jean Dupont', email: 'jean@admin.com', role: 'Super Admin' },
    { id: 2, nom: 'Marie Curie', email: 'marie@admin.com', role: 'Modérateur' },
    { id: 3, nom: 'Paul Martin', email: 'paul@admin.com', role: 'Admin' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Ici, tu ferais ton appel de service : this.adminService.getAll().subscribe(...)
  }
}