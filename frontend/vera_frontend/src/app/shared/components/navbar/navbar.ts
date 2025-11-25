import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
<<<<<<< HEAD
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

}
=======
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
>>>>>>> 92e788eedcaf6b21e41d4f9117436408d6185d2f
