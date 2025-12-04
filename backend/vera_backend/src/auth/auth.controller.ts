// src/auth/auth.controller.ts



import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
// Import pour exclure le rate limiting
import { SkipThrottle } from '@nestjs/throttler'; 

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 🎯 EXCLUSION : Permet d'appeler cette route sans être limité par l'IP
  @SkipThrottle() 
  @Post('login')
  async login(@Body() body: any) {
    const user= await this.authService.validateUser(body.email, body.motDePasse);
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
    return this.authService.login(user);
  }

  // 🎯 EXCLUSION : Permet d'appeler cette route sans être limité par l'IP
  @SkipThrottle()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(body);
    return { message: 'Inscription réussie', userId: user.id };
  }
}