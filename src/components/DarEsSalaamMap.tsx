import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Compass,
  Bike,
  Store,
  Layers,
  Maximize2,
  Minimize2,
  Clock,
  ShieldCheck,
  Building2,
  Plane,
  Cross
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

// Exact Dar es Salaam Landmark coordinates matching the user's map screenshot
const DAR_LANDMARKS = [
  {
    id: 'branch_masaki',
    name: 'Zebra Masaki Main Kitchen',
    category: 'restaurant',
    coords: [-6.7562, 39.2810] as [number, number],
    desc: 'Main kitchen & grill hub',
    icon: '🍕'
  },
  {
    id: 'branch_kariakoo',
    name: 'Zebra Kariakoo Express Hub',
    category: 'restaurant',
    coords: [-6.8195, 39.2730] as [number, number],
    desc: 'China Plaza & Market Square hub',
    icon: '🥩'
  },
  {
    id: 'branch_oysterbay',
    name: 'Zebra Oysterbay Branch',
    category: 'restaurant',
    coords: [-6.7760, 39.2680] as [number, number],
    desc: 'Haile Selassie Rd bistro',
    icon: '🍔'
  },
  {
    id: 'hub_posta',
    name: 'Dar es Salaam City Centre (Posta)',
    category: 'landmark',
    coords: [-6.8160, 39.2890] as [number, number],
    desc: 'Askari Monument & Financial District',
    icon: '🏛️'
  },
  {
    id: 'hub_magomeni',
    name: 'Magomeni & Morogoro Rd',
    category: 'landmark',
    coords: [-6.8040, 39.2580] as [number, number],
    desc: 'BRT Rapid Bus Corridor',
    icon: '🚏'
  },
  {
    id: 'hub_muhimbili',
    name: 'Muhimbili National Hospital',
    category: 'hospital',
    coords: [-6.8065, 39.2740] as [number, number],
    desc: 'National Referral Hospital',
    icon: '🏥'
  },
  {
    id: 'hub_tabata',
    name: 'Tabata Dampo & Sigara',
    category: 'landmark',
    coords: [-6.8220, 39.2320] as [number, number],
    desc: 'Tabata Residential Hub',
    icon: '🏘️'
  },
  {
    id: 'hub_airport',
    name: 'Julius Nyerere Int. Airport (JNIA)',
    category: 'airport',
    coords: [-6.8781, 39.2026] as [number, number],
    desc: 'Terminal 3 & Cargo Wing',
    icon: '✈️'
  },
  {
    id: 'hub_mkapa',
    name: 'Benjamin Mkapa Stadium',
    category: 'stadium',
    coords: [-6.8552, 39.2778] as [number, number],
    desc: 'National Sports Complex',
    icon: '🏟️'
  },
  {
    id: 'hub_kigamboni',
    name: 'Nyerere Bridge (Kigamboni)',
    category: 'bridge',
    coords: [-6.8480, 39.3080] as [number, number],
    desc: 'Harbor Crossing & Ferry',
    icon: '🌉'
  },
  {
    id: 'hub_mabibo',
    name: 'Sokoni Mabibo',
    category: 'market',
    coords: [-6.8010, 39.2290] as [number, number],
    desc: 'Fresh Produce Wholesale Hub',
    icon: '🛒'
  },
  {
    id: 'hub_magufuli',
    name: 'Magufuli Bus Terminal (Mbezi)',
    category: 'terminal',
    coords: [-6.7820, 39.1250] as [number, number],
    desc: 'Upcountry Bus Central Hub',
    icon: '🚌'
  }
];

// Delivery Route coordinates: From Kariakoo Hub -> Upanga East -> Dar City Center
const DELIVERY_ROUTE_COORDS: [number, number][] = [
  [-6.8195, 39.2730], // Kariakoo Hub
  [-6.8170, 39.2750],
  [-6.8120, 39.2770], // Upanga border
  [-6.8080, 39.2810], // Upanga East
  [-6.8110, 39.2860], // Kivukoni link
  [-6.8160, 39.2890]  // Customer in Posta/City Centre
];

export const DarEsSalaamMap: React.FC<DarEsSalaamMapProps> = ({
  riderProgress = 65,
  customerLocationName = 'Upanga East, Dar es Salaam',
  orderNumber = '#ZB-8842',
  etaMinutes = 18,
  className = '',
  compact = false
}) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const riderMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  const [mapViewMode, setMapViewMode] = useState<'streets' | 'aerial' | 'photo'>('streets');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activePoi, setActivePoi] = useState<string | null>('Zebra Kariakoo Express Hub');

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

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered on Dar es Salaam matching the user's screenshot
    const map = L.map(mapContainerRef.current, {
      center: [-6.8200, 39.2680],
      zoom: compact ? 12 : 12,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    // Clean Map Tiles (OSM / Carto)
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Route Polyline (Glowing Neon Emerald)
    const polyline = L.polyline(DELIVERY_ROUTE_COORDS, {
      color: '#10b981',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    routePolylineRef.current = polyline;

    // Add Restaurant / Origin Marker
    const originIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-10 h-10 rounded-2xl bg-amber-500 shadow-xl border-2 border-white flex items-center justify-center text-lg transform hover:scale-110 transition-transform">
            🍕
          </div>
          <div class="absolute -bottom-1 w-3 h-1.5 bg-black/40 rounded-full blur-[1px]"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const originMarker = L.marker(DELIVERY_ROUTE_COORDS[0], { icon: originIcon })
      .addTo(map)
      .bindPopup(`
        <div style="color: #111; font-family: sans-serif; padding: 4px;">
          <strong style="color: #d97706; font-size: 13px;">Zebra Kitchen Hub</strong><br/>
          <span style="font-size: 11px; color: #666;">Kariakoo Market & China Plaza Branch</span>
        </div>
      `);

    // Add Customer Destination Marker
    const destIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-10 h-10 rounded-2xl bg-emerald-600 shadow-xl border-2 border-white flex items-center justify-center text-lg transform hover:scale-110 transition-transform animate-bounce">
            📍
          </div>
          <div class="absolute -bottom-1 w-3 h-1.5 bg-black/40 rounded-full blur-[1px]"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const destMarker = L.marker(DELIVERY_ROUTE_COORDS[DELIVERY_ROUTE_COORDS.length - 1], { icon: destIcon })
      .addTo(map)
      .bindPopup(`
        <div style="color: #111; font-family: sans-serif; padding: 4px;">
          <strong style="color: #059669; font-size: 13px;">Delivery Destination</strong><br/>
          <span style="font-size: 11px; color: #666;">${customerLocationName}</span>
        </div>
      `);

    // Add Rider Bodaboda Marker
    const riderPos = getInterpolatedRiderPosition(riderProgress);
    const riderIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute -inset-2 bg-emerald-400/40 rounded-full animate-ping"></div>
          <div class="w-11 h-11 rounded-full bg-emerald-500 border-2 border-white shadow-2xl flex items-center justify-center text-xl z-10">
            🛵
          </div>
          <div class="absolute -top-6 bg-black/90 text-emerald-400 font-bold px-1.5 py-0.5 rounded text-[9px] whitespace-nowrap shadow border border-emerald-500/30">
            35 km/h • Bodaboda
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    const riderMarker = L.marker(riderPos, { icon: riderIcon, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup(`
        <div style="color: #111; font-family: sans-serif; padding: 4px;">
          <strong style="color: #059669; font-size: 13px;">Mtumaji (Bodaboda Express)</strong><br/>
          <span style="font-size: 11px; color: #444;">Barabara ya Julius Nyerere / Morogoro Rd</span>
        </div>
      `);
    riderMarkerRef.current = riderMarker;

    // Add All Dar es Salaam Landmarks from user's map
    DAR_LANDMARKS.forEach(lm => {
      const isRestaurant = lm.category === 'restaurant';
      const lmIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div class="group relative cursor-pointer flex flex-col items-center">
            <div class="px-2 py-1 rounded-xl ${
              isRestaurant
                ? 'bg-amber-500 text-white font-bold'
                : 'bg-neutral-800/90 text-neutral-200 border border-neutral-600'
            } text-[11px] shadow-lg flex items-center space-x-1 whitespace-nowrap">
              <span>${lm.icon}</span>
              <span class="text-[10px] hidden group-hover:inline-block">${lm.name}</span>
            </div>
          </div>
        `,
        iconSize: [30, 20],
        iconAnchor: [15, 10]
      });

      L.marker(lm.coords, { icon: lmIcon })
        .addTo(map)
        .on('click', () => {
          setActivePoi(`${lm.name} - ${lm.desc}`);
        })
        .bindPopup(`
          <div style="color: #111; font-family: sans-serif; min-width: 140px;">
            <div style="font-weight: bold; font-size: 12px; color: #111;">${lm.icon} ${lm.name}</div>
            <div style="font-size: 11px; color: #666; margin-top: 2px;">${lm.desc}</div>
          </div>
        `);
    });

    mapInstanceRef.current = map;

    // Invalidate size to ensure proper rendering inside dynamic containers
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

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

  // Quick Area Focus Buttons
  const handleFocusArea = (area: string) => {
    setSelectedArea(area);
    const map = mapInstanceRef.current;
    if (!map) return;

    switch (area) {
      case 'all':
        map.flyTo([-6.8200, 39.2680], 12, { duration: 1.2 });
        break;
      case 'cbd':
        map.flyTo([-6.8160, 39.2820], 14, { duration: 1.2 });
        break;
      case 'kariakoo':
        map.flyTo([-6.8195, 39.2690], 15, { duration: 1.2 });
        break;
      case 'masaki':
        map.flyTo([-6.7560, 39.2800], 14, { duration: 1.2 });
        break;
      case 'airport':
        map.flyTo([-6.8781, 39.2026], 14, { duration: 1.2 });
        break;
      case 'kigamboni':
        map.flyTo([-6.8520, 39.2950], 13.5, { duration: 1.2 });
        break;
      default:
        map.flyTo([-6.8200, 39.2680], 12, { duration: 1.2 });
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-950 transition-all duration-300 ${
        isExpanded ? 'fixed inset-3 z-50 rounded-3xl' : compact ? 'h-72 sm:h-80' : 'h-80 sm:h-96'
      } ${className}`}
    >
      {/* 1. Leaflet Interactive Real Map of Dar es Salaam */}
      {mapViewMode !== 'photo' ? (
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      ) : (
        /* 2. Visual Dar es Salaam Map Graphic Mode matching user's upload */
        <div className="relative w-full h-full overflow-hidden bg-[#e5e7eb] dark:bg-[#1a1d24]">
          <img
            src="/dar_es_salaam_map.jpg"
            alt="Dar es Salaam Map Navigation"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Interactive GPS Pin Overlays matching user's map */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Posta / City Centre */}
            <div className="absolute top-[38%] left-[73%] pointer-events-auto cursor-pointer group">
              <div className="px-2 py-1 rounded-xl bg-neutral-900/90 text-white text-[10px] font-bold border border-emerald-500/40 shadow-xl flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Dar es Salaam (Posta)</span>
              </div>
            </div>

            {/* Kariakoo Hub */}
            <div className="absolute top-[42%] left-[62%] pointer-events-auto cursor-pointer">
              <div className="p-1.5 rounded-2xl bg-amber-500 text-white text-xs font-bold shadow-xl border border-white flex items-center space-x-1">
                <span>🍕</span>
                <span className="text-[10px] pr-1">Zebra Kariakoo</span>
              </div>
            </div>

            {/* Animated Bodaboda */}
            <div
              className="absolute pointer-events-auto transition-all duration-1000"
              style={{
                top: `${42 - (riderProgress * 0.05)}%`,
                left: `${62 + (riderProgress * 0.1)}%`
              }}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute -inset-2 bg-emerald-400/40 rounded-full animate-ping"></div>
                <div className="w-9 h-9 rounded-full bg-emerald-500 text-white border-2 border-white shadow-2xl flex items-center justify-center text-sm">
                  🛵
                </div>
              </div>
            </div>

            {/* JNIA Airport */}
            <div className="absolute top-[72%] left-[40%] pointer-events-auto">
              <div className="px-2 py-1 rounded-xl bg-blue-600/90 text-white text-[10px] font-bold shadow flex items-center space-x-1">
                <Plane className="w-3 h-3" />
                <span>Airport JNIA</span>
              </div>
            </div>

            {/* Benjamin Mkapa Stadium */}
            <div className="absolute top-[65%] left-[67%] pointer-events-auto">
              <div className="px-2 py-1 rounded-xl bg-emerald-600/90 text-white text-[10px] font-bold shadow flex items-center space-x-1">
                <span>🏟️</span>
                <span>Mkapa Stadium</span>
              </div>
            </div>

            {/* Nyerere Bridge Kigamboni */}
            <div className="absolute top-[68%] left-[74%] pointer-events-auto">
              <div className="px-2 py-1 rounded-xl bg-purple-600/90 text-white text-[10px] font-bold shadow flex items-center space-x-1">
                <span>🌉</span>
                <span>Nyerere Bridge</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Overlay: Live Dar es Salaam GPS Status */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        {/* Left Badge: City & ETA */}
        <div className="pointer-events-auto bg-black/85 backdrop-blur-md border border-neutral-700/80 rounded-2xl p-2.5 sm:p-3 text-white shadow-2xl flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <Navigation className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs sm:text-sm font-bold font-display text-white">
                Dar es Salaam Live Radar
              </h3>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                GPS Active
              </span>
            </div>
            <p className="text-[10px] text-neutral-300">
              Kariakoo ➔ Upanga • <strong className="text-emerald-400">{etaMinutes} mins</strong> ({riderProgress}% umbali)
            </p>
          </div>
        </div>

        {/* Right Controls: View Switcher & Expand */}
        <div className="pointer-events-auto flex items-center space-x-1.5 bg-black/85 backdrop-blur-md border border-neutral-700/80 rounded-2xl p-1.5 shadow-2xl">
          <button
            onClick={() => setMapViewMode(prev => (prev === 'photo' ? 'streets' : 'photo'))}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 transition-all ${
              mapViewMode === 'photo'
                ? 'bg-emerald-500 text-white'
                : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
            title="Badilisha Mwonekano wa Ramani (Street / Aerial Vector)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {mapViewMode === 'photo' ? 'Street Tile' : 'Picha ya Ramani'}
            </span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
            title={isExpanded ? 'Punguza Ukubwa' : 'Kuza Ramani'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom Area Selector Pills (Posta, Kariakoo, Masaki, Airport, Kigamboni) */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="pointer-events-auto flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 max-w-full bg-black/85 backdrop-blur-md border border-neutral-800 rounded-2xl p-1.5 shadow-2xl">
          {[
            { id: 'all', label: 'Dar Yote' },
            { id: 'cbd', label: 'Posta / CBD' },
            { id: 'kariakoo', label: 'Kariakoo' },
            { id: 'masaki', label: 'Masaki & Oysterbay' },
            { id: 'airport', label: 'Airport (JNIA)' },
            { id: 'kigamboni', label: 'Kigamboni' }
          ].map(area => (
            <button
              key={area.id}
              onClick={() => handleFocusArea(area.id)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${
                selectedArea === area.id
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {area.label}
            </button>
          ))}
        </div>

        {/* Selected Landmark badge or Active POI */}
        {activePoi && (
          <div className="hidden md:flex pointer-events-auto bg-black/85 backdrop-blur-md border border-neutral-800 rounded-2xl px-3 py-1.5 text-[10px] text-neutral-300 max-w-xs truncate items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span className="truncate">{activePoi}</span>
          </div>
        )}
      </div>
    </div>
  );
};
