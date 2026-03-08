import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNotifications, useSendNotification, useAllProfiles } from "@/hooks/useNotifications";
import { toast } from "sonner";
import { Bell, Send, Users, User, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminNotifications() {
  const { data: notifications = [], isLoading } = useNotifications();
  const { data: users = [], isLoading: loadingUsers } = useAllProfiles();
  const sendNotification = useSendNotification();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sendTo, setSendTo] = useState<"all" | "specific">("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    (u.email?.toLowerCase() || "").includes(userSearch.toLowerCase()) ||
    (u.full_name?.toLowerCase() || "").includes(userSearch.toLowerCase())
  );

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title aur message dono fill karein");
      return;
    }
    if (sendTo === "specific" && !selectedUserId) {
      toast.error("Please select a user");
      return;
    }
    try {
      await sendNotification.mutateAsync({
        title: title.trim(),
        message: message.trim(),
        target_user_id: sendTo === "specific" ? selectedUserId : null,
      });
      toast.success(sendTo === "all" ? "Notification sent to all users!" : `Notification sent to ${selectedUser?.email || "user"}!`);
      setTitle("");
      setMessage("");
      setSelectedUserId(null);
      setUserSearch("");
    } catch {
      toast.error("Failed to send notification");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-display font-bold">Notifications</h2>
        <p className="text-muted-foreground text-sm">Send notifications to all or specific users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Send className="h-4 w-4" /> Send New Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Target Toggle */}
          <div>
            <Label className="mb-2 block">Send To</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={sendTo === "all" ? "default" : "outline"}
                onClick={() => { setSendTo("all"); setSelectedUserId(null); }}
                className="gap-2"
                size="sm"
              >
                <Users className="h-4 w-4" /> All Users
              </Button>
              <Button
                type="button"
                variant={sendTo === "specific" ? "default" : "outline"}
                onClick={() => setSendTo("specific")}
                className="gap-2"
                size="sm"
              >
                <User className="h-4 w-4" /> Specific User
              </Button>
            </div>
          </div>

          {/* User Picker */}
          {sendTo === "specific" && (
            <div className="space-y-2">
              <Label>Select User</Label>
              {selectedUser ? (
                <div className="flex items-center gap-2 p-2 border border-primary rounded-lg bg-primary/5">
                  <User className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{selectedUser.full_name || "No name"}</p>
                    <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedUserId(null)}>Change</Button>
                </div>
              ) : (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search by name or email..."
                      className="pl-9 border-0 border-b border-border rounded-none focus-visible:ring-0"
                    />
                  </div>
                  <ScrollArea className="max-h-48">
                    {loadingUsers ? (
                      <p className="p-3 text-sm text-muted-foreground">Loading users...</p>
                    ) : filteredUsers.length === 0 ? (
                      <p className="p-3 text-sm text-muted-foreground">No users found</p>
                    ) : (
                      <div className="divide-y divide-border">
                        {filteredUsers.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => { setSelectedUserId(u.id); setUserSearch(""); }}
                            className="w-full text-left px-3 py-2 hover:bg-accent/50 transition-colors flex items-center gap-2"
                          >
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {(u.full_name || u.email || "?")[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{u.full_name || "No name"}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              )}
            </div>
          )}

          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" />
          </div>
          <div>
            <Label>Message</Label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your notification message..."
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button onClick={handleSend} disabled={sendNotification.isPending} className="gap-2">
            <Send className="h-4 w-4" />
            {sendNotification.isPending
              ? "Sending..."
              : sendTo === "all"
              ? "Send to All Users"
              : "Send to Selected User"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" /> Sent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications sent yet</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((n: any) => (
                <div key={n.id} className="border border-border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold">{n.title}</h4>
                    {n.target_user_id ? (
                      <Badge variant="secondary" className="text-[10px]">
                        <User className="h-3 w-3 mr-1" /> Specific User
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        <Users className="h-3 w-3 mr-1" /> All Users
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
