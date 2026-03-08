import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategories, useAddCategory, useUpdateCategory, useDeleteCategory, DbCategory } from "@/hooks/useCategories";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Categories() {
  const { data: categories = [], isLoading } = useCategories();
  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DbCategory | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", icon: "📦" });

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", slug: "", icon: "📦" });
    setDialogOpen(true);
  };

  const openEdit = (cat: DbCategory) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon });
    setDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setForm({ ...form, name, slug: editing ? form.slug : slug });
  };

  const handleSave = () => {
    if (!form.name || !form.slug) return;
    if (editing) {
      updateCategory.mutate({ id: editing.id, data: { name: form.name, slug: form.slug, icon: form.icon } }, {
        onSuccess: () => { toast({ title: "Category updated" }); setDialogOpen(false); },
        onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
      });
    } else {
      addCategory.mutate({ name: form.name, slug: form.slug, icon: form.icon, sort_order: categories.length }, {
        onSuccess: () => { toast({ title: "Category added" }); setDialogOpen(false); },
        onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteCategory.mutate(id, {
      onSuccess: () => toast({ title: "Category deleted", variant: "destructive" }),
      onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
    });
  };

  if (isLoading) return <div className="text-center py-10 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Categories</h2>
          <p className="text-muted-foreground text-sm">{categories.length} categories</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Add Category</Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Electronics" />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="electronics" />
                <p className="text-xs text-muted-foreground mt-1">Used for filtering (auto-generated)</p>
              </div>
              <div>
                <Label>Icon (Emoji)</Label>
                <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="📦" className="text-2xl" />
              </div>
              <Button onClick={handleSave} className="w-full" disabled={addCategory.isPending || updateCategory.isPending}>
                {editing ? "Update" : "Add Category"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <span className="text-3xl">{cat.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">{cat.name}</h3>
                <p className="text-xs text-muted-foreground">slug: {cat.slug}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(cat)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(cat.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No categories yet. Add your first category!
        </div>
      )}
    </div>
  );
}
