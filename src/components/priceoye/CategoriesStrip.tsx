import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";

const CategoriesStrip = () => {
  const { data: categories = [] } = useCategories();
  if (!categories.length) return null;
  return (
    <div className="w-full bg-card border-b border-border">
      <div className="container mx-auto px-3 sm:px-4 py-3 overflow-x-auto">
        <div className="flex gap-4 sm:gap-6 min-w-max sm:justify-center">
          {categories.slice(0, 10).map((cat: any) => (
            <Link to={`/shop?category=${cat.slug}`} key={cat.id} className="flex flex-col items-center gap-1.5 w-20 shrink-0 group">
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl group-hover:bg-primary/10 transition-colors overflow-hidden">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{cat.icon || "🛍️"}</span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs text-center text-foreground font-medium leading-tight line-clamp-2">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesStrip;
