import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Product } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  get count(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  get subtotal(): number {
    return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  addItem(product: Product, quantity = 1): void {
    const current = this.items;
    const idx = current.findIndex(i => i.product.id === product.id);
    if (idx >= 0) {
      current[idx].quantity += quantity;
    } else {
      current.push({ product, quantity });
    }
    this.saveCart(current);
    this.itemsSubject.next([...current]);
  }

  updateQuantity(productId: string, quantity: number): void {
    const current = this.items.map(i =>
      i.product.id === productId ? { ...i, quantity } : i
    ).filter(i => i.quantity > 0);
    this.saveCart(current);
    this.itemsSubject.next(current);
  }

  removeItem(productId: string): void {
    const current = this.items.filter(i => i.product.id !== productId);
    this.saveCart(current);
    this.itemsSubject.next(current);
  }

  clearCart(): void {
    localStorage.removeItem('cart');
    this.itemsSubject.next([]);
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
  }

  private loadCart(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem('cart') ?? '[]');
    } catch {
      return [];
    }
  }
}
