import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { BlogPost } from '../../models/models';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  posts: BlogPost[] = [];
  loading = true;

  // Demo posts shown when no Supabase data
  demoPosts: BlogPost[] = [
    { id: '1', title: 'Top 10 Shopping Tips for 2024', slug: 'top-10-shopping-tips', excerpt: 'Discover the best strategies for smart online shopping and saving money on your favorite products.', content: '', author: 'Maria Santos', image_url: '', published_at: '2024-04-01', tags: ['tips', 'shopping'] },
    { id: '2', title: 'How to Pay Safely with GCash', slug: 'pay-with-gcash', excerpt: 'A step-by-step guide to using GCash for secure online purchases at InteKN Store.', content: '', author: 'Juan dela Cruz', image_url: '', published_at: '2024-03-15', tags: ['payment', 'gcash'] },
    { id: '3', title: 'New Product Categories Available', slug: 'new-categories', excerpt: 'We\'ve expanded our product lineup! Explore electronics, fashion, home goods, and more.', content: '', author: 'Ana Reyes', image_url: '', published_at: '2024-03-01', tags: ['products', 'new'] },
    { id: '4', title: 'Free Shipping Promo Extended!', slug: 'free-shipping-promo', excerpt: 'Great news! Our free shipping on orders over ₱1,000 promo has been extended indefinitely.', content: '', author: 'Pedro Garcia', image_url: '', published_at: '2024-02-14', tags: ['promo', 'shipping'] }
  ];

  constructor(private contentService: ContentService) {}

  async ngOnInit(): Promise<void> {
    const data = await this.contentService.getBlogPosts();
    this.posts = data.length > 0 ? data : this.demoPosts;
    this.loading = false;
  }
}
