import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useProductReviews, useAddReview } from "@/hooks/useProductReviews";
import { toast } from "sonner";

interface Props {
  productId: string;
}

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

const ProductReviews = ({ productId }: Props) => {
  const { user } = useAuth();
  const { data: reviews = [], isLoading } = useProductReviews(productId);
  const addReview = useAddReview();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    let nameToUse = "";
    let emailToUse = "";
    if (user) {
      nameToUse = user.user_metadata?.full_name || user.email || "Anonymous";
      emailToUse = user.email || "";
    } else {
      if (guestName.trim().length < 2) {
        toast.error("Apna naam likhein");
        return;
      }
      if (guestEmail && !isValidEmail(guestEmail)) {
        toast.error("Email format galat hai");
        return;
      }
      nameToUse = guestName.trim().slice(0, 60);
      emailToUse = guestEmail.trim() || "guest@elitebazar.local";
    }
    try {
      await addReview.mutateAsync({
        product_id: productId,
        user_email: emailToUse,
        user_name: nameToUse,
        rating,
        comment: comment.trim(),
      });
      toast.success("Review added!");
      setComment("");
      setRating(5);
      if (!user) { setGuestName(""); setGuestEmail(""); }
    } catch (err: any) {
      toast.error(err?.message || "Failed to add review");
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-16">
      <h2 className="text-xl font-display font-bold mb-2">Ratings & Reviews</h2>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl font-bold text-gradient-gold">{avgRating}</span>
        <div>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className={i < Math.round(Number(avgRating)) ? "fill-primary text-primary" : "text-border"} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Add Review Form */}
      <form onSubmit={handleSubmit} className="border border-border rounded-lg p-4 mb-6 space-y-3">
        <p className="text-sm font-medium">Write a Review</p>

        {!user && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              placeholder="Your name *"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value.slice(0, 60))}
              maxLength={60}
            />
            <Input
              type="email"
              placeholder="Email (optional)"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value.slice(0, 120))}
              maxLength={120}
            />
          </div>
        )}

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(i + 1)}
            >
              <Star
                size={22}
                className={
                  i < (hoverRating || rating)
                    ? "fill-primary text-primary cursor-pointer"
                    : "text-border cursor-pointer"
                }
              />
            </button>
          ))}
          <span className="text-sm text-muted-foreground ml-2">{rating}/5</span>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Apni review likhein..."
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 2000))}
            maxLength={2000}
            className="flex-1"
          />
          <Button type="submit" disabled={addReview.isPending} size="sm" className="gap-1">
            <Send size={14} /> Post
          </Button>
        </div>
      </form>

      {/* Reviews List */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-border/50 pb-4 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {r.user_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{r.user_name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-0.5 mb-2 ml-10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className={i < r.rating ? "fill-primary text-primary" : "text-border"} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground ml-10">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
