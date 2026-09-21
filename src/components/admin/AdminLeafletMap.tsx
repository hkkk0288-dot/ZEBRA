import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapOrderPin, AdminDriver } from './adminMockData';

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
}

// Major delivery artery corridor in Dar es Salaam
const DAR_MAIN_ROUTE: [number, number][] = [
  [-6.8195, 39.2730], // Kariakoo Hub
  [-6.8140, 39.2760],
  [-6.8080, 39.2820], // Upanga East
  [-6.7990, 39.2790],
  [-6.7900, 39.2850], // Oysterbay
  [-6.7760, 39.2780], // Masaki Peninsula
  [-6.7620, 39.2730]  // Slipway Pier
];

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
  center = [-6.7920, 39.2740]
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // CartoDB tiles: dark_all for dark mode, voyager for light mode
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Glowing courier highway corridor
    L.polyline(DAR_MAIN_ROUTE, {
      color: isDark ? '#3b82f6' : '#2563eb',
      weight: 4,
      opacity: 0.6,
      dashArray: '6, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Layer group for dynamic markers
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer if theme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const newTileLayer = L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTileLayer;
  }, [isDark]);

  // Update Order Pins & Driver Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Render Order Pins (Matching user's screenshot)
    pins.forEach(pin => {
      let badgeStyle = '';
      let icon = '';

      switch (pin.status) {
        case 'Delivered':
          badgeStyle =
            'background:#052e16; color:#4ade80; border:1.5px solid #22c55e; box-shadow:0 4px 14px rgba(34,197,94,0.35);';
          icon = '🏢';
          break;
        case 'On the Way':
          badgeStyle =
            'background:#172554; color:#60a5fa; border:1.5px solid #3b82f6; box-shadow:0 4px 14px rgba(59,130,246,0.35);';
          icon = '📦';
          break;
        case 'Preparing':
          badgeStyle =
            'background:#451a03; color:#fde047; border:1.5px solid #eab308; box-shadow:0 4px 14px rgba(234,179,8,0.35);';
          icon = '🍳';
          break;
        case 'Delayed':
          badgeStyle =
            'background:#431407; color:#fb923c; border:1.5px solid #f97316; box-shadow:0 4px 14px rgba(249,115,22,0.35);';
          icon = '⌛';
          break;
        case 'Canceled':
          badgeStyle =
            'background:#450a0a; color:#f87171; border:1.5px solid #ef4444; box-shadow:0 4px 14px rgba(239,68,68,0.35);';
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
              background:rgba(0,0,0,0.8);
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
    <div className={`relative ${className}`}>
      {/* Real Interactive Leaflet Viewport */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

      {/* Recenter & Zoom Controls */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col space-y-1.5 pointer-events-auto">
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setView(center, zoom, { animate: true });
            }
          }}
          className="p-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700/80 shadow-lg text-xs font-bold flex items-center space-x-1 backdrop-blur-xs transition-all"
          title="Recenter Dar es Salaam"
        >
          <span>🎯 Recenter</span>
        </button>
        <div className="flex bg-neutral-900/90 border border-neutral-700/80 rounded-xl overflow-hidden shadow-lg backdrop-blur-xs">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="px-2.5 py-1 text-white hover:bg-neutral-800 text-sm font-bold border-r border-neutral-700/80"
          >
            +
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="px-2.5 py-1 text-white hover:bg-neutral-800 text-sm font-bold"
          >
            −
          </button>
        </div>
      </div>
    </div>
  );
};
