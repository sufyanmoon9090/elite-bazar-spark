import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import DealsSection from "@/components/DealsSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Deals = () => {
  const { data: products = [] } = useProducts();
  const dealsProducts = products.filter((p) => p.originalPrice);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
              Hot <span className="text-gradient-gold">Deals</span>
            </h1>
            <p className="text-muted-foreground mb-8">
              Don't miss our limited-time offers
            </p>
          </motion.div>
        </div>

        <DealsSection />

        <div className="container mx-auto px-4 mt-12">
          <h2 className="text-2xl font-display font-bold mb-6">
            Products on <span className="text-gradient-gold">Sale</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealsProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Deals;
