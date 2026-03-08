
-- Fix orders: explicitly drop and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can read own orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can read all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;

CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin can read all orders" ON public.orders FOR SELECT USING (is_admin());
CREATE POLICY "Admin can update orders" ON public.orders FOR UPDATE USING (is_admin());
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix notifications: explicitly drop and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can read their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admin can read all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admin can insert notifications" ON public.notifications;

CREATE POLICY "Users can read their notifications" ON public.notifications FOR SELECT USING (target_user_id IS NULL OR target_user_id = auth.uid());
CREATE POLICY "Admin can read all notifications" ON public.notifications FOR SELECT USING (is_admin());
CREATE POLICY "Admin can insert notifications" ON public.notifications FOR INSERT WITH CHECK (is_admin());

-- Fix product_reviews: restrict direct SELECT to only own reviews, force use of view for reading
DROP POLICY IF EXISTS "Authenticated users can read reviews" ON public.product_reviews;
CREATE POLICY "No direct read of reviews" ON public.product_reviews FOR SELECT USING (false);
