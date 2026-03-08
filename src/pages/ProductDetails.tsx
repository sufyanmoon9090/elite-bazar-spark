import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import { toast } from "sonner";
import { useState } from "react";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProductStore();
  const product = products.find((p) => p.id === id);
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 text-center">
          <p className="text-muted-foreground text-lg">Product not found</p>
          <Link to="/shop"><Button className="mt-4">Back to Shop</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const nextImage = () => setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden bg-card border border-border group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImageIndex}
                    src={allImages[selectedImageIndex]}
                    alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                    className="w-full aspect-square object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>
                {product.badge && <Badge className="absolute top-4 left-4 bg-gradient-gold text-primary-foreground">{product.badge}</Badge>}
                {discount > 0 && <Badge variant="destructive" className="absolute top-4 right-4">-{discount}%</Badge>}
                
                {/* Favorite button on image */}
                <button
                  onClick={() => { toggleFavorite(product.id); toast.success(isFavorite(product.id) ? "Removed from favorites" : "Added to favorites"); }}
                  className={`absolute bottom-4 right-4 p-3 rounded-full border border-border backdrop-blur-sm transition-all hover:scale-110 ${isFavorite(product.id) ? "bg-red-500 text-white border-red-500" : "bg-card/80 text-foreground"}`}
                >
                  <Heart size={20} className={isFavorite(product.id) ? "fill-current" : ""} />
                </button>

                {/* Navigation arrows */}
                {allImages.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === selectedImageIndex ? "border-primary shadow-gold" : "border-border opacity-60 hover:opacity-100"}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-sm text-primary font-medium uppercase tracking-wider mb-2">{product.category}</p>
              <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-display font-bold text-gradient-gold">Rs. {product.price.toLocaleString()}</span>
                {product.originalPrice && <span className="text-lg text-muted-foreground line-through">Rs. {product.originalPrice.toLocaleString()}</span>}
                {discount > 0 && <Badge variant="destructive">Save {discount}%</Badge>}
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {product.description || `Experience premium quality with the ${product.name}. Crafted with attention to detail and designed for the modern lifestyle.`}
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">-</button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">+</button>
                </div>
                <Button onClick={handleAddToCart} className="flex-1 bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 gap-2" size="lg">
                  <ShoppingCart size={18} />
                  {isInCart(product.id) ? "Add More" : "Add to Cart"}
                </Button>
                <Button variant="outline" size="lg" onClick={() => { toggleFavorite(product.id); toast.success(isFavorite(product.id) ? "Removed from favorites" : "Added to favorites"); }} className={`border-border ${isFavorite(product.id) ? "text-red-500" : ""}`}>
                  <Heart size={18} className={isFavorite(product.id) ? "fill-current" : ""} />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck size={20} className="text-primary" /><span className="text-xs text-muted-foreground">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Shield size={20} className="text-primary" /><span className="text-xs text-muted-foreground">Cash on Delivery</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw size={20} className="text-primary" /><span className="text-xs text-muted-foreground">Easy Returns</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="bg-card border border-border rounded-xl p-6 mb-16">
            <h2 className="text-xl font-display font-bold mb-4">Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[["Brand", "Elite Bazar"], ["Category", product.category], ["Rating", `${product.rating}/5`], ["Reviews", `${product.reviews} reviews`], ["Availability", "In Stock"], ["Warranty", "1 Year"], ["Delivery", "All Pakistan"], ["Payment", "Cash on Delivery"]].map(([label, value]) => (
                <div key={label} className="flex items-center gap-2 py-2 border-b border-border/50">
                  <Check size={14} className="text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">{label}:</span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <ProductReviews productId={product.id} />

          {related.length > 0 && (
            <div>
              <h2 className="text-2xl font-display font-bold mb-6">Related <span className="text-gradient-gold">Products</span></h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
