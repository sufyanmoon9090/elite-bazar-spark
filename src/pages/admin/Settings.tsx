import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Save, Store, Bell, Shield, Palette } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [store, setStore] = useState({ name: "Elite Bazar", email: "admin@elitebazar.com", currency: "USD", taxRate: "8.5" });
  const [notifications, setNotifications] = useState({ orderEmail: true, lowStock: true, newCustomer: false, weeklyReport: true });
  const [security, setSecurity] = useState({ twoFactor: false, sessionTimeout: "30" });

  const handleSave = () => toast({ title: "Settings saved successfully" });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-display font-bold">Settings</h2>
        <p className="text-muted-foreground text-sm">Manage your store configuration</p>
      </div>

      {/* Store Info */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Store className="h-4 w-4" /> Store Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Store Name</Label><Input value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} /></div>
            <div><Label>Contact Email</Label><Input value={store.email} onChange={(e) => setStore({ ...store, email: e.target.value })} /></div>
            <div><Label>Currency</Label>
              <select value={store.currency} onChange={(e) => setStore({ ...store, currency: e.target.value })} className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PKR">PKR (₨)</option>
              </select>
            </div>
            <div><Label>Tax Rate (%)</Label><Input type="number" value={store.taxRate} onChange={(e) => setStore({ ...store, taxRate: e.target.value })} /></div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {([
            ["orderEmail", "Order Confirmation Emails", "Send email notifications for new orders"],
            ["lowStock", "Low Stock Alerts", "Get notified when product stock is low"],
            ["newCustomer", "New Customer Alerts", "Notify when new customers register"],
            ["weeklyReport", "Weekly Reports", "Receive weekly performance summary"],
          ] as const).map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between">
              <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
              <Switch checked={notifications[key]} onCheckedChange={(v) => setNotifications({ ...notifications, [key]: v })} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Security</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Add extra layer of security</p></div>
            <Switch checked={security.twoFactor} onCheckedChange={(v) => setSecurity({ ...security, twoFactor: v })} />
          </div>
          <div className="max-w-xs">
            <Label>Session Timeout (minutes)</Label>
            <Input type="number" value={security.sessionTimeout} onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="gap-2"><Save className="h-4 w-4" /> Save Settings</Button>
    </div>
  );
}
