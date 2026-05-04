import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HeroSlides from "@/components/HeroSlides";
import CategoriesSection from "@/components/CategoriesSection";
import TrendingProducts from "@/components/TrendingProducts";
import DealsSection from "@/components/DealsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";
import PromoStrip from "@/components/priceoye/PromoStrip";
import PriceOyeNavbar from "@/components/priceoye/PriceOyeNavbar";
import CategoriesStrip from "@/components/priceoye/CategoriesStrip";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Index = () => {
  const { data: dealsSettings } = useSiteSettings("deals");
  const { data: whyChooseSettings } = useSiteSettings("why_choose_us");
  const { data: layout } = useSiteSettings("ui_layout");

  const showDeals = dealsSettings?.enabled !== false;
  const showWhyChoose = whyChooseSettings?.enabled !== false;
  const variant = layout?.variant || "classic";

  if (variant === "priceoye") {
    return (
      <div className="min-h-screen bg-background">
        <PromoStrip />
        <PriceOyeNavbar />
        <main className="pt-16">
          <CategoriesStrip />
          <HeroSlides />
          {showDeals && <DealsSection />}
          <TrendingProducts />
          {showWhyChoose && <WhyChooseUs />}
          <TestimonialsSection />
          <BlogSection />
          <NewsletterSection />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSlides />
        <HeroSection />
        <CategoriesSection />
        <TrendingProducts />
        {showDeals && <DealsSection />}
        {showWhyChoose && <WhyChooseUs />}
        <TestimonialsSection />
        <BlogSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
