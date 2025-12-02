import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [],
  // templateUrl: './hero.html',
  template: `<section class="hero bg-blue-600 text-white p-8 text-center">
    <h1 class="text-4xl font-bold mb-4">Welcome to Vera Project</h1>
    <p class="text-lg">Your gateway to seamless project management.</p>
  </section>`,
  standalone: true,
})
export class Hero {}
