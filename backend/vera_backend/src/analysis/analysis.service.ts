// src/analysis/analysis.service.ts (Fichier FINAL - Réponse courte VERA uniquement)

import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios'; 
import { AnalyzeDto } from './dto/analyze.dto';
import { AnalysisResult } from './interfaces/analysis-result.interface';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AnalysisService {
  private readonly logger = new Logger(AnalysisService.name);
  
  // Déclarations des propriétés
  private readonly veraApiKey: string | undefined; 
  private readonly veraModelUrl: string | undefined; 
  private readonly geminiApiKey: string | undefined; 
  private readonly httpClient: AxiosInstance; 
  
  private geminiModel: any; 
  
  private readonly DEFAULT_USER_ID = 'vera-telegram-user'; 

  constructor(private configService: ConfigService) {
    this.veraApiKey = this.configService.get<string>('VERA_AI_API_KEY'); 
    this.veraModelUrl = this.configService.get<string>('VERA_MODEL_URL');
    this.geminiApiKey = this.configService.get<string>('GEMINI_API_KEY'); 
    
    // Initialisation du client HTTP pour VERA
    this.httpClient = axios.create({
        baseURL: this.veraModelUrl,
        timeout: 15000, 
        headers: {
            'X-API-Key': this.veraApiKey, 
            'Content-Type': 'application/json',
        },
    });

    // 🎯 Initialisation Gemini (Modèle 2.0 Flash confirmé)
    if (this.geminiApiKey) {
      try {
          const genAI = new GoogleGenerativeAI(this.geminiApiKey);
          this.geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
          this.logger.log('✅ Client Gemini initialisé (modèle: gemini-2.0-flash).');
      } catch (error) {
          this.logger.error('❌ Erreur init Gemini:', error);
          this.geminiModel = undefined;
      }
    } else {
      this.geminiModel = undefined;
      this.logger.error('❌ Clé GEMINI_API_KEY manquante.');
    }
    
    if (!this.veraApiKey || !this.veraModelUrl) {
        this.logger.error('❌ Configuration VERA INCOMPLÈTE.');
    } else {
        this.logger.log(`✅ VERA API prête: ${this.veraModelUrl}`);
    }
  }

  // -------------------------------------------------------------------
  // I. Logique d'Appel API Générique pour le TEXTE
  // -------------------------------------------------------------------

  public async callVeraModel(content: string, sourceUserId: string): Promise<AnalysisResult> {
    const endpoint = '/api/v1/chat'; 

    try {
        const response = await this.httpClient.post(endpoint, 
            { userId: sourceUserId, query: content }, 
            { responseType: 'text', transformResponse: (data) => data }
        );

        const veraResponseText = response.data as string;
        
        return {
            verdict: 'RÉPONSE DIRECTE DE VERA',
            confidence: 0.99,
            details: veraResponseText, 
            source: sourceUserId
        };

    } catch (error) {
        const status = error.response?.status;
        let errorMessage: string;

        if (status === 401 || status === 403) {
            errorMessage = 'Erreur Auth API VERA.';
        } else {
            errorMessage = `Erreur VERA [${status}]: ${error.message}`;
        }
        this.logger.error(errorMessage);
        throw new InternalServerErrorException(errorMessage);
    }
  }

  // -------------------------------------------------------------------
  // II. PROXY MULTIMODAL GEMINI (IMAGES / VIDÉOS / AUDIO)
  // -------------------------------------------------------------------

  private async callGeminiMediaProxy(file: any, userId: string): Promise<AnalysisResult> {
    if (!this.geminiModel) {
        throw new InternalServerErrorException('Gemini client non initialisé.');
    }

    this.logger.log(`Analyse multimodale Gemini démarrée (${file.mimetype})...`);
    
    const filePart = {
        inlineData: {
            data: file.buffer.toString('base64'),
            mimeType: file.mimetype,
        }
    };
    
    const geminiPrompt = `Agis comme un expert en analyse forensique et vérification de faits.
    Analyse ce fichier (image, vidéo ou audio).
    1. Décris objectivement ce que l'on voit ou entend.
    2. Identifie les éléments factuels clés (dates, lieux, affirmations).
    3. Donne le contexte apparent.
    Ne donne pas de verdict, donne juste la description factuelle détaillée pour qu'un autre système puisse vérifier.`;

    try {
        const result = await this.geminiModel.generateContent([geminiPrompt, filePart]);
        const response = await result.response;
        
        const text = typeof response.text === 'function' ? response.text() : response.text;

        if (!text) throw new InternalServerErrorException("Gemini n'a rien généré.");

        const geminiDescription = text.trim();
        this.logger.log(`Gemini description (Interne) : ${geminiDescription.substring(0, 50)}...`);
        
        // Envoi à VERA pour le verdict final
        const veraResult = await this.callVeraModel(
            `Voici une description d'un média à vérifier. Dis-moi si cela semble crédible ou trompeur : "${geminiDescription}"`,
            userId
        );
        
        // 🎯 MODIFICATION ICI : On ne renvoie QUE la réponse de VERA
        return {
            verdict: veraResult.verdict,
            confidence: veraResult.confidence,
            details: veraResult.details, // On cache la description technique Gemini
            source: userId,
        };

    } catch (error) {
        this.logger.error(`Échec Gemini : ${error.message}`);
        throw new InternalServerErrorException(`Échec analyse Gemini.`);
    }
  }

  // -------------------------------------------------------------------
  // III. Méthodes Publiques (Contrôleur)
  // -------------------------------------------------------------------

  async analyzeContent(analyzeDto: AnalyzeDto): Promise<AnalysisResult> {
    const { content } = analyzeDto;
    this.logger.log(`Analyse texte reçue.`);

    if (!this.veraApiKey) {
        return {
            verdict: 'SIMULATION',
            confidence: 0.5,
            details: 'Mode simulation actif (Clés API manquantes).',
            source: 'System'
        };
    }
    return this.callVeraModel(content, this.DEFAULT_USER_ID);
  }
  
  async analyzeMediaFile(file: any, userId: string = this.DEFAULT_USER_ID): Promise<AnalysisResult> {
    this.logger.log(`Analyse fichier reçue : ${file.originalname}`);

    if (!this.geminiModel) {
        this.logger.warn('Simulation Média (Gemini absent).');
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            verdict: 'ANALYSE MÉDIA SIMULÉE',
            confidence: 0.70,
            details: `Analyse simulée pour ${file.mimetype}.`,
            source: userId,
        };
    }
    
    try {
        return await this.callGeminiMediaProxy(file, userId);
    } catch (e) {
        this.logger.error('Erreur Proxy -> Fallback Simulation');
        return {
            verdict: 'ERREUR ANALYSE',
            confidence: 0.0,
            details: `Erreur: ${e.message}`,
            source: userId,
        };
    }
  }
}