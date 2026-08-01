import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAllOrders, useUpdateOrderStatus, type Order } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { Search, ExternalLink, ChevronDown, Eye, CheckCircle2, MapPin, Phone, User, Package, CreditCard, Truck, Calendar, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const { data: orders = [], isLoading } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();
  // Products are loaded to resolve each ordered item's private supplier sourcing link
  const { data: products = [] } = useProducts();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      (o.address as any)?.name?.toLowerCase().includes(search.toLowerCase()) || "";
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = async (orderId: string, orderNumber: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ orderId, status: newStatus });
      toast({ title: `Order ${orderNumber} updated to ${newStatus}` });
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch {
      toast({ title: "Failed to update order", variant: "destructive" });
    }
  };

  const buildFullAddress = (addr: any) =>
    [addr?.street, addr?.city, addr?.province, addr?.zip, addr?.country]
      .filter((v) => typeof v === "string" && v.trim().length > 0)
      .join(", ");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Orders</h2>
        <p className="text-muted-foreground text-sm">Manage and track all orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="pl-9" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 capitalize">
              {filterStatus === "all" ? "All Status" : filterStatus}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterStatus("all")}>All</DropdownMenuItem>
            {statuses.map((s) => (
              <DropdownMenuItem key={s} onClick={() => setFilterStatus(s)} className="capitalize">{s}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading orders...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Order #</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Address</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Items</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Total</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => {
                    const addr = order.address as any;
                    const items = order.items as any[];
                    const fullAddress = buildFullAddress(addr);
                    return (
                      <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-medium">{order.order_number}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p>{addr?.name || "—"}</p>
                            <p className="text-xs text-muted-foreground">{addr?.phone || ""}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground max-w-[220px]">
                          <p className="truncate" title={fullAddress || "—"}>{fullAddress || "—"}</p>
                        </td>
                        <td className="py-3 px-4">{items.length} items</td>
                        <td className="py-3 px-4">Rs. {(Number(order.total) + Number(order.shipping_cost)).toLocaleString()}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[order.status] || ""}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-3 w-3" /> View
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 text-xs">
                                  Update <ChevronDown className="h-3 w-3 ml-1" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                {statuses.map((s) => (
                                  <DropdownMenuItem key={s} onClick={() => handleUpdateStatus(order.id, order.order_number, s)} className="capitalize">
                                    {s}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">No orders found</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (() => {
            const addr = selectedOrder.address as any;
            const items = selectedOrder.items as any[];
            const fullAddress = buildFullAddress(addr);
            const subtotal = Number(selectedOrder.total);
            const shipping = Number(selectedOrder.shipping_cost);
            const grandTotal = subtotal + shipping;

            return (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <DialogTitle className="text-xl font-display">
                        Order {selectedOrder.order_number}
                      </DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(selectedOrder.created_at).toLocaleString("en-PK", {
                          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </DialogDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${statusColors[selectedOrder.status] || ""}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </DialogHeader>

                <div className="space-y-5 mt-2">
                  {/* Customer & Address */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" /> Customer
                      </h4>
                      <p className="text-sm font-medium">{addr?.name || "—"}</p>
                      {addr?.phone && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Phone className="h-3 w-3" /> {addr.phone}
                        </p>
                      )}
                      {addr?.email && (
                        <p className="text-xs text-muted-foreground break-all">{addr.email}</p>
                      )}
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" /> Shipping Address
                      </h4>
                      <div className="text-sm text-muted-foreground space-y-0.5">
                        {addr?.street && <p>{addr.street}</p>}
                        {(addr?.city || addr?.province) && (
                          <p>{[addr?.city, addr?.province].filter(Boolean).join(", ")}</p>
                        )}
                        {addr?.zip && <p>ZIP: {addr.zip}</p>}
                        {addr?.country && <p>{addr.country}</p>}
                        {!fullAddress && <p>—</p>}
                      </div>
                    </div>
                  </div>

                  {/* Payment & Shipping method */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-border bg-muted/20 p-4">
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-1">
                        <CreditCard className="h-4 w-4 text-primary" /> Payment
                      </h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {selectedOrder.payment_method || "Cash on Delivery"}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/20 p-4">
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-1">
                        <Truck className="h-4 w-4 text-primary" /> Shipping Method
                      </h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {selectedOrder.shipping_method || "Standard"}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="rounded-lg border border-border">
                    <div className="p-4 border-b border-border flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-semibold">Items ({items.length})</h4>
                    </div>
                    <div className="divide-y divide-border">
                      {items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover bg-muted" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} × Rs. {Number(item.price).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <p className="text-sm font-semibold">
                              Rs. {(Number(item.price) * Number(item.quantity)).toLocaleString()}
                            </p>
                            {/* ADMIN ONLY: direct fulfillment link to the supplier listing */}
                            {(() => {
                              const supplierUrl = products.find((p) => p.id === item.id)?.supplierUrl;
                              return supplierUrl ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 gap-1 text-[11px]"
                                  asChild
                                >
                                  <a href={supplierUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3" /> Order from Supplier
                                  </a>
                                </Button>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">No supplier link</span>
                              );
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>Rs. {shipping.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Grand Total</span>
                      <span className="text-primary">Rs. {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    {selectedOrder.status === "pending" && (
                      <Button
                        className="flex-1 gap-2"
                        onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.order_number, "processing")}
                      >
                        <CheckCircle2 className="h-4 w-4" /> Confirm Order
                      </Button>
                    )}
                    {selectedOrder.status === "processing" && (
                      <Button
                        className="flex-1 gap-2"
                        onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.order_number, "shipped")}
                      >
                        <Truck className="h-4 w-4" /> Mark as Shipped
                      </Button>
                    )}
                    {selectedOrder.status === "shipped" && (
                      <Button
                        className="flex-1 gap-2"
                        onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.order_number, "delivered")}
                      >
                        <CheckCircle2 className="h-4 w-4" /> Mark as Delivered
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          Change Status <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {statuses.map((s) => (
                          <DropdownMenuItem
                            key={s}
                            onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.order_number, s)}
                            className="capitalize"
                          >
                            {s}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {selectedOrder.status !== "cancelled" && selectedOrder.status !== "delivered" && (
                      <Button
                        variant="destructive"
                        className="gap-2"
                        onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.order_number, "cancelled")}
                      >
                        <XCircle className="h-4 w-4" /> Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
