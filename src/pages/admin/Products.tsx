import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useProductVariants, useAddVariant, useUpdateVariant, useDeleteVariant, ProductVariant } from "@/hooks/useProductVariants";
import { useCategories } from "@/hooks/useCategories";
import { Product } from "@/data/mockData";
import { Plus, Search, Pencil, Trash2, X, ImagePlus, Layers } from "lucide-react";
import ImageUpload, { MultiImageUpload } from "@/components/admin/ImageUpload";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

export default function Products() {
  const { data: productList = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const addVariant = useAddVariant();
  const updateVariant = useUpdateVariant();
  const deleteVariant = useDeleteVariant();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  // Variant management
  const [variantDialog, setVariantDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { data: variants = [] } = useProductVariants(selectedProductId ?? undefined);
  const [variantForm, setVariantForm] = useState({ variant_name: "", price: "", original_price: "", image: "", description: "" });
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);

  const [form, setForm] = useState({ name: "", price: "", category: "", image: "", description: "", images: [] as string[], supplierUrl: "" });
  const [newImageUrl, setNewImageUrl] = useState("");

  const filtered = productList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditingProduct(null);
    setForm({ name: "", price: "", category: "", image: "", description: "", images: [], supplierUrl: "" });
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
      supplierUrl: product.supplierUrl || "",
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
      updateProduct.mutate({
        id: editingProduct.id,
        data: {
          name: form.name,
          price: parseFloat(form.price),
          category: form.category,
          image: mainImage,
          images: form.images.length > 0 ? form.images : undefined,
          description: form.description,
          supplierUrl: form.supplierUrl,
        },
      }, {
        onSuccess: () => toast({ title: "Product updated" }),
        onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
      });
    } else {
      addProduct.mutate({
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        image: mainImage,
        images: form.images.length > 0 ? form.images : undefined,
        rating: 0,
        reviews: 0,
        description: form.description,
        supplierUrl: form.supplierUrl,
      }, {
        onSuccess: () => toast({ title: "Product added" }),
        onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
      });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteProduct.mutate(id, {
      onSuccess: () => toast({ title: "Product deleted", variant: "destructive" }),
      onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
    });
  };

  // Variant handlers
  const openVariants = (productId: string) => {
    setSelectedProductId(productId);
    setEditingVariant(null);
    setVariantForm({ variant_name: "", price: "", original_price: "", image: "", description: "" });
    setVariantDialog(true);
  };

  const openEditVariant = (v: ProductVariant) => {
    setEditingVariant(v);
    setVariantForm({
      variant_name: v.variant_name,
      price: v.price.toString(),
      original_price: v.original_price?.toString() || "",
      image: v.image,
      description: v.description || "",
    });
  };

  const resetVariantForm = () => {
    setEditingVariant(null);
    setVariantForm({ variant_name: "", price: "", original_price: "", image: "", description: "" });
  };

  const handleSaveVariant = () => {
    if (!variantForm.variant_name || !variantForm.price || !selectedProductId) return;
    const payload = {
      variant_name: variantForm.variant_name,
      price: parseFloat(variantForm.price),
      original_price: variantForm.original_price ? parseFloat(variantForm.original_price) : null,
      image: variantForm.image,
      description: variantForm.description || null,
    };

    if (editingVariant) {
      updateVariant.mutate({ id: editingVariant.id, data: { ...payload, product_id: selectedProductId } }, {
        onSuccess: () => { toast({ title: "Variant updated" }); resetVariantForm(); },
        onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
      });
    } else {
      addVariant.mutate({ ...payload, product_id: selectedProductId }, {
        onSuccess: () => { toast({ title: "Variant added" }); resetVariantForm(); },
        onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
      });
    }
  };

  const handleDeleteVariant = (id: string) => {
    if (!selectedProductId) return;
    deleteVariant.mutate({ id, productId: selectedProductId }, {
      onSuccess: () => toast({ title: "Variant deleted", variant: "destructive" }),
    });
  };

  if (isLoading) {
    return <div className="text-center py-10 text-muted-foreground">Loading products...</div>;
  }

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
                <div><Label>Price (Rs.)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" /></div>
                <div>
                  <Label>Category</Label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="products" label="Main Image" />

                <MultiImageUpload value={form.images} onChange={(urls) => setForm({ ...form, images: urls })} folder="products" label="Additional Images" />

                {/* ADMIN ONLY — never rendered on the public storefront */}
                <div>
                  <Label>Supplier Sourcing Link (private)</Label>
                  <Input
                    value={form.supplierUrl}
                    onChange={(e) => setForm({ ...form, supplierUrl: e.target.value })}
                    placeholder="https://markaz.app/product/..."
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Visible only inside the admin panel. Used for the "Order from Supplier" button.
                  </p>
                </div>
                <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description" /></div>
                <Button onClick={handleSave} className="w-full" disabled={addProduct.isPending || updateProduct.isPending}>
                  {editingProduct ? "Update Product" : "Add Product"}
                </Button>
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
                  <p className="text-primary font-bold text-sm mt-0.5">Rs. {product.price.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="secondary" className="text-[10px]">{product.category}</Badge>
                    {product.images && product.images.length > 0 && (
                      <Badge variant="outline" className="text-[10px]">{product.images.length} imgs</Badge>
                    )}
                    <Badge variant={(product as any).in_stock === false ? "destructive" : "default"} className="text-[10px]">
                      {(product as any).in_stock === false ? "Out of Stock" : "In Stock"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Switch
                    checked={(product as any).in_stock !== false}
                    onCheckedChange={(checked) => updateProduct.mutate({ id: product.id, data: { in_stock: checked } as any }, { onSuccess: () => toast({ title: checked ? "Marked in stock" : "Marked out of stock" }) })}
                    className="scale-75"
                  />
                  <span className="text-[10px] text-muted-foreground">Stock</span>
                  <div className="ml-auto flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(product)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openVariants(product.id)} title="Manage Variants"><Layers className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(product.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Variant Management Dialog */}
      <Dialog open={variantDialog} onOpenChange={setVariantDialog}>
        <DialogContent className="max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Manage Variants</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-4">
              {/* Existing variants */}
              {variants.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Existing Variants ({variants.length})</Label>
                  {variants.map((v) => (
                    <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                      {v.image && <img src={v.image} alt={v.variant_name} className="w-12 h-12 rounded object-cover" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{v.variant_name}</p>
                        <p className="text-xs text-primary">Rs. {v.price.toLocaleString()}{v.original_price ? ` (was Rs. ${v.original_price.toLocaleString()})` : ""}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => openEditVariant(v)}><Pencil className="h-3 w-3" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0 text-destructive" onClick={() => handleDeleteVariant(v.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add/Edit variant form */}
              <div className="border-t border-border pt-4 space-y-3">
                <Label className="font-semibold">{editingVariant ? "Edit Variant" : "Add New Variant"}</Label>
                <div><Label className="text-xs">Variant Name (e.g. Brown, Large, 128GB)</Label><Input value={variantForm.variant_name} onChange={(e) => setVariantForm({ ...variantForm, variant_name: e.target.value })} placeholder="Brown" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Price (Rs.)</Label><Input type="number" value={variantForm.price} onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })} placeholder="0" /></div>
                  <div><Label className="text-xs">Original Price</Label><Input type="number" value={variantForm.original_price} onChange={(e) => setVariantForm({ ...variantForm, original_price: e.target.value })} placeholder="Optional" /></div>
                </div>
                <ImageUpload value={variantForm.image} onChange={(url) => setVariantForm({ ...variantForm, image: url })} folder="variants" label="Variant Image" />
                <div><Label className="text-xs">Description</Label><Textarea value={variantForm.description} onChange={(e) => setVariantForm({ ...variantForm, description: e.target.value })} placeholder="Variant specific description" rows={2} /></div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveVariant} className="flex-1" disabled={addVariant.isPending || updateVariant.isPending}>
                    {editingVariant ? "Update Variant" : "Add Variant"}
                  </Button>
                  {editingVariant && <Button variant="outline" onClick={resetVariantForm}>Cancel</Button>}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
