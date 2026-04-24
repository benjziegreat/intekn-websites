import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      zipCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.cartService.items.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }
    this.authService.profile$.subscribe(profile => {
      if (profile) {
        this.form.patchValue({
          fullName: profile.full_name,
          email: profile.email,
          phone: profile.phone ?? '',
          address: profile.address ?? '',
          city: profile.city ?? ''
        });
      }
    });
  }

  get tax(): number { return parseFloat((this.cartService.subtotal * 0.12).toFixed(2)); }
  get total(): number { return parseFloat((this.cartService.subtotal + this.tax).toFixed(2)); }

  submitOrder(): void {
    if (this.form.invalid) return;
    this.router.navigate(['/order-history']);
  }
}
