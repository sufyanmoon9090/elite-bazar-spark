import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductReview {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ["product_reviews", productId],
    queryFn: async () => {
      // Use the public view that excludes user_email
      const { data, error } = await supabase
        .from("product_reviews_public")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as ProductReview[];
    },
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: { product_id: string; user_email: string; user_name: string; rating: number; comment: string }) => {
      const { error } = await supabase.from("product_reviews").insert(review);
      if (error) throw error;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product_reviews", variables.product_id] });
    },
  });
}
