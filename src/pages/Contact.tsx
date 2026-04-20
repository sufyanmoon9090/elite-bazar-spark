import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Contact = () => {
  const { data: contact } = useSiteSettings("contact");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const cfg = {
    design: contact?.design || "classic",
    title: contact?.title || "Contact",
    highlight: contact?.highlight || "Us",
    subtitle: contact?.subtitle || "We'd love to hear from you",
    email: contact?.email || "support@elitebazar.com",
    whatsapp: contact?.whatsapp || "923276254377",
    whatsapp_display: contact?.whatsapp_display || "+92 327 625 4377",
    address: contact?.address || "Lahore, Punjab, Pakistan",
    form_title: contact?.form_title || "Send us a message",
    primary_color: contact?.primary_color || "#FFD700",
    accent_color: contact?.accent_color || "#22c55e",
  };

  const waLink = `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent("Hi! I want to contact you.")}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const inputs = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <Button type="submit" style={{ background: cfg.primary_color, color: "#000" }} className="font-semibold gap-2 hover:opacity-90">
          <Send size={16} /> Send Message
        </Button>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          style={{ borderColor: cfg.accent_color, color: cfg.accent_color }}
          onClick={() => window.open(waLink, "_blank")}
        >
          <MessageCircle size={16} /> Chat on WhatsApp
        </Button>
      </div>
    </form>
  );

  // ============ DESIGN 1: BOLD DARK ============
  if (cfg.design === "bold_dark") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20">
          <section className="bg-zinc-950 text-white py-16 sm:py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl sm:text-7xl md:text-8xl font-display font-black uppercase leading-[0.9] tracking-tight">
                {cfg.title} <span style={{ color: cfg.primary_color }}>{cfg.highlight}</span>
              </motion.h1>
              <p className="mt-6 max-w-xl text-zinc-400 text-base sm:text-lg">{cfg.subtitle}</p>
              <a href={waLink} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-white font-bold uppercase border-b-2 border-white pb-1 hover:gap-4 transition-all">
                Get in touch <ArrowRight size={18} />
              </a>
            </div>
            {/* sticker badges */}
            <div className="absolute top-10 right-10 hidden md:flex flex-col gap-3 rotate-6">
              <span className="px-4 py-2 rounded-full text-xs font-bold uppercase" style={{ background: cfg.primary_color, color: "#000" }}>📞 Call us</span>
              <span className="px-4 py-2 rounded-full text-xs font-bold uppercase bg-pink-500 text-white -rotate-6">💬 24/7 Support</span>
              <span className="px-4 py-2 rounded-full text-xs font-bold uppercase" style={{ background: cfg.accent_color, color: "#000" }}>⚡ Fast reply</span>
            </div>
          </section>

          <section className="container mx-auto px-4 -mt-10">
            <div className="grid lg:grid-cols-3 gap-6">
              {[
                { icon: Mail, label: "EMAIL US", value: cfg.email, color: cfg.primary_color },
                { icon: Phone, label: "WHATSAPP", value: cfg.whatsapp_display, color: cfg.accent_color },
                { icon: MapPin, label: "VISIT US", value: cfg.address, color: "#ec4899" },
              ].map((item) => (
                <div key={item.label} className="bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: item.color }}>
                    <item.icon size={20} className="text-black" />
                  </div>
                  <p className="text-xs font-bold tracking-widest text-zinc-500 mb-2">{item.label}</p>
                  <p className="text-base font-semibold">{item.value}</p>
                </div>
              ))}
            </div>

            <Card className="mt-10 border-2 border-zinc-800 bg-zinc-900 text-white max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl font-display uppercase">{cfg.form_title}</CardTitle>
              </CardHeader>
              <CardContent>{inputs}</CardContent>
            </Card>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // ============ DESIGN 2: WARM FRIENDLY ============
  if (cfg.design === "warm_friendly") {
    return (
      <div className="min-h-screen" style={{ background: "#FCD34D" }}>
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-sm font-medium text-zinc-500 mb-2">— {cfg.subtitle}</p>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-zinc-900 leading-tight">
                    Hey There, <br />
                    <span className="italic" style={{ color: cfg.primary_color }}>{cfg.title} {cfg.highlight}</span>
                  </h1>
                  <p className="mt-4 text-zinc-600">Reach out anytime — we love friendly chats and quick replies.</p>
                  <a href={`mailto:${cfg.email}`} className="inline-block mt-4 underline text-zinc-900 font-medium">{cfg.email}</a>
                </div>
                <div className="flex justify-center">
                  <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full flex items-center justify-center shadow-xl" style={{ background: cfg.primary_color }}>
                    <Sparkles size={80} className="text-white" />
                  </div>
                </div>
              </motion.div>

              <div className="mt-10 grid md:grid-cols-3 gap-4">
                {[
                  { icon: Mail, label: "Email", value: cfg.email, bg: "#10b981" },
                  { icon: Phone, label: "WhatsApp", value: cfg.whatsapp_display, bg: cfg.accent_color },
                  { icon: MapPin, label: "Address", value: cfg.address, bg: "#f97316" },
                ].map((item) => (
                  <div key={item.label} className="bg-zinc-50 rounded-2xl p-5 hover:shadow-lg transition-shadow">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: item.bg }}>
                      <item.icon size={18} className="text-white" />
                    </div>
                    <p className="text-sm font-bold text-zinc-900">{item.label}</p>
                    <p className="text-sm text-zinc-600 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-t-2 border-dashed border-zinc-200 pt-8">
                <h2 className="text-2xl font-display font-bold text-zinc-900 mb-4">{cfg.form_title}</h2>
                <div className="text-zinc-900">{inputs}</div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ============ DESIGN 3: MODERN MINIMAL ============
  if (cfg.design === "modern_minimal") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">— Get in touch —</p>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-light tracking-tight">
                {cfg.title} <span className="italic font-serif" style={{ color: cfg.primary_color }}>{cfg.highlight}</span>
              </h1>
              <p className="mt-6 text-muted-foreground max-w-md mx-auto">{cfg.subtitle}</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-16 border-y border-border py-10">
              {[
                { label: "Email", value: cfg.email, href: `mailto:${cfg.email}` },
                { label: "WhatsApp", value: cfg.whatsapp_display, href: waLink },
                { label: "Location", value: cfg.address, href: "#" },
              ].map((item) => (
                <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{item.label}</p>
                  <p className="text-lg font-medium group-hover:underline" style={{ textDecorationColor: cfg.primary_color }}>{item.value}</p>
                </a>
              ))}
            </div>

            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-display font-light mb-6 text-center">{cfg.form_title}</h2>
              {inputs}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ============ DESIGN 4: CLASSIC (DEFAULT) ============
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2 text-center">
              {cfg.title} <span style={{ color: cfg.primary_color }}>{cfg.highlight}</span>
            </h1>
            <p className="text-muted-foreground text-center mb-12">{cfg.subtitle}</p>

            <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", value: cfg.email },
                  { icon: Phone, label: "WhatsApp", value: cfg.whatsapp_display },
                  { icon: MapPin, label: "Address", value: cfg.address },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="p-3 rounded-lg" style={{ background: `${cfg.primary_color}20` }}>
                      <item.icon size={20} style={{ color: cfg.primary_color }} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                  style={{ background: cfg.accent_color }}
                >
                  <MessageCircle size={20} /> Chat on WhatsApp
                </a>
              </div>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">{cfg.form_title}</CardTitle>
                </CardHeader>
                <CardContent>{inputs}</CardContent>
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
