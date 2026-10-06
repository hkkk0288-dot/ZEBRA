import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapOrderPin, AdminDriver } from './adminMockData';

export type AdminMapLayerMode = 'roadmap' | 'hybrid' | 'satellite' | 'terrain' | 'osm';

interface LayerOption {
  id: AdminMapLayerMode;
  name: string;
  icon: string;
  url: string;
  subdomains: string[];
  maxZoom: number;
  attr: string;
}

const LAYER_CONFIGS: Record<AdminMapLayerMode, LayerOption> = {
  roadmap: {
    id: 'roadmap',
    name: 'Mitaa (Roadmap)',
    icon: '🗺️',
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attr: '© Google Maps'
  },
  hybrid: {
    id: 'hybrid',
    name: 'Satelaiti (Hybrid)',
    icon: '🛰️',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attr: '© Google Satellite'
  },
  satellite: {
    id: 'satellite',
    name: 'Picha Anga (Satellite)',
    icon: '🌍',
    url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attr: '© Google Imagery'
  },
  terrain: {
    id: 'terrain',
    name: 'Ardhi (Terrain)',
    icon: '⛰️',
    url: 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attr: '© Google Terrain'
  },
  osm: {
    id: 'osm',
    name: 'OpenStreetMap',
    icon: '🧭',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19,
    attr: '© OpenStreetMap contributors'
  }
};

// 8 Kookoos Branches in Dar es Salaam
const KOOKOOS_BRANCH_PINS = [
  { id: 'b-mwenge', name: 'Kookoos Mwenge HQ', coords: [-6.7712, 39.2215] as [number, number], tag: 'HQ Central', phone: '+255 712 345 678' },
  { id: 'b-sinza', name: 'Kookoos Sinza Mori', coords: [-6.7820, 39.2310] as [number, number], tag: 'Branch 02', phone: '+255 744 883 291' },
  { id: 'b-kariakoo', name: 'Kookoos Kamata Kariakoo', coords: [-6.8240, 39.2785] as [number, number], tag: 'Branch 03', phone: '+255 682 994 002' },
  { id: 'b-masana', name: 'Kookoos Masana Goba', coords: [-6.7450, 39.1850] as [number, number], tag: 'Branch 04', phone: '+255 754 112 334' },
  { id: 'b-bahari', name: 'Kookoos Bahari Beach', coords: [-6.6620, 39.2130] as [number, number], tag: 'Branch 05', phone: '+255 712 998 877' },
  { id: 'b-tegeta', name: 'Kookoos Tegeta Shoppers', coords: [-6.6850, 39.2010] as [number, number], tag: 'Branch 06', phone: '+255 788 445 566' },
  { id: 'b-kigamboni', name: 'Kookoos Kigamboni Ferry', coords: [-6.8320, 39.3010] as [number, number], tag: 'Branch 07', phone: '+255 714 556 778' },
  { id: 'b-masaki', name: 'Kookoos Masaki Peninsula', coords: [-6.7580, 39.2820] as [number, number], tag: 'Branch 08', phone: '+255 755 221 144' }
];

// Major delivery artery corridor in Dar es Salaam
const DAR_MAIN_ROUTE: [number, number][] = [
  [-6.8240, 39.2785], // Kariakoo
  [-6.8080, 39.2820], // Upanga
  [-6.7900, 39.2850], // Oysterbay
  [-6.7712, 39.2215], // Mwenge HQ
  [-6.7820, 39.2310], // Sinza
  [-6.7580, 39.2820]  // Masaki
];

// Quick Focus Presets for Dar es Salaam Landmarks (matching user screenshots)
const FOCUS_PRESETS = [
  { label: 'Dar es Salaam (Yote)', coords: [-6.8000, 39.2600] as [number, number], zoom: 12 },
  { label: 'Mwenge HQ 🍗', coords: [-6.7712, 39.2215] as [number, number], zoom: 15 },
  { label: 'Airport (JNIA) ✈️', coords: [-6.8778, 39.2026] as [number, number], zoom: 14 },
  { label: 'Tandika / Mkapa 🏟️', coords: [-6.8550, 39.2780] as [number, number], zoom: 14 },
  { label: 'Kigamboni & Vikindu 🌊', coords: [-6.9200, 39.2900] as [number, number], zoom: 13 },
  { label: 'Mvomero / Pwani 🌿', coords: [-6.3500, 38.4000] as [number, number], zoom: 9 }
];

interface AdminLeafletMapProps {
  pins?: MapOrderPin[];
  selectedPin?: MapOrderPin | null;
  onSelectPin?: (pin: MapOrderPin) => void;
  drivers?: AdminDriver[];
  selectedDriver?: AdminDriver | null;
  onSelectDriver?: (driver: AdminDriver) => void;
  isDark: boolean;
  className?: string;
  zoom?: number;
  center?: [number, number];
  defaultLayer?: AdminMapLayerMode;
}

export const AdminLeafletMap: React.FC<AdminLeafletMapProps> = ({
  pins = [],
  selectedPin = null,
  onSelectPin,
  drivers = [],
  selectedDriver = null,
  onSelectDriver,
  isDark,
  className = 'w-full h-full',
  zoom = 13,
  center = [-6.7920, 39.2600],
  defaultLayer
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const branchesLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Active layer state - defaults to hybrid or roadmap (watermark-free!)
  const [activeLayer, setActiveLayer] = useState<AdminMapLayerMode>(() => {
    if (defaultLayer) return defaultLayer;
    const saved = localStorage.getItem('admin_preferred_map_layer');
    if (saved && (saved in LAYER_CONFIGS)) {
      return saved as AdminMapLayerMode;
    }
    // Default to hybrid satellite which has high-res imagery + roads, or roadmap
    return 'roadmap';
  });

  const [showBranches, setShowBranches] = useState<boolean>(true);
  const [showPresetsMenu, setShowPresetsMenu] = useState<boolean>(false);

  // Helper to switch tile layer cleanly
  const switchTileLayer = (layerKey: AdminMapLayerMode) => {
    if (!mapInstanceRef.current) return;
    const cfg = LAYER_CONFIGS[layerKey];
    if (!cfg) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newLayer = L.tileLayer(cfg.url, {
      subdomains: cfg.subdomains,
      maxZoom: cfg.maxZoom,
      attribution: cfg.attr
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
    setActiveLayer(layerKey);
    localStorage.setItem('admin_preferred_map_layer', layerKey);
  };

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      minZoom: 8,
      maxZoom: 20,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Initial tile layer (Google Roadmap or Satellite Hybrid - 100% clean, no watermarks!)
    const initialConfig = LAYER_CONFIGS[activeLayer] || LAYER_CONFIGS.roadmap;
    const tileLayer = L.tileLayer(initialConfig.url, {
      subdomains: initialConfig.subdomains,
      maxZoom: initialConfig.maxZoom,
      attribution: initialConfig.attr
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Glowing courier highway corridor
    L.polyline(DAR_MAIN_ROUTE, {
      color: '#f59e0b',
      weight: 4,
      opacity: 0.75,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Layer group for branches
    const branchesGroup = L.layerGroup().addTo(map);
    branchesLayerRef.current = branchesGroup;

    // Layer group for dynamic markers
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Render static Kookoos Branches
    renderBranches(branchesGroup);

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    // Initial invalidation after mounting
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render Kookoos branches on map
  const renderBranches = (group: L.LayerGroup) => {
    group.clearLayers();
    KOOKOOS_BRANCH_PINS.forEach(branch => {
      const branchIcon = L.divIcon({
        className: 'kookoos-branch-pin',
        html: `
          <div style="
            display:flex;
            flex-direction:column;
            align-items:center;
            cursor:pointer;
            filter:drop-shadow(0 4px 10px rgba(245,158,11,0.6));
          ">
            <div style="
              width:34px;
              height:34px;
              border-radius:12px;
              background:linear-gradient(135deg, #f59e0b, #d97706);
              border:2.5px solid #ffffff;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:18px;
              color:#fff;
              box-shadow:0 4px 12px rgba(0,0,0,0.35);
            ">
              🍗
            </div>
            <div style="
              margin-top:2px;
              padding:2px 7px;
              border-radius:6px;
              background:rgba(17,24,39,0.92);
              border:1px solid rgba(245,158,11,0.4);
              color:#fde68a;
              font-size:10px;
              font-weight:800;
              white-space:nowrap;
              font-family:system-ui, sans-serif;
            ">
              ${branch.name.replace('Kookoos ', '')}
            </div>
          </div>
        `,
        iconSize: [80, 52],
        iconAnchor: [40, 26]
      });

      const marker = L.marker(branch.coords, { icon: branchIcon });
      marker.bindPopup(`
        <div style="font-family:system-ui, sans-serif; padding:4px; font-size:12px;">
          <strong style="color:#d97706; font-size:13px;">${branch.name}</strong>
          <div style="margin-top:2px; color:#4b5563;">${branch.tag}</div>
          <div style="margin-top:4px; font-family:monospace; font-weight:bold; color:#111827;">${branch.phone}</div>
          <div style="margin-top:6px; font-size:10px; color:#10b981; font-weight:bold;">● Jikoni & Sehemu ya Kupakia Wazi</div>
        </div>
      `);
      group.addLayer(marker);
    });
  };

  // Toggle branches visibility
  useEffect(() => {
    if (!branchesLayerRef.current || !mapInstanceRef.current) return;
    if (showBranches) {
      if (!mapInstanceRef.current.hasLayer(branchesLayerRef.current)) {
        mapInstanceRef.current.addLayer(branchesLayerRef.current);
      }
    } else {
      if (mapInstanceRef.current.hasLayer(branchesLayerRef.current)) {
        mapInstanceRef.current.removeLayer(branchesLayerRef.current);
      }
    }
  }, [showBranches]);

  // Update Order Pins & Driver Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Render Order Pins
    pins.forEach(pin => {
      let badgeStyle = '';
      let icon = '';

      switch (pin.status) {
        case 'Delivered':
          badgeStyle =
            'background:#052e16; color:#4ade80; border:1.5px solid #22c55e; box-shadow:0 4px 14px rgba(34,197,94,0.45);';
          icon = '🏢';
          break;
        case 'On the Way':
          badgeStyle =
            'background:#172554; color:#60a5fa; border:1.5px solid #3b82f6; box-shadow:0 4px 14px rgba(59,130,246,0.45);';
          icon = '📦';
          break;
        case 'Preparing':
          badgeStyle =
            'background:#451a03; color:#fde047; border:1.5px solid #eab308; box-shadow:0 4px 14px rgba(234,179,8,0.45);';
          icon = '🍳';
          break;
        case 'Delayed':
          badgeStyle =
            'background:#431407; color:#fb923c; border:1.5px solid #f97316; box-shadow:0 4px 14px rgba(249,115,22,0.45);';
          icon = '⌛';
          break;
        case 'Canceled':
          badgeStyle =
            'background:#450a0a; color:#f87171; border:1.5px solid #ef4444; box-shadow:0 4px 14px rgba(239,68,68,0.45);';
          icon = '✖';
          break;
      }

      const isSelected = selectedPin?.id === pin.id;

      const customIcon = L.divIcon({
        className: 'admin-order-map-pill',
        html: `
          <div style="
            display:inline-flex;
            align-items:center;
            gap:6px;
            padding:5px 12px;
            border-radius:9999px;
            font-family:system-ui, -apple-system, sans-serif;
            font-size:11px;
            font-weight:700;
            white-space:nowrap;
            cursor:pointer;
            transform:${isSelected ? 'scale(1.18)' : 'scale(1)'};
            transition:all 0.15s ease-in-out;
            ${badgeStyle}
          ">
            <span style="font-size:12px; line-height:1;">${icon}</span>
            <span>${pin.status}</span>
          </div>
        `,
        iconSize: [110, 32],
        iconAnchor: [55, 16]
      });

      const marker = L.marker(pin.coordinates, { icon: customIcon });

      if (onSelectPin) {
        marker.on('click', () => {
          onSelectPin(pin);
          mapInstanceRef.current?.panTo(pin.coordinates, { animate: true, duration: 0.5 });
        });
      }

      markersLayerRef.current?.addLayer(marker);
    });

    // 2. Render Fleet Drivers (Boda-boda riders)
    drivers.forEach(driver => {
      const isSelected = selectedDriver?.id === driver.id;
      const isBusy = driver.status === 'busy';
      const isOffline = driver.status === 'offline';

      const driverIcon = L.divIcon({
        className: 'admin-driver-map-marker',
        html: `
          <div style="
            position:relative;
            display:flex;
            flex-direction:column;
            align-items:center;
            cursor:pointer;
            transform:${isSelected ? 'scale(1.2)' : 'scale(1)'};
            transition:all 0.15s ease;
          ">
            ${
              isBusy
                ? `<div style="
                    position:absolute;
                    top:-22px;
                    padding:2px 6px;
                    border-radius:9999px;
                    background:rgba(15,23,42,0.95);
                    border:1px solid #10b981;
                    color:#34d399;
                    font-size:9px;
                    font-weight:800;
                    white-space:nowrap;
                    box-shadow:0 2px 6px rgba(0,0,0,0.4);
                  ">${driver.currentSpeed} km/h</div>`
                : ''
            }
            <div style="
              width:34px;
              height:34px;
              border-radius:9999px;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:16px;
              box-shadow:0 4px 14px rgba(0,0,0,0.5);
              border:2.5px solid ${isBusy ? '#10b981' : isOffline ? '#6b7280' : '#3b82f6'};
              background:${isBusy ? '#064e3b' : isOffline ? '#1f2937' : '#1e3a8a'};
            ">
              🛵
            </div>
            <div style="
              margin-top:2px;
              padding:1px 6px;
              border-radius:6px;
              background:rgba(0,0,0,0.85);
              color:#fff;
              font-size:9px;
              font-weight:700;
              white-space:nowrap;
            ">
              ${driver.name.split(' ')[0]}
            </div>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 34]
      });

      const marker = L.marker(driver.coordinates, { icon: driverIcon });

      if (onSelectDriver) {
        marker.on('click', () => {
          onSelectDriver(driver);
          mapInstanceRef.current?.panTo(driver.coordinates, { animate: true, duration: 0.5 });
        });
      }

      markersLayerRef.current?.addLayer(marker);
    });
  }, [pins, selectedPin, onSelectPin, drivers, selectedDriver, onSelectDriver]);

  return (
    <div className={`relative ${className} select-none`}>
      {/* Real Interactive Leaflet Viewport */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

      {/* Top Map Layer Selector Bar (Google Roadmap, Satellite, Hybrid, Terrain, OSM) */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 shadow-2xl pointer-events-auto max-w-[calc(100%-100px)]">
        {(Object.keys(LAYER_CONFIGS) as AdminMapLayerMode[]).map(layerKey => {
          const cfg = LAYER_CONFIGS[layerKey];
          const isCurrent = activeLayer === layerKey;
          return (
            <button
              key={layerKey}
              type="button"
              onClick={() => switchTileLayer(layerKey)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/30 scale-105'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
              title={`Badili kwenda ${cfg.name}`}
            >
              <span>{cfg.icon}</span>
              <span className="hidden sm:inline">{cfg.name.split(' ')[0]}</span>
            </button>
          );
        })}

        {/* Toggle Kookoos Branches */}
        <button
          type="button"
          onClick={() => setShowBranches(prev => !prev)}
          className={`flex items-center space-x-1 px-2 py-1 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer ${
            showBranches
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
          }`}
          title="Onyesha / Ficha Matawi ya Kookoos"
        >
          <span>🍗 8 Matawi</span>
        </button>
      </div>

      {/* Quick Location Preset Jump Bar */}
      <div className="absolute top-3 right-3 z-20 pointer-events-auto">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPresetsMenu(prev => !prev)}
            className="px-2.5 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700/80 shadow-lg text-[11px] font-bold flex items-center space-x-1.5 backdrop-blur-md cursor-pointer"
            title="Maeneo Muhimu ya Dar es Salaam"
          >
            <span>📍</span>
            <span className="hidden sm:inline">Maeneo</span>
            <span className="text-[9px]">▾</span>
          </button>

          {showPresetsMenu && (
            <div className="absolute right-0 mt-1.5 w-52 rounded-2xl bg-neutral-900/95 backdrop-blur-md border border-neutral-700 shadow-2xl py-1.5 z-30 space-y-0.5">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                Maeneo ya Dar & Pwani
              </div>
              {FOCUS_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    mapInstanceRef.current?.setView(p.coords, p.zoom, { animate: true });
                    setShowPresetsMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:text-amber-400 hover:bg-neutral-800/80 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{p.label}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">z{p.zoom}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recenter & Zoom Controls */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col space-y-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setView(center, zoom, { animate: true });
            }
          }}
          className="p-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700/80 shadow-lg text-xs font-bold flex items-center space-x-1 backdrop-blur-md transition-all cursor-pointer"
          title="Rejea Dar es Salaam ya Kati"
        >
          <span>🎯 Dar Kati</span>
        </button>

        <div className="flex bg-neutral-900/90 border border-neutral-700/80 rounded-xl overflow-hidden shadow-lg backdrop-blur-md">
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="px-2.5 py-1 text-white hover:bg-neutral-800 text-sm font-bold border-r border-neutral-700/80 cursor-pointer"
            title="Sogeza Karibu (Zoom In)"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="px-2.5 py-1 text-white hover:bg-neutral-800 text-sm font-bold cursor-pointer"
            title="Punguza (Zoom Out)"
          >
            −
          </button>
        </div>
      </div>

      {/* Current Active Layer Badge (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
        <div className="px-2.5 py-1 rounded-xl bg-neutral-950/80 border border-neutral-800/80 backdrop-blur-sm text-[10px] font-semibold text-neutral-300 flex items-center space-x-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Ramani: <strong className="text-white">{LAYER_CONFIGS[activeLayer].name}</strong></span>
          <span className="text-neutral-500">• 100% Live Dar es Salaam</span>
        </div>
      </div>
    </div>
  );
};
