import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const defaults = { title: "Shop by", highlight: "Category", subtitle: "Find exactly what you need" };

const CategoriesSection = () => {
  const { data: settings } = useSiteSettings("categories_heading");
  const { data: categories = [] } = useCategories();
  const s = { ...defaults, ...settings };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
            {s.title} <span className="text-gradient-gold">{s.highlight}</span>
          </h2>
          <p className="text-muted-foreground">{s.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <Link to={`/shop?category=${cat.slug}`} key={cat.id}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }} className="bg-card border border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 hover:shadow-gold transition-all">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-display font-semibold text-sm mb-1">{cat.name}</h3>
              </motion.div>
            </Link>
          ))}
        </div>
        {categories.length === 0 && (
          <p className="text-center text-muted-foreground">No categories added yet.</p>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
