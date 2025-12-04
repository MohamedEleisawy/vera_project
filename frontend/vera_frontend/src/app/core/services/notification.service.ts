// frontend/src/app/core/services/notification.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // Affiche un succès (Vert)
  showSuccess(message: string) {
    // Plus tard, tu remplaceras ça par un beau composant Tailwind
    console.log(`✅ SUCCÈS : ${message}`);
    // alert(message); // Décommente si tu veux une popup native temporaire
  }

  // Affiche une erreur (Rouge)
  showError(message: string) {
    console.error(`❌ ERREUR : ${message}`);
    alert(`Erreur : ${message}`); // Simple alert pour que tu le voies bien
  }
}
