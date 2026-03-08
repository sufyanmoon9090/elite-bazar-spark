
-- Blog posts table
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blog posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Admin can insert blog posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin can update blog posts" ON public.blog_posts FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admin can delete blog posts" ON public.blog_posts FOR DELETE TO authenticated USING (public.is_admin());

-- Add in_stock to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS in_stock boolean NOT NULL DEFAULT true;
