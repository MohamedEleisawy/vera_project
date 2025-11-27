// src/main.ts
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Imports de tes fichiers locaux
import { User } from './users/user.entity';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

// =================================================================
// DÉFINITION DU MODULE PRINCIPAL
// =================================================================
@Module({
  imports: [
    // 1. Charge les variables d'environnement (.env)
    ConfigModule.forRoot(),

    // 2. Connexion à la Base de données (Supabase via TypeORM)
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DIRECT_URL, // Port 5432
      entities: [User],
      synchronize: true, // ⚠️ Dev uniquement : Met à jour les tables auto
      ssl: {
        rejectUnauthorized: false, // Obligatoire pour Supabase
      },
    }),

    // 3. Enregistre l'entité User pour pouvoir l'injecter dans les Services
    TypeOrmModule.forFeature([User]),

    // 4. Configuration du Module JWT (Sécurité)
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'SECRET_SUPER_SECURISE_A_CHANGER',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  // Enregistrement des Contrôleurs (Routes API)
  controllers: [AuthController],

  // Enregistrement des Services (Logique métier)
  providers: [AuthService],
})
class AppModule {}

// =================================================================
// DÉMARRAGE DE L'APPLICATION
// =================================================================
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🚨 CORRECTION CORS : Remplacement de app.enableCors() simple par la configuration explicite
  const allowedOrigins = ['http://localhost:4200', 'http://127.0.0.1:4200']; // Ajoute localhost:4200 (ton frontend)

  app.enableCors({
    origin: (origin, callback) => {
      // Autorise l'origine si elle est dans la liste ou si elle est undefined (app mobile, cURL)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS for origin: ${origin}`), false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Inclut OPTIONS pour la requête preflight
    allowedHeaders: 'Content-Type, Accept, Authorization', // Autorise les en-têtes nécessaires pour l'authentification
  });

  // === SEED (REMPLISSAGE) AUTOMATIQUE AU DÉMARRAGE ===
  try {
    const dataSource = app.get(DataSource);
    const userRepo = dataSource.getRepository(User);

    const adminExists = await userRepo.findOneBy({ email: 'admin@vera.com' });

    if (!adminExists) {
      console.log('🌱 Base de données vide : Création de Admin...');
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      const newAdmin = userRepo.create({
        email: 'admin@vera.com',
        nom: 'Admin',
        prenom: 'Vera',
        motDePasse: hashedPassword,
        isAdmin: true,
        actif: true,
      });
      await userRepo.save(newAdmin);
      console.log('✅ Admin créé : admin@vera.com / Password123!');
    } else {
      console.log('👌 Admin existe déjà, pas besoin de seed.');
    }
  } catch (error) {
    console.error('❌ Erreur lors du seed :', error);
  }
  // =====================================================

  await app.listen(3000);
  console.log('🚀 Serveur lancé sur http://localhost:3000');
}
bootstrap();
