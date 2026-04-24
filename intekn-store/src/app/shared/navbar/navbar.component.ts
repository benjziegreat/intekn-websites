import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  cartCount = 0;
  isLoggedIn = false;
  userName = '';
  isScrolled = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 60;
  }

  constructor(public authService: AuthService, private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.cartCount = items.reduce((s, i) => s + i.quantity, 0);
    });
    this.authService.session$.subscribe(session => {
      this.isLoggedIn = !!session;
    });
    this.authService.profile$.subscribe(profile => {
      this.userName = profile?.full_name?.split(' ')[0] ?? '';
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  signOut(): void {
    this.authService.signOut();
  }
}
