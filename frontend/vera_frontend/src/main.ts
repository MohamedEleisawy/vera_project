// 👇 IMPORT CRUCIAL : Doit être la toute première ligne !
import 'zone.js'; 

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
// Vérifie bien que ton composant principal s'appelle 'App' et est dans 'app/app.ts'
// Si c'est le standard Angular, c'est souvent 'AppComponent' dans './app/app.component'
import { App } from './app/app'; 

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));