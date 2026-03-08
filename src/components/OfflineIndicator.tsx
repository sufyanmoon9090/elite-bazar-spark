import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnline, setShowOnline] = useState(false);

  useEffect(() => {
    const goOffline = () => setIsOnline(false);
    const goOnline = () => {
      setIsOnline(true);
      setShowOnline(true);
      setTimeout(() => setShowOnline(false), 3000);
    };

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[9999] bg-destructive text-destructive-foreground text-center py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium shadow-lg"
        >
          <WifiOff size={16} />
          You are offline — Some features may not work
        </motion.div>
      )}
      {showOnline && isOnline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[9999] bg-primary text-primary-foreground text-center py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium shadow-lg"
        >
          <Wifi size={16} />
          Back online!
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;
