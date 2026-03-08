import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { toast } from "sonner";

const ProductCard = ({ product }: { product: Product & { in_stock?: boolean } }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const inStock = product.in_stock !== false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) {
      toast.error("This product is out of stock");
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
    toast.success(isFavorite(product.id) ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <Link to={`/product/${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4 }}
        className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-card transition-all"
      >
        <div className="relative aspect-square overflow-hidden">
          <img src={product.image} alt={product.name} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!inStock ? "opacity-50 grayscale" : ""}`} onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-gradient-gold text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-destructive text-destructive-foreground text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
          {inStock && (
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button onClick={handleAddToCart} className="p-2.5 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform">
                <ShoppingCart size={18} />
              </button>
              <button onClick={handleFavorite} className={`p-2.5 rounded-full border border-border hover:scale-110 transition-transform ${isFavorite(product.id) ? "bg-red-500 text-white" : "bg-card text-foreground"}`}>
                <Heart size={18} className={isFavorite(product.id) ? "fill-current" : ""} />
              </button>
              <Link to={`/product/${product.id}`} onClick={(e) => e.stopPropagation()} className="p-2.5 bg-card text-foreground rounded-full border border-border hover:scale-110 transition-transform">
                <Eye size={18} />
              </Link>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="font-display font-semibold text-sm mb-2 line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className={i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-gradient-gold">Rs. {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">Rs. {product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            {inStock ? (
              <span className="text-[10px] font-semibold text-green-500">In Stock</span>
            ) : (
              <span className="text-[10px] font-semibold text-destructive">Out of Stock</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
