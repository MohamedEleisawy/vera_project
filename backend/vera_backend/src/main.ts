// src/main.ts
import { Module, ValidationPipe } from '@nestjs/common';
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
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DIRECT_URL,
      entities: [User],
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'SECRET_SUPER_SECURISE_A_CHANGER',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // =================================================================
  // 🛡️ SÉCURITÉ : VALIDATION DES DONNÉES
  // =================================================================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // =================================================================
  // 🔓 CORS : LA CORRECTION EST ICI 👇
  // =================================================================
  app.enableCors({
    // On autorise explicitement ton frontend Angular
    origin: ['http://localhost:4200'], 
    // On autorise l'envoi de cookies/tokens si besoin
    credentials: true,
    // On autorise toutes les méthodes HTTP standards
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    // On autorise les headers que Angular envoie
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // SEED (Création Admin)
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
    }
  } catch (error) {
    console.error('❌ Erreur lors du seed :', error);
  }
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
  console.log('🚀 Serveur lancé sur http://localhost:3000');
}
bootstrap();
