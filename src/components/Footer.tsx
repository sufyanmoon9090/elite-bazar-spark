import { Link } from "react-router-dom";
import defaultLogo from "@/assets/logo.png";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useTheme } from "next-themes";
import { MessageCircle } from "lucide-react";

const footerLinks = {
  "Quick Links": [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "Deals", to: "/deals" },
    { label: "Blog", to: "/blog" },
    { label: "Contact", to: "/contact" },
  ],
  "Customer Service": [
    { label: "My Favorites", to: "/favorites" },
    { label: "Cart", to: "/cart" },
    { label: "Login / Register", to: "/auth" },
    { label: "Track Order", to: "/my-orders" },
  ],
  "Legal": [
    { label: "Privacy Policy", to: "/contact" },
    { label: "Terms & Conditions", to: "/contact" },
  ],
};

const Footer = () => {
  const { data: general } = useSiteSettings("general");
  const { data: wa } = useSiteSettings("global_whatsapp");
  const { resolvedTheme } = useTheme();
  const siteName = general?.site_name || "Elite Bazar";
  const logoSrc = resolvedTheme === "dark" && general?.dark_logo_url ? general.dark_logo_url : (general?.logo_url || defaultLogo);
  const footerText = general?.footer_text || "Your premium destination for quality products and exceptional shopping experiences.";
  const waNumber = wa?.number || "923276254377";
  const waDisplay = wa?.display || "+92 327 625 4377";
  const showWAFooter = wa?.show_footer !== false;

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logoSrc} alt={siteName} className="h-8 w-8 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = defaultLogo; }} />
              <span className="font-display font-bold text-gradient-gold">{siteName}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {footerText}
            </p>
            {showWAFooter && (
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors"
              >
                <MessageCircle size={16} /> {waDisplay}
              </a>
            )}
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
