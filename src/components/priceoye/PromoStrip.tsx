import { useSiteSettings } from "@/hooks/useSiteSettings";

const PromoStrip = () => {
  const { data } = useSiteSettings("promo_strip");
  if (data?.enabled === false) return null;
  const text = data?.text || "OFFICIAL E-COMMERCE PARTNER";
  const bg = data?.bg_color || "#FBBF24";
  const fg = data?.text_color || "#111827";
  return (
    <div className="w-full text-center py-1.5 text-xs sm:text-sm font-bold tracking-wide" style={{ backgroundColor: bg, color: fg }}>
      {text}
    </div>
  );
};

export default PromoStrip;
