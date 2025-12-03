import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { YoutubeTranscript } from 'youtube-transcript';
import axios from 'axios';

@Injectable()
export class YoutubeAnalysisService {
  private readonly logger = new Logger(YoutubeAnalysisService.name);

  constructor(private readonly analysisService: AnalysisService) {}

  async analyzeYoutubeVideo(url: string, userId: string) {
    this.logger.log(`📺 Analyse YouTube demandée pour : ${url}`);

    const videoId = this.extractVideoId(url);
    if (!videoId) {
      throw new BadRequestException('Lien YouTube invalide.');
    }

    let analysisContent = '';
    let sourceUsed = '';

    try {
        // --- ESSAI 1 : Récupération "Bête et Méchante" (Langue par défaut) ---
        // On ne force plus 'fr' immédiatement, on prend ce que YouTube nous donne par défaut.
        // Cela contourne souvent les erreurs sur les sous-titres auto-générés.
        this.logger.log(`Tentative de récupération des sous-titres (Mode Standard)...`);
        
        let transcriptItems = await YoutubeTranscript.fetchTranscript(videoId)
            .catch(() => null);

        // Si le défaut échoue, on tente explicitement l'anglais (souvent présent sur les grosses vidéos)
        if (!transcriptItems) {
             this.logger.log(`Tentative repli anglais...`);
             transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' })
                .catch(() => null);
        }

        if (transcriptItems && transcriptItems.length > 0) {
            const fullText = transcriptItems.map(item => item.text).join(' ');
            
            // Tronquage intelligent (env. 25k caractères pour Gemini 2.0 Flash qui a une grande fenêtre contextuelle)
            analysisContent = fullText.length > 25000 ? fullText.substring(0, 25000) + '... [Tronqué]' : fullText;
            sourceUsed = 'TRANSCRIPTION COMPLÈTE';
            this.logger.log(`✅ Sous-titres récupérés (${analysisContent.length} chars).`);
        } else {
            throw new Error('Aucune piste de sous-titres trouvée.');
        }

    } catch (error) {
        // --- ESSAI 2 : Fallback Métadonnées (Titre + Description) ---
        this.logger.warn(`⚠️ Sous-titres bloqués (Probable mur de cookies ou absence). Passage au mode Métadonnées.`);
        
        try {
            const metadata = await this.getVideoMetadata(videoId);
            analysisContent = `Titre: ${metadata.title}\n\nDescription et Mots-clés: ${metadata.description}`;
            sourceUsed = 'MÉTADONNÉES (TITRE + DESCRIPTION)';
            this.logger.log(`✅ Métadonnées récupérées via HTML.`);
        } catch (metaError) {
            throw new InternalServerErrorException("Impossible d'accéder aux informations de cette vidéo.");
        }
    }

    // --- APPEL VERA ---
    this.logger.log(`Envoi à VERA (${sourceUsed})...`);
    
    const prompt = `Analyse cette vidéo YouTube.
    Source des données : ${sourceUsed}
    URL : ${url}
    
    Contenu brut :
    "${analysisContent}"
    
    Instructions :
    1. Résume les faits principaux évoqués.
    2. Si c'est une transcription : analyse la véracité des propos.
    3. Si ce sont des métadonnées : analyse le contexte et les revendications du titre/description.
    4. Sois clair sur les limitations si tu n'as que le titre.`;

    return this.analysisService.callVeraModel(prompt, userId);
  }

  // ... (Le reste des méthodes privées getVideoMetadata et extractVideoId reste inchangé)
  private async getVideoMetadata(videoId: string): Promise<{ title: string, description: string }> {
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      const { data } = await axios.get(url, {
          headers: { 
              // User-Agent qui ressemble à un vrai navigateur pour passer certains filtres
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
          }
      });

      const titleMatch = data.match(/<meta name="title" content="([^"]*)"/);
      const descMatch = data.match(/<meta name="description" content="([^"]*)"/);

      const title = titleMatch ? titleMatch[1] : 'Titre inconnu';
      const description = descMatch ? descMatch[1] : 'Description indisponible';

      return { title, description };
  }

  private extractVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}