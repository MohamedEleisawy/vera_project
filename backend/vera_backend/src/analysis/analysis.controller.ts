// src/analysis/analysis.controller.ts (Fichier COMPLET - Confirmé)

import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, InternalServerErrorException, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; 
import { AnalysisService } from './analysis.service';
import { AnalyzeDto } from './dto/analyze.dto';

const controllerLogger = new Logger('AnalysisController');

@Controller('analyze') 
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  // 1. ENDPOINT TEXTE
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post() 
  @HttpCode(HttpStatus.OK)
  async analyzeContent(@Body() analyzeDto: AnalyzeDto) {
    return await this.analysisService.analyzeContent(analyzeDto);
  }

  // 2. ENDPOINT MÉDIA (Images, Vidéos, Audio)
  @Post('media') 
  @UseInterceptors(FileInterceptor('file')) 
  @HttpCode(HttpStatus.OK)
  async analyzeMedia(
    @UploadedFile() file: any, // Utilisation de 'any' pour éviter les soucis de typage Multer stricts
    @Body('userId') userId: string,
  ) {
    if (!file) {
      throw new InternalServerErrorException('Aucun fichier reçu (champ "file" manquant).');
    }

    controllerLogger.log(`Media reçu : ${file.originalname} | Type: ${file.mimetype}`);

    // Le service gère maintenant tout (y compris l'audio via Gemini)
    return await this.analysisService.analyzeMediaFile(file, userId);
  }
}