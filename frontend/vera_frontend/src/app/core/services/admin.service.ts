import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, map } from 'rxjs';
import { environment } from '../../../environment/environment'; // Vérifie le chemin
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private supabase: SupabaseClient;

  constructor() {
    // Initialisation du client Supabase avec tes clés
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // RÉCUPÉRATION RÉELLE DEPUIS SUPABASE
  getAdmins(): Observable<User[]> {
    // On crée la promesse de requête
    const promise = this.supabase
      .from('users')                 // Nom de ta table dans l'image
      .select('*')                   // On prend toutes les colonnes
      .eq('isAdmin', true)           // FILTRE: On ne veut que les admins
      .order('createdAt', { ascending: false }); // Tri par date récente

    // On convertit la Promesse en Observable pour Angular
    return from(promise).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        // Supabase retourne 'data', on le renvoie
        return response.data as User[];
      })
    );
  }
}