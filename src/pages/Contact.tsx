import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2 text-center">
              Contact <span className="text-gradient-gold">Us</span>
            </h1>
            <p className="text-muted-foreground text-center mb-12">
              We'd love to hear from you
            </p>

            <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "support@elitebazar.com" },
                  { icon: Phone, label: "WhatsApp", value: "+92 327 625 4377" },
                  { icon: MapPin, label: "Address", value: "Lahore, Punjab, Pakistan" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <item.icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Send us a message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name *</Label>
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
                      </div>
                    </div>
                    <div>
                      <Label>Subject</Label>
                      <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" />
                    </div>
                    <div>
                      <Label>Message *</Label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Your message..."
                        rows={5}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button type="submit" className="bg-gradient-gold text-primary-foreground font-semibold gap-2">
                        <Send size={16} /> Send Message
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2 border-green-500 text-green-600 hover:bg-green-500/10"
                        onClick={() => window.open("https://wa.me/923276254377", "_blank")}
                      >
                        <MessageCircle size={16} /> Contact on WhatsApp
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
