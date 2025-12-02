import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  // templateUrl: './footer.html',
  template: `<footer class="bg-gray-800 text-white p-4 text-center">
    <p>&copy; 2024 Vera Project. All rights reserved.</p>
  </footer>`,
  standalone: true,
})
export class Footer {}
