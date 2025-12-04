import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-sondage',
  templateUrl: './dashboard-sondage.html',
  styleUrls: ['./dashboard-sondage.css'],
})
export class DashboardSondageComponent implements OnInit {
  sondageUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    // On sécurise l'URL pour qu'Angular accepte de l'afficher
    const rawUrl = 'https://lookerstudio.google.com/embed/reporting/370ec307-e7a9-414c-9415-f76d18bcf853/page/VLMhF';
    this.sondageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  ngOnInit(): void {}
}