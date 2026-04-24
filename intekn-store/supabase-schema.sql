-- =============================================
-- InteKN Store - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE (extends auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Philippines',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stock_qty INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  category TEXT NOT NULL,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Products are publicly readable
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by all"
  ON public.products FOR SELECT
  USING (true);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10,2) NOT NULL,
  tax NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT,
  payment_ref TEXT,
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Users can only view/manage own orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- BLOG POSTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  image_url TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  tags TEXT[] DEFAULT '{}'
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog posts are viewable by all"
  ON public.blog_posts FOR SELECT
  USING (true);

-- =============================================
-- CONTACT MESSAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- =============================================
-- SAMPLE DATA - Products
-- =============================================
INSERT INTO public.products (name, description, price, stock_qty, category, image_url, featured) VALUES
  ('Wireless Bluetooth Earbuds', 'Premium sound quality with active noise cancellation. 30-hour battery life.', 1499.00, 50, 'Electronics', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', true),
  ('Smart Watch Series 5', 'Track fitness, notifications, and more. Water resistant to 50 meters.', 3999.00, 30, 'Electronics', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', true),
  ('Ergonomic Office Chair', 'Lumbar support, adjustable height, and breathable mesh back for long hours.', 8500.00, 15, 'Furniture', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', true),
  ('Running Shoes Pro', 'Lightweight and responsive for daily training and long runs.', 2899.00, 40, 'Sports', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', true),
  ('Insulated Water Bottle', 'Keeps drinks cold 24hrs or hot 12hrs. BPA-free stainless steel.', 899.00, 100, 'Sports', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', true),
  ('Laptop Stand Adjustable', 'Aluminum alloy, compatible with all laptops 10-17 inches. Foldable.', 1200.00, 60, 'Electronics', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', true),
  ('Cotton Crew Neck T-Shirt', '100% organic cotton, available in 8 colors. Machine washable.', 399.00, 200, 'Fashion', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', false),
  ('Stainless Steel Cookware Set', '5-piece non-stick set with glass lids. Dishwasher safe.', 4599.00, 20, 'Kitchen', 'https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=400', false);

-- =============================================
-- TRIGGER: Auto-create profile on user signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Customer')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
