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
  // ⚠️ FIX N°1 : Je commente. Le Frontend appelle directement /auth, pas /api/auth.
  // app.setGlobalPrefix('api'); 

  // 2. Augmentation de la taille limite des requêtes (CRITIQUE pour l'envoi d'images/audio)
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // 3. Validation des données entrantes (DTO)
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // 4. Configuration CORS (LISTE BLANCHE MISE À JOUR)
  app.enableCors({
    origin: (origin, callback) => {
      // ✅ FIX N°2 : J'ai mis à jour cette liste avec TON nouveau domaine Vercel.
      const allowedOrigins = [
        'http://localhost:4200',
        'http://127.0.0.1:4200',
        'https://projetvera2025.vercel.app', // TON DOMAINE VERCEL ACTUEL
        'https://vera-pwa.web.app', // Placeholder
        'https://vera-project-3cyt.vercel.app', // Ancien domaine
      ];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️ CORS bloqué pour l'origine : ${origin}`);
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // 5. Seed (Création automatique de l'Admin si la base est vide)
  try {
    const dataSource = app.get(DataSource);
    const userRepo = dataSource.getRepository(User);

    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }

    const adminExists = await userRepo.findOneBy({ email: 'admin@vera.com' });

    if (!adminExists) {
      console.log('🌱 Base de données : Création du compte Admin par défaut...');
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
  }

  // 6. Démarrage du serveur
  // ✅ FIX N°3 : On utilise process.env.PORT pour s'adapter à Railway ou Render
  await app.listen(process.env.PORT || 3000); 
  
  console.log(` 
  🚀 --------------------------------------------------- 
  🚀 SERVEUR VERA BACKEND DÉMARRÉ
  🚀 URL : http://localhost:${process.env.PORT || 3000} (ou port Railway)
  🚀 --------------------------------------------------- 
  `);
}

bootstrap();
