import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBanner} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Sparkles size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">New Collection 2026</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight mb-6">
            Welcome to{" "}
            <span className="text-gradient-gold">Elite Bazar</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg">
            Discover premium products curated for the modern lifestyle. Quality meets elegance in every purchase.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/shop">
              <Button size="lg" className="bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 transition-opacity text-base px-8">
                Shop Now <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
            <Link to="/shop">
              <Button size="lg" variant="outline" className="border-primary/30 text-foreground hover:bg-primary/10 text-base px-8">
                Browse Categories
              </Button>
            </Link>
          </div>

          <div className="flex gap-8 mt-12">
            {[
              { value: "10K+", label: "Products" },
              { value: "50K+", label: "Happy Customers" },
              { value: "99%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-display font-bold text-gradient-gold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
