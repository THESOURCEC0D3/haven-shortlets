import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  phone: string;
  message: string;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function WhatsAppButton({
  phone,
  message,
  label = "WhatsApp Us",
  variant = "default",
  size = "default",
  className = "",
}: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={`bg-green-500 hover:bg-green-600 text-white ${className}`}
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="w-4 h-4 mr-2" />
        {label}
      </a>
    </Button>
  );
}
