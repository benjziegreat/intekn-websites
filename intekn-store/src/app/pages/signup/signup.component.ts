import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;
  confirmationSent = false;
  resendLoading = false;
  resendSuccess = false;
  signupEmail = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      agreeTerms: [false, Validators.requiredTrue]
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { fullName, email, password } = this.form.value;
    this.signupEmail = email;
    const { error, needsConfirmation } = await this.authService.signUp(email, password, fullName);
    this.loading = false;
    if (error) {
      this.error = error.message ?? 'Registration failed. Please try again.';
    } else if (needsConfirmation) {
      this.confirmationSent = true;
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  async resendEmail(): Promise<void> {
    this.resendLoading = true;
    this.resendSuccess = false;
    const { error } = await this.authService.resendConfirmation(this.signupEmail);
    this.resendLoading = false;
    if (!error) this.resendSuccess = true;
  }
}
