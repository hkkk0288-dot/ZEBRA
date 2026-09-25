import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  Compass,
  Layers,
  MapPin,
  Navigation,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  LocateFixed,
  Maximize2,
  Minimize2,
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';

export type MapPreset =
  | 'tanganyika_east_africa'
  | 'mikocheni_street'
  | 'morogoro_corridor'
  | 'tanzania_national'
  | 'world'
  | 'user_location';

export type TileLayerType = 'google_terrain' | 'google_roadmap' | 'google_hybrid' | 'google_satellite' | 'carto_voyager';

interface MapPresetConfig {
  key: MapPreset;
  label: string;
  shortLabel: string;
  icon: string;
  badge: string;
  center: [number, number];
  zoom: number;
  description: string;
}

export const MAP_PRESETS: MapPresetConfig[] = [
  {
    key: 'tanganyika_east_africa',
    label: 'Ziwa Tanganyika & Afrika Mashariki',
    shortLabel: 'Tanganyika',
    icon: '🌊',
    badge: 'Ziwa Tanganyika (Google Terrain)',
    center: [-4.6000, 29.8000], // Centered directly on Lake Tanganyika, Burundi, Rwanda, DRC & Tanzania
    zoom: 7,
    description: 'Ziwa Tanganyika, Bujumbura (Burundi), Rwanda, DRC Kongo (Kalemie), Ziwa Victoria, Mwanza, Katavi & Dodoma'
  },
  {
    key: 'mikocheni_street',
    label: 'Mikocheni & Msasani Mitaani',
    shortLabel: 'Mikocheni',
    icon: '🏙️',
    badge: 'Mitaani (Street Level)',
    center: [-6.7725, 39.2485], // Mikocheni A / Shoppers Plaza / Mwai Kibaki Rd
    zoom: 16,
    description: 'Mwai Kibaki Road, Shoppers Plaza Mikocheni, Chwaku St, Kairuki, Shule St'
  },
  {
    key: 'morogoro_corridor',
    label: 'Dar - Morogoro Highway',
    shortLabel: 'Morogoro',
    icon: '🛣️',
    badge: 'Ukanda (T1/T2/T3 Highway)',
    center: [-6.6500, 38.3500], // Dar to Morogoro corridor
    zoom: 9,
    description: 'Njia kuu za T1, T2 & T3: Dar es Salaam, Kibaha, Chalinze, Morogoro, Kilosa'
  },
  {
    key: 'tanzania_national',
    label: 'Tanzania Nzima',
    shortLabel: 'Tanzania',
    icon: '🇹🇿',
    badge: 'Kitaifa (National View)',
    center: [-6.3690, 34.8888], // Tanzania Center
    zoom: 6,
    description: 'Dodoma (Mji Mkuu), Dar es Salaam, Zanzibar, Arusha, Mwanza, Kigoma, Mbeya'
  },
  {
    key: 'world',
    label: 'Ramani ya Dunia',
    shortLabel: 'Dunia',
    icon: '🌍',
    badge: 'Ulimwengu (Global)',
    center: [0.0, 25.0], // Africa / World center
    zoom: 3,
    description: 'Mabara yote ya dunia, bahari kuu na nchi zote kijiografia'
  }
];

// Live Google & Carto tile layers
const LIVE_TILE_LAYERS: Record<TileLayerType, { name: string; url: string; subdomains: string[]; maxZoom: number; attr: string }> = {
  google_terrain: {
    name: 'Google Terrain (Milima & Maumbile)',
    url: 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attr: '&copy; Google Maps'
  },
  google_roadmap: {
    name: 'Google Roadmap (Barabara & Mitaa)',
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attr: '&copy; Google Maps'
  },
  google_hybrid: {
    name: 'Google Hybrid (Setilaiti + Majina)',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attr: '&copy; Google Maps'
  },
  google_satellite: {
    name: 'Google Satellite (Angani Halisi)',
    url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attr: '&copy; Google Maps'
  },
  carto_voyager: {
    name: 'Carto Voyager (Safi)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19,
    attr: '&copy; CartoDB & OSM'
  }
};

interface KeyLocation {
  id: string;
  name: string;
  category: string;
  coords: [number, number];
  description: string;
  color: string;
  icon: string;
}

const KEY_LOCATIONS: KeyLocation[] = [
  {
    id: 'tanganyika_kigoma',
    name: 'Ziwa Tanganyika (Kigoma Port)',
    category: 'Great Lake Hub',
    coords: [-4.8769, 29.6267],
    description: 'Ziwa la pili kwa kina duniani, mpaka wa Tanzania, DRC, Burundi & Zambia',
    color: '#06b6d4',
    icon: '🌊'
  },
  {
    id: 'bujumbura',
    name: 'Bujumbura (Burundi)',
    category: 'Capital Port',
    coords: [-3.3822, 29.3644],
    description: 'Pwani ya Kaskazini mwa Ziwa Tanganyika, Burundi',
    color: '#10b981',
    icon: '🇧🇮'
  },
  {
    id: 'kalemie',
    name: 'Kalemie (DRC Kongo)',
    category: 'Lake Port',
    coords: [-5.9475, 29.1947],
    description: 'Bandari kuu ya DRC kwenye Ziwa Tanganyika',
    color: '#3b82f6',
    icon: '🇨🇩'
  },
  {
    id: 'mwanza_rock',
    name: 'Mwanza (Ziwa Victoria)',
    category: 'Lake Victoria Hub',
    coords: [-2.5164, 32.9175],
    description: 'Pwani ya Ziwa Victoria, kitovu cha kibiashara cha Kanda ya Ziwa',
    color: '#3b82f6',
    icon: '🐟'
  },
  {
    id: 'shoppers_plaza',
    name: 'Shoppers Plaza Mikocheni',
    category: 'Shopping & Dining',
    coords: [-6.7725, 39.2485],
    description: 'Mwai Kibaki Road - Kituo kikuu cha ununuzi na chakula Mikocheni',
    color: '#10b981',
    icon: '🏬'
  },
  {
    id: 'masaki_kitchen',
    name: 'Zebra Restaurant (Masaki Central)',
    category: 'Zebra Kitchen HQ',
    coords: [-6.7680, 39.2780],
    description: 'Plot 44, Toure Drive, Masaki Peninsula',
    color: '#f59e0b',
    icon: '🍕'
  },
  {
    id: 'kariakoo_hub',
    name: 'Zebra Express (Kariakoo)',
    category: 'Zebra Kitchen',
    coords: [-6.8195, 39.2730],
    description: 'China Plaza & Uhuru St, Kariakoo',
    color: '#ef4444',
    icon: '🥩'
  },
  {
    id: 'morogoro_town',
    name: 'Morogoro Town (Milima ya Uluguru)',
    category: 'Regional Hub',
    coords: [-6.8278, 37.6591],
    description: 'Kituo kikuu cha ukanda wa kati, njia ya Iringa & Dodoma',
    color: '#10b981',
    icon: '🏔️'
  },
  {
    id: 'dodoma_capital',
    name: 'Dodoma (Mji Mkuu wa Tanzania)',
    category: 'Capital City',
    coords: [-6.1630, 35.7516],
    description: 'Makao Makuu ya Serikali ya Jamhuri ya Muungano wa Tanzania',
    color: '#eab308',
    icon: '⭐'
  }
];

interface InteractiveLiveMapProps {
  initialPreset?: MapPreset;
  className?: string;
  isDark?: boolean;
  onSelectLocation?: (location: KeyLocation) => void;
}

export const InteractiveLiveMap: React.FC<InteractiveLiveMapProps> = ({
  initialPreset = 'tanganyika_east_africa',
  className = 'h-[480px] sm:h-[560px]',
  isDark = true,
  onSelectLocation
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);

  const [activePreset, setActivePreset] = useState<MapPreset>(initialPreset);
  const [activeTileType, setActiveTileType] = useState<TileLayerType>('google_terrain');
  const [currentZoom, setCurrentZoom] = useState<number>(7);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);
  const [userAddressNotice, setUserAddressNotice] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<KeyLocation | null>(null);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);

  // Initialize Map with 100% live Google Terrain tiles
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const preset = MAP_PRESETS.find(p => p.key === initialPreset) || MAP_PRESETS[0];

    try {
      const map = L.map(containerRef.current, {
        center: preset.center,
        zoom: preset.zoom,
        minZoom: 2,
        maxZoom: 19,
        zoomControl: false,
        attributionControl: false
      });

      const tileConf = LIVE_TILE_LAYERS[activeTileType] || LIVE_TILE_LAYERS.google_terrain;
      const tileLayer = L.tileLayer(tileConf.url, {
        subdomains: tileConf.subdomains,
        maxZoom: tileConf.maxZoom,
        attribution: tileConf.attr
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      markersGroupRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      // Crucial: Invalidate size across multiple cycles so tiles render immediately
      const timers = [
        setTimeout(() => map.invalidateSize(), 50),
        setTimeout(() => map.invalidateSize(), 150),
        setTimeout(() => map.invalidateSize(), 300),
        setTimeout(() => map.invalidateSize(), 600),
        setTimeout(() => map.invalidateSize(), 1200)
      ];

      return () => {
        timers.forEach(t => clearTimeout(t));
        map.remove();
        mapRef.current = null;
      };
    } catch (err) {
      console.warn('Leaflet live map notice:', err);
    }
  }, []);

  // Update tile layer dynamically
  useEffect(() => {
    if (!mapRef.current) return;

    try {
      const tileConf = LIVE_TILE_LAYERS[activeTileType] || LIVE_TILE_LAYERS.google_terrain;
      if (tileLayerRef.current) {
        mapRef.current.removeLayer(tileLayerRef.current);
      }

      const newTileLayer = L.tileLayer(tileConf.url, {
        subdomains: tileConf.subdomains,
        maxZoom: tileConf.maxZoom,
        attribution: tileConf.attr
      }).addTo(mapRef.current);

      tileLayerRef.current = newTileLayer;
      mapRef.current.invalidateSize();
    } catch (e) {
      console.warn('Tile update error:', e);
    }
  }, [activeTileType]);

  // Render Markers
  const renderMarkers = useCallback(() => {
    if (!mapRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    KEY_LOCATIONS.forEach(loc => {
      const isSelected = selectedLocation?.id === loc.id;

      const html = `
        <div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        ">
          <div style="
            background: ${loc.color};
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 9999px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.6);
            border: 2px solid #ffffff;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
            transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
            transition: transform 0.2s ease;
          ">
            <span>${loc.icon}</span>
            <span>${loc.name.split(' (')[0]}</span>
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 7px solid ${loc.color};
          "></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-live-marker',
        html,
        iconSize: [140, 36],
        iconAnchor: [70, 36]
      });

      const marker = L.marker(loc.coords, { icon: customIcon });

      marker.on('click', () => {
        setSelectedLocation(loc);
        if (onSelectLocation) onSelectLocation(loc);
        if (mapRef.current) {
          mapRef.current.flyTo(loc.coords, Math.max(mapRef.current.getZoom(), 14), {
            duration: 1.2
          });
        }
      });

      marker.addTo(markersGroupRef.current!);
    });
  }, [selectedLocation, onSelectLocation]);

  useEffect(() => {
    renderMarkers();
  }, [renderMarkers]);

  // Handle Preset Change
  const handleSelectPreset = (presetKey: MapPreset) => {
    setActivePreset(presetKey);
    const preset = MAP_PRESETS.find(p => p.key === presetKey);
    if (!preset || !mapRef.current) return;

    mapRef.current.invalidateSize();
    mapRef.current.flyTo(preset.center, preset.zoom, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  };

  // Live GPS geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Kifaa chako hakiruhusu huduma ya GPS / Geolocation.');
      return;
    }

    setIsLocatingUser(true);
    setUserAddressNotice('Inatafuta eneo lako la sasa kwa GPS...');

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;
        const coords: [number, number] = [latitude, longitude];

        setIsLocatingUser(false);
        setActivePreset('user_location');
        setUserAddressNotice(
          `Eneo lako: Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)} (Usahihi ±${Math.round(accuracy)}m)`
        );

        if (!mapRef.current) return;

        mapRef.current.invalidateSize();
        mapRef.current.flyTo(coords, 16, { duration: 1.5 });

        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng(coords);
        } else {
          const userIconHtml = `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <span style="
                position: absolute;
                width: 34px;
                height: 34px;
                border-radius: 9999px;
                background-color: #3b82f6;
                opacity: 0.4;
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></span>
              <div style="
                width: 18px;
                height: 18px;
                border-radius: 9999px;
                background-color: #2563eb;
                border: 3px solid #ffffff;
                box-shadow: 0 0 12px rgba(37,99,235,0.9);
                z-index: 10;
              "></div>
            </div>
          `;
          const userIcon = L.divIcon({
            className: 'live-user-marker',
            html: userIconHtml,
            iconSize: [34, 34],
            iconAnchor: [17, 17]
          });

          userMarkerRef.current = L.marker(coords, { icon: userIcon })
            .bindPopup('<b>Upo Hapa Sasa (You are here)</b><br>Eneo lako halisi la kijiografia.')
            .addTo(mapRef.current);
        }

        if (userCircleRef.current) {
          userCircleRef.current.setLatLng(coords);
          userCircleRef.current.setRadius(accuracy);
        } else {
          userCircleRef.current = L.circle(coords, {
            radius: accuracy,
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
            weight: 1.5
          }).addTo(mapRef.current);
        }
      },
      error => {
        setIsLocatingUser(false);
        setUserAddressNotice('Tafadhali ruhusu GPS kwenye simu au kompyuta yako ili kuonyesha eneo lako.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Search Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapRef.current) return;

    const query = searchQuery.toLowerCase().trim();

    if (query.includes('tanganyika') || query.includes('kigoma') || query.includes('burundi') || query.includes('rwanda') || query.includes('congo') || query.includes('kalemie')) {
      handleSelectPreset('tanganyika_east_africa');
      return;
    }
    if (query.includes('mikocheni') || query.includes('shoppers') || query.includes('chwaku') || query.includes('kibaki')) {
      handleSelectPreset('mikocheni_street');
      return;
    }
    if (query.includes('morogoro') || query.includes('chalinze') || query.includes('kibaha') || query.includes('kilosa')) {
      handleSelectPreset('morogoro_corridor');
      return;
    }
    if (query.includes('tanzania') || query.includes('dodoma') || query.includes('zanzibar') || query.includes('arusha') || query.includes('mwanza')) {
      handleSelectPreset('tanzania_national');
      return;
    }
    if (query.includes('dunia') || query.includes('world') || query.includes('afrika') || query.includes('africa')) {
      handleSelectPreset('world');
      return;
    }

    const matched = KEY_LOCATIONS.find(
      l =>
        l.name.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query)
    );

    if (matched) {
      setSelectedLocation(matched);
      mapRef.current.flyTo(matched.coords, 16, { duration: 1.5 });
    }
  };

  const currentPresetInfo = MAP_PRESETS.find(p => p.key === activePreset) || MAP_PRESETS[0];

  return (
    <div className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-800 bg-[#0d1219] shadow-2xl flex flex-col ${className}`}>
      {/* Top Bar: Presets & Controls */}
      <div className="p-2 sm:p-3 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 z-20 shrink-0">
        {/* Preset Selector Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {MAP_PRESETS.map(preset => {
            const isSelected = activePreset === preset.key;
            return (
              <button
                key={preset.key}
                type="button"
                onClick={() => handleSelectPreset(preset.key)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-semibold text-xs transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-1 ring-emerald-400 font-bold'
                    : 'bg-neutral-900/90 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <span className="text-sm">{preset.icon}</span>
                <span className="hidden md:inline">{preset.label}</span>
                <span className="md:hidden">{preset.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Live GPS & Layer Switcher */}
        <div className="flex items-center space-x-1.5 shrink-0 justify-end">
          {/* Real-time GPS Location Button */}
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocatingUser}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer ${
              activePreset === 'user_location'
                ? 'bg-blue-600 text-white ring-2 ring-blue-400 animate-pulse'
                : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/40 hover:text-white'
            }`}
            title="Pata Eneo Langu Sasa (Live GPS Location)"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${isLocatingUser ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLocatingUser ? 'Inatafuta GPS...' : 'Eneo Langu Sasa'}</span>
            <span className="sm:hidden">GPS</span>
          </button>

          {/* Layer Style Menu Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
              title="Badili Aina ya Ramani (Terrain / Roadmap / Satellite)"
            >
              <Layers className="w-4 h-4" />
            </button>

            {showLayerMenu && (
              <div className="absolute right-0 top-11 w-64 bg-neutral-900/98 backdrop-blur-xl border border-neutral-700/80 rounded-2xl p-1.5 shadow-2xl z-50 space-y-1">
                <div className="text-[10px] font-bold text-neutral-400 px-2 py-1 uppercase tracking-wider">
                  Mtindo wa Ramani (Live Google Tiles)
                </div>
                {(Object.keys(LIVE_TILE_LAYERS) as TileLayerType[]).map(key => {
                  const style = LIVE_TILE_LAYERS[key];
                  const isCur = activeTileType === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setActiveTileType(key);
                        setShowLayerMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isCur
                          ? 'bg-emerald-500 text-white font-bold'
                          : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <span>{style.name}</span>
                      {isCur && <span className="text-[10px]">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 py-1.5 bg-neutral-950/80 border-b border-neutral-800/60 flex items-center justify-between gap-2 z-10 shrink-0">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tafuta: Ziwa Tanganyika, Bujumbura, Mikocheni, Morogoro, Mwanza..."
            className="w-full pl-8 pr-3 py-1 text-xs rounded-xl bg-neutral-900 text-white border border-neutral-800 focus:border-emerald-500 outline-none placeholder-neutral-500"
          />
        </form>

        <div className="text-[11px] text-neutral-400 hidden sm:flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{currentPresetInfo.badge}</span>
        </div>
      </div>

      {/* 100% REAL LIVE LEAFLET CANVAS - NO STATIC PICTURES! */}
      <div
        className="relative w-full flex-1"
        style={{ minHeight: '380px', height: '100%', position: 'relative' }}
      >
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full z-0"
          style={{ width: '100%', height: '100%', minHeight: '380px' }}
        />

        {/* Floating Zoom & Controls */}
        <div className="absolute top-3 right-3 flex flex-col space-y-1.5 bg-neutral-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-neutral-700/60 shadow-xl z-20">
          <button
            type="button"
            onClick={() => mapRef.current?.zoomIn()}
            className="p-2 rounded-xl hover:bg-neutral-800 text-white transition-colors cursor-pointer"
            title="Kuza (Zoom In)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="text-[10px] font-mono font-bold text-center text-neutral-400 select-none">
            {currentZoom}z
          </div>
          <button
            type="button"
            onClick={() => mapRef.current?.zoomOut()}
            className="p-2 rounded-xl hover:bg-neutral-800 text-white transition-colors cursor-pointer"
            title="Punguza (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleSelectPreset(activePreset)}
            className="p-2 rounded-xl hover:bg-neutral-800 text-amber-400 transition-colors cursor-pointer"
            title="Rudisha Mtazamo wa Asili"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Floating Live Info Pill */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto max-w-lg bg-neutral-950/95 backdrop-blur-md p-2.5 rounded-2xl border border-neutral-700/70 shadow-2xl z-20 flex items-start space-x-2.5 pointer-events-auto">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Compass className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <p className="font-bold text-xs text-white truncate">
                {selectedLocation ? selectedLocation.name : currentPresetInfo.label}
              </p>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded-full">
                LIVE INTERACTIVE MAP
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
              {userAddressNotice || (selectedLocation ? selectedLocation.description : currentPresetInfo.description)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Location Shortcuts below map */}
      <div className="p-2 sm:p-2.5 bg-neutral-950/95 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 z-10 text-xs shrink-0">
        <button
          type="button"
          onClick={() => handleSelectPreset('tanganyika_east_africa')}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 hover:border-cyan-500/40 text-left transition-all cursor-pointer"
        >
          <span className="text-cyan-400 font-bold block text-[11px]">🌊 Ziwa Tanganyika</span>
          <span className="text-neutral-400 text-[10px] truncate block">Burundi, Kongo & Kigoma</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectPreset('mikocheni_street')}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 hover:border-emerald-500/40 text-left transition-all cursor-pointer"
        >
          <span className="text-emerald-400 font-bold block text-[11px]">🏬 Shoppers Plaza</span>
          <span className="text-neutral-400 text-[10px] truncate block">Mikocheni / Mwai Kibaki</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectPreset('morogoro_corridor')}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 hover:border-blue-500/40 text-left transition-all cursor-pointer"
        >
          <span className="text-blue-400 font-bold block text-[11px]">🏔️ Dar - Morogoro</span>
          <span className="text-neutral-400 text-[10px] truncate block">Njia kuu ya T1 & T2</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectPreset('tanzania_national')}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 hover:border-amber-500/40 text-left transition-all cursor-pointer"
        >
          <span className="text-amber-400 font-bold block text-[11px]">🇹🇿 Tanzania Nzima</span>
          <span className="text-neutral-400 text-[10px] truncate block">Dodoma, Mwanza, Arusha</span>
        </button>
      </div>
    </div>
  );
};
