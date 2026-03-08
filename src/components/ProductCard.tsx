import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { Product } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart, isInCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-card transition-all"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
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
        {/* Hover actions */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={handleAddToCart}
            className="p-2.5 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform"
          >
            <ShoppingCart size={18} />
          </button>
          <button className="p-2.5 bg-card text-foreground rounded-full border border-border hover:scale-110 transition-transform">
            <Heart size={18} />
          </button>
          <button className="p-2.5 bg-card text-foreground rounded-full border border-border hover:scale-110 transition-transform">
            <Eye size={18} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-display font-semibold text-sm mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-border"}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-gradient-gold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
