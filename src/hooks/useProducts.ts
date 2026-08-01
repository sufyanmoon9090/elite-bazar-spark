import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/mockData";

interface DbProduct {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image: string;
  images: string[] | null;
  category: string;
  rating: number;
  reviews: number;
  badge: string | null;
  description: string | null;
  /** ADMIN ONLY — supplier sourcing link */
  supplier_url?: string | null;
}

function mapDbToProduct(db: DbProduct): Product {
  return {
    id: db.id,
    name: db.name,
    price: db.price,
    originalPrice: db.original_price ?? undefined,
    image: db.image,
    images: (db.images as string[]) ?? undefined,
    category: db.category,
    rating: db.rating,
    reviews: db.reviews,
    badge: db.badge ?? undefined,
    description: db.description ?? undefined,
    supplierUrl: db.supplier_url ?? undefined,
  };
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as DbProduct[]).map(mapDbToProduct);
    },
  });
}

export function useAddProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      const row = {
        name: product.name,
        price: product.price,
        original_price: product.originalPrice ?? null,
        image: product.image,
        images: (product.images ?? []) as unknown as import("@/integrations/supabase/types").Json,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews,
        badge: product.badge ?? null,
        description: product.description ?? null,
        supplier_url: product.supplierUrl ?? null,
      };
      const { error } = await supabase.from("products").insert(row);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      const updates: Record<string, unknown> = {};
      if (data.name !== undefined) updates.name = data.name;
      if (data.price !== undefined) updates.price = data.price;
      if (data.originalPrice !== undefined) updates.original_price = data.originalPrice;
      if (data.image !== undefined) updates.image = data.image;
      if (data.images !== undefined) updates.images = data.images;
      if (data.category !== undefined) updates.category = data.category;
      if (data.rating !== undefined) updates.rating = data.rating;
      if (data.reviews !== undefined) updates.reviews = data.reviews;
      if (data.badge !== undefined) updates.badge = data.badge;
      if (data.description !== undefined) updates.description = data.description;
      if (data.supplierUrl !== undefined) updates.supplier_url = data.supplierUrl || null;

      const { error } = await supabase.from("products").update(updates as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
