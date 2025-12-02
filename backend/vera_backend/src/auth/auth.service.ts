// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity'; // Assure-toi du bon chemin

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // 1. INSCRIPTION
  async register(userData: Partial<User>): Promise<User> {
    const { email, motDePasse, nom } = userData;

    // Vérifier si l'email existe déjà
    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const newUser = this.usersRepository.create({
      ...userData,
      motDePasse: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  // 2. VALIDATION (LOGIN)
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOneBy({ email });
    
    // Si user existe et mot de passe correspond
    if (user && (await bcrypt.compare(pass, user.motDePasse))) {
      const { motDePasse, ...result } = user; // On retire le mot de passe du résultat
      return result;
    }
    return null;
  }

  // 3. GÉNÉRATION DU TOKEN JWT
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, isAdmin: user.isAdmin };
    return {
      access_token: this.jwtService.sign(payload), // Crée le token crypté
      user: user,
    };
  }
}