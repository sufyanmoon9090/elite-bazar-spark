import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Menu, X, Search, User, LogOut, Bell, UserCircle, Package } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { useUnreadCount } from "@/hooks/useNotifications";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import defaultLogo from "@/assets/logo.png";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/shop" },
  { label: "Deals", to: "/deals" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const { user, signOut } = useAuth();
  const { data: unreadCount = 0 } = useUnreadCount(user?.id);
  const { data: general } = useSiteSettings("general");
  const { resolvedTheme } = useTheme();
  const siteName = general?.site_name || "Elite Bazar";
  const logoSrc = resolvedTheme === "dark" && general?.dark_logo_url ? general.dark_logo_url : (general?.logo_url || defaultLogo);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: isAdmin = false } = useQuery({
    queryKey: ["is_admin", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("is_admin");
      if (error) return false;
      return data as boolean;
    },
    enabled: !!user,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoSrc} alt={siteName} className="h-10 w-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = defaultLogo; }} />
          <span className="font-display text-xl font-bold text-gradient-gold hidden sm:block">{siteName}</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="h-8 w-32 sm:w-48 text-sm bg-card" />
              <button type="button" onClick={() => setSearchOpen(false)} className="p-1 text-muted-foreground"><X size={16} /></button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
              <Search size={20} />
            </button>
          )}

          {user && (
            <Link to="/notifications" className="p-2 text-muted-foreground hover:text-primary transition-colors relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          <Link to="/favorites" className="p-2 text-muted-foreground hover:text-primary transition-colors relative hidden sm:block">
            <Heart size={20} />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="p-2 text-muted-foreground hover:text-primary transition-colors relative">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden sm:flex items-center gap-1">
              <Link to="/my-orders" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/15 text-primary hover:bg-primary/25 transition-colors" title="My Orders">
                <Package size={16} />
              </Link>
              <Link to="/profile" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/15 text-primary hover:bg-primary/25 transition-colors" title="Profile">
                <UserCircle size={18} />
              </Link>
              <button onClick={() => signOut()} className="p-2 text-muted-foreground hover:text-destructive transition-colors" title="Sign out">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="p-2 text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              <User size={20} />
            </Link>
          )}

          <button className="lg:hidden p-2 text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Side drawer overlay + drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-72 bg-card border-l border-border shadow-xl lg:hidden flex flex-col h-screen"
            >
              <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                <span className="font-display font-bold text-gradient-gold">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-1">
                  {!user && (
                    <Link to="/auth" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-semibold bg-gradient-gold text-primary-foreground rounded-lg px-3 py-3 mb-2 transition-colors shadow-gold">
                      <User size={16} /> Login / Register
                    </Link>
                  )}
                  {navLinks.map((link) => (
                    <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg px-3 py-3 transition-colors">
                      {link.label}
                    </Link>
                  ))}
                  <Link to="/favorites" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg px-3 py-3 transition-colors">
                    Favorites ({favorites.length})
                  </Link>
                  {user && (
                    <>
                      <Link to="/notifications" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg px-3 py-3 transition-colors">
                        Notifications {unreadCount > 0 && `(${unreadCount})`}
                      </Link>
                      <Link to="/my-orders" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg px-3 py-3 transition-colors">
                        My Orders
                      </Link>
                      <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg px-3 py-3 transition-colors">
                        My Profile
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="p-4 border-t border-border shrink-0">
                {user ? (
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="w-full text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg px-3 py-3 text-left transition-colors">
                    Sign Out
                  </button>
                ) : (
                  <Link to="/auth" onClick={() => setMobileOpen(false)} className="block w-full text-sm font-medium text-primary hover:bg-primary/10 rounded-lg px-3 py-3 text-center transition-colors">
                    Login / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
