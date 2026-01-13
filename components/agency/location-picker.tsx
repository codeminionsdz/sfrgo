"use client"

import { useEffect, useState } from "react"
import { MapPin, Loader2, AlertCircle, Locate } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface LocationPickerProps {
  initialLat?: number | null
  initialLng?: number | null
  onLocationChange: (lat: number, lng: number) => void
  className?: string
}

/**
 * Interactive map for selecting agency location
 * Uses Leaflet and OpenStreetMap
 * Click on map to set location, drag marker to adjust
 * Supports automatic location detection with user confirmation
 * 
 * @param initialLat - Initial latitude (if location already set)
 * @param initialLng - Initial longitude (if location already set)
 * @param onLocationChange - Callback when location is selected/changed
 */
export function LocationPicker({
  initialLat,
  initialLng,
  onLocationChange,
  className = "",
}: LocationPickerProps) {
  const [isClient, setIsClient] = useState(false)
  const [Map, setMap] = useState<any>(null)
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
  } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  )
  const [isDetecting, setIsDetecting] = useState(false)
  const [isAutoDetected, setIsAutoDetected] = useState(false)
  const [mapInstance, setMapInstance] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Dynamically import Leaflet only on client side to avoid SSR issues
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

  const handleLocationSelect = (lat: number, lng: number, isAuto = false) => {
    setSelectedLocation({ lat, lng })
    onLocationChange(lat, lng)
    
    if (isAuto) {
      setIsAutoDetected(true)
      toast.success("تم تحديد موقعك", {
        description: "يرجى تأكيد الموقع أو تعديله عن طريق سحب العلامة",
      })
    }
  }

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      toast.error("المتصفح لا يدعم تحديد الموقع", {
        description: "يرجى استخدام الطريقة اليدوية بالنقر على الخريطة",
      })
      return
    }

    setIsDetecting(true)
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        // Center map on detected location
        if (mapInstance) {
          mapInstance.setView([latitude, longitude], 16)
        }
        
        // Set marker at detected location
        handleLocationSelect(latitude, longitude, true)
        setIsDetecting(false)
      },
      (error) => {
        setIsDetecting(false)
        
        let errorMessage = "فشل في تحديد الموقع"
        let description = "يرجى استخدام الطريقة اليدوية بالنقر على الخريطة"
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "تم رفض إذن الموقع"
            description = "يرجى السماح بالوصول إلى الموقع في إعدادات المتصفح"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "الموقع غير متوفر"
            description = "تأكد من تفعيل خدمات الموقع على جهازك"
            break
          case error.TIMEOUT:
            errorMessage = "انتهت مهلة تحديد الموقع"
            description = "يرجى المحاولة مرة أخرى أو استخدام الطريقة اليدوية"
            break
        }
        
        toast.error(errorMessage, { description })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  if (!isClient || !Map) {
    return (
      <div
        className={`w-full h-[400px] bg-muted rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">جاري تحميل الخريطة...</p>
        </div>
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker, useMapEvents } = Map

  // Default center: Algeria (Algiers)
  const defaultCenter: [number, number] = [36.7538, 3.0588]
  const center: [number, number] = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : defaultCenter

  // Component to handle map clicks and track map instance
  function LocationMarker() {
    const map = useMapEvents({
      click(e: any) {
        handleLocationSelect(e.latlng.lat, e.latlng.lng)
        setIsAutoDetected(false) // Clear auto-detected flag when manually selecting
      },
    })

    // Store map instance for auto-detection
    useEffect(() => {
      setMapInstance(map)
    }, [map])

    if (!selectedLocation) return null

    return (
      <Marker
        position={[selectedLocation.lat, selectedLocation.lng]}
        draggable={true}
        eventHandlers={{
          dragend: (e: any) => {
            const marker = e.target
            const position = marker.getLatLng()
            handleLocationSelect(position.lat, position.lng)
            setIsAutoDetected(false) // Clear auto-detected flag when dragging
          },
        }}
      />
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Auto-detect Button */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleAutoDetect}
          disabled={isDetecting}
          className="flex-1 sm:flex-initial"
        >
          {isDetecting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جاري تحديد الموقع...
            </>
          ) : (
            <>
              <Locate className="w-4 h-4 mr-2" />
              📍 تحديد موقعي تلقائياً
            </>
          )}
        </Button>
        <div className="flex-1 text-xs text-muted-foreground">
          أو انقر على الخريطة لتحديد الموقع يدوياً
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              حدد موقع مكتبك الفعلي على الخريطة
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              استخدم زر التحديد التلقائي، أو انقر على الخريطة، أو اسحب العلامة لضبط الموقع بدقة
            </p>
          </div>
        </div>
      </div>
      
      {/* Auto-detected confirmation notice */}
      {isAutoDetected && (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                يرجى تأكيد الموقع
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                تم تحديد موقعك تلقائياً. تأكد من دقة الموقع واسحب العلامة إذا لزم الأمر، ثم احفظ التغييرات.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="relative rounded-lg overflow-hidden border border-border shadow-md">
        <MapContainer
          center={center}
          zoom={selectedLocation ? 15 : 6}
          style={{ height: "400px", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </div>

      {/* Coordinates Preview */}
      {selectedLocation && (
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-foreground">
                الموقع المحدد
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground font-mono">
                <div>
                  <span className="text-foreground">خط العرض:</span>{" "}
                  {selectedLocation.lat.toFixed(6)}
                </div>
                <div>
                  <span className="text-foreground">خط الطول:</span>{" "}
                  {selectedLocation.lng.toFixed(6)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedLocation && (
        <div className="text-center py-3">
          <p className="text-sm text-muted-foreground">
            لم يتم تحديد موقع بعد. انقر على الخريطة أو استخدم زر التحديد التلقائي.
          </p>
        </div>
      )}
    </div>
  )
}
