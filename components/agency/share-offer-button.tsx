"use client";

import { useState } from "react";
import { Share2, Copy, Download, Facebook, MessageCircle, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ShareOfferButtonProps {
  offerId: string;
  offerTitle: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ShareOfferButton({
  offerId,
  offerTitle,
  variant = "outline",
  size = "default",
  className,
}: ShareOfferButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://safrgo.online";
  const offerUrl = `${appUrl}/offers/${offerId}`;
  const ogImageUrl = `${appUrl}/api/og/offer/${offerId}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(offerUrl);
      toast.success("تم نسخ رابط العرض إلى الحافظة");
    } catch (error) {
      toast.error("حدث خطأ أثناء نسخ الرابط");
    }
  };

  const downloadImage = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(ogImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${offerTitle.replace(/\s+/g, "-")}-offer.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("تم تحميل صورة العرض بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل الصورة");
    } finally {
      setIsDownloading(false);
    }
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(offerUrl)}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const shareToWhatsApp = () => {
    const message = `${offerTitle}\n${offerUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareToInstagram = () => {
    // Instagram doesn't have direct share URL, so we copy and show instructions
    copyLink();
    toast.success("يمكنك الآن لصق الرابط في منشور Instagram", { duration: 5000 });
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: offerTitle,
          text: `اكتشف هذا العرض السياحي المميز على SAFRGO`,
          url: offerUrl,
        });
      } catch (error) {
        // User cancelled or share failed
        console.error("Share failed:", error);
      }
    } else {
      // Fallback to copy link
      copyLink();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild suppressHydrationWarning>
        <Button variant={variant} size={size} className={className}>
          <Share2 className={size === "icon" ? "h-5 w-5" : "h-4 w-4 mr-2"} />
          {size !== "icon" && "مشاركة"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>مشاركة العرض</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Native Share (if supported) */}
        {typeof window !== "undefined" && typeof navigator !== "undefined" && "share" in navigator && (
          <>
            <DropdownMenuItem onClick={shareNative}>
              <Share2 className="h-4 w-4 ml-2" />
              مشاركة...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Social Media */}
        <DropdownMenuItem onClick={shareToFacebook}>
          <Facebook className="h-4 w-4 ml-2 text-blue-600" />
          فيسبوك
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToWhatsApp}>
          <MessageCircle className="h-4 w-4 ml-2 text-green-600" />
          واتساب
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToInstagram}>
          <Instagram className="h-4 w-4 ml-2 text-pink-600" />
          إنستغرام
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Copy Link */}
        <DropdownMenuItem onClick={copyLink}>
          <Copy className="h-4 w-4 ml-2" />
          نسخ الرابط
        </DropdownMenuItem>

        {/* Download Image */}
        <DropdownMenuItem onClick={downloadImage} disabled={isDownloading}>
          <Download className="h-4 w-4 ml-2" />
          {isDownloading ? "جاري التحميل..." : "تحميل الصورة"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
