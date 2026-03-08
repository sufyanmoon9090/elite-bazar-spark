
-- Create coupons table
CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount numeric NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT 'percent',
  min_order numeric NOT NULL DEFAULT 0,
  usage_limit integer NOT NULL DEFAULT 999,
  used integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  expires_at date NOT NULL DEFAULT '2026-12-31',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Anyone can read active coupons (needed for checkout validation)
CREATE POLICY "Anyone can read active coupons" ON public.coupons
  FOR SELECT USING (true);

-- Only admin can insert/update/delete
CREATE POLICY "Admin can insert coupons" ON public.coupons
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admin can update coupons" ON public.coupons
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admin can delete coupons" ON public.coupons
  FOR DELETE USING (is_admin());
