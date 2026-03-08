import { motion } from "framer-motion";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { blogPosts as fallbackPosts } from "@/data/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Blog = () => {
  const { data: dbPosts = [] } = useBlogPosts();
  const posts = dbPosts.length > 0 ? dbPosts : fallbackPosts;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
              Our <span className="text-gradient-gold">Blog</span>
            </h1>
            <p className="text-muted-foreground mb-10">Tips, trends, and product insights</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-xl overflow-hidden group cursor-pointer hover:border-primary/30 transition-all"
                >
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
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
