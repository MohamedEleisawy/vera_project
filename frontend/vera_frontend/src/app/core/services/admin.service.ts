import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model'; 

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }

  // SIMULATION DE DONNÉES (Remplace ceci par ton appel HTTP ou Supabase)
  getAdmins(): Observable<User[]> {
    const mockUsers: User[] = [
      {
        id: '1',
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@vera.com',
        isAdmin: true,
        actif: true,
        createdAt: new Date('2023-11-15T09:00:00'),
        updatedAt: new Date()
      },
      {
        id: '2',
        nom: 'Martin',
        prenom: 'Sophie',
        email: 'sophie.admin@vera.com',
        isAdmin: true,
        actif: true,
        createdAt: new Date('2024-01-20T14:30:00'),
        updatedAt: new Date()
      },
      {
        id: '3',
        nom: 'Lambda',
        prenom: 'User',
        email: 'user@test.com',
        isAdmin: false, // Lui ne devrait pas s'afficher
        actif: true,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date()
      }
    ];

    // On simule un filtre côté frontend (dans la vraie vie, fais le filtre dans ta requête SQL/API)
    const adminsOnly = mockUsers.filter(user => user.isAdmin === true);
    
    return of(adminsOnly);
  }
}