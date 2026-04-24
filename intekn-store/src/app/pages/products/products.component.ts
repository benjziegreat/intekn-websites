import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/models';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategory = '';
  searchQuery = '';
  sortBy = 'newest';
  loading = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.categories = await this.productService.getCategories();
    this.route.queryParams.subscribe(async params => {
      this.selectedCategory = params['category'] ?? '';
      this.products = await this.productService.getProducts(this.selectedCategory || undefined);
      this.applyFilters();
      this.loading = false;
    });
  }

  applyFilters(): void {
    let result = [...this.products];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (this.sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (this.sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    this.filteredProducts = result;
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);
  }
}
