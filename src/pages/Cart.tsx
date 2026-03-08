import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-8">
              Shopping <span className="text-gradient-gold">Cart</span>
            </h1>

            {items.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="mx-auto text-muted-foreground mb-4" size={48} />
                <p className="text-lg text-muted-foreground mb-6">Your cart is empty</p>
                <Link to="/shop">
                  <Button className="bg-gradient-gold text-primary-foreground font-semibold">Continue Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => (
                    <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border border-border rounded-xl p-4 flex gap-4">
                      <Link to={`/product/${item.id}`}>
                        <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover hover:opacity-80 transition-opacity" />
                      </Link>
                      <div className="flex-1">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="font-display font-semibold text-sm mb-1 hover:text-primary transition-colors">{item.name}</h3>
                        </Link>
                        <p className="text-sm text-gradient-gold font-bold">Rs. {item.price.toLocaleString()}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded border border-border hover:border-primary/40 transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded border border-border hover:border-primary/40 transition-colors">
                            <Plus size={14} />
                          </button>
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
                  <h3 className="font-display font-bold text-lg mb-6">Order Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items ({totalItems})</span>
                      <span>Rs. {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-primary">Free</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-display font-bold">
                      <span>Total</span>
                      <span className="text-gradient-gold text-lg">Rs. {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <Link to="/checkout">
                    <Button className="w-full bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link to="/shop" className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft size={14} /> Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
