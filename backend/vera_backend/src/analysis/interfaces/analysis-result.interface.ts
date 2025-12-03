// src/analysis/interfaces/analysis-result.interface.ts

/**
 * Définit la structure des données de sortie après l'analyse par l'IA Vera.
 * Cette interface assure que toutes les fonctions d'analyse renvoient un format cohérent.
 */
export interface AnalysisResult {
  /**
   * Le verdict final clair (ex: "VRAI / VÉRIFIÉ", "FAUX / DÉSINFORMATION", "NON ÉVALUÉ").
   */
  verdict: string;

  /**
   * Le niveau de confiance que l'IA accorde à son propre verdict (entre 0.0 et 1.0).
   */
  confidence: number;

  /**
   * Une explication brève ou des détails sur les raisons du verdict.
   */
  details?: string;

  /**
   * Peut être étendu pour inclure l'URL ou l'ID de la source analysée.
   */
  source?: string;
}