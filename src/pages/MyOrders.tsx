import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, XCircle, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMyOrders } from "@/hooks/useOrders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-yellow-500", label: "Pending" },
  processing: { icon: Package, color: "text-blue-500", label: "Processing" },
  shipped: { icon: Truck, color: "text-purple-500", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "text-green-500", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-destructive", label: "Cancelled" },
};

const statusSteps = ["pending", "processing", "shipped", "delivered"];

const MyOrders = () => {
  const { user } = useAuth();
  const { data: orders = [], isLoading } = useMyOrders(user?.id);

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-display font-bold mb-8">
              My <span className="text-gradient-gold">Orders</span>
            </h1>

            {isLoading ? (
              <p className="text-muted-foreground">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="mx-auto text-muted-foreground mb-4" size={48} />
                <p className="text-lg text-muted-foreground mb-4">No orders yet</p>
                <Link to="/shop">
                  <Button className="bg-gradient-gold text-primary-foreground">Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const config = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  const currentStepIndex = statusSteps.indexOf(order.status);
                  const isCancelled = order.status === "cancelled";
                  const items = order.items as any[];

                  return (
                    <div key={order.id} className="bg-card border border-border rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Order #{order.order_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <div className={`flex items-center gap-1.5 ${config.color}`}>
                          <StatusIcon size={16} />
                          <span className="text-sm font-medium">{config.label}</span>
                        </div>
                      </div>

                      {/* Progress tracker */}
                      {!isCancelled && (
                        <div className="flex items-center mb-6">
                          {statusSteps.map((step, i) => {
                            const stepConf = statusConfig[step];
                            const StepIcon = stepConf.icon;
                            const isCompleted = i <= currentStepIndex;
                            return (
                              <div key={step} className="flex items-center flex-1 last:flex-none">
                                <div className={`flex flex-col items-center`}>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                                    <StepIcon size={14} />
                                  </div>
                                  <span className={`text-[10px] mt-1 ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>{stepConf.label}</span>
                                </div>
                                {i < statusSteps.length - 1 && (
                                  <div className={`flex-1 h-0.5 mx-1 mt-[-16px] ${i < currentStepIndex ? "bg-primary" : "bg-border"}`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {isCancelled && (
                        <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4">
                          This order has been cancelled.
                        </div>
                      )}

                      {/* Items */}
                      <div className="space-y-2 border-t border-border pt-4">
                        {items.map((item: any, i: number) => (
                          <div key={i} className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
                        <span className="text-sm text-muted-foreground">
                          {order.shipping_method} delivery • {(order.address as any)?.city}
                        </span>
                        <span className="font-display font-bold text-gradient-gold">
                          Rs. {(Number(order.total) + Number(order.shipping_cost)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
