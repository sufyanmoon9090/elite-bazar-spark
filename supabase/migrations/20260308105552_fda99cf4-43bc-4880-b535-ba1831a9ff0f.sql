
-- Fix 1: Orders - Change RESTRICTIVE policies to PERMISSIVE
DROP POLICY IF EXISTS "Users can read own orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can read all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;

CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin can read all orders" ON public.orders FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admin can update orders" ON public.orders FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Fix 2: Notifications - Change RESTRICTIVE policies to PERMISSIVE
DROP POLICY IF EXISTS "Users can read their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admin can read all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admin can insert notifications" ON public.notifications;

CREATE POLICY "Users can read their notifications" ON public.notifications FOR SELECT TO authenticated USING (target_user_id IS NULL OR target_user_id = auth.uid());
CREATE POLICY "Admin can read all notifications" ON public.notifications FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admin can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (is_admin());

-- Fix 3: product_reviews - Create a view to hide user_email
CREATE VIEW public.product_reviews_public
WITH (security_invoker=on) AS
  SELECT id, product_id, user_name, rating, comment, created_at
  FROM public.product_reviews;

-- Fix 4: Create user_roles table for proper admin management
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Seed existing admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'sufyan@gmail.com'
ON CONFLICT DO NOTHING;

-- Update is_admin to use roles table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- RLS for user_roles: only admin can manage
CREATE POLICY "Admin can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
