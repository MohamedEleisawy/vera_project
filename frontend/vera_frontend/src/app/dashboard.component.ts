import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="p-8 bg-blue-50 min-h-screen">
      <h1 class="text-4xl font-bold text-blue-700 mb-6">Dashboard - Accès Sécurisé (Phase 2)</h1>
      <p class="mb-4 text-green-700 font-semibold">Félicitations, vous êtes connecté !</p>
      <p class="mb-8">Ici se trouveront les outils de gestion et d'analyse.</p>
      <button (click)="fetchData()" class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
        Tester Requête Sécurisée
      </button>
      <a routerLink="/" class="ml-4 text-blue-600 hover:text-blue-800 underline">Retourner à l'Accueil</a>
      <p *ngIf="apiMessage" class="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">{{ apiMessage }}</p>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule] 
})
export class DashboardComponent implements OnInit {
  apiMessage: string = '';
  // Simule l'injection de HttpClient pour tester l'Interceptor
  private http: any = { 
    get: (url: string) => { 
      // Simule une requête qui passe par l'Interceptor
      return new Observable<any>(observer => {
        console.log('Dashboard: Requête API envoyée (vérifiez le log de l\'Interceptor)');
        setTimeout(() => {
          observer.next({ status: 'success', data: 'Liste des fiches fact-checking reçue.' });
          observer.complete();
        }, 1000);
      });
    }
  };

  ngOnInit() {}
  
  fetchData() {
    this.apiMessage = 'Chargement...';
    // L'URL commence par /api/ pour déclencher l'Interceptor
    this.http.get('/api/v1/fiches').subscribe((res: any) => {
      this.apiMessage = `API Réponse: ${res.data}`;
    });
  }
}