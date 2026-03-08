import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths, startOfMonth } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-destructive/20 text-destructive",
};

const catColors = [
  "hsl(43, 74%, 49%)",
  "hsl(43, 80%, 65%)",
  "hsl(220, 15%, 40%)",
  "hsl(220, 15%, 55%)",
  "hsl(220, 10%, 35%)",
  "hsl(340, 60%, 50%)",
  "hsl(160, 50%, 40%)",
];

export default function Dashboard() {
  // Fetch orders
  const { data: orders = [] } = useQuery({
    queryKey: ["admin_orders_dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch users count
  const { data: usersData = [] } = useQuery({
    queryKey: ["admin_all_users"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_all_users_for_admin");
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch products for category distribution
  const { data: products = [] } = useQuery({
    queryKey: ["admin_products_dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("category");
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate stats
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
  const totalOrders = orders.length;
  const totalUsers = usersData.length;
  const totalProducts = products.length;

  const stats = [
    { title: "Total Revenue", value: `Rs ${totalRevenue.toLocaleString()}`, icon: DollarSign },
    { title: "Total Orders", value: totalOrders.toLocaleString(), icon: ShoppingCart },
    { title: "Total Users", value: totalUsers.toLocaleString(), icon: Users },
    { title: "Total Products", value: totalProducts.toLocaleString(), icon: TrendingUp },
  ];

  // Revenue by month (last 7 months)
  const revenueData = Array.from({ length: 7 }, (_, i) => {
    const date = subMonths(new Date(), 6 - i);
    const monthStart = startOfMonth(date);
    const monthLabel = format(date, "MMM");
    const monthOrders = orders.filter((o: any) => {
      const d = new Date(o.created_at);
      return d.getMonth() === monthStart.getMonth() && d.getFullYear() === monthStart.getFullYear();
    });
    const revenue = monthOrders.reduce((s: number, o: any) => s + Number(o.total || 0), 0);
    return { month: monthLabel, revenue };
  });

  // Category distribution from products
  const catMap: Record<string, number> = {};
  products.forEach((p: any) => {
    const cat = p.category || "Other";
    catMap[cat] = (catMap[cat] || 0) + 1;
  });
  const totalCatCount = products.length || 1;
  const categoryDistribution = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, count], i) => ({
      name,
      value: Math.round((count / totalCatCount) * 100),
      fill: catColors[i % catColors.length],
    }));

  // Recent 5 orders
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Dashboard</h2>
        <p className="text-muted-foreground text-sm">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) => [`Rs ${value.toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="hsl(43,74%,49%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryDistribution.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))",
                      }}
                      formatter={(value: number) => [`${value}%`, "Share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {categoryDistribution.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.fill }} />
                        <span className="text-muted-foreground">{cat.name}</span>
                      </div>
                      <span className="font-medium">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No products yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Order</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Date</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Total</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2 font-medium">{order.order_number}</td>
                      <td className="py-3 px-2 text-muted-foreground">{format(new Date(order.created_at), "MMM dd, yyyy")}</td>
                      <td className="py-3 px-2">Rs {Number(order.total).toLocaleString()}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ""}`}>
                          {order.status}
                        </span>
                      </td>
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
