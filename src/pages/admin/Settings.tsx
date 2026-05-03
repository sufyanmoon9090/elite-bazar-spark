import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Save, Store, Bell, Shield, Layout, Sparkles, Zap, Award, MessageSquare, BookOpen, Mail, Globe, ImageIcon, TrendingUp, Minus, Plus, Phone, Palette, MessageCircle as MessageCircleIcon } from "lucide-react";
import { useAllSiteSettings, useUpdateSiteSetting } from "@/hooks/useSiteSettings";

export default function Settings() {
  const { toast } = useToast();
  const { data: allSettings, isLoading } = useAllSiteSettings();
  const updateSetting = useUpdateSiteSetting();

  // Local state for each section
  const [general, setGeneral] = useState<any>({});
  const [hero, setHero] = useState<any>({});
  const [catHeading, setCatHeading] = useState<any>({});
  const [deals, setDeals] = useState<any>({});
  const [whyChoose, setWhyChoose] = useState<any>({});
  const [testimonialsH, setTestimonialsH] = useState<any>({});
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [blogH, setBlogH] = useState<any>({});
  const [newsletter, setNewsletter] = useState<any>({});
  const [trending, setTrending] = useState<any>({});
  const [contact, setContact] = useState<any>({});
  const [whatsapp, setWhatsapp] = useState<any>({});
  const [heroSlides, setHeroSlides] = useState<{ enabled: boolean; desktop: any[]; mobile: any[] }>({ enabled: true, desktop: [], mobile: [] });

  useEffect(() => {
    if (allSettings) {
      setGeneral(allSettings.general || {});
      setHero(allSettings.hero || {});
      setCatHeading(allSettings.categories_heading || {});
      setDeals(allSettings.deals || {});
      setWhyChoose(allSettings.why_choose_us || {});
      setTestimonialsH(allSettings.testimonials_heading || {});
      setTestimonialsList(Array.isArray(allSettings.testimonials_list?.items) ? allSettings.testimonials_list.items : []);
      setBlogH(allSettings.blog_heading || {});
      setNewsletter(allSettings.newsletter || {});
      setTrending(allSettings.trending_products || { count: 8 });
      setContact(allSettings.contact || {});
      setWhatsapp(allSettings.global_whatsapp || {});
      const hs = allSettings.hero_slides || {};
      setHeroSlides({
        enabled: hs.enabled !== false,
        desktop: Array.isArray(hs.desktop) ? hs.desktop : [],
        mobile: Array.isArray(hs.mobile) ? hs.mobile : [],
      });
    }
  }, [allSettings]);

  const saveAll = async () => {
    try {
      await Promise.all([
        updateSetting.mutateAsync({ key: "general", data: general }),
        updateSetting.mutateAsync({ key: "hero", data: hero }),
        updateSetting.mutateAsync({ key: "categories_heading", data: catHeading }),
        updateSetting.mutateAsync({ key: "deals", data: deals }),
        updateSetting.mutateAsync({ key: "why_choose_us", data: whyChoose }),
        updateSetting.mutateAsync({ key: "testimonials_heading", data: testimonialsH }),
        updateSetting.mutateAsync({ key: "testimonials_list", data: { items: testimonialsList } }),
        updateSetting.mutateAsync({ key: "blog_heading", data: blogH }),
        updateSetting.mutateAsync({ key: "newsletter", data: newsletter }),
        updateSetting.mutateAsync({ key: "trending_products", data: trending }),
        updateSetting.mutateAsync({ key: "contact", data: contact }),
        updateSetting.mutateAsync({ key: "global_whatsapp", data: whatsapp }),
        updateSetting.mutateAsync({ key: "hero_slides", data: heroSlides }),
      ]);
      toast({ title: "All settings saved!" });
    } catch {
      toast({ title: "Error saving settings", variant: "destructive" });
    }
  };

  if (isLoading) return <p className="text-muted-foreground">Loading settings...</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Landing Page Settings</h2>
          <p className="text-muted-foreground text-sm">Customize every section of your landing page</p>
        </div>
        <Button onClick={saveAll} disabled={updateSetting.isPending} className="gap-2">
          <Save className="h-4 w-4" /> {updateSetting.isPending ? "Saving..." : "Save All"}
        </Button>
      </div>

      {/* General / Branding */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" /> General / Branding</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Site Name (changes everywhere)</Label><Input value={general.site_name || ""} onChange={(e) => setGeneral({ ...general, site_name: e.target.value })} placeholder="Elite Bazar" /></div>
          <div>
            <Label>Light Theme Logo URL</Label>
            <Input value={general.logo_url || ""} onChange={(e) => setGeneral({ ...general, logo_url: e.target.value })} placeholder="https://i.ibb.co/your-light-logo.png" />
            {general.logo_url && (
              <div className="mt-2 flex items-center gap-3">
                <img src={general.logo_url} alt="Light logo preview" className="h-12 w-12 object-contain rounded border border-border bg-white" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="text-xs text-muted-foreground">Light Preview</span>
              </div>
            )}
          </div>
          <div>
            <Label>Dark Theme Logo URL</Label>
            <Input value={general.dark_logo_url || ""} onChange={(e) => setGeneral({ ...general, dark_logo_url: e.target.value })} placeholder="https://i.ibb.co/your-dark-logo.png" />
            {general.dark_logo_url && (
              <div className="mt-2 flex items-center gap-3">
                <img src={general.dark_logo_url} alt="Dark logo preview" className="h-12 w-12 object-contain rounded border border-border bg-black" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="text-xs text-muted-foreground">Dark Preview</span>
              </div>
            )}
          </div>
          <div><Label>Footer Description</Label><Input value={general.footer_text || ""} onChange={(e) => setGeneral({ ...general, footer_text: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* Hero Section */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4" /> Hero Section</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Badge Text</Label><Input value={hero.badge || ""} onChange={(e) => setHero({ ...hero, badge: e.target.value })} /></div>
          <div><Label>Title (highlighted)</Label><Input value={hero.title || ""} onChange={(e) => setHero({ ...hero, title: e.target.value })} /></div>
          <div><Label>Subtitle</Label><Input value={hero.subtitle || ""} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Button 1 Text</Label><Input value={hero.button1 || ""} onChange={(e) => setHero({ ...hero, button1: e.target.value })} /></div>
            <div><Label>Button 2 Text</Label><Input value={hero.button2 || ""} onChange={(e) => setHero({ ...hero, button2: e.target.value })} /></div>
          </div>
          <Separator />
          <Label className="text-xs text-muted-foreground">Stats</Label>
          {(hero.stats || []).map((stat: any, i: number) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <Input value={stat.value} onChange={(e) => { const s = [...hero.stats]; s[i] = { ...s[i], value: e.target.value }; setHero({ ...hero, stats: s }); }} placeholder="Value" />
              <Input value={stat.label} onChange={(e) => { const s = [...hero.stats]; s[i] = { ...s[i], label: e.target.value }; setHero({ ...hero, stats: s }); }} placeholder="Label" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categories Heading */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Layout className="h-4 w-4" /> Categories Section</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Title</Label><Input value={catHeading.title || ""} onChange={(e) => setCatHeading({ ...catHeading, title: e.target.value })} /></div>
            <div><Label>Highlight</Label><Input value={catHeading.highlight || ""} onChange={(e) => setCatHeading({ ...catHeading, highlight: e.target.value })} /></div>
          </div>
          <div><Label>Subtitle</Label><Input value={catHeading.subtitle || ""} onChange={(e) => setCatHeading({ ...catHeading, subtitle: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* Trending Products */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Trending Products</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Title</Label><Input value={trending.title || ""} onChange={(e) => setTrending({ ...trending, title: e.target.value })} placeholder="Trending" /></div>
            <div><Label>Highlight</Label><Input value={trending.highlight || ""} onChange={(e) => setTrending({ ...trending, highlight: e.target.value })} placeholder="Products" /></div>
          </div>
          <div><Label>Subtitle</Label><Input value={trending.subtitle || ""} onChange={(e) => setTrending({ ...trending, subtitle: e.target.value })} /></div>
          <Separator />
          <div>
            <Label>Products to Show</Label>
            <div className="flex items-center gap-3 mt-2">
              <Button variant="outline" size="icon" onClick={() => setTrending({ ...trending, count: Math.max(1, (trending.count ?? 8) - 1) })}><Minus className="h-4 w-4" /></Button>
              <span className="text-lg font-bold w-8 text-center">{trending.count ?? 8}</span>
              <Button variant="outline" size="icon" onClick={() => setTrending({ ...trending, count: Math.min(20, (trending.count ?? 8) + 1) })}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4" /> Deals Section</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Show Deals Section</Label>
            <Switch checked={deals.enabled !== false} onCheckedChange={(v) => setDeals({ ...deals, enabled: v })} />
          </div>
          <Separator />
          <div><Label>Badge</Label><Input value={deals.badge || ""} onChange={(e) => setDeals({ ...deals, badge: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Title</Label><Input value={deals.title || ""} onChange={(e) => setDeals({ ...deals, title: e.target.value })} /></div>
            <div><Label>Highlight</Label><Input value={deals.highlight || ""} onChange={(e) => setDeals({ ...deals, highlight: e.target.value })} /></div>
          </div>
          <div><Label>Subtitle</Label><Input value={deals.subtitle || ""} onChange={(e) => setDeals({ ...deals, subtitle: e.target.value })} /></div>
          <Separator />
          <Label className="text-xs text-muted-foreground">Sale Timer (Starting Time)</Label>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Hours</Label><Input type="number" min={0} max={99} value={deals.timer_hours ?? 12} onChange={(e) => setDeals({ ...deals, timer_hours: parseInt(e.target.value) || 0 })} /></div>
            <div><Label>Minutes</Label><Input type="number" min={0} max={59} value={deals.timer_minutes ?? 34} onChange={(e) => setDeals({ ...deals, timer_minutes: parseInt(e.target.value) || 0 })} /></div>
            <div><Label>Seconds</Label><Input type="number" min={0} max={59} value={deals.timer_seconds ?? 56} onChange={(e) => setDeals({ ...deals, timer_seconds: parseInt(e.target.value) || 0 })} /></div>
          </div>
        </CardContent>
      </Card>

      {/* Why Choose Us */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Award className="h-4 w-4" /> Why Choose Us</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Show Why Choose Us Section</Label>
            <Switch checked={whyChoose.enabled !== false} onCheckedChange={(v) => setWhyChoose({ ...whyChoose, enabled: v })} />
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Title</Label><Input value={whyChoose.title || ""} onChange={(e) => setWhyChoose({ ...whyChoose, title: e.target.value })} /></div>
            <div><Label>Highlight</Label><Input value={whyChoose.highlight || ""} onChange={(e) => setWhyChoose({ ...whyChoose, highlight: e.target.value })} /></div>
          </div>
          <Separator />
          <Label className="text-xs text-muted-foreground">Features</Label>
          {(whyChoose.features || []).map((f: any, i: number) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <Input value={f.title} onChange={(e) => { const fs = [...whyChoose.features]; fs[i] = { ...fs[i], title: e.target.value }; setWhyChoose({ ...whyChoose, features: fs }); }} placeholder="Title" />
              <Input value={f.desc} onChange={(e) => { const fs = [...whyChoose.features]; fs[i] = { ...fs[i], desc: e.target.value }; setWhyChoose({ ...whyChoose, features: fs }); }} placeholder="Description" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Testimonials Heading */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Testimonials Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Title</Label><Input value={testimonialsH.title || ""} onChange={(e) => setTestimonialsH({ ...testimonialsH, title: e.target.value })} /></div>
            <div><Label>Highlight</Label><Input value={testimonialsH.highlight || ""} onChange={(e) => setTestimonialsH({ ...testimonialsH, highlight: e.target.value })} /></div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Customer Reviews ({testimonialsList.length})</Label>
            <Button size="sm" variant="outline" onClick={() => setTestimonialsList([...testimonialsList, { id: Date.now().toString(), name: "", role: "Verified Buyer", rating: 5, text: "", avatar: "" }])} className="gap-1"><Plus className="h-3 w-3" /> Add Review</Button>
          </div>
          {testimonialsList.map((t: any, i: number) => (
            <div key={i} className="border border-border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Review #{i + 1}</span>
                <Button size="sm" variant="ghost" onClick={() => setTestimonialsList(testimonialsList.filter((_, idx) => idx !== i))} className="h-7 px-2 text-destructive"><Minus className="h-3 w-3" /></Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Name" value={t.name || ""} onChange={(e) => { const arr = [...testimonialsList]; arr[i] = { ...arr[i], name: e.target.value }; setTestimonialsList(arr); }} />
                <Input placeholder="Role (e.g., Verified Buyer)" value={t.role || ""} onChange={(e) => { const arr = [...testimonialsList]; arr[i] = { ...arr[i], role: e.target.value }; setTestimonialsList(arr); }} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Avatar Image URL" value={t.avatar || ""} onChange={(e) => { const arr = [...testimonialsList]; arr[i] = { ...arr[i], avatar: e.target.value }; setTestimonialsList(arr); }} />
                <Input type="number" min={1} max={5} placeholder="Rating 1-5" value={t.rating ?? 5} onChange={(e) => { const arr = [...testimonialsList]; arr[i] = { ...arr[i], rating: Math.max(1, Math.min(5, Number(e.target.value) || 5)) }; setTestimonialsList(arr); }} />
              </div>
              <textarea className="w-full text-sm p-2 rounded-md border border-border bg-background min-h-[60px]" placeholder="Review text..." value={t.text || ""} onChange={(e) => { const arr = [...testimonialsList]; arr[i] = { ...arr[i], text: e.target.value }; setTestimonialsList(arr); }} />
            </div>
          ))}
          {testimonialsList.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">No reviews yet. Click "Add Review" to add the first one.</p>}
        </CardContent>
      </Card>

      {/* Blog Heading */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4" /> Blog Section</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Title</Label><Input value={blogH.title || ""} onChange={(e) => setBlogH({ ...blogH, title: e.target.value })} /></div>
            <div><Label>Highlight</Label><Input value={blogH.highlight || ""} onChange={(e) => setBlogH({ ...blogH, highlight: e.target.value })} /></div>
          </div>
          <div><Label>Subtitle</Label><Input value={blogH.subtitle || ""} onChange={(e) => setBlogH({ ...blogH, subtitle: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* Newsletter */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Mail className="h-4 w-4" /> Newsletter Section</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Title</Label><Input value={newsletter.title || ""} onChange={(e) => setNewsletter({ ...newsletter, title: e.target.value })} /></div>
            <div><Label>Highlight</Label><Input value={newsletter.highlight || ""} onChange={(e) => setNewsletter({ ...newsletter, highlight: e.target.value })} /></div>
          </div>
          <div><Label>Subtitle</Label><Input value={newsletter.subtitle || ""} onChange={(e) => setNewsletter({ ...newsletter, subtitle: e.target.value })} /></div>
          <div><Label>Button Text</Label><Input value={newsletter.button || ""} onChange={(e) => setNewsletter({ ...newsletter, button: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* Contact Page */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Phone className="h-4 w-4" /> Contact Page</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Design Template</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                { id: "classic", name: "Classic", desc: "Current default style" },
                { id: "bold_dark", name: "Bold Dark", desc: "Big typography + sticker badges" },
                { id: "warm_friendly", name: "Warm Friendly", desc: "Yellow card, illustration vibe" },
                { id: "modern_minimal", name: "Modern Minimal", desc: "Clean, elegant, serif accent" },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setContact({ ...contact, design: d.id })}
                  className={`text-left p-3 rounded-lg border-2 transition-all ${(contact.design || "classic") === d.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
                >
                  <p className="font-semibold text-sm">{d.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Title</Label><Input value={contact.title || ""} onChange={(e) => setContact({ ...contact, title: e.target.value })} placeholder="Contact" /></div>
            <div><Label>Highlight</Label><Input value={contact.highlight || ""} onChange={(e) => setContact({ ...contact, highlight: e.target.value })} placeholder="Us" /></div>
          </div>
          <div><Label>Subtitle</Label><Input value={contact.subtitle || ""} onChange={(e) => setContact({ ...contact, subtitle: e.target.value })} /></div>
          <div><Label>Form Title</Label><Input value={contact.form_title || ""} onChange={(e) => setContact({ ...contact, form_title: e.target.value })} /></div>
          <Separator />
          <div><Label>Email</Label><Input value={contact.email || ""} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="support@elitebazar.com" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>WhatsApp Number (no +)</Label><Input value={contact.whatsapp || ""} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} placeholder="923276254377" /></div>
            <div><Label>WhatsApp Display</Label><Input value={contact.whatsapp_display || ""} onChange={(e) => setContact({ ...contact, whatsapp_display: e.target.value })} placeholder="+92 327 625 4377" /></div>
          </div>
          <div><Label>Address</Label><Input value={contact.address || ""} onChange={(e) => setContact({ ...contact, address: e.target.value })} /></div>
          <Separator />
          <Label className="text-xs text-muted-foreground flex items-center gap-1"><Palette className="h-3 w-3" /> Colors</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Primary Color</Label>
              <div className="flex gap-2">
                <Input type="color" value={contact.primary_color || "#FFD700"} onChange={(e) => setContact({ ...contact, primary_color: e.target.value })} className="w-16 h-10 p-1" />
                <Input value={contact.primary_color || "#FFD700"} onChange={(e) => setContact({ ...contact, primary_color: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Accent Color (WhatsApp)</Label>
              <div className="flex gap-2">
                <Input type="color" value={contact.accent_color || "#22c55e"} onChange={(e) => setContact({ ...contact, accent_color: e.target.value })} className="w-16 h-10 p-1" />
                <Input value={contact.accent_color || "#22c55e"} onChange={(e) => setContact({ ...contact, accent_color: e.target.value })} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global WhatsApp */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageCircleIcon className="h-4 w-4" /> WhatsApp Integration</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>WhatsApp Number (no +)</Label><Input value={whatsapp.number || ""} onChange={(e) => setWhatsapp({ ...whatsapp, number: e.target.value })} placeholder="923276254377" /></div>
            <div><Label>Display Number</Label><Input value={whatsapp.display || ""} onChange={(e) => setWhatsapp({ ...whatsapp, display: e.target.value })} placeholder="+92 327 625 4377" /></div>
          </div>
          <div><Label>Default Message</Label><Input value={whatsapp.default_message || ""} onChange={(e) => setWhatsapp({ ...whatsapp, default_message: e.target.value })} placeholder="Hi! I am interested in your products." /></div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label>Show Floating Button</Label>
            <Switch checked={whatsapp.show_floating !== false} onCheckedChange={(v) => setWhatsapp({ ...whatsapp, show_floating: v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Show in Footer</Label>
            <Switch checked={whatsapp.show_footer !== false} onCheckedChange={(v) => setWhatsapp({ ...whatsapp, show_footer: v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Show on Product Pages</Label>
            <Switch checked={whatsapp.show_product !== false} onCheckedChange={(v) => setWhatsapp({ ...whatsapp, show_product: v })} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveAll} disabled={updateSetting.isPending} className="gap-2 w-full">
        <Save className="h-4 w-4" /> {updateSetting.isPending ? "Saving..." : "Save All Settings"}
      </Button>
    </div>
  );
}
