import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Order, UserProfile } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  profile: UserProfile | null = null;
  recentOrders: Order[] = [];
  activeTab = 'overview';
  editForm: FormGroup;
  saving = false;
  saveSuccess = false;
  totalSpent = 0;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      full_name: ['', Validators.required],
      phone: [''],
      address: [''],
      city: [''],
      country: ['']
    });
  }

  async ngOnInit(): Promise<void> {
    this.authService.profile$.subscribe(p => {
      this.profile = p;
      if (p) this.editForm.patchValue(p);
    });
    this.recentOrders = (await this.orderService.getMyOrders()).slice(0, 5);
    this.totalSpent = this.recentOrders.reduce((sum, o) => sum + o.total, 0);
  }

  async saveProfile(): Promise<void> {
    this.saving = true;
    await this.authService.updateProfile(this.editForm.value);
    this.saving = false;
    this.saveSuccess = true;
    setTimeout(() => this.saveSuccess = false, 3000);
  }
}
