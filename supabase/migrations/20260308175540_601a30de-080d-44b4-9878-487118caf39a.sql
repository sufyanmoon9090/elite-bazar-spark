
CREATE OR REPLACE FUNCTION public.update_product_rating_on_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_r NUMERIC;
  cnt INT;
BEGIN
  SELECT AVG(rating), COUNT(*) INTO avg_r, cnt
  FROM public.product_reviews
  WHERE product_id = COALESCE(NEW.product_id, OLD.product_id);

  UPDATE public.products
  SET rating = COALESCE(ROUND(avg_r::numeric, 1), 0),
      reviews = COALESCE(cnt, 0)
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_product_rating ON public.product_reviews;

CREATE TRIGGER trg_update_product_rating
AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_product_rating_on_review();
