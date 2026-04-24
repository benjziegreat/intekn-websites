import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  loading = true;

  features = [
    { faIcon: 'fa-solid fa-hat-chef fa-2x', title: 'Quality Products', desc: 'We source only the best products from trusted suppliers.' },
    { faIcon: 'fa-solid fa-truck-fast fa-2x', title: 'Fast Delivery', desc: 'Nationwide delivery in 3–5 business days.' },
    { faIcon: 'fa-solid fa-cart-shopping fa-2x', title: 'Easy Ordering', desc: 'Simple checkout with your preferred payment method.' },
    { faIcon: 'fa-solid fa-headset fa-2x', title: '24/7 Support', desc: 'Our team is always here to help you.' }
  ];

  constructor(private productService: ProductService) {}

  async ngOnInit(): Promise<void> {
    this.featuredProducts = await this.productService.getFeaturedProducts();
    this.loading = false;
  }
}
