import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { CommonModule } from '@angular/common';
import { CookieConsentComponent } from './cookiesconsent';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Navbar, Footer, RouterModule, CookieConsentComponent],
  templateUrl: './app.html',
  standalone: true,
})
export class App {
  protected readonly title = signal('projet-vera');
}
