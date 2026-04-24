import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Product } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private supabaseService: SupabaseService) {}

  async getProducts(category?: string): Promise<Product[]> {
    let query = this.supabaseService.client.from('products').select('*').order('created_at', { ascending: false });
    if (category) query = query.eq('category', category);
    const { data } = await query;
    return data ?? [];
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const { data } = await this.supabaseService.client
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(6);
    return data ?? [];
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data } = await this.supabaseService.client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  }

  async getCategories(): Promise<string[]> {
    const { data } = await this.supabaseService.client
      .from('products')
      .select('category');
    const categories = [...new Set((data ?? []).map((p: any) => p.category))];
    return categories;
  }
}
