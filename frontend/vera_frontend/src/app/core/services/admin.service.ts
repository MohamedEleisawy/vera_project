import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  // Simulation basée sur tes colonnes BDD
  getAdmins(): Observable<User[]> {
    const mockUsers: User[] = [
      {
        id: 'uuid-1',
        nom: 'Stark',
        prenom: 'Tony',
        email: 'tony@stark.com',
        isAdmin: true,
        actif: true,
        createdAt: '2023-11-15T09:00:00'
      },
      {
        id: 'uuid-2',
        nom: 'Rogers',
        prenom: 'Steve',
        email: 'cap@america.com',
        isAdmin: true,
        actif: false,
        createdAt: '2024-01-20T14:30:00'
      }
    ];
    return of(mockUsers);
  }
}