// src/app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// --- Imports des Modules de Configuration Globale ---
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// --- Imports des Modules Locaux ---
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';

// 1. Le module d'analyse principal
import { AnalysisModule } from './analysis/analysis.module';

// 2. 🎯 CORRECTION ICI : Le module YouTube est maintenant DANS le dossier analysis
import { YoutubeAnalysisModule } from './analysis/youtube-analysis.module';

@Module({
  imports: [
    // 1. Charge les variables d'environnement (.env)
    ConfigModule.forRoot(),

    // 2. Connexion à la Base de données
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DIRECT_URL,
      entities: [User],
      synchronize: true, // ⚠️ DEV SEULEMENT
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    // 3. Enregistre l'entité User
    TypeOrmModule.forFeature([User]),

    // 4. Configuration du Module JWT
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'SECRET_SUPER_SECURISE_A_CHANGER',
      signOptions: { expiresIn: '1d' },
    }),

    // 5. Modules Locaux
    AuthModule,
    AnalysisModule,
    YoutubeAnalysisModule, // Charge le module YouTube corrigé
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
