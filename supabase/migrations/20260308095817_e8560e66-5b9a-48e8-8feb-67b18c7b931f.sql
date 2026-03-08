
-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_number TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC NOT NULL DEFAULT 0,
  shipping_cost NUMERIC NOT NULL DEFAULT 0,
  shipping_method TEXT NOT NULL DEFAULT 'standard',
  address JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL DEFAULT 'COD',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can read their own orders
CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- Authenticated users can insert their own orders
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only admin can update orders (status changes)
CREATE POLICY "Admin can update orders" ON public.orders FOR UPDATE USING (public.is_admin());

-- Admin can read all orders
CREATE POLICY "Admin can read all orders" ON public.orders FOR SELECT USING (public.is_admin());
