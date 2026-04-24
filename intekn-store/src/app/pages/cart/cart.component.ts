import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/models';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => this.items = items);
  }

  updateQty(productId: string, qty: number): void {
    this.cartService.updateQuantity(productId, qty);
  }

  remove(productId: string): void {
    this.cartService.removeItem(productId);
  }

  get tax(): number {
    return parseFloat((this.cartService.subtotal * 0.12).toFixed(2));
  }

  get total(): number {
    return parseFloat((this.cartService.subtotal + this.tax).toFixed(2));
  }
}
