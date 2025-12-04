// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// 1. Import du module Throttler
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core'; // Pour appliquer le garde globalement

// --- Imports des Modules de Configuration Globale ---
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

// --- Imports des Modules Locaux ---
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';

// 1. Le module d'analyse principal
import { AnalysisModule } from './analysis/analysis.module';

// 2. Le module YouTube
import { YoutubeAnalysisModule } from './analysis/youtube-analysis.module';

@Module({
  imports: [
    // 🎯 0. CONFIGURATION DU RATE LIMITING (10 requêtes max par minute par IP)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Durée de vie du compteur (60 000 ms = 1 minute)
        limit: 10,  // Nombre maximum de requêtes autorisées par fenêtre de temps
      },
    ]),

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
    YoutubeAnalysisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 🎯 Application globale du ThrottlerGuard à toute l'application
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
