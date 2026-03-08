import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Tag, Copy, Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from "@/hooks/useCoupons";

export default function Coupons() {
  const { data: coupons = [], isLoading } = useCoupons();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCouponMut = useDeleteCoupon();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ code: "", discount: "", type: "percent" as "percent" | "fixed", minOrder: "", usageLimit: "", expiresAt: "" });
  const { toast } = useToast();

  const handleAdd = async () => {
    if (!form.code || !form.discount) return;
    try {
      await createCoupon.mutateAsync({
        code: form.code.toUpperCase(),
        discount: parseFloat(form.discount),
        type: form.type,
        min_order: parseFloat(form.minOrder) || 0,
        usage_limit: parseInt(form.usageLimit) || 999,
        active: true,
        expires_at: form.expiresAt || "2026-12-31",
      });
      setDialogOpen(false);
      setForm({ code: "", discount: "", type: "percent", minOrder: "", usageLimit: "", expiresAt: "" });
      toast({ title: "Coupon created" });
    } catch {
      toast({ title: "Error creating coupon", variant: "destructive" });
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    await updateCoupon.mutateAsync({ id, active: !active });
  };

  const handleDelete = async (id: string) => {
    await deleteCouponMut.mutateAsync(id);
    toast({ title: "Coupon deleted", variant: "destructive" });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: `Copied: ${code}` });
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Coupons</h2>
          <p className="text-muted-foreground text-sm">{coupons.length} coupons total</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> New Coupon</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Coupon</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="SUMMER25" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Discount</Label><Input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="10" /></div>
                <div><Label>Type</Label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "percent" | "fixed" })} className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground">
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed (Rs.)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Min Order (Rs.)</Label><Input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} placeholder="0" /></div>
                <div><Label>Usage Limit</Label><Input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="999" /></div>
              </div>
              <div><Label>Expires At</Label><Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} /></div>
              <Button onClick={handleAdd} disabled={createCoupon.isPending} className="w-full">
                {createCoupon.isPending ? "Creating..." : "Create Coupon"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {coupons.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">No coupons yet. Create your first coupon!</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {coupons.map((coupon) => {
            const isExpired = new Date(coupon.expires_at) < new Date();
            return (
              <Card key={coupon.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="font-mono font-bold text-lg">{coupon.code}</span>
                      <button onClick={() => copyCode(coupon.code)} className="text-muted-foreground hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button>
                    </div>
                    <Badge variant={coupon.active && !isExpired ? "default" : "secondary"} className={coupon.active && !isExpired ? "bg-green-500/20 text-green-400" : ""}>
                      {isExpired ? "Expired" : coupon.active ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-primary">{coupon.type === "percent" ? `${coupon.discount}%` : `Rs. ${coupon.discount}`} <span className="text-sm font-normal text-muted-foreground">off</span></p>
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p>Min order: Rs. {coupon.min_order}</p>
                    <p>Used: {coupon.used} / {coupon.usage_limit}</p>
                    <p>Expires: {coupon.expires_at}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => toggleActive(coupon.id, coupon.active)}>
                      {coupon.active ? "Disable" : "Enable"}
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(coupon.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
