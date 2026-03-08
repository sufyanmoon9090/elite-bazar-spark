import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string;
  price: number;
  original_price: number | null;
  image: string;
  description: string | null;
  created_at: string;
}

export function useProductVariants(productId: string | undefined) {
  return useQuery({
    queryKey: ["product_variants", productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as unknown as ProductVariant[];
    },
    enabled: !!productId,
  });
}

export function useAddVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (variant: Omit<ProductVariant, "id" | "created_at">) => {
      const { error } = await supabase.from("product_variants").insert(variant);
      if (error) throw error;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["product_variants", v.product_id] }),
  });
}

export function useUpdateVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductVariant> & { product_id: string } }) => {
      const { product_id, ...updates } = data;
      const { error } = await supabase.from("product_variants").update(updates).eq("id", id);
      if (error) throw error;
      return product_id;
    },
    onSuccess: (productId) => qc.invalidateQueries({ queryKey: ["product_variants", productId] }),
  });
}

export function useDeleteVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, productId }: { id: string; productId: string }) => {
      const { error } = await supabase.from("product_variants").delete().eq("id", id);
      if (error) throw error;
      return productId;
    },
    onSuccess: (productId) => qc.invalidateQueries({ queryKey: ["product_variants", productId] }),
  });
}
