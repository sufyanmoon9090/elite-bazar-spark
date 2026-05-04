import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, X, ShoppingCart, User, LogOut, UserCircle, Package, Heart, Bell } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { useUnreadCount } from "@/hooks/useNotifications";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import defaultLogo from "@/assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Deals", to: "/deals" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const PriceOyeNavbar = () => {
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const { user, signOut } = useAuth();
  const { data: unreadCount = 0 } = useUnreadCount(user?.id);
  const { data: general } = useSiteSettings("general");
  const { data: poStyle } = useSiteSettings("priceoye_style");
  const siteName = general?.site_name || "Elite Bazar";
  const logoSrc = general?.logo_url || defaultLogo;
  const bg = poStyle?.navbar_bg || "linear-gradient(90deg, #38BDF8 0%, #FBBF24 100%)";
  const fg = poStyle?.navbar_fg || "#0F172A";

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-md" style={{ background: bg, color: fg }}>
      <div className="container mx-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-4 h-16">
        <button onClick={() => setOpen(!open)} className="p-2 lg:hidden" aria-label="Menu">
          <Menu size={22} />
        </button>

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logoSrc} alt={siteName} className="h-9 w-9 object-contain rounded-md bg-white/20 p-0.5" onError={(e) => { (e.target as HTMLImageElement).src = defaultLogo; }} />
          <span className="font-display font-extrabold text-base sm:text-lg hidden sm:block" style={{ color: fg }}>{siteName}</span>
        </Link>

        <div className="hidden lg:flex items-center gap-5 ml-4">
          {navLinks.map((l) => (
            <Link key={l.label} to={l.to} className="text-sm font-semibold hover:opacity-80" style={{ color: fg }}>{l.label}</Link>
          ))}
        </div>

        <form onSubmit={onSearch} className="flex-1 max-w-xl mx-1 sm:mx-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              placeholder="Search..."
              className="w-full bg-white text-gray-900 rounded-full pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/60"
            />
          </div>
        </form>

        <div className="flex items-center gap-1 shrink-0">
          {user && (
            <Link to="/notifications" className="p-2 relative" style={{ color: fg }}>
              <Bell size={20} />
              {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unreadCount}</span>}
            </Link>
          )}
          <Link to="/favorites" className="p-2 relative hidden sm:block" style={{ color: fg }}>
            <Heart size={20} />
            {favorites.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{favorites.length}</span>}
          </Link>
          <Link to="/cart" className="p-2 relative" style={{ color: fg }}>
            <ShoppingCart size={20} />
            {totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>}
          </Link>
          {user ? (
            <div className="hidden sm:flex items-center gap-1">
              <Link to="/my-orders" className="p-2" style={{ color: fg }} title="My Orders"><Package size={18} /></Link>
              <Link to="/profile" className="p-2" style={{ color: fg }} title="Profile"><UserCircle size={20} /></Link>
              <button onClick={() => signOut()} className="p-2" style={{ color: fg }} title="Sign out"><LogOut size={18} /></button>
            </div>
          ) : (
            <Link to="/auth" className="p-2 hidden sm:block" style={{ color: fg }}><User size={20} /></Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed top-0 left-0 bottom-0 z-[70] w-72 bg-card border-r border-border shadow-xl lg:hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-display font-bold">Menu</span>
                <button onClick={() => setOpen(false)} className="p-2"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
                {!user && (
                  <Link to="/auth" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg px-3 py-3 mb-2">
                    <User size={16} /> Login / Register
                  </Link>
                )}
                {navLinks.map((l) => (
                  <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium text-foreground hover:bg-muted rounded-lg px-3 py-3">{l.label}</Link>
                ))}
                <Link to="/favorites" onClick={() => setOpen(false)} className="text-sm font-medium text-foreground hover:bg-muted rounded-lg px-3 py-3">Favorites ({favorites.length})</Link>
                {user && (
                  <>
                    <Link to="/my-orders" onClick={() => setOpen(false)} className="text-sm font-medium text-foreground hover:bg-muted rounded-lg px-3 py-3">My Orders</Link>
                    <Link to="/profile" onClick={() => setOpen(false)} className="text-sm font-medium text-foreground hover:bg-muted rounded-lg px-3 py-3">My Profile</Link>
                    <button onClick={() => { signOut(); setOpen(false); }} className="text-left text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg px-3 py-3">Sign Out</button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default PriceOyeNavbar;
