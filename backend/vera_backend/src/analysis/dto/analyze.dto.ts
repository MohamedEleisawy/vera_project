// src/analysis/dto/analyze.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object (DTO) pour la requête d'analyse
 * Le bot Telegram enverra ceci au backend.
 */
export class AnalyzeDto {
  @IsString()
  @IsNotEmpty()
  content: string; // Le texte, l'URL, ou l'ID de fichier à analyser.
}