import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.html',
})
export class StatCardComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() change: string = '';
  @Input() isPositive: boolean = true;
}
