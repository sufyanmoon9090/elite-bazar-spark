import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface Props { productName: string; }

const WhatsAppOrderButton = ({ productName }: Props) => {
  const { data } = useSiteSettings("global_whatsapp");
  if (data?.show_product === false) return null;
  const number = data?.number || "923276254377";
  const text = `Hi! I want to order: ${productName}`;
  return (
    <a
      href={`https://wa.me/${number}?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noreferrer"
      className="mt-3 mb-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors"
    >
      <MessageCircle size={16} /> Order on WhatsApp
    </a>
  );
};

export default WhatsAppOrderButton;
