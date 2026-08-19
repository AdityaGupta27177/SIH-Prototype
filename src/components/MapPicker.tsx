"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function MapPicker({
  onLocationSelect,
  initialLat = 18.52,
  initialLng = 73.855,
}: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [selectedPos, setSelectedPos] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    const map = L.map(mapRef.current).setView([initialLat, initialLng], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap & Survey of India Cadastral Base",
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }

      setSelectedPos({ lat, lng });
      onLocationSelect(lat, lng);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3">
      <div
        ref={mapRef}
        className="h-[380px] w-full rounded-lg border-2 border-parchment-300 shadow-inner overflow-hidden"
        style={{ zIndex: 1 }}
      />
      {selectedPos ? (
        <div className="flex items-center justify-between bg-olive-50 border border-olive-400 rounded-lg px-4 py-2.5 text-xs">
          <span className="font-semibold text-olive-900 flex items-center gap-1.5">
            📍 Captured Plot Geotag:
          </span>
          <span className="font-mono font-bold text-olive-900">
            {selectedPos.lat.toFixed(6)}° N, {selectedPos.lng.toFixed(6)}° E
          </span>
        </div>
      ) : (
        <div className="bg-parchment-100 border border-parchment-300 rounded-lg p-3 text-xs text-parchment-600 flex items-center gap-2">
          <span>ℹ️</span>
          <span>Click directly on the cadastral field plot to fix the verified cultivation geotag.</span>
        </div>
      )}
    </div>
  );
}
