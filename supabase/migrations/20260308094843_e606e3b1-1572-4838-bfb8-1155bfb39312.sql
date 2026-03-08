
-- Site settings table for landing page customization
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  section_data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Product reviews table
CREATE TABLE public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Site settings: anyone can read, no one can write via client (admin writes via service role or we'll handle in code)
CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert site settings" ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update site settings" ON public.site_settings FOR UPDATE USING (true);

-- Product reviews: anyone can read, authenticated users can insert
CREATE POLICY "Anyone can read reviews" ON public.product_reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Insert default site settings
INSERT INTO public.site_settings (section_key, section_data) VALUES
('hero', '{"badge": "New Collection 2026", "title": "Elite Bazar", "subtitle": "Discover premium products curated for the modern lifestyle. Quality meets elegance in every purchase.", "button1": "Shop Now", "button2": "Browse Categories", "stats": [{"value": "10K+", "label": "Products"}, {"value": "50K+", "label": "Happy Customers"}, {"value": "99%", "label": "Satisfaction"}]}'),
('categories_heading', '{"title": "Shop by", "highlight": "Category", "subtitle": "Find exactly what you need"}'),
('deals', '{"badge": "Flash Sale", "title": "Up to", "highlight": "70% Off", "subtitle": "Premium electronics & gadgets. Limited time only!"}'),
('why_choose_us', '{"title": "Why Choose", "highlight": "Elite Bazar", "features": [{"title": "Fast Delivery", "desc": "Free shipping on orders over $50"}, {"title": "Secure Payment", "desc": "100% protected transactions"}, {"title": "Easy Returns", "desc": "30-day hassle-free returns"}, {"title": "Premium Quality", "desc": "Curated top-tier products"}, {"title": "24/7 Support", "desc": "Always here to help"}]}'),
('testimonials_heading', '{"title": "What Our", "highlight": "Customers Say"}'),
('blog_heading', '{"title": "Shopping", "highlight": "Guides", "subtitle": "Tips, trends, and product insights"}'),
('newsletter', '{"title": "Stay", "highlight": "Updated", "subtitle": "Subscribe to get exclusive deals, new arrivals, and insider-only discounts.", "button": "Subscribe"}');
