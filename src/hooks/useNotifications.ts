import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  target_user_id?: string | null;
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data || []) as Notification[];
    },
  });
}

export function useUnreadCount(userId: string | undefined) {
  return useQuery({
    queryKey: ["notification_reads", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data: allNotifs } = await supabase
        .from("notifications")
        .select("id");
      const { data: reads } = await supabase
        .from("notification_reads")
        .select("notification_id")
        .eq("user_id", userId!);
      const readIds = new Set((reads || []).map((r: any) => r.notification_id));
      return (allNotifs || []).filter((n: any) => !readIds.has(n.id)).length;
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notificationId, userId }: { notificationId: string; userId: string }) => {
      const { error } = await supabase
        .from("notification_reads")
        .upsert({ notification_id: notificationId, user_id: userId }, { onConflict: "notification_id,user_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification_reads"] });
    },
  });
}

export function useSendNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, message, target_user_id }: { title: string; message: string; target_user_id?: string | null }) => {
      const insertData: Record<string, unknown> = { title, message };
      if (target_user_id) {
        insertData.target_user_id = target_user_id;
      }
      const { error } = await supabase.from("notifications").insert(insertData as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useAllProfiles() {
  return useQuery({
    queryKey: ["all_profiles"],
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as any)("get_all_users_for_admin");
      if (error) throw error;
      return (data || []) as { id: string; email: string; full_name: string | null }[];
    },
  });
}
