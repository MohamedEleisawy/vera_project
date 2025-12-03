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
        this.logger.log(`Tentative de récupération des sous-titres...`);
        
        // 🎯 CORRECTION ICI : On ajoute ': any' pour autoriser le changement de type
        let transcriptItems: any = null;

        // 1. Essai Standard (Automatique)
        try {
            transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
        } catch (e) {
            this.logger.warn(`Echec auto-détection, essai forcé FR...`);
        }

        // 2. Essai Forcé Français (Si l'auto a échoué)
        if (!transcriptItems) {
            try {
                transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'fr' });
            } catch (e) {
                this.logger.warn(`Echec FR, essai forcé EN...`);
            }
        }

        // 3. Essai Forcé Anglais (Dernier recours)
        if (!transcriptItems) {
             try {
                transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
             } catch (e) {
                // Rien à faire, on passera aux métadonnées
             }
        }

        if (transcriptItems && transcriptItems.length > 0) {
            const fullText = transcriptItems.map(item => item.text).join(' ');
            
            // ✂️ TRONCATURE À 10 000 CARACTÈRES
            analysisContent = fullText.length > 10000 ? fullText.substring(0, 10000) + '... [Tronqué]' : fullText;
            
            sourceUsed = 'TRANSCRIPTION COMPLÈTE';
            this.logger.log(`✅ Sous-titres récupérés (${analysisContent.length} chars).`);
        } else {
            throw new Error('Aucune piste de sous-titres trouvée (Bloqué ou inexistant).');
        }

    } catch (error) {
        // --- FALLBACK MÉTADONNÉES ---
        this.logger.warn(`⚠️ Sous-titres inaccessibles. Passage au mode Métadonnées.`);
        
        try {
            const metadata = await this.getVideoMetadata(videoId);
            analysisContent = `Titre: ${metadata.title}\n\nDescription: ${metadata.description}`;
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
    1. Résume les faits principaux.
    2. Vérifie la véracité des propos (Fact-checking).
    3. Si tu n'as que le titre/description, précise que l'analyse est limitée.`;

    return this.analysisService.callVeraModel(prompt, userId);
  }

  // ... (Méthodes privées inchangées)
  private async getVideoMetadata(videoId: string): Promise<{ title: string, description: string }> {
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      const { data } = await axios.get(url, {
          headers: { 
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
          }
      });
      const titleMatch = data.match(/<meta name="title" content="([^"]*)"/);
      const descMatch = data.match(/<meta name="description" content="([^"]*)"/);
      return { 
          title: titleMatch ? titleMatch[1] : 'Titre inconnu', 
          description: descMatch ? descMatch[1] : 'Description indisponible' 
      };
  }

  private extractVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}
