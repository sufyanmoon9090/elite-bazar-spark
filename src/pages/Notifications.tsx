import { motion } from "framer-motion";
import { Bell, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications, useMarkAsRead, useUnreadCount } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Navigate } from "react-router-dom";

const Notifications = () => {
  const { user } = useAuth();
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const { data: unreadCount = 0 } = useUnreadCount(user?.id);

  if (!user) return <Navigate to="/auth" replace />;

  const handleMarkRead = (notifId: string) => {
    markAsRead.mutate({ notificationId: notifId, userId: user.id });
  };

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      markAsRead.mutate({ notificationId: n.id, userId: user.id });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-display font-bold">
                <span className="text-gradient-gold">Notifications</span>
              </h1>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-1">
                  <Check size={14} /> Mark all as read
                </Button>
              )}
            </div>

            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : notifications.length === 0 ? (
              <div className="text-center py-20">
                <Bell className="mx-auto text-muted-foreground mb-4" size={48} />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="bg-card border border-border rounded-xl p-4 flex items-start gap-4 cursor-pointer hover:border-primary/30 transition-all"
                    onClick={() => handleMarkRead(n.id)}
                  >
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <Bell size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold mb-1">{n.title}</h3>
                      <p className="text-sm text-muted-foreground">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(n.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Notifications;
