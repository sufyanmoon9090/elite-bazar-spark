import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { revenueData, categoryDistribution, orders } from "@/data/adminMockData";

const dailyData = [
  { day: "Mon", sales: 4200, visitors: 1200 },
  { day: "Tue", sales: 3800, visitors: 980 },
  { day: "Wed", sales: 5100, visitors: 1450 },
  { day: "Thu", sales: 4700, visitors: 1320 },
  { day: "Fri", sales: 6200, visitors: 1780 },
  { day: "Sat", sales: 7800, visitors: 2100 },
  { day: "Sun", sales: 5500, visitors: 1650 },
];

const topProducts = [
  { name: "Smart Watch Ultra", units: 567, revenue: 255_033 },
  { name: "Premium Wireless Headphones", units: 342, revenue: 102_597 },
  { name: "Noise Cancelling Earbuds", units: 298, revenue: 59_597 },
  { name: "Designer Leather Bag", units: 213, revenue: 40_468 },
  { name: "Luxury Perfume Set", units: 421, revenue: 54_725 },
];

const tooltipStyle = {
  background: "hsl(220,18%,10%)",
  border: "1px solid hsl(220,15%,18%)",
  borderRadius: "8px",
  color: "hsl(40,20%,95%)",
};

export default function Reports() {
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
          { label: "Weekly Revenue", value: "$37,300", change: "+14%", up: true, icon: DollarSign },
          { label: "Weekly Orders", value: "486", change: "+9%", up: true, icon: ShoppingCart },
          { label: "New Customers", value: "124", change: "+22%", up: true, icon: Users },
          { label: "Return Rate", value: "2.4%", change: "-0.3%", up: false, icon: Package },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-md bg-primary/10"><s.icon className="h-4 w-4 text-primary" /></div>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${s.up ? "text-green-400" : "text-destructive"}`}>
                  {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{s.change}
                </span>
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
          <CardHeader><CardTitle className="text-base">Daily Sales</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                <XAxis dataKey="day" stroke="hsl(220,10%,55%)" fontSize={12} />
                <YAxis stroke="hsl(220,10%,55%)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Sales"]} />
                <Area type="monotone" dataKey="sales" stroke="hsl(43,74%,49%)" fill="hsl(43,74%,49%)" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Daily Visitors</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                <XAxis dataKey="day" stroke="hsl(220,10%,55%)" fontSize={12} />
                <YAxis stroke="hsl(220,10%,55%)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="visitors" stroke="hsl(220,60%,60%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(220,60%,60%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader><CardTitle className="text-base">Top Products by Revenue</CardTitle></CardHeader>
        <CardContent>
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
                    <td className="py-3 px-2 text-primary font-medium">${p.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
