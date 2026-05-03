import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  shipping_cost: number;
  shipping_method: string;
  address: any;
  status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export function useMyOrders(userId: string | undefined) {
  return useQuery({
    queryKey: ["my_orders", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Order[];
    },
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: ["all_orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Order[];
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: {
      user_id: string | null;
      guest_email?: string | null;
      guest_phone?: string | null;
      order_number: string;
      items: OrderItem[];
      total: number;
      shipping_cost: number;
      shipping_method: string;
      address: any;
    }) => {
      const { data, error } = await supabase.from("orders").insert({
        user_id: order.user_id,
        guest_email: order.guest_email ?? null,
        guest_phone: order.guest_phone ?? null,
        order_number: order.order_number,
        items: order.items as any,
        total: order.total,
        shipping_cost: order.shipping_cost,
        shipping_method: order.shipping_method,
        address: order.address as any,
      } as any).select().single();
      if (error) throw error;
      return data as unknown as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_orders"] });
      queryClient.invalidateQueries({ queryKey: ["all_orders"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all_orders"] });
      queryClient.invalidateQueries({ queryKey: ["my_orders"] });
    },
  });
}
