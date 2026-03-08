import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNotifications, useSendNotification } from "@/hooks/useNotifications";
import { toast } from "sonner";
import { Bell, Send, Trash2 } from "lucide-react";

export default function AdminNotifications() {
  const { data: notifications = [], isLoading } = useNotifications();
  const sendNotification = useSendNotification();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title aur message dono fill karein");
      return;
    }
    try {
      await sendNotification.mutateAsync({ title: title.trim(), message: message.trim() });
      toast.success("Notification sent to all users!");
      setTitle("");
      setMessage("");
    } catch {
      toast.error("Failed to send notification");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-display font-bold">Notifications</h2>
        <p className="text-muted-foreground text-sm">Send notifications to all users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Send className="h-4 w-4" /> Send New Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Send className="h-4 w-4" /> {sendNotification.isPending ? "Sending..." : "Send to All Users"}
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
              {notifications.map((n) => (
                <div key={n.id} className="border border-border rounded-lg p-3">
                  <h4 className="text-sm font-semibold">{n.title}</h4>
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
