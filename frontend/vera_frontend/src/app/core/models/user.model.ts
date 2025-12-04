export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  isAdmin: boolean;
  actif: boolean;
  createdAt: string; // Supabase renvoie des strings pour les dates
  updatedAt?: string;
  motDePasse?: string;
}