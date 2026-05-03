import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useIsMobile } from "@/hooks/use-mobile";

interface Slide {
  image: string;
  title?: string;
  subtitle?: string;
  button?: string;
  link?: string;
}

const HeroSlides = () => {
  const { data } = useSiteSettings("hero_slides");
  const isMobile = useIsMobile();
  const enabled = data?.enabled !== false;
  const list: Slide[] = (isMobile ? data?.mobile : data?.desktop) || [];
  const slides = (list && list.length > 0) ? list : (data?.desktop || []);
  const [idx, setIdx] = useState(0);

  useEffect(() => { setIdx(0); }, [slides.length]);

  useEffect(() => {
    if (!slides.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!enabled || !slides.length) return null;

  const next = () => setIdx((i) => (i + 1) % slides.length);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const cur = slides[idx];

  return (
    <section className="relative w-full overflow-hidden bg-secondary">
      <div className="relative w-full aspect-[16/6] sm:aspect-[16/5] md:aspect-[21/8] max-h-[560px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            {cur.link ? (
              <Link to={cur.link} className="block w-full h-full">
                <img src={cur.image} alt={cur.title || "Slide"} className="w-full h-full object-cover" />
              </Link>
            ) : (
              <img src={cur.image} alt={cur.title || "Slide"} className="w-full h-full object-cover" />
            )}

            {(cur.title || cur.subtitle || cur.button) && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent flex items-center">
                <div className="container mx-auto px-6 sm:px-10 max-w-2xl text-white">
                  {cur.title && (
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold drop-shadow-lg mb-2">
                      {cur.title}
                    </h2>
                  )}
                  {cur.subtitle && (
                    <p className="text-sm sm:text-lg opacity-95 mb-4 drop-shadow max-w-md">{cur.subtitle}</p>
                  )}
                  {cur.button && cur.link && (
                    <Link
                      to={cur.link}
                      className="inline-block bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 shadow-lg"
                    >
                      {cur.button}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {slides.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background text-foreground rounded-full p-1.5 sm:p-2 backdrop-blur shadow-md"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background text-foreground rounded-full p-1.5 sm:p-2 backdrop-blur shadow-md"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : "w-1.5 bg-white/60 hover:bg-white"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSlides;
