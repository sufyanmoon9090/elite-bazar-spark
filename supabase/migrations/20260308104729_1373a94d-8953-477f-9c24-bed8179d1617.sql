
-- Create a function to get all user profiles for admin
CREATE OR REPLACE FUNCTION public.get_all_users_for_admin()
RETURNS TABLE(id uuid, email text, full_name text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    p.id,
    COALESCE(u.email, '') as email,
    p.full_name
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  WHERE (SELECT public.is_admin())
$$;
