import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Save, Store, Bell, Shield, Layout, Sparkles, Zap, Award, MessageSquare, BookOpen, Mail, Globe, ImageIcon } from "lucide-react";
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
  const [blogH, setBlogH] = useState<any>({});
  const [newsletter, setNewsletter] = useState<any>({});

  useEffect(() => {
    if (allSettings) {
      setGeneral(allSettings.general || {});
      setHero(allSettings.hero || {});
      setCatHeading(allSettings.categories_heading || {});
      setDeals(allSettings.deals || {});
      setWhyChoose(allSettings.why_choose_us || {});
      setTestimonialsH(allSettings.testimonials_heading || {});
      setBlogH(allSettings.blog_heading || {});
      setNewsletter(allSettings.newsletter || {});
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
        updateSetting.mutateAsync({ key: "blog_heading", data: blogH }),
        updateSetting.mutateAsync({ key: "newsletter", data: newsletter }),
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

      {/* Deals Section */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4" /> Deals Section</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><Label>Badge</Label><Input value={deals.badge || ""} onChange={(e) => setDeals({ ...deals, badge: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Title</Label><Input value={deals.title || ""} onChange={(e) => setDeals({ ...deals, title: e.target.value })} /></div>
            <div><Label>Highlight</Label><Input value={deals.highlight || ""} onChange={(e) => setDeals({ ...deals, highlight: e.target.value })} /></div>
          </div>
          <div><Label>Subtitle</Label><Input value={deals.subtitle || ""} onChange={(e) => setDeals({ ...deals, subtitle: e.target.value })} /></div>
        </CardContent>
      </Card>

      {/* Why Choose Us */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Award className="h-4 w-4" /> Why Choose Us</CardTitle></CardHeader>
        <CardContent className="space-y-3">
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
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Title</Label><Input value={testimonialsH.title || ""} onChange={(e) => setTestimonialsH({ ...testimonialsH, title: e.target.value })} /></div>
            <div><Label>Highlight</Label><Input value={testimonialsH.highlight || ""} onChange={(e) => setTestimonialsH({ ...testimonialsH, highlight: e.target.value })} /></div>
          </div>
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

      <Button onClick={saveAll} disabled={updateSetting.isPending} className="gap-2 w-full">
        <Save className="h-4 w-4" /> {updateSetting.isPending ? "Saving..." : "Save All Settings"}
      </Button>
    </div>
  );
}
