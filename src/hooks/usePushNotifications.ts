import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Requests browser notification permission and listens for
 * new notifications via Supabase Realtime. Shows a browser
 * push notification when a new one arrives for this user.
 */
export function usePushNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const permissionRef = useRef<NotificationPermission>("default");

  // Request permission on mount
  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      permissionRef.current = "granted";
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((p) => {
        permissionRef.current = p;
      });
    }
  }, []);

  // Listen for realtime inserts
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("push-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const notif = payload.new as {
            id: string;
            title: string;
            message: string;
            target_user_id: string | null;
          };

          // Only show if broadcast (null) or targeted to this user
          if (notif.target_user_id && notif.target_user_id !== user.id) return;

          // Invalidate queries so in-app list updates
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          queryClient.invalidateQueries({ queryKey: ["notification_reads"] });

          // Show browser notification
          if (permissionRef.current === "granted") {
            try {
              new Notification(notif.title, {
                body: notif.message,
                icon: "/favicon.ico",
                badge: "/favicon.ico",
                tag: notif.id,
              });
            } catch {
              // Fallback: some mobile browsers don't support new Notification()
              if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then((reg) => {
                  reg.showNotification(notif.title, {
                    body: notif.message,
                    icon: "/favicon.ico",
                    badge: "/favicon.ico",
                    tag: notif.id,
                  });
                });
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
}
