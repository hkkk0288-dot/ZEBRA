import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  MapPin,
  X,
  LocateFixed,
  Search,
  Check,
  Navigation,
  Compass,
  Building,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export interface LocationPickerResult {
  address: string;
  areaName: string;
  coords: [number, number]; // [lat, lng]
}

interface MapLocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (result: LocationPickerResult) => void;
  initialAddress?: string;
  initialCoords?: [number, number];
  isDark?: boolean;
}

// Popular delivery areas in Dar es Salaam with predefined coordinates
const POPULAR_DAR_AREAS = [
  { name: 'Masaki Peninsula', lat: -6.7580, lng: 39.2780, landmark: 'Toure Drive / Slipway / Sea Cliff' },
  { name: 'Oysterbay', lat: -6.7780, lng: 39.2750, landmark: 'Haile Selassie / Coco Beach' },
  { name: 'Mikocheni A', lat: -6.7690, lng: 39.2480, landmark: 'Mwai Kibaki Rd / Shoppers Plaza' },
  { name: 'Mikocheni B', lat: -6.7620, lng: 39.2390, landmark: 'Rose Garden / Regent Estate' },
  { name: 'Upanga East', lat: -6.8080, lng: 39.2830, landmark: 'UN Road / Muhimbili / Sea View' },
  { name: 'Kariakoo Hub', lat: -6.8195, lng: 39.2730, landmark: 'Uhuru Street / Msimbazi / China Plaza' },
  { name: 'Posta / City Centre', lat: -6.8150, lng: 39.2890, landmark: 'Samora Avenue / Kivukoni Ferry' },
  { name: 'Kinondoni', lat: -6.7910, lng: 39.2600, landmark: 'Manyanya / Biafra' },
  { name: 'Sinza', lat: -6.7820, lng: 39.2210, landmark: 'Mori / Kumekucha / Afrika Sana' },
  { name: 'Mwenge', lat: -6.7700, lng: 39.2150, landmark: 'Mlimani City / Bagamoyo Road' },
  { name: 'Mbezi Beach', lat: -6.7050, lng: 39.2280, landmark: 'Africana / Rainbow / Kawe Link' },
  { name: 'Kawe', lat: -6.7350, lng: 39.2350, landmark: 'Kawe Roundabout / Old Bagamoyo Rd' }
];

export const MapLocationPickerModal: React.FC<MapLocationPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  initialAddress = '',
  initialCoords = [-6.7725, 39.2725], // Default: Masaki / Oysterbay area, Dar es Salaam
  isDark = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);

  const [currentCoords, setCurrentCoords] = useState<[number, number]>(initialCoords);
  const [selectedAddress, setSelectedAddress] = useState<string>(
    initialAddress || 'Plot 44, Toure Drive, Masaki Peninsula, Dar es Salaam'
  );
  const [selectedArea, setSelectedArea] = useState<string>('Masaki Peninsula');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isResolvingAddress, setIsResolvingAddress] = useState<boolean>(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  // Helper to find nearest known Dar area or reverse geocode
  const resolveLocationName = useCallback(async (lat: number, lng: number) => {
    setIsResolvingAddress(true);
    let bestArea = 'Dar es Salaam';
    let minDistance = Infinity;

    // Find closest Dar es Salaam zone
    for (const area of POPULAR_DAR_AREAS) {
      const dist = Math.hypot(area.lat - lat, area.lng - lng);
      if (dist < minDistance) {
        minDistance = dist;
        bestArea = area.name;
      }
    }

    setSelectedArea(bestArea);

    // Try online reverse geocode with Nominatim (free, open source OSM)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: { 'Accept-Language': 'sw,en' },
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const road = data.address?.road || data.address?.suburb || data.address?.neighbourhood || bestArea;
        const city = data.address?.city || 'Dar es Salaam';
        const formatted = `${road}, ${bestArea}, ${city}`;
        setSelectedAddress(formatted);
        setIsResolvingAddress(false);
        return;
      }
    } catch {
      // Fallback to closest zone & coordinates
    }

    // Fallback format
    const nearest = POPULAR_DAR_AREAS.find(a => a.name === bestArea);
    const landmarkText = nearest ? ` (karibu na ${nearest.landmark})` : '';
    setSelectedAddress(`${bestArea}${landmarkText}, Dar es Salaam`);
    setIsResolvingAddress(false);
  }, []);

  // Update pin position on map
  const updatePinPosition = useCallback((lat: number, lng: number, shouldPan = true) => {
    setCurrentCoords([lat, lng]);

    if (pinMarkerRef.current) {
      pinMarkerRef.current.setLatLng([lat, lng]);
    }

    if (shouldPan && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([lat, lng], { animate: true });
    }

    resolveLocationName(lat, lng);
  }, [resolveLocationName]);

  // Handle GPS location click
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice('Kifaa chako hakiruhusu GPS ya moja kwa moja.');
      setTimeout(() => setLocationNotice(null), 3000);
      return;
    }

    setIsLocating(true);
    setLocationNotice('Inatafuta GPS ya kifaa chako...');

    navigator.geolocation.getCurrentPosition(
      position => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        updatePinPosition(latitude, longitude, true);
        setLocationNotice('📍 Eneo lako la sasa limepatikana!');
        setTimeout(() => setLocationNotice(null), 3000);
      },
      error => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        setLocationNotice('Haikuweza kupata GPS. Tafadhali bofya kwenye ramani moja kwa moja.');
        setTimeout(() => setLocationNotice(null), 4000);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  // Select predefined area
  const handleSelectArea = (area: typeof POPULAR_DAR_AREAS[0]) => {
    updatePinPosition(area.lat, area.lng, true);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([area.lat, area.lng], 16, { animate: true });
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Small delay to ensure modal DOM is mounted and sized
    const timer = setTimeout(() => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: currentCoords,
        zoom: 14,
        minZoom: 4,
        maxZoom: 19,
        zoomControl: false,
        attributionControl: false
      });

      // Free OpenStreetMap / Carto tiles (NO Google API Key or billing needed!)
      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

      L.tileLayer(tileUrl, {
        subdomains: isDark ? 'abcd' : 'abc',
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // Create Custom Pulsing Delivery Pin
      const customPinIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.5); border: 3px solid #ffffff; cursor: grab;">
              <span style="font-size: 22px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🛵</span>
            </div>
            <div style="width: 4px; height: 12px; background: #059669; border-radius: 2px;"></div>
            <div style="width: 14px; height: 6px; background: rgba(0,0,0,0.3); border-radius: 50%; filter: blur(2px);"></div>
          </div>
        `,
        iconSize: [44, 60],
        iconAnchor: [22, 60]
      });

      const marker = L.marker(currentCoords, {
        icon: customPinIcon,
        draggable: true
      }).addTo(map);

      // When dragging the pin
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        updatePinPosition(pos.lat, pos.lng, false);
      });

      // When clicking anywhere on the map
      map.on('click', (e: L.LeafletMouseEvent) => {
        updatePinPosition(e.latlng.lat, e.latlng.lng, true);
      });

      pinMarkerRef.current = marker;
      mapInstanceRef.current = map;

      // Ensure proper sizing
      setTimeout(() => map.invalidateSize(), 100);
      setTimeout(() => map.invalidateSize(), 300);
    }, 50);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        pinMarkerRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectLocation({
      address: selectedAddress,
      areaName: selectedArea,
      coords: currentCoords
    });
    onClose();
  };

  const filteredAreas = POPULAR_DAR_AREAS.filter(
    a => !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.landmark.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] transition-all ${
          isDark
            ? 'bg-[#12141a] border-neutral-800 text-white'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-neutral-800/80 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0">
              📍
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base font-display flex items-center space-x-2">
                <span>Chagua Eneo kwenye Ramani</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 hidden xs:inline-block">
                  Dar es Salaam
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Bofya popote kwenye ramani au sogeza alama kuweka anwani ya delivery
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
            title="Funga"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & GPS Quick Actions */}
        <div className="p-3 sm:p-4 border-b border-neutral-800/60 flex flex-col sm:flex-row gap-2.5 shrink-0 bg-neutral-900/30">
          {/* Quick search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tafuta eneo: Masaki, Mikocheni, Kariakoo, Upanga..."
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none border transition-colors ${
                isDark
                  ? 'bg-neutral-900/80 border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-500'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-emerald-500'
              }`}
            />
          </div>

          {/* GPS current location button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
          >
            <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Inatafuta GPS...' : '📍 Eneo Langu (GPS)'}</span>
          </button>
        </div>

        {/* Quick popular areas chips (horizontal scroll for smooth mobile tap) */}
        <div className="px-3 sm:px-4 py-2 border-b border-neutral-800/40 flex items-center space-x-1.5 overflow-x-auto no-scrollbar shrink-0 bg-neutral-900/10">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
            Mitaa Maarufu:
          </span>
          {filteredAreas.slice(0, 8).map(area => (
            <button
              key={area.name}
              type="button"
              onClick={() => handleSelectArea(area)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                selectedArea === area.name
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                  : isDark
                  ? 'bg-neutral-800/60 text-neutral-300 border-neutral-700 hover:border-emerald-500/50'
                  : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:border-emerald-400'
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>

        {/* Location Notice Banner if any */}
        {locationNotice && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-1.5 text-xs text-emerald-400 font-medium flex items-center space-x-2">
            <span>ℹ️</span>
            <span>{locationNotice}</span>
          </div>
        )}

        {/* Leaflet Map Interactive Canvas */}
        <div className="relative flex-1 min-h-[260px] sm:min-h-[340px] w-full overflow-hidden bg-neutral-950">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Map Overlay Instruction Pill */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold flex items-center space-x-1.5 shadow-lg">
            <span>👆</span>
            <span>Gusa au sogeza alama kuweka eneo</span>
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-1">
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="w-8 h-8 rounded-lg bg-black/80 hover:bg-black text-white flex items-center justify-center font-bold text-base shadow border border-white/10"
              title="Zoom In"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="w-8 h-8 rounded-lg bg-black/80 hover:bg-black text-white flex items-center justify-center font-bold text-base shadow border border-white/10"
              title="Zoom Out"
            >
              −
            </button>
          </div>
        </div>

        {/* Footer: Selected Location Summary & Confirm Button */}
        <div className="p-3.5 sm:p-5 border-t border-neutral-800/80 bg-neutral-900/60 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Address Display */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Eneo Lililochaguliwa:
                </span>
                {isResolvingAddress && (
                  <span className="text-[10px] text-neutral-400 animate-pulse">
                    (Inathibitisha mtaa...)
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                {selectedAddress}
              </p>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                GPS: {currentCoords[0].toFixed(5)}, {currentCoords[1].toFixed(5)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-neutral-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Ghairi
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Thibitisha Eneo Hili</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
