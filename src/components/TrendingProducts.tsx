import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProducts } from "@/hooks/useProducts";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ProductCard from "@/components/ProductCard";

const TrendingProducts = () => {
  const { data: products = [] } = useProducts();
  const { data: settings } = useSiteSettings("trending_products");
  const queryClient = useQueryClient();

  const count = settings?.count ?? 8;
  const title = settings?.title ?? "Trending";
  const highlight = settings?.highlight ?? "Products";
  const subtitle = settings?.subtitle ?? "Most popular picks this week";

  // Realtime: refresh products when rating/reviews change
  useEffect(() => {
    const channel = supabase
      .channel("products-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "products" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["products"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
            {title} <span className="text-gradient-gold">{highlight}</span>
          </h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, count).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
