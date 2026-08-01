import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fuzzyFilter } from "@/lib/fuzzySearch";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";

  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (search.trim()) {
      result = fuzzyFilter(search, result as any) as typeof result;
    }
    if (sortBy === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, search, selectedCategory, sortBy]);

  const activeCategory = categories.find((c) => c.slug === selectedCategory);
  const seoTitle = activeCategory
    ? `${activeCategory.name} — Buy Online in Pakistan | Elite Bazar`
    : "Shop All Products — Online Store in Pakistan | Elite Bazar";
  const seoDescription = activeCategory
    ? `Browse ${activeCategory.name.toLowerCase()} at Elite Bazar. Genuine products, best prices in Pakistan and Cash on Delivery.`
    : "Browse the full Elite Bazar catalog — electronics, fashion, gadgets and home essentials with Cash on Delivery across Pakistan.";

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        path={activeCategory ? `/shop?category=${activeCategory.slug}` : "/shop"}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://elite-bazar.lovable.app/" },
            { "@type": "ListItem", position: 2, name: "Shop", item: "https://elite-bazar.lovable.app/shop" },
            ...(activeCategory
              ? [{
                  "@type": "ListItem",
                  position: 3,
                  name: activeCategory.name,
                  item: `https://elite-bazar.lovable.app/shop?category=${activeCategory.slug}`,
                }]
              : []),
          ],
        }}
      />
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
              Our <span className="text-gradient-gold">Collection</span>
            </h1>
            <p className="text-muted-foreground">Discover premium products curated for you</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card border-border" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant={selectedCategory === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory("all")} className={selectedCategory === "all" ? "bg-gradient-gold text-primary-foreground" : "border-border text-muted-foreground"}>All</Button>
              {categories.map((cat) => (
                <Button key={cat.id} variant={selectedCategory === cat.slug ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(cat.slug)} className={selectedCategory === cat.slug ? "bg-gradient-gold text-primary-foreground" : "border-border text-muted-foreground"}>{cat.name}</Button>
              ))}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground">
              <option value="default">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-20"><p className="text-muted-foreground">Loading products...</p></div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {filtered.map((product) => (<ProductCard key={product.id} product={product} />))}
            </div>
          ) : (
            <div className="text-center py-20"><p className="text-muted-foreground">No products found matching your criteria.</p></div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
