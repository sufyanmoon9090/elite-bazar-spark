
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS guest_email text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS guest_phone text;

DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;

CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
TO public
WITH CHECK (
  (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
    AND NOT (SELECT is_suspended FROM public.profiles WHERE id = auth.uid())
  )
  OR
  (
    user_id IS NULL
    AND guest_email IS NOT NULL
    AND guest_phone IS NOT NULL
    AND char_length(guest_email) >= 5
    AND char_length(guest_phone) >= 7
    AND guest_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  )
);
