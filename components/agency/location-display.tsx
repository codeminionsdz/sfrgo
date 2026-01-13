"use client"

import { useEffect, useState } from "react"
import { MapPin } from "@/components/icons"

interface LocationDisplayProps {
  lat: number
  lng: number
  agencyName: string
  className?: string
}

/**
 * Read-only map display for agency public profile
 * Shows agency location with marker
 * No editing capabilities
 * 
 * @param lat - Agency latitude
 * @param lng - Agency longitude
 * @param agencyName - Agency name for marker popup
 */
export function LocationDisplay({
  lat,
  lng,
  agencyName,
  className = "",
}: LocationDisplayProps) {
  const [isClient, setIsClient] = useState(false)
  const [Map, setMap] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)

    // Dynamically import Leaflet only on client side
    import("react-leaflet").then((module) => {
      setMap(module)
    })
    
    // Import Leaflet to fix default marker icon
    import("leaflet").then((L) => {
      // Fix Leaflet default icon issue with webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })
    })
  }, [])

  if (!isClient || !Map) {
    return (
      <div
        className={`w-full h-[300px] bg-muted rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="flex flex-col items-center gap-2">
          <MapPin className="w-8 h-8 text-muted-foreground animate-pulse" />
          <p className="text-sm text-muted-foreground">جاري تحميل الخريطة...</p>
        </div>
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker, Popup } = Map

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Map */}
      <div className="relative rounded-lg overflow-hidden border border-border shadow-md">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          style={{ height: "300px", width: "100%" }}
          scrollWheelZoom={false}
          dragging={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-sm">{agencyName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  موقع المكتب
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Location Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span>موقع المكتب الفعلي</span>
      </div>
    </div>
  )
}

/**
 * Empty state when location is not set
 */
export function LocationNotSet({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full h-[300px] bg-muted rounded-lg flex items-center justify-center ${className}`}
    >
      <div className="text-center space-y-2 px-4">
        <MapPin className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
        <p className="text-sm font-medium text-foreground">
          لم يتم تحديد الموقع
        </p>
        <p className="text-xs text-muted-foreground">
          لم تقم الوكالة بتحديد موقعها على الخريطة بعد
        </p>
      </div>
    </div>
  )
}
