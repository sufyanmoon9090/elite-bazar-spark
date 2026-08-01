import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Heart, Truck, Shield, RotateCcw, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useProductReviews } from "@/hooks/useProductReviews";
import { useProductVariants, ProductVariant } from "@/hooks/useProductVariants";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import SEO, { SITE_URL } from "@/components/SEO";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";
import { toast } from "sonner";
import { useState, useMemo } from "react";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: products = [], isLoading } = useProducts();
  const { data: variants = [] } = useProductVariants(id);
  const { data: liveReviews = [] } = useProductReviews(id || "");
  const product = products.find((p) => p.id === id);
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // When variants load, auto-select none (show base product)
  const selectedVariant = useMemo(() => {
    return variants.find((v) => v.id === selectedVariantId) || null;
  }, [variants, selectedVariantId]);

  // Active price/description based on variant
  const activePrice = selectedVariant ? selectedVariant.price : product?.price ?? 0;
  const activeOriginalPrice = selectedVariant ? selectedVariant.original_price : product?.originalPrice;
  const activeDescription = selectedVariant?.description || product?.description;
  const activeImage = selectedVariant?.image || undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 text-center">
          <p className="text-muted-foreground text-lg">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Product Not Found | Elite Bazar" description="This product is no longer available." path="/shop" noindex />
        <Navbar />
        <main className="pt-24 pb-20 text-center">
          <p className="text-muted-foreground text-lg">Product not found</p>
          <Link to="/shop"><Button className="mt-4">Back to Shop</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Build image list: if variant has image, show that first; otherwise product images
  const baseImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const allImages = activeImage ? [activeImage, ...baseImages.filter(img => img !== activeImage)] : baseImages;
  
  const discount = activeOriginalPrice ? Math.round(((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100) : 0;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    const cartProduct = {
      ...product,
      price: activePrice,
      originalPrice: activeOriginalPrice ?? undefined,
      // Append variant info to name if variant selected
      name: selectedVariant ? `${product.name} - ${selectedVariant.variant_name}` : product.name,
      image: allImages[0],
    };
    for (let i = 0; i < quantity; i++) addToCart(cartProduct);
    toast.success(`${cartProduct.name} added to cart`);
  };

  const nextImage = () => setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariantId(variant.id === selectedVariantId ? null : variant.id);
    setSelectedImageIndex(0);
  };

  // ---- SEO: meta tags + Product / Offer / BreadcrumbList structured data ----
  const seoTitle = `${product.name} — Price in Pakistan | Elite Bazar`;
  const seoDescription = (
    activeDescription ||
    `Buy ${product.name} online at Elite Bazar for Rs. ${activePrice.toLocaleString()}. Cash on Delivery all over Pakistan.`
  ).slice(0, 155);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: seoDescription,
    image: allImages,
    sku: product.id,
    category: product.category,
    brand: { "@type": "Brand", name: "Elite Bazar" },
    ...(product.reviews > 0 && product.rating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviews,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.id}`,
      priceCurrency: "PKR",
      price: activePrice,
      availability:
        (product as any).in_stock === false
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category,
        item: `${SITE_URL}/shop?category=${product.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${SITE_URL}/product/${product.id}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        path={`/product/${product.id}`}
        image={allImages[0]}
        type="product"
        jsonLd={[productSchema, breadcrumbSchema]}
      />
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
            <div className="space-y-3">
              <div
                className="relative rounded-2xl overflow-hidden bg-card border border-border group"
                onTouchStart={(e) => {
                  (e.currentTarget as any)._touchStartX = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  const startX = (e.currentTarget as any)._touchStartX;
                  if (startX === undefined) return;
                  const diff = startX - e.changedTouches[0].clientX;
                  if (Math.abs(diff) > 50) { diff > 0 ? nextImage() : prevImage(); }
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${selectedImageIndex}-${selectedVariantId}`}
                    src={allImages[selectedImageIndex]}
                    alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                    className="w-full aspect-square object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>
                {product.badge && <Badge className="absolute top-4 left-4 bg-gradient-gold text-primary-foreground">{product.badge}</Badge>}
                {discount > 0 && <Badge variant="destructive" className="absolute top-4 right-4">-{discount}%</Badge>}

                <button
                  onClick={() => { toggleFavorite(product.id); toast.success(isFavorite(product.id) ? "Removed from favorites" : "Added to favorites"); }}
                  className={`absolute bottom-4 right-4 p-3 rounded-full border border-border backdrop-blur-sm transition-all hover:scale-110 ${isFavorite(product.id) ? "bg-red-500 text-white border-red-500" : "bg-card/80 text-foreground"}`}
                >
                  <Heart size={20} className={isFavorite(product.id) ? "fill-current" : ""} />
                </button>

                {allImages.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border text-foreground transition-opacity hover:scale-110">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border text-foreground transition-opacity hover:scale-110">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === selectedImageIndex ? "border-primary shadow-gold" : "border-border opacity-60 hover:opacity-100"}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
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

              {/* Variant Selector */}
              {variants.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">
                    Variant: <span className="text-primary">{selectedVariant?.variant_name || "Default"}</span>
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleVariantSelect(v)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                          selectedVariantId === v.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {v.image && (
                          <img src={v.image} alt={v.variant_name} className="w-10 h-10 rounded object-cover" />
                        )}
                        <div className="text-left">
                          <p className="text-xs font-medium">{v.variant_name}</p>
                          <p className="text-xs text-primary">Rs. {v.price.toLocaleString()}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-display font-bold text-gradient-gold">Rs. {activePrice.toLocaleString()}</span>
                {activeOriginalPrice && <span className="text-lg text-muted-foreground line-through">Rs. {activeOriginalPrice.toLocaleString()}</span>}
                {discount > 0 && <Badge variant="destructive">Save {discount}%</Badge>}
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {activeDescription || `Experience premium quality with the ${product.name}. Crafted with attention to detail and designed for the modern lifestyle.`}
              </p>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center border border-border rounded-lg h-9 text-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground transition-colors">-</button>
                  <span className="px-3 py-1.5 font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground transition-colors">+</button>
                </div>
                <Button onClick={handleAddToCart} className="flex-1 bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90 gap-2 h-9 text-sm px-4">
                  <ShoppingCart size={16} />
                  {isInCart(product.id) ? "Add More" : "Add to Cart"}
                </Button>
                <Button variant="outline" size="icon" onClick={() => { toggleFavorite(product.id); toast.success(isFavorite(product.id) ? "Removed from favorites" : "Added to favorites"); }} className={`shrink-0 h-9 w-9 border-border ${isFavorite(product.id) ? "text-red-500" : ""}`}>
                  <Heart size={16} className={isFavorite(product.id) ? "fill-current" : ""} />
                </Button>
              </div>

              <WhatsAppOrderButton productName={product.name} />

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
              {[["Brand", "Elite Bazar"], ["Category", product.category], ["Rating", `${liveReviews.length > 0 ? (liveReviews.reduce((s, r) => s + r.rating, 0) / liveReviews.length).toFixed(1) : product.rating}/5`], ["Reviews", `${liveReviews.length || product.reviews} reviews`], ["Availability", "In Stock"], ["Delivery", "All Pakistan"], ["Payment", "Cash on Delivery"]].map(([label, value]) => (
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
