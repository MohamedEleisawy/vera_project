import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './components.html',
  styleUrl: './components.css',
})
export class About {}
