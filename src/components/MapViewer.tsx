"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewerProps {
  pinLat: number;
  pinLng: number;
  boundary?: {
    type: "Polygon";
    coordinates: number[][][];
  };
  isInside?: boolean;
}

export default function MapViewer({
  pinLat,
  pinLng,
  boundary,
  isInside,
}: MapViewerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    const map = L.map(mapRef.current).setView([pinLat, pinLng], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap & Survey Cadastral Base",
    }).addTo(map);

    const pinIcon = L.divIcon({
      html: `<div style="
        width: 22px; height: 22px;
        background: ${isInside ? '#134E2D' : '#991B1B'};
        border: 3px solid #FFFFFF;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      "></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      className: "",
    });
    L.marker([pinLat, pinLng], { icon: pinIcon }).addTo(map);

    if (boundary) {
      const latLngs: L.LatLngExpression[] = boundary.coordinates[0].map(
        (coord) => [coord[1], coord[0]] as L.LatLngExpression
      );
      const polygon = L.polygon(latLngs, {
        color: isInside ? "#134E2D" : "#991B1B",
        fillColor: isInside ? "#134E2D" : "#991B1B",
        fillOpacity: 0.2,
        weight: 3,
        dashArray: isInside ? undefined : "6, 6",
      }).addTo(map);

      const group = L.featureGroup([L.marker([pinLat, pinLng]), polygon]);
      map.fitBounds(group.getBounds().pad(0.2));
    }

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
      {isInside !== undefined && (
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-lg border text-xs font-mono font-bold uppercase tracking-wider ${
            isInside
              ? "bg-olive-50 text-olive-900 border-olive-600"
              : "bg-crimson-50 text-crimson-800 border-crimson-600"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{isInside ? "🛡️" : "⚠️"}</span>
            <span>
              {isInside
                ? "SPATIAL COINCIDENCE PASSED (ST_Within Cadastral Polygon)"
                : "OUT-OF-BOUNDS GEOTAG DETECTED (Spatial Inconsistency)"}
            </span>
          </div>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-current">
            {isInside ? "MATCH: 100%" : "DISPUTED"}
          </span>
        </div>
      )}
    </div>
  );
}
