
-- Drop and recreate the view WITHOUT security_invoker so it bypasses base table RLS
DROP VIEW IF EXISTS public.product_reviews_public;
CREATE VIEW public.product_reviews_public AS
  SELECT id, product_id, user_name, rating, comment, created_at
  FROM public.product_reviews;

-- Grant select on the view to anon and authenticated
GRANT SELECT ON public.product_reviews_public TO anon, authenticated;
