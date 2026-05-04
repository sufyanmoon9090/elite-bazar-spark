import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSiteSettings(sectionKey: string) {
  return useQuery({
    queryKey: ["site_settings", sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("section_data")
        .eq("section_key", sectionKey)
        .maybeSingle();
      if (error) throw error;
      return data?.section_data as Record<string, any> | null;
    },
  });
}

export function useAllSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("section_key, section_data");
      if (error) throw error;
      const map: Record<string, any> = {};
      data?.forEach((row: any) => { map[row.section_key] = row.section_data; });
      return map;
    },
  });
}

export function useUpdateSiteSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, data }: { key: string; data: any }) => {
      const { error } = await supabase
        .from("site_settings")
        .upsert(
          { section_key: key, section_data: data, updated_at: new Date().toISOString() },
          { onConflict: "section_key" }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    },
  });
}
