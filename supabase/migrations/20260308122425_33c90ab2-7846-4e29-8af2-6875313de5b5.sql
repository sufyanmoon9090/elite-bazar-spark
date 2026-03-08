
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  image TEXT NOT NULL DEFAULT '',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Admin can insert variants" ON public.product_variants FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin can update variants" ON public.product_variants FOR UPDATE USING (is_admin());
CREATE POLICY "Admin can delete variants" ON public.product_variants FOR DELETE USING (is_admin());
