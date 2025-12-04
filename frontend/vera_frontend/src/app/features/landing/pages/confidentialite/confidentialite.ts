import { Component } from '@angular/core';
import { AuthRoutingModule } from '../../../auth/auth-routing-module';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confidentialite',
  imports: [AuthRoutingModule, RouterLink, CommonModule],
  templateUrl: './confidentialite.html',
  styleUrl: './confidentialite.css',
})
export class Confidentialite {}
