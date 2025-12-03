import { Module } from '@nestjs/common';
import { YoutubeAnalysisController } from './youtube-analysis.controller';
import { YoutubeAnalysisService } from './youtube-analysis.service';
// On importe le module Analysis pour avoir accès à son Service (VERA/Gemini)
import { AnalysisModule } from './analysis.module'; 

@Module({
  imports: [AnalysisModule], 
  controllers: [YoutubeAnalysisController],
  providers: [YoutubeAnalysisService],
})
// 👇 C'est ici que c'était "AnalysisModule" par erreur
export class YoutubeAnalysisModule {}