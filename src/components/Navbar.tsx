import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Menu, X, Search, User, LogOut, Bell, UserCircle, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { useUnreadCount } from "@/hooks/useNotifications";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
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
          <img src={logo} alt="Elite Bazar" className="h-10 w-10 object-contain" />
          <span className="font-display text-xl font-bold text-gradient-gold hidden sm:block">Elite Bazar</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
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
              {isAdmin && (
                <Link to="/admin" className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/15 text-primary hover:bg-primary/25 transition-colors" title="Admin">
                  <User size={16} />
                </Link>
              )}
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

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden bg-card border-t border-border">
            <div className="flex flex-col p-4 gap-3">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary py-2">
                  {link.label}
                </Link>
              ))}
              <Link to="/favorites" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary py-2">
                Favorites ({favorites.length})
              </Link>
              {user && (
                <>
                  <Link to="/notifications" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary py-2">
                    Notifications {unreadCount > 0 && `(${unreadCount})`}
                  </Link>
                  <Link to="/my-orders" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary py-2">
                    My Orders
                  </Link>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary py-2">
                    My Profile
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary py-2">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="text-sm font-medium text-destructive py-2 text-left">
                    Sign Out
                  </button>
                </>
              )}
              {!user && (
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-primary py-2">
                  Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
