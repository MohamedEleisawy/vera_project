import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <!-- 
      Le composant app-root ne fait qu'afficher le contenu routé.
      Le routage est défini dans app.module.ts, où la route '/' pointe vers HomeComponent.
      Le contenu de HomeComponent (avec les boutons de test) sera affiché ici.
    -->
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'fact-checking-platform';
}