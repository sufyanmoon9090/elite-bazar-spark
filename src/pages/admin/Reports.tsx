import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Loader2 } from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfDay } from "date-fns";

const tooltipStyle = {
  background: "hsl(220,18%,10%)",
  border: "1px solid hsl(220,15%,18%)",
  borderRadius: "8px",
  color: "hsl(40,20%,95%)",
};

const useReportsData = () =>
  useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const [ordersRes, profilesRes, productsRes] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, created_at:updated_at"),
        supabase.from("products").select("id, name, price, category"),
      ]);

      const orders = ordersRes.data || [];
      const profiles = profilesRes.data || [];
      const products = productsRes.data || [];

      // Weekly stats
      const weekAgo = subDays(new Date(), 7);
      const twoWeeksAgo = subDays(new Date(), 14);
      const thisWeekOrders = orders.filter((o) => new Date(o.created_at) >= weekAgo);
      const lastWeekOrders = orders.filter((o) => new Date(o.created_at) >= twoWeeksAgo && new Date(o.created_at) < weekAgo);

      const thisWeekRevenue = thisWeekOrders.reduce((s, o) => s + Number(o.total), 0);
      const lastWeekRevenue = lastWeekOrders.reduce((s, o) => s + Number(o.total), 0);
      const revenueChange = lastWeekRevenue > 0 ? Math.round(((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100) : 0;
      const ordersChange = lastWeekOrders.length > 0 ? Math.round(((thisWeekOrders.length - lastWeekOrders.length) / lastWeekOrders.length) * 100) : 0;
      const cancelledThisWeek = thisWeekOrders.filter((o) => o.status === "cancelled").length;
      const returnRate = thisWeekOrders.length > 0 ? ((cancelledThisWeek / thisWeekOrders.length) * 100).toFixed(1) : "0";

      // Daily data for last 7 days
      const dailyData = Array.from({ length: 7 }, (_, i) => {
        const day = subDays(new Date(), 6 - i);
        const dayStart = startOfDay(day);
        const dayEnd = new Date(dayStart.getTime() + 86400000);
        const dayOrders = orders.filter((o) => new Date(o.created_at) >= dayStart && new Date(o.created_at) < dayEnd);
        return {
          day: format(day, "EEE"),
          sales: dayOrders.reduce((s, o) => s + Number(o.total), 0),
          orders: dayOrders.length,
        };
      });

      // Top products by order items
      const productSales: Record<string, { name: string; units: number; revenue: number }> = {};
      orders.forEach((order) => {
        const items = order.items as any[];
        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            const key = item.id || item.name;
            if (!productSales[key]) productSales[key] = { name: item.name || "Unknown", units: 0, revenue: 0 };
            productSales[key].units += item.quantity || 1;
            productSales[key].revenue += (item.price || 0) * (item.quantity || 1);
          });
        }
      });
      const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

      return {
        summary: {
          weeklyRevenue: thisWeekRevenue,
          revenueChange,
          weeklyOrders: thisWeekOrders.length,
          ordersChange,
          totalCustomers: profiles.length,
          returnRate,
        },
        dailyData,
        topProducts,
        totalOrders: orders.length,
      };
    },
  });

export default function Reports() {
  const { data, isLoading } = useReportsData();

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!data) return null;

  const { summary, dailyData, topProducts } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Reports</h2>
          <p className="text-muted-foreground text-sm">Analytics & performance insights</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export CSV</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Weekly Revenue", value: `Rs. ${summary.weeklyRevenue.toLocaleString()}`, change: `${summary.revenueChange >= 0 ? "+" : ""}${summary.revenueChange}%`, up: summary.revenueChange >= 0, icon: DollarSign },
          { label: "Weekly Orders", value: String(summary.weeklyOrders), change: `${summary.ordersChange >= 0 ? "+" : ""}${summary.ordersChange}%`, up: summary.ordersChange >= 0, icon: ShoppingCart },
          { label: "Total Customers", value: String(summary.totalCustomers), change: "", up: true, icon: Users },
          { label: "Cancel Rate", value: `${summary.returnRate}%`, change: "", up: false, icon: Package },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-primary/10"><s.icon className="h-4 w-4 text-primary" /></div>
                {s.change && (
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${s.up ? "text-green-400" : "text-destructive"}`}>
                    {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{s.change}
                  </span>
                )}
              </div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Daily Sales (Last 7 Days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                <XAxis dataKey="day" stroke="hsl(220,10%,55%)" fontSize={12} />
                <YAxis stroke="hsl(220,10%,55%)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`Rs. ${v.toLocaleString()}`, "Sales"]} />
                <Area type="monotone" dataKey="sales" stroke="hsl(43,74%,49%)" fill="hsl(43,74%,49%)" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Daily Orders (Last 7 Days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                <XAxis dataKey="day" stroke="hsl(220,10%,55%)" fontSize={12} />
                <YAxis stroke="hsl(220,10%,55%)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="orders" stroke="hsl(220,60%,60%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(220,60%,60%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader><CardTitle className="text-base">Top Products by Revenue</CardTitle></CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No order data yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">#</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Product</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Units Sold</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr key={p.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2 text-muted-foreground">{i + 1}</td>
                      <td className="py-3 px-2 font-medium">{p.name}</td>
                      <td className="py-3 px-2 text-muted-foreground">{p.units.toLocaleString()}</td>
                      <td className="py-3 px-2 text-primary font-medium">Rs. {p.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
