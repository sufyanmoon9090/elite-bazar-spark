import { motion } from "framer-motion";
import { Truck, Shield, RotateCcw, Award, Headphones } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const icons = [Truck, Shield, RotateCcw, Award, Headphones];
const defaultFeatures = [
  { title: "Fast Delivery", desc: "Free shipping on orders over $50" },
  { title: "Secure Payment", desc: "100% protected transactions" },
  { title: "Easy Returns", desc: "30-day hassle-free returns" },
  { title: "Premium Quality", desc: "Curated top-tier products" },
  { title: "24/7 Support", desc: "Always here to help" },
];

const WhyChooseUs = () => {
  const { data: settings } = useSiteSettings("why_choose_us");
  const title = settings?.title || "Why Choose";
  const highlight = settings?.highlight || "Elite Bazar";
  const features = settings?.features || defaultFeatures;

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
            {title} <span className="text-gradient-gold">{highlight}</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((f: any, i: number) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="font-display font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
