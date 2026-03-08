import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, Ban, CheckCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Customers() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin_all_users"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_all_users_for_admin");
      if (error) throw error;
      return data || [];
    },
  });

  const toggleSuspend = useMutation({
    mutationFn: async ({ userId, suspend }: { userId: string; suspend: boolean }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_suspended: suspend })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: (_, { suspend }) => {
      queryClient.invalidateQueries({ queryKey: ["admin_all_users"] });
      toast({ title: suspend ? "User suspended" : "User activated" });
    },
    onError: () => {
      toast({ title: "Failed to update user", variant: "destructive" });
    },
  });

  const filtered = users.filter(
    (u: any) =>
      (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Customers</h2>
        <p className="text-muted-foreground text-sm">{users.length} registered users</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading customers...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Users className="h-8 w-8" />
              <p>No customers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">#</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user: any, idx: number) => (
                    <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 text-muted-foreground">{idx + 1}</td>
                      <td className="py-3 px-4 font-medium">{user.full_name || "—"}</td>
                      <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                      <td className="py-3 px-4">
                        {user.is_suspended ? (
                          <Badge variant="destructive" className="text-xs">Suspended</Badge>
                        ) : (
                          <Badge className="text-xs bg-green-500/20 text-green-500 hover:bg-green-500/30 border-0">Active</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant={user.is_suspended ? "outline" : "destructive"}
                          className="gap-1.5 h-8 text-xs"
                          disabled={toggleSuspend.isPending}
                          onClick={() => toggleSuspend.mutate({ userId: user.id, suspend: !user.is_suspended })}
                        >
                          {user.is_suspended ? <><CheckCircle size={14} /> Activate</> : <><Ban size={14} /> Suspend</>}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
