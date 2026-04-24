import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Session, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { UserProfile } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private sessionSubject = new BehaviorSubject<Session | null>(null);
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);

  session$: Observable<Session | null> = this.sessionSubject.asObservable();
  profile$: Observable<UserProfile | null> = this.profileSubject.asObservable();

  constructor(private supabaseService: SupabaseService, private router: Router) {
    this.supabaseService.client.auth.getSession().then(({ data }) => {
      this.sessionSubject.next(data.session);
      if (data.session) this.loadProfile(data.session.user.id);
    });

    this.supabaseService.client.auth.onAuthStateChange((_event, session) => {
      this.sessionSubject.next(session);
      if (session) {
        this.loadProfile(session.user.id);
      } else {
        this.profileSubject.next(null);
      }
    });
  }

  get currentUser(): User | null {
    return this.sessionSubject.value?.user ?? null;
  }

  get isLoggedIn(): boolean {
    return !!this.sessionSubject.value;
  }

  async signUp(email: string, password: string, fullName: string): Promise<{ error: any; needsConfirmation?: boolean }> {
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (error) {
      const msg: string = (error.message ?? '').toLowerCase();
      if (msg.includes('rate limit') || msg.includes('email rate') || msg.includes('over_email_send_rate_limit') || error.status === 429) {
        return { error: { message: 'Too many sign-up attempts. Please wait a few minutes and try again.' } };
      }
      if (msg.includes('already registered') || msg.includes('already been registered') || msg.includes('user already exists')) {
        return { error: { message: 'An account with this email already exists. Please log in instead.' } };
      }
      if (msg.includes('invalid email')) {
        return { error: { message: 'Please enter a valid email address.' } };
      }
      if (msg.includes('password') && msg.includes('short')) {
        return { error: { message: 'Password must be at least 8 characters.' } };
      }
      return { error };
    }

    // Email confirmation required — profile will be created by DB trigger on_auth_user_created
    if (data.user && !data.session) {
      return { error: null, needsConfirmation: true };
    }

    // Email confirmation disabled — user has a session immediately, create profile
    if (data.user && data.session) {
      await this.supabaseService.client.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName
      });
    }

    return { error: null };
  }

  async resendConfirmation(email: string): Promise<{ error: any }> {
    const { error } = await this.supabaseService.client.auth.resend({
      type: 'signup',
      email
    });
    return { error };
  }

  async signIn(email: string, password: string): Promise<{ error: any }> {
    const { error } = await this.supabaseService.client.auth.signInWithPassword({ email, password });
    return { error };
  }

  async signOut(): Promise<void> {
    await this.supabaseService.client.auth.signOut();
    this.router.navigate(['/login']);
  }

  async loadProfile(userId: string): Promise<void> {
    const { data } = await this.supabaseService.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    this.profileSubject.next(data);
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<{ error: any }> {
    const userId = this.currentUser?.id;
    if (!userId) return { error: 'Not authenticated' };
    const { error } = await this.supabaseService.client
      .from('profiles')
      .update(profile)
      .eq('id', userId);
    if (!error) await this.loadProfile(userId);
    return { error };
  }

  async getProfile(): Promise<UserProfile | null> {
    const userId = this.currentUser?.id;
    if (!userId) return null;
    const { data } = await this.supabaseService.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data;
  }
}
