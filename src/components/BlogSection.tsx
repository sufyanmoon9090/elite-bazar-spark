import { useBlogPosts } from "@/hooks/useBlogPosts";
import { blogPosts as fallbackPosts } from "@/data/mockData";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const defaults = { title: "Shopping", highlight: "Guides", subtitle: "Tips, trends, and product insights" };

const BlogSection = () => {
  const { data: settings } = useSiteSettings("blog_heading");
  const s = { ...defaults, ...settings };
  const { data: dbPosts = [] } = useBlogPosts();
  const posts = dbPosts.length > 0 ? dbPosts : fallbackPosts;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-3">
            {s.title} <span className="text-gradient-gold">{s.highlight}</span>
          </h2>
          <p className="text-muted-foreground">{s.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card border border-border rounded-xl overflow-hidden group cursor-pointer hover:border-primary/30 transition-all">
              <div className="aspect-video overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium text-primary">{post.category}</span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
                <h3 className="font-display font-semibold mb-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
