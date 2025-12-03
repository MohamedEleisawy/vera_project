import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { YoutubeAnalysisService } from './youtube-analysis.service';

@Controller('youtube-analysis') // Route: /api/youtube-analysis
export class YoutubeAnalysisController {
  private readonly logger = new Logger(YoutubeAnalysisController.name);

  constructor(private readonly youtubeService: YoutubeAnalysisService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async analyzeYoutube(@Body() body: { url: string; userId: string }) {
    this.logger.log(`Reçu requête YouTube : ${body.url}`);
    
    if (!body.url) {
        return { verdict: 'ERREUR', details: 'URL manquante.' };
    }

    return await this.youtubeService.analyzeYoutubeVideo(body.url, body.userId);
  }
}