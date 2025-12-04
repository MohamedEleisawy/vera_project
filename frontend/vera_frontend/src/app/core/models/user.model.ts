// src/app/core/models/user.model.ts
export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string; // Optionnel car on ne l'affiche pas
  isAdmin: boolean;
  actif: boolean;
  createdAt: string | Date; // Correspond au timestamp de ton schéma
  updatedAt: string | Date;
}