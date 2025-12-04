// src/app/features/landing/landing-module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing-module';
import { InputComponent } from '../../shared/components/input/input.component';
import { LucideAngularModule, FileText } from 'lucide-angular';

@NgModule({
  imports: [
    CommonModule,
    LandingRoutingModule,
    InputComponent,
    LucideAngularModule.pick({ FileText }),
  ],
})
export class LandingModule {}
