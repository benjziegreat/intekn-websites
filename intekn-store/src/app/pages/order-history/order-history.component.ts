import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/models';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  expandedId: string | null = null;

  constructor(private orderService: OrderService) {}

  async ngOnInit(): Promise<void> {
    this.orders = await this.orderService.getMyOrders();
    this.loading = false;
  }

  toggleExpand(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }
}
