// src/main.ts (Version FUSIONNÉE et OPTIMISÉE)

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as bodyParser from 'body-parser'; // Nécessaire pour augmenter la limite d'upload

// On importe le vrai module racine (fichier app.module.ts)
import { AppModule } from './app.module';
import { User } from './users/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Préfixe API Global
  // Toutes les routes commenceront par /api (ex: /api/analyze, /api/auth/login)
  app.setGlobalPrefix('api');

  // 2. Augmentation de la taille limite des requêtes (CRITIQUE pour l'envoi d'images/audio)
  // Par défaut, NestJS bloque à 100kb. On passe à 50mb.
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // 3. Validation des données entrantes (DTO)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transforme les JSON en objets typés
      whitelist: true, // Rejette les champs non autorisés
      forbidNonWhitelisted: true, // Signale une erreur si champ inconnu
    }),
  );

  // 4. Configuration CORS (Pour autoriser Angular ET le développement local)
  app.enableCors({
    origin: (origin, callback) => {
      // Liste blanche des domaines autorisés
      const allowedOrigins = [
        'http://localhost:4200', // Angular local
        'http://127.0.0.1:4200', // Angular local (variante IP)
        'https://vera-pwa.web.app', // (Exemple) Votre future URL de prod si connue
      ];
      // On autorise si l'origine est dans la liste OU si pas d'origine (ex: Postman ou Bot Telegram en local)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️ CORS bloqué pour l'origine : ${origin}`);
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Autorise les cookies/headers sécurisés
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // 5. Seed (Création automatique de l'Admin si la base est vide)
  try {
    const dataSource = app.get(DataSource);
    const userRepo = dataSource.getRepository(User);

    // Vérification de la connexion DB avant de faire une requête
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    const adminExists = await userRepo.findOneBy({ email: 'admin@vera.com' });

    if (!adminExists) {
      console.log('🌱Base de données : Création du compte Admin par défaut...');
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      const newAdmin = userRepo.create({
        email: 'admin@vera.com',
        nom: 'Admin',
        prenom: 'System',
        motDePasse: hashedPassword,
        isAdmin: true,
        actif: true,
      });
      await userRepo.save(newAdmin);
      console.log('✅ Admin créé avec succès : admin@vera.com / Password123!');
    } else {
      console.log('👌 Compte Admin déjà présent.');
    }
  } catch (error) {
    console.error('❌ Erreur lors du Seed (Création Admin) :', error.message);
    // On ne bloque pas le démarrage du serveur pour autant
  }

  // 6. Démarrage du serveur
  await app.listen(3000);
  console.log(`
  🚀 ---------------------------------------------------
  🚀 SERVEUR VERA BACKEND DÉMARRÉ
  🚀 URL : http://localhost:3000
  🚀 API : http://localhost:3000/api
  🚀 ---------------------------------------------------
  `);
}

bootstrap();
