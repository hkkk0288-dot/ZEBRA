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
import { RestaurantBranch } from '../types';

export type MapPreset =
  | 'dar_es_salaam'
  | 'mwenge_hq'
  | 'kariakoo_hub'
  | 'masaki_peninsula'
  | 'sinza_mori'
  | 'kigamboni_ferry'
  | 'mikocheni_street'
  | 'tanganyika_east_africa'
  | 'morogoro_corridor'
  | 'tanzania_national'
  | 'world'
  | 'user_location';

export type TileLayerType = 'google_roadmap' | 'google_hybrid' | 'google_satellite' | 'google_terrain' | 'osm_standard';

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
    key: 'dar_es_salaam',
    label: 'Dar es Salaam (Matawi Yote)',
    shortLabel: 'Dar Yote',
    icon: '🍗',
    badge: 'Dar es Salaam (Matawi 8)',
    center: [-6.7900, 39.2600],
    zoom: 12,
    description: 'Matawi yote 8 ya Kookoos: Mwenge, Sinza, Kariakoo, Tegeta, Masana, Bahari Beach, Kigamboni na Masaki'
  },
  {
    key: 'mwenge_hq',
    label: 'Mwenge HQ (Kookoos Central)',
    shortLabel: 'Mwenge HQ',
    icon: '👑',
    badge: 'Mwenge HQ Flagship',
    center: [-6.7712, 39.2215],
    zoom: 16,
    description: 'Kookoos Mwenge HQ Branch • Bagamoyo Road'
  },
  {
    key: 'kariakoo_hub',
    label: 'Kamata Kariakoo & Posta',
    shortLabel: 'Kariakoo',
    icon: '🏢',
    badge: 'Kariakoo Kamata Hub',
    center: [-6.8240, 39.2785],
    zoom: 16,
    description: 'Kookoos Kamata Kariakoo • Msimbazi / Nyerere Junction'
  },
  {
    key: 'masaki_peninsula',
    label: 'Masaki & Slipway Pier',
    shortLabel: 'Masaki',
    icon: '🌊',
    badge: 'Masaki Peninsula',
    center: [-6.7580, 39.2820],
    zoom: 16,
    description: 'Kookoos Masaki Peninsula • Toure Drive'
  },
  {
    key: 'sinza_mori',
    label: 'Sinza Mori & Shekilango',
    shortLabel: 'Sinza',
    icon: '🏘️',
    badge: 'Sinza Mori Outlet',
    center: [-6.7820, 39.2310],
    zoom: 16,
    description: 'Kookoos Sinza Mori Branch • Shekilango Road'
  },
  {
    key: 'kigamboni_ferry',
    label: 'Kigamboni & South Beach',
    shortLabel: 'Kigamboni',
    icon: '🌴',
    badge: 'Kigamboni Ferry',
    center: [-6.8320, 39.3010],
    zoom: 15,
    description: 'Kookoos Kigamboni Branch • Ferry Road'
  },
  {
    key: 'mikocheni_street',
    label: 'Mikocheni & Shoppers',
    shortLabel: 'Mikocheni',
    icon: '🏙️',
    badge: 'Mikocheni Mitaani',
    center: [-6.7725, 39.2485],
    zoom: 16,
    description: 'Mwai Kibaki Road, Shoppers Plaza Mikocheni'
  },
  {
    key: 'tanzania_national',
    label: 'Tanzania Nzima',
    shortLabel: 'Tanzania',
    icon: '🇹🇿',
    badge: 'Kitaifa (National View)',
    center: [-6.3690, 34.8888],
    zoom: 6,
    description: 'Dodoma, Dar es Salaam, Zanzibar, Arusha, Mwanza, Mbeya'
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
  osm_standard: {
    name: 'OpenStreetMap (Asilia)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19,
    attr: '&copy; OpenStreetMap contributors'
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
    name: 'Kookoos (Mwenge HQ Central)',
    category: 'Kookoos Kitchen HQ',
    coords: [-6.7712, 39.2215],
    description: 'Bagamoyo Road, Karibu na Kituo cha Mwenge',
    color: '#f59e0b',
    icon: '🍗'
  },
  {
    id: 'kariakoo_hub',
    name: 'Kookoos Express (Kariakoo)',
    category: 'Kookoos Kitchen',
    coords: [-6.8240, 39.2785],
    description: 'Kamata Junction, Nyerere / Msimbazi Road',
    color: '#ef4444',
    icon: '🍗'
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

const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

interface InteractiveLiveMapProps {
  initialPreset?: MapPreset;
  className?: string;
  isDark?: boolean;
  branches?: RestaurantBranch[];
  onSelectLocation?: (location: KeyLocation) => void;
}

export const InteractiveLiveMap: React.FC<InteractiveLiveMapProps> = ({
  initialPreset = 'dar_es_salaam',
  className = 'h-[480px] sm:h-[560px]',
  isDark = true,
  branches,
  onSelectLocation
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);

  const [activePreset, setActivePreset] = useState<MapPreset>(initialPreset);
  const [activeTileType, setActiveTileType] = useState<TileLayerType>('google_roadmap');
  const [currentZoom, setCurrentZoom] = useState<number>(12);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [isExpandedFullscreen, setIsExpandedFullscreen] = useState<boolean>(false);
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

      let resizeObserver: ResizeObserver | null = null;
      if (containerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          map.invalidateSize();
        });
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        timers.forEach(t => clearTimeout(t));
        if (resizeObserver) resizeObserver.disconnect();
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

    // Map restaurant branches to key locations if provided
    const branchKeyLocations: KeyLocation[] = (branches || [])
      .filter(b => b.active !== false)
      .map(b => ({
        id: b.id,
        name: b.name,
        category: b.tag || 'Tawi la Mgahawa (Branch)',
        coords: [b.lat, b.lng] as [number, number],
        description: `${b.address} • Simu: ${b.phone} • Masaa: ${b.hours}`,
        color: '#f59e0b',
        icon: '🍗'
      }));

    const allLocations = [...branchKeyLocations, ...KEY_LOCATIONS.filter(k => !branchKeyLocations.some(b => b.id === k.id))];

    allLocations.forEach(loc => {
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
  }, [selectedLocation, onSelectLocation, branches]);

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
        setUserCoords(coords);
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

  // Calculate distance to selected location if user GPS is available
  const selectedDistance = (selectedLocation && userCoords)
    ? calculateDistanceKm(userCoords[0], userCoords[1], selectedLocation.coords[0], selectedLocation.coords[1])
    : null;

  return (
    <div
      className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-800 bg-[#0d1219] shadow-2xl flex flex-col transition-all duration-300 ${
        isExpandedFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen rounded-none max-w-none m-0 border-none'
          : className
      }`}
    >
      {/* Top Bar: Presets & Controls */}
      <div className="p-2 sm:p-3 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 z-20 shrink-0">
        {/* Preset Selector Tabs - Smooth Touch Horizontal Swipe */}
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
                    ? 'text-white shadow-md ring-1 ring-white/30 font-bold'
                    : 'bg-neutral-900/90 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700'
                }`}
                style={isSelected ? {
                  backgroundColor: 'var(--brand-primary, #f59e0b)',
                  boxShadow: '0 4px 14px -2px var(--brand-primary-shadow, rgba(245, 158, 11, 0.4))'
                } : undefined}
              >
                <span className="text-sm">{preset.icon}</span>
                <span className="hidden md:inline">{preset.label}</span>
                <span className="md:hidden">{preset.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Live GPS & Fullscreen & Layer Switcher */}
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

          {/* Fullscreen Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setIsExpandedFullscreen(!isExpandedFullscreen);
              setTimeout(() => mapRef.current?.invalidateSize(), 150);
            }}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
            title={isExpandedFullscreen ? 'Toka Skrini Kamili' : 'Skrini Kamili ya Simu'}
          >
            {isExpandedFullscreen ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4" />}
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
                          ? 'text-white font-bold'
                          : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                      style={isCur ? { backgroundColor: 'var(--brand-primary, #f59e0b)' } : undefined}
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
            placeholder="Tafuta tawi: Mwenge, Sinza, Kariakoo, Masaki..."
            className="w-full pl-8 pr-3 py-1 text-xs rounded-xl bg-neutral-900 text-white border border-neutral-800 focus:border-amber-500 outline-none placeholder-neutral-500"
          />
        </form>

        <div className="text-[11px] text-neutral-400 hidden sm:flex items-center space-x-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--brand-primary, #f59e0b)' }}
          />
          <span>{currentPresetInfo.badge}</span>
        </div>
      </div>

      {/* 100% REAL LIVE LEAFLET CANVAS */}
      <div
        className="relative w-full flex-1"
        style={{ minHeight: '340px', height: '100%', position: 'relative' }}
      >
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full z-0"
          style={{ width: '100%', height: '100%', minHeight: '340px' }}
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

        {/* MOBILE FLOATING INTERACTIVE BRANCH & LOCATION CARD */}
        {selectedLocation ? (
          <div className="absolute bottom-3 left-3 right-3 max-w-md mx-auto bg-neutral-950/95 backdrop-blur-xl p-3.5 rounded-3xl border border-neutral-700/80 shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-neutral-800/80">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div
                  className="w-9 h-9 rounded-2xl text-white flex items-center justify-center text-lg font-bold shadow-md shrink-0"
                  style={{ backgroundColor: 'var(--brand-primary, #f59e0b)' }}
                >
                  {selectedLocation.icon || '🍗'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <h4 className="font-extrabold text-xs sm:text-sm text-white truncate">
                      {selectedLocation.name}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold shrink-0">
                      Wazi Sasa
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                    {selectedLocation.category || 'Tawi la Kookoos'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLocation(null)}
                className="p-1.5 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                title="Funga kadi hii"
              >
                ✕
              </button>
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-[11px] text-neutral-300 leading-snug">
                {selectedLocation.description}
              </p>

              {selectedDistance !== null && (
                <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl w-fit">
                  <span>📍</span>
                  <span>Umbali: km {selectedDistance} kutoka eneo lako la sasa</span>
                </div>
              )}

              {/* Action Buttons for Mobile Phone Users */}
              <div className="flex items-center space-x-2 pt-1">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.coords[0]},${selectedLocation.coords[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 rounded-xl text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all"
                  style={{ backgroundColor: 'var(--brand-primary, #f59e0b)' }}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Nielekeze (Google Maps)</span>
                </a>

                <a
                  href="tel:+255744883291"
                  className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-bold text-xs flex items-center justify-center space-x-1 active:scale-95 transition-all"
                >
                  <span>📞 Piga Simu</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Bottom Floating Default Info Pill */
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto max-w-lg bg-neutral-950/95 backdrop-blur-md p-2.5 rounded-2xl border border-neutral-700/70 shadow-2xl z-20 flex items-start space-x-2.5 pointer-events-auto">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-white shadow-sm"
              style={{ backgroundColor: 'var(--brand-primary, #f59e0b)' }}
            >
              <Compass className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <p className="font-bold text-xs text-white truncate">
                  {currentPresetInfo.label}
                </p>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.2 rounded-full"
                  style={{
                    backgroundColor: 'var(--brand-primary-light, rgba(245, 158, 11, 0.15))',
                    color: 'var(--brand-primary, #f59e0b)'
                  }}
                >
                  LIVE INTERACTIVE MAP
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                {userAddressNotice || currentPresetInfo.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Location Shortcuts below map - Horizontal Swipeable on Mobile */}
      <div className="p-2 sm:p-2.5 bg-neutral-950/95 border-t border-neutral-800/80 flex items-center space-x-2 overflow-x-auto no-scrollbar z-10 text-xs shrink-0">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
          Maeneo ya Haraka:
        </span>

        <button
          type="button"
          onClick={() => handleSelectPreset('mwenge_hq')}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-all cursor-pointer shrink-0 min-w-[130px]"
        >
          <span className="text-amber-400 font-bold block text-[11px]">👑 Mwenge HQ</span>
          <span className="text-neutral-400 text-[10px] truncate block">Flagship Store</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectPreset('masaki_peninsula')}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-all cursor-pointer shrink-0 min-w-[130px]"
        >
          <span className="text-cyan-400 font-bold block text-[11px]">🌊 Masaki & Slipway</span>
          <span className="text-neutral-400 text-[10px] truncate block">Toure Drive Pier</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectPreset('kariakoo_hub')}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-all cursor-pointer shrink-0 min-w-[130px]"
        >
          <span className="text-rose-400 font-bold block text-[11px]">🏢 Kamata Kariakoo</span>
          <span className="text-neutral-400 text-[10px] truncate block">Msimbazi / Nyerere</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectPreset('sinza_mori')}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-all cursor-pointer shrink-0 min-w-[130px]"
        >
          <span className="text-emerald-400 font-bold block text-[11px]">🏘️ Sinza Mori</span>
          <span className="text-neutral-400 text-[10px] truncate block">Shekilango Road</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectPreset('mikocheni_street')}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-all cursor-pointer shrink-0 min-w-[130px]"
        >
          <span className="text-teal-400 font-bold block text-[11px]">🏬 Shoppers Plaza</span>
          <span className="text-neutral-400 text-[10px] truncate block">Mwai Kibaki Rd</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectPreset('tanzania_national')}
          className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left transition-all cursor-pointer shrink-0 min-w-[130px]"
        >
          <span className="text-amber-400 font-bold block text-[11px]">🇹🇿 Tanzania Nzima</span>
          <span className="text-neutral-400 text-[10px] truncate block">Dodoma, Mwanza, Arusha</span>
        </button>
      </div>
    </div>
  );
};
