import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/models';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  quantity = 1;
  addedToCart = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.product = await this.productService.getProductById(id);
    }
    this.loading = false;
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addItem(this.product, this.quantity);
      this.addedToCart = true;
      setTimeout(() => this.addedToCart = false, 2000);
    }
  }

  buyNow(): void {
    if (this.product) {
      this.cartService.addItem(this.product, this.quantity);
      this.router.navigate(['/cart']);
    }
  }
}
