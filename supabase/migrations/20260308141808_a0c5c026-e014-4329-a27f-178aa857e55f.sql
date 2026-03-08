
DROP FUNCTION IF EXISTS public.get_all_users_for_admin();

CREATE FUNCTION public.get_all_users_for_admin()
RETURNS TABLE(id uuid, email text, full_name text, is_suspended boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    p.id,
    COALESCE(u.email, '') as email,
    p.full_name,
    p.is_suspended
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  WHERE (SELECT public.is_admin())
$$;
