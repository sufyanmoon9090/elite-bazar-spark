import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Menu, X, Search, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/shop" },
  { label: "Deals", to: "/shop" },
  { label: "Blog", to: "/" },
  { label: "Contact", to: "/" },
];

const Navbar = () => {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Elite Bazar" className="h-10 w-10 object-contain" />
          <span className="font-display text-xl font-bold text-gradient-gold hidden sm:block">
            Elite Bazar
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors hidden sm:block">
            <Heart size={20} />
          </button>
          <Link to="/cart" className="p-2 text-muted-foreground hover:text-primary transition-colors relative">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button className="p-2 text-muted-foreground hover:text-primary transition-colors hidden sm:block">
            <User size={20} />
          </button>
          <button
            className="lg:hidden p-2 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-card border-t border-border"
          >
            <div className="flex flex-col p-4 gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-primary py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-primary py-2"
              >
                Login / Register
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
