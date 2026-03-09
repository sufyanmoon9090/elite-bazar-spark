import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAllOrders, useUpdateOrderStatus } from "@/hooks/useOrders";
import { Search, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-destructive/20 text-destructive",
};

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const { data: orders = [], isLoading } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
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
    } catch {
      toast({ title: "Failed to update order", variant: "destructive" });
    }
  };

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
                    const fullAddress = [addr?.street, addr?.city, addr?.province, addr?.zip]
                      .filter((value) => typeof value === "string" && value.trim().length > 0)
                      .join(", ");
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ""}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
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
    </div>
  );
}
