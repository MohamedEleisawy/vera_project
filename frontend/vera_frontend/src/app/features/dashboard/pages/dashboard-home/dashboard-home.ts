import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { StatCardComponent } from '../../components/stats-card/stats-card';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, StatCardComponent],
  templateUrl: './dashboard-home.html',
})
export class DashboardHome implements OnInit {
  apiMessage: string = '';

  private http: any = {
    get: (url: string) => {
      return new Observable<any>((observer) => {
        console.log("Dashboard: Requête API envoyée (vérifiez le log de l'Interceptor)");
        setTimeout(() => {
          observer.next({ status: 'success', data: 'Liste des fiches fact-checking reçue.' });
          observer.complete();
        }, 1000);
      });
    },
  };

  ngOnInit() {}

  fetchData() {
    this.apiMessage = 'Chargement...';
    this.http.get('/api/v1/fiches').subscribe((res: any) => {
      this.apiMessage = `API Réponse: ${res.data}`;
    });
  }
}
