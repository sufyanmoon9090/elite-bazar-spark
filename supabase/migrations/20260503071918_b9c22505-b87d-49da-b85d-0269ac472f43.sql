
ALTER TABLE public.product_reviews ALTER COLUMN user_email DROP NOT NULL;

DROP POLICY IF EXISTS "Authenticated users can add reviews" ON public.product_reviews;

CREATE POLICY "Anyone can add reviews"
ON public.product_reviews
FOR INSERT
TO public
WITH CHECK (
  (
    auth.uid() IS NOT NULL
    AND user_email = ((SELECT email FROM auth.users WHERE id = auth.uid()))::text
    AND NOT (SELECT is_suspended FROM public.profiles WHERE id = auth.uid())
  )
  OR
  (
    auth.uid() IS NULL
    AND char_length(coalesce(user_name, '')) BETWEEN 2 AND 60
    AND char_length(coalesce(comment, '')) BETWEEN 1 AND 2000
    AND rating BETWEEN 1 AND 5
  )
);
