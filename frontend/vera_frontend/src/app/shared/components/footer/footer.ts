import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './footer.html',
})
export class Footer {
  currentYear = new Date().getFullYear();
}