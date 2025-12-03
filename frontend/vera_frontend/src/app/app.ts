import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Card } from './shared/components/card/card'; // Importer le composant Card ici
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { Sidebar } from './features/dashboard/components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Card, Navbar, Footer, Sidebar], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('projet-vera');
}