import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useCreateOrder } from "@/hooks/useOrders";
import { useValidateCoupon, useIncrementCouponUsage, Coupon } from "@/hooks/useCoupons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { CreditCard, MapPin, Truck, Check, ArrowLeft, Banknote, Tag, X } from "lucide-react";
import { provinces, getCitiesByProvince } from "@/data/pakistanCities";

const steps = ["Address", "Shipping", "Payment", "Confirmation"];

const Checkout = () => {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const validateCoupon = useValidateCoupon();
  const incrementUsage = useIncrementCouponUsage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({ name: "", street: "", city: "", province: "", zip: "", phone: "", email: "" });
  const [shipping, setShipping] = useState("standard");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const shippingCost = shipping === "express" ? 300 : shipping === "overnight" ? 500 : 0;

  const discount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round(totalPrice * appliedCoupon.discount / 100)
      : appliedCoupon.discount
    : 0;
  const finalTotal = totalPrice + shippingCost - discount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20 text-center">
          <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
          <Link to="/shop"><Button className="bg-gradient-gold text-primary-foreground">Go Shopping</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const coupon = await validateCoupon.mutateAsync({ code: couponCode, orderTotal: totalPrice });
      setAppliedCoupon(coupon);
      toast.success(`Coupon "${coupon.code}" applied! ${coupon.type === "percent" ? `${coupon.discount}%` : `Rs. ${coupon.discount}`} off`);
    } catch (err: any) {
      toast.error(err.message || "Invalid coupon");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const handlePlaceOrder = async () => {
    const orderNumber = `EB-${Date.now().toString(36).toUpperCase()}`;
    try {
      await createOrder.mutateAsync({
        user_id: user?.id ?? null,
        guest_email: user ? null : address.email.trim(),
        guest_phone: user ? null : address.phone.trim(),
        order_number: orderNumber,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        total: finalTotal,
        shipping_cost: shippingCost,
        shipping_method: shipping,
        address,
      });
      if (appliedCoupon) {
        await incrementUsage.mutateAsync(appliedCoupon.id);
      }
      toast.success(`Order ${orderNumber} placed successfully!`);
      clearCart();
      navigate(user ? "/my-orders" : "/");
    } catch (err: any) {
      toast.error(err?.message || "Order place karne mein error aya. Dobara try karein.");
    }
  };

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  const isValidPhone = (p: string) => /^[+\d][\d\s-]{6,16}$/.test(p.trim());

  const nextStep = () => {
    if (step === 0) {
      if (!address.name || !address.street || !address.city || !address.phone || !address.email) {
        toast.error("Sab required fields fill karein (Email + Phone zaroori hai)");
        return;
      }
      if (!isValidEmail(address.email)) {
        toast.error("Email format galat hai");
        return;
      }
      if (!isValidPhone(address.phone)) {
        toast.error("Phone number format galat hai (e.g. +92 3XX XXXXXXX)");
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
            <h1 className="text-3xl font-display font-bold mb-8"><span className="text-gradient-gold">Checkout</span></h1>

            <div className="flex items-center justify-between mb-10">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span className={`text-sm hidden sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                  {i < steps.length - 1 && <div className={`w-8 sm:w-16 h-px mx-2 ${i < step ? "bg-primary" : "bg-border"}`} />}
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {step === 0 && (
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><MapPin size={18} className="text-primary" /> Delivery Address (Pakistan)</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div><Label>Full Name *</Label><Input value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} placeholder="Muhammad Ali" /></div>
                      <div><Label>Street Address / Area *</Label><Input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="House #12, Street 5, Gulberg III" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Province *</Label>
                          <select value={address.province} onChange={(e) => setAddress({ ...address, province: e.target.value, city: "" })} className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground">
                            <option value="">Select Province</option>
                            {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                        <div>
                          <Label>City *</Label>
                          <select value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground" disabled={!address.province}>
                            <option value="">{address.province ? "Select City" : "Select Province First"}</option>
                            {getCitiesByProvince(address.province).map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><Label>Postal Code</Label><Input value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} placeholder="54000" /></div>
                        <div><Label>Phone Number *</Label><Input type="tel" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="+92 3XX XXXXXXX" /></div>
                      </div>
                      <div><Label>Email Address *</Label><Input type="email" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} placeholder="you@example.com" /></div>
                    </CardContent>
                  </Card>
                )}

                {step === 1 && (
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Truck size={18} className="text-primary" /> Shipping Method</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { id: "standard", label: "Standard Delivery", desc: "5-7 working days", price: "Free" },
                        { id: "express", label: "Express Delivery", desc: "2-3 working days", price: "Rs. 300" },
                        { id: "overnight", label: "Overnight Delivery", desc: "Next working day (major cities)", price: "Rs. 500" },
                      ].map((opt) => (
                        <label key={opt.id} className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${shipping === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                          <div className="flex items-center gap-3">
                            <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id} onChange={() => setShipping(opt.id)} className="accent-primary" />
                            <div><p className="font-medium text-sm">{opt.label}</p><p className="text-xs text-muted-foreground">{opt.desc}</p></div>
                          </div>
                          <span className="text-sm font-semibold text-primary">{opt.price}</span>
                        </label>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {step === 2 && (
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><CreditCard size={18} className="text-primary" /> Payment Method</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-primary bg-primary/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Banknote size={20} className="text-primary" /></div>
                          <div><p className="font-medium text-sm">Cash on Delivery (COD)</p><p className="text-xs text-muted-foreground">Order receive hone par payment karein</p></div>
                        </div>
                        <Check size={18} className="text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {step === 3 && (
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Check size={18} className="text-primary" /> Order Confirmation</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-secondary/50 rounded-lg p-4">
                        <h3 className="font-medium text-sm mb-2">Delivery Address:</h3>
                        <p className="text-sm text-muted-foreground">{address.name}<br />{address.street}<br />{address.city}, {address.province} {address.zip}<br />Phone: {address.phone}<br />Email: {address.email}</p>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-4">
                        <h3 className="font-medium text-sm mb-2">Shipping:</h3>
                        <p className="text-sm text-muted-foreground capitalize">{shipping} delivery</p>
                      </div>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm py-1">
                            <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                            <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => step > 0 ? setStep(step - 1) : navigate("/cart")} className="gap-2">
                    <ArrowLeft size={16} /> {step > 0 ? "Back" : "Cart"}
                  </Button>
                  {step < 3 ? (
                    <Button onClick={nextStep} className="bg-gradient-gold text-primary-foreground font-semibold">Continue</Button>
                  ) : (
                    <Button onClick={handlePlaceOrder} disabled={createOrder.isPending} className="bg-gradient-gold text-primary-foreground font-semibold shadow-gold">
                      {createOrder.isPending ? "Placing Order..." : "Place Order (COD)"}
                    </Button>
                  )}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
                <h3 className="font-display font-bold text-lg mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items ({totalItems})</span>
                    <span>Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shippingCost === 0 ? "text-primary" : ""}>
                      {shippingCost === 0 ? "Free" : `Rs. ${shippingCost.toLocaleString()}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Discount</span>
                      <span>- Rs. {discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between font-display font-bold">
                    <span>Total</span>
                    <span className="text-gradient-gold text-lg">Rs. {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="border-t border-border pt-4 mt-4">
                  <p className="text-sm font-medium mb-2 flex items-center gap-1.5"><Tag size={14} className="text-primary" /> Coupon Code</p>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2">
                      <div>
                        <span className="font-mono font-bold text-sm text-primary">{appliedCoupon.code}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({appliedCoupon.type === "percent" ? `${appliedCoupon.discount}%` : `Rs. ${appliedCoupon.discount}`} off)
                        </span>
                      </div>
                      <button onClick={removeCoupon} className="text-muted-foreground hover:text-destructive"><X size={16} /></button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="font-mono text-sm"
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      />
                      <Button size="sm" variant="outline" onClick={handleApplyCoupon} disabled={validateCoupon.isPending} className="shrink-0">
                        {validateCoupon.isPending ? "..." : "Apply"}
                      </Button>
                    </div>
                  )}
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
