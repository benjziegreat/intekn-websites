import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { Order, OrderItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  async createOrder(shippingAddress: string, paymentMethod: string): Promise<{ data: Order | null; error: any }> {
    const userId = this.authService.currentUser?.id;
    if (!userId) return { data: null, error: 'Not authenticated' };

    const items = this.cartService.items;
    const subtotal = this.cartService.subtotal;
    const tax = parseFloat((subtotal * 0.12).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));

    const orderItems: OrderItem[] = items.map(i => ({
      product_id: i.product.id,
      product_name: i.product.name,
      quantity: i.quantity,
      unit_price: i.product.price,
      subtotal: i.product.price * i.quantity
    }));

    const { data, error } = await this.supabaseService.client
      .from('orders')
      .insert({
        user_id: userId,
        items: orderItems,
        subtotal,
        tax,
        total,
        status: 'pending',
        payment_method: paymentMethod,
        shipping_address: shippingAddress
      })
      .select()
      .single();

    return { data, error };
  }

  async updateOrderStatus(orderId: string, status: string, paymentRef?: string): Promise<{ error: any }> {
    const { error } = await this.supabaseService.client
      .from('orders')
      .update({ status, payment_ref: paymentRef })
      .eq('id', orderId);
    return { error };
  }

  async getMyOrders(): Promise<Order[]> {
    const userId = this.authService.currentUser?.id;
    if (!userId) return [];
    const { data } = await this.supabaseService.client
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data ?? [];
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data } = await this.supabaseService.client
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    return data;
  }
}
