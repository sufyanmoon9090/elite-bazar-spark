import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing!");
      setEmail("");
    }
  };

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="text-3xl font-display font-bold mb-3">
            Stay <span className="text-gradient-gold">Updated</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to get exclusive deals, new arrivals, and insider-only discounts.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-card border-border flex-1"
              required
            />
            <Button type="submit" className="bg-gradient-gold text-primary-foreground font-semibold shadow-gold hover:opacity-90">
              <Send size={16} className="mr-2" /> Subscribe
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
