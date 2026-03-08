
-- Fix overly permissive policies on site_settings
DROP POLICY "Anyone can insert site settings" ON public.site_settings;
DROP POLICY "Anyone can update site settings" ON public.site_settings;

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (SELECT email FROM auth.users WHERE id = auth.uid()) = 'sufyan@gmail.com'
$$;

-- Only admin can insert/update site settings
CREATE POLICY "Admin can insert site settings" ON public.site_settings FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin can update site settings" ON public.site_settings FOR UPDATE USING (public.is_admin());
