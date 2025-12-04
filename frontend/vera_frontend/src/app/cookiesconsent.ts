import { Component, OnInit, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

interface CookieConsent {
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (showBanner()) {
      <div
        class="fixed bottom-0 left-0 right-0 z-50 bg-stone-900 text-white p-4 lg:p-6 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-description"
      >
        <div class="max-w-[1800px] mx-auto">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <!-- Contenu texte -->
            <div class="flex-1">
              <h2 id="cookie-title" class="text-lg font-semibold mb-2">🍪 Gestion des cookies</h2>
              <p id="cookie-description" class="text-sm text-stone-300 mb-2">
                Vera utilise des cookies pour améliorer votre expérience et analyser l'utilisation
                du site. Vous pouvez accepter tous les cookies, les refuser, ou personnaliser vos
                préférences.
              </p>
              <a
                href="/confidentialite"
                class="text-sm text-primary-green-200 hover:text-primary-green-100 underline focus:outline-none focus:ring-2 focus:ring-primary-green-300 rounded"
                aria-label="En savoir plus sur notre politique de cookies"
              >
                En savoir plus
              </a>
            </div>

            <!-- Boutons d'action -->
            <div class="flex flex-col sm:flex-row gap-3 lg:shrink-0">
              <button
                type="button"
                (click)="openPreferences()"
                class="px-4 py-2 text-sm font-medium text-stone-300 border border-stone-600 rounded-full hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-900 focus:ring-white cursor-pointer"
                aria-haspopup="dialog"
                aria-label="Personnaliser mes préférences de cookies"
              >
                Personnaliser
              </button>

              <button
                type="button"
                (click)="rejectAll()"
                class="px-4 py-2 text-sm font-medium text-white border border-stone-600 rounded-full hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-900 focus:ring-white cursor-pointer"
                aria-label="Refuser tous les cookies non essentiels"
              >
                Tout refuser
              </button>

              <button
                type="button"
                (click)="acceptAll()"
                class="px-4 py-2 text-sm font-medium bg-primary-green-200 text-stone-900 rounded-full hover:bg-primary-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-900 focus:ring-primary-green-300 cursor-pointer"
                aria-label="Accepter tous les cookies"
              >
                Tout accepter
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Modal de préférences -->
    @if (showPreferences()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preferences-title"
        (click)="closePreferences()"
        (keydown.escape)="closePreferences()"
      >
        <div
          class="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div class="p-6 border-b border-stone-200">
            <h3 id="preferences-title" class="text-xl font-bold text-stone-900">
              Préférences de cookies
            </h3>
            <p class="text-sm text-stone-600 mt-2">
              Choisissez les cookies que vous souhaitez autoriser.
            </p>
          </div>

          <!-- Options -->
          <div class="p-6 space-y-6">
            <!-- Cookies essentiels -->
            <fieldset class="flex items-start justify-between">
              <div class="flex-1">
                <legend class="font-semibold text-stone-900">Cookies essentiels</legend>
                <p id="essential-desc" class="text-sm text-stone-600 mt-1">
                  Nécessaires au fonctionnement du site. Ils ne peuvent pas être désactivés.
                </p>
              </div>
              <div class="ml-4 mt-1">
                <span class="text-sm text-stone-500 italic">Toujours actifs</span>
              </div>
            </fieldset>

            <!-- Cookies analytiques -->
            <fieldset class="flex items-start justify-between">
              <div class="flex-1">
                <legend class="font-semibold text-stone-900">Cookies analytiques</legend>
                <p id="analytics-desc" class="text-sm text-stone-600 mt-1">
                  Nous aident à comprendre comment vous utilisez le site pour l'améliorer.
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  [checked]="analyticsEnabled()"
                  (change)="toggleAnalytics()"
                  class="sr-only peer"
                  aria-describedby="analytics-desc"
                />
                <div
                  class="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green-200"
                ></div>
                <span class="sr-only">Activer les cookies analytiques</span>
              </label>
            </fieldset>

            <!-- Cookies marketing -->
            <fieldset class="flex items-start justify-between">
              <div class="flex-1">
                <legend class="font-semibold text-stone-900">Cookies marketing</legend>
                <p id="marketing-desc" class="text-sm text-stone-600 mt-1">
                  Utilisés pour vous proposer des contenus personnalisés.
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  [checked]="marketingEnabled()"
                  (change)="toggleMarketing()"
                  class="sr-only peer"
                  aria-describedby="marketing-desc"
                />
                <div
                  class="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green-200"
                ></div>
                <span class="sr-only">Activer les cookies marketing</span>
              </label>
            </fieldset>
          </div>

          <!-- Footer -->
          <div class="p-6 bg-stone-50 rounded-b-2xl flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              (click)="closePreferences()"
              class="px-6 py-2 text-sm font-medium text-stone-600 border border-stone-300 rounded-full hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 cursor-pointer"
              aria-label="Annuler"
            >
              Annuler
            </button>
            <button
              type="button"
              (click)="savePreferences()"
              class="px-6 py-2 text-sm font-medium bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 cursor-pointer"
              aria-label="Enregistrer mes préférences de cookies"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class CookieConsentComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  // Initialiser à false pour éviter le flash au chargement
  showBanner = signal(false);
  showPreferences = signal(false);
  analyticsEnabled = signal(false);
  marketingEnabled = signal(false);

  private readonly CONSENT_KEY = 'vera_cookie_consent';
  private readonly CONSENT_DURATION_DAYS = 395; // 13 mois max CNIL

  ngOnInit(): void {
    // Vérifier seulement côté client (navigateur)
    if (isPlatformBrowser(this.platformId)) {
      this.checkConsent();
    }
  }

  private checkConsent(): void {
    const consent = this.getStoredConsent();

    if (!consent || this.isConsentExpired(consent)) {
      this.showBanner.set(true);
    } else {
      this.analyticsEnabled.set(consent.analytics);
      this.marketingEnabled.set(consent.marketing);
    }
  }

  private getStoredConsent(): CookieConsent | null {
    try {
      const stored = localStorage.getItem(this.CONSENT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private isConsentExpired(consent: CookieConsent): boolean {
    const expirationMs = this.CONSENT_DURATION_DAYS * 24 * 60 * 60 * 1000;
    return Date.now() - consent.timestamp > expirationMs;
  }

  private saveConsent(analytics: boolean, marketing: boolean): void {
    const consent: CookieConsent = {
      analytics,
      marketing,
      timestamp: Date.now(),
    };
    localStorage.setItem(this.CONSENT_KEY, JSON.stringify(consent));
    this.showBanner.set(false);
    this.showPreferences.set(false);
  }

  acceptAll(): void {
    this.analyticsEnabled.set(true);
    this.marketingEnabled.set(true);
    this.saveConsent(true, true);
  }

  rejectAll(): void {
    this.analyticsEnabled.set(false);
    this.marketingEnabled.set(false);
    this.saveConsent(false, false);
  }

  openPreferences(): void {
    this.showPreferences.set(true);
  }

  closePreferences(): void {
    this.showPreferences.set(false);
  }

  toggleAnalytics(): void {
    this.analyticsEnabled.update((v) => !v);
  }

  toggleMarketing(): void {
    this.marketingEnabled.update((v) => !v);
  }

  savePreferences(): void {
    this.saveConsent(this.analyticsEnabled(), this.marketingEnabled());
  }
}
