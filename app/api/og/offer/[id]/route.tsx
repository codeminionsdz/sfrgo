import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch offer details
    const { data: offer, error } = await supabase
      .from("offers")
      .select(
        `
        *,
        agencies (
          name,
          logo,
          verified
        )
      `
      )
      .eq("id", id)
      .single();

    if (error || !offer) {
      return new Response("Offer not found", { status: 404 });
    }

    const agency = offer.agencies as any;

    // Format price
    const formatPrice = (price: number, currency: string = "DZD") => {
      if (currency === "DZD") {
        return `${price.toLocaleString("ar-DZ")} دج`;
      }
      return `${price.toLocaleString("en-US")} ${currency}`;
    };

    const response = new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#0f172a",
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
            fontFamily: "sans-serif",
          }}
        >
          {/* Header with SAFRGO branding */}
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
              {agency.logo && (
                <img
                  src={agency.logo}
                  alt="Agency"
                  width="60"
                  height="60"
                  style={{ borderRadius: "12px", objectFit: "cover" }}
                />
              )}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {agency.name}
                  {agency.verified && (
                    <span
                      style={{
                        fontSize: 20,
                        color: "#3b82f6",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  وكالة سياحية معتمدة
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: "#3b82f6",
                letterSpacing: "1px",
              }}
            >
              SAFRGO
            </div>
          </div>

          {/* Main content */}
          <div
            style={{
              display: "flex",
              flex: 1,
              padding: "60px",
              gap: "40px",
            }}
          >
            {/* Left side - Offer image */}
            {offer.image && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
              >
                <img
                  src={offer.image}
                  alt={offer.title}
                  width="100%"
                  height="100%"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {/* Right side - Offer details */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                paddingRight: "20px",
              }}
            >
              {/* Title and destination */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    color: "white",
                    lineHeight: 1.2,
                    textAlign: "right",
                  }}
                >
                  {offer.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: 24,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  <span style={{ fontSize: 28 }}>📍</span>
                  <span>{offer.destination}, {offer.country}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: 24,
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  <span style={{ fontSize: 28 }}>⏱️</span>
                  <span>{offer.duration}</span>
                </div>
              </div>

              {/* Price and CTA */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {offer.original_price && offer.original_price > offer.price && (
                  <div
                    style={{
                      fontSize: 28,
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "line-through",
                      textAlign: "right",
                    }}
                  >
                    {formatPrice(offer.original_price, offer.currency)}
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
                      fontSize: 64,
                      fontWeight: 900,
                      color: "#3b82f6",
                      lineHeight: 1,
                    }}
                  >
                    {formatPrice(offer.price, offer.currency)}
                  </div>
                  <div
                    style={{
                      fontSize: 24,
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
                    fontSize: 28,
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
              fontSize: 20,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            اكتشف أفضل العروض السياحية مع SAFRGO
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );

    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    response.headers.set('Content-Type', 'image/png');
    
    return response;
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
