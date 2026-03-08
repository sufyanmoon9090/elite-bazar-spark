
DROP VIEW IF EXISTS public.product_reviews_public;

CREATE VIEW public.product_reviews_public
WITH (security_invoker=off) AS
SELECT id, product_id, user_name, rating, comment, created_at
FROM public.product_reviews;
