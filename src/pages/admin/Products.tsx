import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProductStore } from "@/store/productStore";
import { Product } from "@/data/mockData";
import { Plus, Search, Pencil, Trash2, X, ImagePlus } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Products() {
  const { products: productList, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({ name: "", price: "", category: "", image: "", description: "", images: [] as string[] });
  const [newImageUrl, setNewImageUrl] = useState("");

  const filtered = productList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditingProduct(null);
    setForm({ name: "", price: "", category: "", image: "", description: "", images: [] });
    setNewImageUrl("");
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      description: product.description || "",
      images: product.images || [],
    });
    setNewImageUrl("");
    setDialogOpen(true);
  };

  const addImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setForm({ ...form, images: [...form.images, newImageUrl.trim()] });
    setNewImageUrl("");
  };

  const removeImage = (index: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    const mainImage = form.image || form.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80";
    
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        image: mainImage,
        images: form.images.length > 0 ? form.images : undefined,
        description: form.description,
      });
      toast({ title: "Product updated" });
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        image: mainImage,
        images: form.images.length > 0 ? form.images : undefined,
        rating: 0,
        reviews: 0,
        description: form.description,
      };
      addProduct(newProduct);
      toast({ title: "Product added" });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast({ title: "Product deleted", variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Products</h2>
          <p className="text-muted-foreground text-sm">{productList.length} products in catalog</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-4 pt-2">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" /></div>
                <div><Label>Price ($)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" /></div>
                <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="electronics" /></div>
                <div><Label>Main Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
                
                {/* Multiple Images Section */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><ImagePlus className="h-4 w-4" /> Product Images</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Paste image URL and click Add"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                    />
                    <Button type="button" variant="secondary" onClick={addImageUrl} className="shrink-0">Add</Button>
                  </div>
                  {form.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {form.images.map((img, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-border">
                          <img src={img} alt={`Image ${idx + 1}`} className="w-full aspect-square object-cover" />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <span className="absolute bottom-1 left-1 text-[10px] bg-card/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-foreground">
                            {idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">Add multiple image URLs for a product gallery.</p>
                </div>

                <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description" /></div>
                <Button onClick={handleSave} className="w-full">{editingProduct ? "Update Product" : "Add Product"}</Button>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-9" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="flex">
              <img src={product.image} alt={product.name} className="w-24 h-24 object-cover" />
              <CardContent className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                  <p className="text-primary font-bold text-sm mt-0.5">${product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="secondary" className="text-[10px]">{product.category}</Badge>
                    {product.images && product.images.length > 0 && (
                      <Badge variant="outline" className="text-[10px]">{product.images.length} imgs</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 mt-2">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(product)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(product.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
