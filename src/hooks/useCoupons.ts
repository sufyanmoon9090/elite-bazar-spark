import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: string;
  min_order: number;
  usage_limit: number;
  used: number;
  active: boolean;
  expires_at: string;
  created_at: string;
}

export const useCoupons = () =>
  useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Coupon[];
    },
  });

export const useCreateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (coupon: Omit<Coupon, "id" | "created_at" | "used">) => {
      const { error } = await supabase.from("coupons").insert(coupon);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
};

export const useUpdateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Coupon> & { id: string }) => {
      const { error } = await supabase.from("coupons").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
};

export const useDeleteCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
};

export const useValidateCoupon = () =>
  useMutation({
    mutationFn: async ({ code, orderTotal }: { code: string; orderTotal: number }) => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("active", true)
        .single();
      if (error || !data) throw new Error("Invalid coupon code");
      const coupon = data as Coupon;
      if (new Date(coupon.expires_at) < new Date()) throw new Error("Coupon has expired");
      if (coupon.used >= coupon.usage_limit) throw new Error("Coupon usage limit reached");
      if (orderTotal < coupon.min_order) throw new Error(`Minimum order Rs. ${coupon.min_order} required`);
      return coupon;
    },
  });

// Increment used count after order
export const useIncrementCouponUsage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (couponId: string) => {
      const { data: coupon } = await supabase.from("coupons").select("used").eq("id", couponId).single();
      if (!coupon) return;
      await supabase.from("coupons").update({ used: (coupon as any).used + 1 }).eq("id", couponId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
};
