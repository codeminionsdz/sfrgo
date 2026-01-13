import React from "react";

/**
 * نموذج توضيحي لشكل صورة OG المولدة
 * الحجم: 1200x630 بكسل
 * 
 * هذا الملف للتوثيق فقط - الصورة الفعلية تُولَّد في:
 * app/api/og/offer/[id]/route.tsx
 */

// مثال على البيانات
const exampleOffer = {
  title: "رحلة إلى بالي الساحرة",
  destination: "بالي",
  country: "إندونيسيا",
  duration: "8 أيام / 7 ليالي",
  price: 129900,
  originalPrice: 159900,
  currency: "DZD",
  image: "/example-bali.jpg",
  agency: {
    name: "وكالة الأحلام للسفر",
    logo: "/example-agency-logo.png",
    verified: true,
  },
};

export function OGImagePreview() {
  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        backgroundColor: "#0f172a",
        backgroundImage:
          "radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "40px 60px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Agency Logo */}
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#3b82f6",
              borderRadius: "12px",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {exampleOffer.agency.name}
              {exampleOffer.agency.verified && (
                <span style={{ fontSize: "20px", color: "#3b82f6" }}>✓</span>
              )}
            </div>
            <div
              style={{
                fontSize: "18px",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              وكالة سياحية معتمدة
            </div>
          </div>
        </div>
        {/* SAFRGO Branding */}
        <div
          style={{
            fontSize: "24px",
            fontWeight: 600,
            color: "#3b82f6",
            letterSpacing: "1px",
          }}
        >
          SAFRGO
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flex: 1,
          padding: "60px",
          gap: "40px",
        }}
      >
        {/* Left - Image */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#1e293b",
            borderRadius: "24px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Placeholder for offer image */}
        </div>

        {/* Right - Details */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingRight: "20px",
          }}
        >
          {/* Title & Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.2,
                textAlign: "right",
              }}
            >
              {exampleOffer.title}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "24px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              <span style={{ fontSize: "28px" }}>📍</span>
              <span>
                {exampleOffer.destination}, {exampleOffer.country}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "24px",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              <span style={{ fontSize: "28px" }}>⏱️</span>
              <span>{exampleOffer.duration}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {exampleOffer.originalPrice && (
              <div
                style={{
                  fontSize: "28px",
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "line-through",
                  textAlign: "right",
                }}
              >
                {exampleOffer.originalPrice.toLocaleString("ar-DZ")} دج
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  fontSize: "64px",
                  fontWeight: 900,
                  color: "#3b82f6",
                  lineHeight: 1,
                }}
              >
                {exampleOffer.price.toLocaleString("ar-DZ")} دج
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                للشخص
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 40px",
                backgroundColor: "#3b82f6",
                borderRadius: "16px",
                fontSize: "28px",
                fontWeight: 700,
                color: "white",
                boxShadow: "0 10px 30px -5px rgba(59, 130, 246, 0.5)",
              }}
            >
              احجز الآن على SAFRGO
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          fontSize: "20px",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        اكتشف أفضل العروض السياحية مع SAFRGO
      </div>
    </div>
  );
}

/**
 * مواصفات التصميم
 * ==================
 * 
 * الأبعاد:
 * - العرض: 1200px
 * - الارتفاع: 630px
 * - نسبة العرض إلى الارتفاع: 1.9:1
 * 
 * الألوان:
 * - الخلفية: #0f172a (slate-900)
 * - الأساسي: #3b82f6 (blue-500)
 * - النص الرئيسي: #ffffff
 * - النص الثانوي: rgba(255,255,255,0.6)
 * 
 * الخطوط:
 * - العنوان: 48px, font-weight: 800
 * - السعر: 64px, font-weight: 900
 * - التفاصيل: 24-28px, font-weight: 400-600
 * - Footer: 20px
 * 
 * المسافات:
 * - Padding الخارجي: 40-60px
 * - Gap بين العناصر: 12-24px
 * - Border radius: 12-24px
 * 
 * الظلال:
 * - صورة العرض: 0 25px 50px -12px rgba(0,0,0,0.5)
 * - زر CTA: 0 10px 30px -5px rgba(59,130,246,0.5)
 * 
 * المنصات المدعومة:
 * ✅ Facebook (recommended: 1200x630)
 * ✅ Twitter/X (minimum: 1200x628)
 * ✅ LinkedIn (recommended: 1200x627)
 * ✅ WhatsApp (auto-resize)
 * ✅ Instagram (when shared as link)
 * 
 * ملاحظات:
 * - تصميم RTL (من اليمين لليسار)
 * - دعم Unicode كامل للنصوص العربية
 * - تحسين للعرض على الأجهزة المختلفة
 * - علامة SAFRGO غير مزعجة (أعلى يميناً)
 * - تركيز على صورة العرض والسعر
 */

export default OGImagePreview;
