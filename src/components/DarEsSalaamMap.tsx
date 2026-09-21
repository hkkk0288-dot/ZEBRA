import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Navigation,
  Maximize2,
  Minimize2,
  Clock,
  LocateFixed,
  MapPin,
  Bike
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface DarEsSalaamMapProps {
  riderProgress?: number; // 0 to 100
  customerLocationName?: string;
  orderNumber?: string;
  etaMinutes?: number;
  className?: string;
  compact?: boolean;
}

// Delivery Route coordinates: From Kariakoo Hub -> Upanga East -> Masaki / City Centre
const DELIVERY_ROUTE_COORDS: [number, number][] = [
  [-6.8195, 39.2730], // Kariakoo Hub (Origin)
  [-6.8150, 39.2755],
  [-6.8100, 39.2780], // Upanga
  [-6.8020, 39.2820],
  [-6.7900, 39.2850], // Oysterbay link
  [-6.7760, 39.2780], // Masaki Peninsula (Destination)
];

export const DarEsSalaamMap: React.FC<DarEsSalaamMapProps> = ({
  riderProgress = 65,
  customerLocationName = 'Plot 44, Toure Drive, Masaki Peninsula',
  orderNumber = '#ZB-782194',
  etaMinutes = 8,
  className = '',
  compact = false
}) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const riderMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Calculate live rider position along the route
  const getInterpolatedRiderPosition = (progress: number): [number, number] => {
    const points = DELIVERY_ROUTE_COORDS;
    if (points.length < 2) return points[0];

    const totalSegments = points.length - 1;
    const scaledProgress = Math.max(0, Math.min(100, progress)) / 100;
    const currentSegmentFloat = scaledProgress * totalSegments;
    const currentSegmentIndex = Math.min(Math.floor(currentSegmentFloat), totalSegments - 1);
    const segmentFraction = currentSegmentFloat - currentSegmentIndex;

    const p1 = points[currentSegmentIndex];
    const p2 = points[currentSegmentIndex + 1];

    const lat = p1[0] + (p2[0] - p1[0]) * segmentFraction;
    const lng = p1[1] + (p2[1] - p1[1]) * segmentFraction;
    return [lat, lng];
  };

  // Initialize Map with clean, watermark-free tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered on Dar es Salaam
    const map = L.map(mapContainerRef.current, {
      center: [-6.7980, 39.2770],
      zoom: 13,
      minZoom: 11,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    // Clean, high-resolution tiles WITHOUT "API KEY REQUIRED" watermark
    // Dark: ESRI Dark Gray Canvas (Clean, sleek, free, official)
    // Light: OpenStreetMap Standard
    const tileUrl = isDark
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      subdomains: 'abc',
      maxZoom: 19,
      opacity: isDark ? 0.92 : 1
    }).addTo(map);

    // Route Polyline (Sleek glowing Emerald)
    const polyline = L.polyline(DELIVERY_ROUTE_COORDS, {
      color: '#10b981',
      weight: 4,
      opacity: 0.9,
      dashArray: '6, 6',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    routePolylineRef.current = polyline;

    // Add Restaurant / Origin Marker (Clean, no clutter)
    const originIcon = L.divIcon({
      className: 'custom-clean-map-icon',
      html: `
        <div class="relative flex flex-col items-center">
          <div class="px-2 py-1 rounded-xl bg-amber-500 text-neutral-950 font-black text-[10px] shadow-lg border border-amber-300 flex items-center space-x-1 whitespace-nowrap">
            <span>🍕</span>
            <span>Zebra Kitchen</span>
          </div>
          <div class="w-1.5 h-1.5 bg-amber-500 rotate-45 -mt-0.5"></div>
        </div>
      `,
      iconSize: [80, 30],
      iconAnchor: [40, 30]
    });

    L.marker(DELIVERY_ROUTE_COORDS[0], { icon: originIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: sans-serif; padding: 2px;">
          <strong style="color: #d97706; font-size: 12px;">Zebra Kitchen Hub</strong><br/>
          <span style="font-size: 11px; color: #666;">Chakula kimeandaliwa hapa</span>
        </div>
      `);

    // Add Customer Destination Marker
    const destIcon = L.divIcon({
      className: 'custom-clean-map-icon',
      html: `
        <div class="relative flex flex-col items-center">
          <div class="px-2 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[10px] shadow-lg border border-emerald-300 flex items-center space-x-1 whitespace-nowrap">
            <span>📍</span>
            <span>Mteja (Delivery)</span>
          </div>
          <div class="w-1.5 h-1.5 bg-emerald-600 rotate-45 -mt-0.5"></div>
        </div>
      `,
      iconSize: [95, 30],
      iconAnchor: [47, 30]
    });

    L.marker(DELIVERY_ROUTE_COORDS[DELIVERY_ROUTE_COORDS.length - 1], { icon: destIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: sans-serif; padding: 2px;">
          <strong style="color: #059669; font-size: 12px;">Eneo la Kufikisha</strong><br/>
          <span style="font-size: 11px; color: #666;">${customerLocationName}</span>
        </div>
      `);

    // Add Live Courier Bodaboda Marker (Minimal, high quality)
    const riderPos = getInterpolatedRiderPosition(riderProgress);
    const riderIcon = L.divIcon({
      className: 'custom-clean-map-icon',
      html: `
        <div class="relative flex flex-col items-center">
          <div class="absolute -top-5 px-1.5 py-0.5 rounded-full bg-neutral-900/90 border border-emerald-500/40 text-emerald-400 font-bold text-[9px] shadow whitespace-nowrap">
            35 km/h
          </div>
          <div class="relative w-9 h-9 rounded-full bg-emerald-500 border-2 border-white shadow-xl flex items-center justify-center text-base z-10">
            🛵
          </div>
          <div class="absolute -bottom-1 w-2.5 h-1 bg-black/40 rounded-full blur-[1px]"></div>
        </div>
      `,
      iconSize: [36, 46],
      iconAnchor: [18, 36]
    });

    const riderMarker = L.marker(riderPos, { icon: riderIcon, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: sans-serif; padding: 2px;">
          <strong style="color: #059669; font-size: 12px;">Bodaboda Express</strong><br/>
          <span style="font-size: 11px; color: #444;">Yuko njiani kuelekea kwako</span>
        </div>
      `);
    riderMarkerRef.current = riderMarker;

    // Automatically frame the delivery route smoothly
    const bounds = L.latLngBounds(DELIVERY_ROUTE_COORDS);
    map.fitBounds(bounds, { padding: [35, 35], maxZoom: 14 });

    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isDark]);

  // Update Rider Marker position dynamically
  useEffect(() => {
    if (!riderMarkerRef.current) return;
    const newPos = getInterpolatedRiderPosition(riderProgress);
    riderMarkerRef.current.setLatLng(newPos);
  }, [riderProgress]);

  // Re-center on Rider
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const riderPos = getInterpolatedRiderPosition(riderProgress);
    map.flyTo(riderPos, 14, { duration: 1 });
  };

  return (
    <div
      className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-800 shadow-xl bg-neutral-950 transition-all duration-300 ${
        isExpanded ? 'fixed inset-3 z-50 rounded-2xl sm:rounded-3xl' : compact ? 'h-64 sm:h-80' : 'h-72 sm:h-96'
      } ${className}`}
    >
      {/* Real Map Canvas (Clean, Watermark-Free) */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Sleek Top Floating Radar Badge */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="pointer-events-auto bg-neutral-900/90 backdrop-blur-md border border-neutral-700/70 rounded-full px-3 py-1.5 text-white shadow-lg flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold tracking-wide">Live GPS</span>
          <span className="text-neutral-500">•</span>
          <span className="text-[11px] text-emerald-400 font-semibold">{etaMinutes} mins</span>
        </div>

        {/* Map Control Buttons */}
        <div className="pointer-events-auto flex items-center space-x-1.5">
          <button
            onClick={handleRecenter}
            className="p-2 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-700/70 text-neutral-300 hover:text-white shadow-lg transition-transform active:scale-95"
            title="Lenga kwa Dereva (Re-center)"
          >
            <LocateFixed className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-700/70 text-neutral-300 hover:text-white shadow-lg transition-transform active:scale-95"
            title={isExpanded ? 'Punguza Ukubwa' : 'Kuza Ramani'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Clean Bottom Route Status Strip */}
      <div className="absolute bottom-3 left-3 right-3 pointer-events-none z-10 flex justify-center">
        <div className="pointer-events-auto bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-2xl px-3.5 py-1.5 text-white shadow-xl flex items-center space-x-2 text-[11px] max-w-sm w-full justify-between">
          <div className="flex items-center space-x-1.5 truncate">
            <span className="text-amber-400 font-bold">Zebra Masaki</span>
            <span className="text-neutral-500">➔</span>
            <span className="truncate text-neutral-300">{customerLocationName}</span>
          </div>
          <span className="text-emerald-400 font-bold shrink-0">{riderProgress}%</span>
        </div>
      </div>
    </div>
  );
};
