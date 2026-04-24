export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_qty: number;
  category: string;
  image_url: string;
  featured: boolean;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id?: string;
  user_id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method?: string;
  payment_ref?: string;
  shipping_address: string;
  created_at?: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image_url: string;
  published_at: string;
  tags: string[];
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}


