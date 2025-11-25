import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.html',
})
export class Card {
  @Input() title?: string = '';
  @Input() subtitle?: string = '';
  @Input() imageUrl: string = '';
  @Input() imageAlt: string = 'Card image';
}