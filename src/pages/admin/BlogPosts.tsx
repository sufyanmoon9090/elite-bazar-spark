import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost, BlogPost } from "@/hooks/useBlogPosts";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function BlogPosts() {
  const { data: posts = [], isLoading } = useBlogPosts();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ title: "", excerpt: "", image: "", category: "", date: "", sort_order: 0 });

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", excerpt: "", image: "", category: "", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), sort_order: posts.length + 1 });
    setDialogOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({ title: post.title, excerpt: post.excerpt, image: post.image, category: post.category, date: post.date, sort_order: post.sort_order });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title) return;
    if (editing) {
      updatePost.mutate({ id: editing.id, ...form }, {
        onSuccess: () => { toast({ title: "Guide updated" }); setDialogOpen(false); },
        onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
      });
    } else {
      createPost.mutate(form, {
        onSuccess: () => { toast({ title: "Guide added" }); setDialogOpen(false); },
        onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
      });
    }
  };

  const handleDelete = (id: string) => {
    deletePost.mutate(id, {
      onSuccess: () => toast({ title: "Guide deleted", variant: "destructive" }),
    });
  };

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Blog / Guides</h2>
          <p className="text-muted-foreground text-sm">{posts.length} guides published</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Add Guide</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <div className="aspect-video overflow-hidden">
              <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-primary">{post.category}</span>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </div>
              <h3 className="font-medium text-sm mb-1">{post.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => openEdit(post)}><Pencil className="h-3 w-3" /> Edit</Button>
                <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-destructive hover:text-destructive" onClick={() => handleDelete(post.id)}><Trash2 className="h-3 w-3" /> Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Guide" : "Add New Guide"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Guide title" /></div>
            <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Tech, Fashion, Home..." /></div>
            <div><Label>Date</Label><Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="Mar 5, 2026" /></div>
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="blog" label="Cover Image" />
            <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief description..." rows={3} /></div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
            <Button onClick={handleSave} className="w-full" disabled={createPost.isPending || updatePost.isPending}>
              {editing ? "Update Guide" : "Add Guide"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
