
-- 1. Fix review INSERT policy: verify email matches auth user + suspension check
DROP POLICY IF EXISTS "Authenticated users can add reviews" ON public.product_reviews;
CREATE POLICY "Authenticated users can add reviews"
  ON public.product_reviews FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND NOT (SELECT is_suspended FROM public.profiles WHERE id = auth.uid())
  );

-- 2. Fix orders INSERT policy: add suspension check
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND NOT (SELECT is_suspended FROM public.profiles WHERE id = auth.uid())
  );

-- 3. Add order validation trigger
CREATE OR REPLACE FUNCTION public.validate_order_data()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.total <= 0 THEN
    RAISE EXCEPTION 'Invalid order total';
  END IF;
  IF NEW.shipping_cost < 0 THEN
    RAISE EXCEPTION 'Invalid shipping cost';
  END IF;
  IF jsonb_array_length(NEW.items) = 0 THEN
    RAISE EXCEPTION 'Order must have at least one item';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_order
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.validate_order_data();

-- 4. Fix notifications SELECT policy: restrict broadcast to authenticated users only
DROP POLICY IF EXISTS "Users can read their notifications" ON public.notifications;
CREATE POLICY "Users can read their notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING ((target_user_id IS NULL) OR (target_user_id = auth.uid()));

-- 5. Enable RLS on product_reviews_public view (it's a view so we add a grant restriction instead)
-- Views don't support RLS directly. Revoke write access from anon/authenticated on the view.
REVOKE INSERT, UPDATE, DELETE ON public.product_reviews_public FROM anon, authenticated;
