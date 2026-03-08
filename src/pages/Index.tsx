import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import TrendingProducts from "@/components/TrendingProducts";
import DealsSection from "@/components/DealsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Index = () => {
  const { data: dealsSettings } = useSiteSettings("deals");
  const { data: whyChooseSettings } = useSiteSettings("why_choose_us");

  const showDeals = dealsSettings?.enabled !== false;
  const showWhyChoose = whyChooseSettings?.enabled !== false;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
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
