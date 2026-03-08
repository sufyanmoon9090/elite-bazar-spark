import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  address: string | null;
  updated_at: string;
}

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Profile> & { id: string }) => {
      const { error } = await supabase
        .from("profiles")
        .upsert({ id, ...updates, updated_at: new Date().toISOString() })
      if (error) throw error;
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profile", variables.id] });
    },
  });
}
