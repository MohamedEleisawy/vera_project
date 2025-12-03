// src/analysis/analysis.module.ts (Vérification)

import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, 
  ],
  controllers: [AnalysisController],
  providers: [AnalysisService],
  // 🎯 CORRECTION/VERIFICATION CRITIQUE : Il faut exporter le service pour qu'il soit vu par YoutubeAnalysisModule
  exports: [AnalysisService], 
})
export class AnalysisModule {}