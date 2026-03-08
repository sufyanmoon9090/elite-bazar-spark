
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  original_price numeric,
  image text NOT NULL DEFAULT '',
  images jsonb DEFAULT '[]'::jsonb,
  category text NOT NULL DEFAULT '',
  rating numeric NOT NULL DEFAULT 0,
  reviews integer NOT NULL DEFAULT 0,
  badge text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Everyone can read products
CREATE POLICY "Anyone can read products" ON public.products FOR SELECT USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Admin can insert products" ON public.products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin can update products" ON public.products FOR UPDATE USING (is_admin());
CREATE POLICY "Admin can delete products" ON public.products FOR DELETE USING (is_admin());

-- Seed with initial data
INSERT INTO public.products (name, price, original_price, image, images, category, rating, reviews, badge) VALUES
('Premium Wireless Headphones', 299.99, 399.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80","https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80","https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&q=80"]', 'electronics', 4.8, 342, 'Best Seller'),
('Smart Watch Ultra', 449.99, 549.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80","https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&q=80","https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80"]', 'gadgets', 4.9, 567, 'New'),
('Designer Leather Bag', 189.99, 249.99, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', '["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80","https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80"]', 'fashion', 4.7, 213, 'Trending'),
('Minimalist Desk Lamp', 79.99, NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', '[]', 'home', 4.5, 189, NULL),
('Luxury Perfume Set', 129.99, 179.99, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80', '["https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80","https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80"]', 'beauty', 4.6, 421, 'Sale'),
('Wireless Charging Pad', 49.99, NULL, 'https://images.unsplash.com/photo-1586953208270-767889fa9237?w=400&q=80', '[]', 'accessories', 4.4, 156, NULL),
('Noise Cancelling Earbuds', 199.99, 259.99, 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&q=80', '["https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&q=80","https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80"]', 'electronics', 4.7, 298, 'Hot Deal'),
('Handcrafted Ceramic Vase', 64.99, NULL, 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&q=80', '[]', 'home', 4.3, 87, NULL);
