import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
<<<<<<< HEAD
import { environment } from '../../../environment/environment';

=======
import { environment } from '../../../environnements/environnement';
>>>>>>> b39c2ffa90710d37494a838fd6548463299f74b7
// Interface de réponse du Backend (correspond à ce que NestJS renvoie)
export interface AnalysisResponse {
  verdict: string;
  confidence: number;
  details: string;
  source?: string;
  // Vous pourrez ajouter d'autres champs plus tard si le backend évolue
}

@Injectable({
<<<<<<< HEAD
  providedIn: 'root'
=======
  providedIn: 'root',
>>>>>>> b39c2ffa90710d37494a838fd6548463299f74b7
})
export class ApiService {
  // L'URL de base est récupérée depuis environment.ts
  // On enlève le slash final s'il y en a un pour éviter les doubles slashs
  private baseUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(private http: HttpClient) {}

  /**
   * Analyse d'un texte simple
   */
  analyzeText(content: string): Observable<AnalysisResponse> {
    return this.http.post<AnalysisResponse>(`${this.baseUrl}/analyze`, { content });
  }

  /**
   * Analyse d'une vidéo YouTube via son URL
   */
  analyzeYoutube(url: string, userId: string = 'web-guest'): Observable<AnalysisResponse> {
    return this.http.post<AnalysisResponse>(`${this.baseUrl}/youtube-analysis`, { url, userId });
  }

  /**
   * Analyse d'un fichier média (Image/Audio/Vidéo)
   */
  analyzeMedia(file: File, userId: string = 'web-guest'): Observable<AnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    return this.http.post<AnalysisResponse>(`${this.baseUrl}/analyze/media`, formData);
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> b39c2ffa90710d37494a838fd6548463299f74b7
