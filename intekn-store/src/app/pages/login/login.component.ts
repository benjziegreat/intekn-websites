import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;
  returnUrl = '/dashboard';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/dashboard';
  }

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { email, password } = this.form.value;
    const { error } = await this.authService.signIn(email, password);
    this.loading = false;
    if (error) {
      const msg: string = (error.message ?? '').toLowerCase();
      if (msg.includes('email not confirmed') || msg.includes('not confirmed')) {
        this.error = 'Please confirm your email address first. Check your inbox (and spam folder) for the confirmation link.';
      } else if (msg.includes('invalid login') || msg.includes('invalid credentials') || msg.includes('wrong password')) {
        this.error = 'Incorrect email or password. Please try again.';
      } else if (msg.includes('too many') || error.status === 429) {
        this.error = 'Too many login attempts. Please wait a few minutes and try again.';
      } else {
        this.error = error.message ?? 'Login failed. Please try again.';
      }
    } else {
      this.router.navigateByUrl(this.returnUrl);
    }
  }
}
