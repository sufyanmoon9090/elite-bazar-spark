import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
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
      <SEO
        title="Elite Bazar — Online Shopping in Pakistan | Cash on Delivery"
        description="Shop electronics, fashion, gadgets and home essentials at Elite Bazar. Best prices in Pakistan, fast delivery and Cash on Delivery."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Elite Bazar",
          url: "https://elite-bazar.lovable.app/",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://elite-bazar.lovable.app/shop?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
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
    <SEO
      title="Elite Bazar — Online Shopping in Pakistan | Cash on Delivery"
      description="Shop electronics, fashion, gadgets and home essentials at Elite Bazar. Best prices in Pakistan, fast delivery and Cash on Delivery."
      path="/"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Elite Bazar",
        url: "https://elite-bazar.lovable.app/",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://elite-bazar.lovable.app/shop?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      }}
    />
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
