import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Clock } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const defaults = { badge: "Flash Sale", title: "Up to", highlight: "70% Off", subtitle: "Premium electronics & gadgets. Limited time only!", timer_hours: 12, timer_minutes: 34, timer_seconds: 56 };

const DealsSection = () => {
  const { data: settings } = useSiteSettings("deals");
  const s = { ...defaults, ...settings };
  const [timeLeft, setTimeLeft] = useState({ hours: s.timer_hours, minutes: s.timer_minutes, seconds: s.timer_seconds });

  useEffect(() => {
    setTimeLeft({ hours: s.timer_hours, minutes: s.timer_minutes, seconds: s.timer_seconds });
  }, [s.timer_hours, s.timer_minutes, s.timer_seconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="bg-card border border-primary/20 rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-primary" size={20} />
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">{s.badge}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-2">
                {s.title} <span className="text-gradient-gold">{s.highlight}</span>
              </h2>
              <p className="text-muted-foreground">{s.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-primary mr-2" size={20} />
              {[
                { value: pad(timeLeft.hours), label: "Hours" },
                { value: pad(timeLeft.minutes), label: "Min" },
                { value: pad(timeLeft.seconds), label: "Sec" },
              ].map((t, i) => (
                <div key={t.label} className="flex items-center gap-2">
                  <div className="bg-secondary rounded-lg p-3 min-w-[60px] text-center">
                    <div className="text-2xl font-display font-bold text-gradient-gold">{t.value}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">{t.label}</div>
                  </div>
                  {i < 2 && <span className="text-2xl text-muted-foreground font-bold">:</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
