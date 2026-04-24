import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BlogPost, ContactMessage } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ContentService {
  constructor(private supabaseService: SupabaseService) {}

  async getBlogPosts(): Promise<BlogPost[]> {
    const { data } = await this.supabaseService.client
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });
    return data ?? [];
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data } = await this.supabaseService.client
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    return data;
  }

  async submitContactMessage(msg: ContactMessage): Promise<{ error: any }> {
    const { error } = await this.supabaseService.client
      .from('contact_messages')
      .insert(msg);
    return { error };
  }
}
