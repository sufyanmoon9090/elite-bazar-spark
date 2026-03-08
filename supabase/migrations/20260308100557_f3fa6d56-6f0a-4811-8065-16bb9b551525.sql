
-- 1. Add length constraints to product_reviews
ALTER TABLE public.product_reviews
  ADD CONSTRAINT comment_length CHECK (char_length(comment) <= 2000);

ALTER TABLE public.product_reviews
  ADD CONSTRAINT username_length CHECK (char_length(user_name) <= 100);

-- 2. Restrict SELECT on product_reviews to authenticated users only
DROP POLICY "Anyone can read reviews" ON public.product_reviews;
CREATE POLICY "Authenticated users can read reviews"
  ON public.product_reviews FOR SELECT TO authenticated
  USING (true);
