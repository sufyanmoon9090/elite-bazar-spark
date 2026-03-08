import { motion } from "framer-motion";
import { Truck, Shield, RotateCcw, Award, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "Fast Delivery", desc: "Free shipping on orders over $50" },
  { icon: Shield, title: "Secure Payment", desc: "100% protected transactions" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day hassle-free returns" },
  { icon: Award, title: "Premium Quality", desc: "Curated top-tier products" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
            Why Choose <span className="text-gradient-gold">Elite Bazar</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="text-primary" size={24} />
              </div>
              <h3 className="font-display font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
