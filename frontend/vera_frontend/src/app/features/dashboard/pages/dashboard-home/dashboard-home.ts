import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.html',
  styleUrls: ['./dashboard-home.css'] 
})

export class DashboardHome {
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