
-- Fix search_path on validate_order_data function
CREATE OR REPLACE FUNCTION public.validate_order_data()
RETURNS trigger LANGUAGE plpgsql
SET search_path = public
AS $$
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
