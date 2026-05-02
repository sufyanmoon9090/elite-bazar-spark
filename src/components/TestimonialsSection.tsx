import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials as fallbackTestimonials } from "@/data/mockData";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const defaults = { title: "What Our", highlight: "Customers Say" };

const TestimonialsSection = () => {
  const { data: settings } = useSiteSettings("testimonials_heading");
  const { data: listSettings } = useSiteSettings("testimonials_list");
  const s = { ...defaults, ...settings };
  const items = Array.isArray(listSettings?.items) && listSettings.items.length > 0 ? listSettings.items : fallbackTestimonials;
  if (!items || items.length === 0) return null;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
            {s.title} <span className="text-gradient-gold">{s.highlight}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} className={j < t.rating ? "fill-primary text-primary" : "text-border"} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-display font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
