import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { CreditCard, MapPin, Truck, Check, ArrowLeft } from "lucide-react";

const steps = ["Address", "Shipping", "Payment", "Confirmation"];

const Checkout = () => {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });
  const [shipping, setShipping] = useState("standard");
  const shippingCost = shipping === "express" ? 14.99 : shipping === "overnight" ? 29.99 : 0;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 text-center">
          <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
          <Link to="/shop">
            <Button className="bg-gradient-gold text-primary-foreground">Go Shopping</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePlaceOrder = () => {
    toast.success("Order placed successfully! 🎉");
    clearCart();
    navigate("/");
  };

  const nextStep = () => {
    if (step === 0) {
      if (!address.name || !address.street || !address.city || !address.zip) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    if (step < 3) setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-display font-bold mb-8">
              <span className="text-gradient-gold">Checkout</span>
            </h1>

            {/* Steps */}
            <div className="flex items-center justify-between mb-10">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      i <= step
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`text-sm hidden sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
                    {s}
                  </span>
                  {i < steps.length - 1 && (
                    <div className={`w-8 sm:w-16 h-px mx-2 ${i < step ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Step 0: Address */}
                {step === 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin size={18} className="text-primary" /> Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Full Name *</Label>
                        <Input value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} placeholder="John Doe" />
                      </div>
                      <div>
                        <Label>Street Address *</Label>
                        <Input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="123 Main St" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>City *</Label>
                          <Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="New York" />
                        </div>
                        <div>
                          <Label>State</Label>
                          <Input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="NY" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>ZIP Code *</Label>
                          <Input value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} placeholder="10001" />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="+1 234 567 890" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 1: Shipping */}
                {step === 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Truck size={18} className="text-primary" /> Shipping Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { id: "standard", label: "Standard Shipping", desc: "5-7 business days", price: "Free" },
                        { id: "express", label: "Express Shipping", desc: "2-3 business days", price: "$14.99" },
                        { id: "overnight", label: "Overnight Shipping", desc: "Next business day", price: "$29.99" },
                      ].map((opt) => (
                        <label
                          key={opt.id}
                          className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                            shipping === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              value={opt.id}
                              checked={shipping === opt.id}
                              onChange={() => setShipping(opt.id)}
                              className="accent-primary"
                            />
                            <div>
                              <p className="font-medium text-sm">{opt.label}</p>
                              <p className="text-xs text-muted-foreground">{opt.desc}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-primary">{opt.price}</span>
                        </label>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CreditCard size={18} className="text-primary" /> Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-primary bg-primary/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Banknote size={20} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Cash on Delivery</p>
                            <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                          </div>
                        </div>
                        <Check size={18} className="text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Cash on Delivery is the only available payment method. Please have the exact amount ready at the time of delivery.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Check size={18} className="text-primary" /> Order Confirmation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-secondary/50 rounded-lg p-4">
                        <h3 className="font-medium text-sm mb-2">Shipping to:</h3>
                        <p className="text-sm text-muted-foreground">
                          {address.name}<br />
                          {address.street}<br />
                          {address.city}, {address.state} {address.zip}
                        </p>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-4">
                        <h3 className="font-medium text-sm mb-2">Shipping Method:</h3>
                        <p className="text-sm text-muted-foreground capitalize">{shipping} shipping</p>
                      </div>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm py-1">
                            <span className="text-muted-foreground">
                              {item.name} × {item.quantity}
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => step > 0 ? setStep(step - 1) : navigate("/cart")}
                    className="gap-2"
                  >
                    <ArrowLeft size={16} /> {step > 0 ? "Back" : "Cart"}
                  </Button>
                  {step < 3 ? (
                    <Button onClick={nextStep} className="bg-gradient-gold text-primary-foreground font-semibold">
                      Continue
                    </Button>
                  ) : (
                    <Button onClick={handlePlaceOrder} className="bg-gradient-gold text-primary-foreground font-semibold shadow-gold">
                      Place Order
                    </Button>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
                <h3 className="font-display font-bold text-lg mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items ({totalItems})</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shippingCost === 0 ? "text-primary" : ""}>
                      {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-display font-bold">
                    <span>Total</span>
                    <span className="text-gradient-gold text-lg">
                      ${(totalPrice + shippingCost).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
