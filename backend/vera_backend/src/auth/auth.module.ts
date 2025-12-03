import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/user.entity'; // Vérifie bien le chemin vers ton entité User

@Module({
  imports: [
    // 👇 C'EST CETTE LIGNE QUI MANQUAIT !
    // Elle permet d'injecter @InjectRepository(User) dans AuthService
    TypeOrmModule.forFeature([User]), 
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}