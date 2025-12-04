export interface User {
  id: string;
  nom: string;       // varchar
  prenom: string;    // varchar
  email: string;     // varchar
  isAdmin: boolean;  // bool
  actif: boolean;    // bool
  createdAt: string | Date; // timestamp
  // on ignore motDePasse pour la sécurité
}