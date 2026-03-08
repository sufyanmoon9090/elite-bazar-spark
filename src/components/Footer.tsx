import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const footerLinks = {
  "Quick Links": [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "About Us", to: "/" },
    { label: "Contact", to: "/" },
  ],
  "Customer Service": [
    { label: "FAQ", to: "/" },
    { label: "Shipping Info", to: "/" },
    { label: "Returns", to: "/" },
    { label: "Track Order", to: "/" },
  ],
  "Legal": [
    { label: "Privacy Policy", to: "/" },
    { label: "Terms & Conditions", to: "/" },
    { label: "Cookie Policy", to: "/" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Elite Bazar" className="h-8 w-8 object-contain" />
              <span className="font-display font-bold text-gradient-gold">Elite Bazar</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your premium destination for quality products and exceptional shopping experiences.
            </p>
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
            © 2026 Elite Bazar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
