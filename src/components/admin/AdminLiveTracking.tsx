import React, { useState } from 'react';
import {
  Bike,
  Navigation,
  Battery,
  Gauge,
  Phone,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { INITIAL_DRIVERS, AdminDriver } from './adminMockData';

interface AdminLiveTrackingProps {
  isDark: boolean;
}

export const AdminLiveTracking: React.FC<AdminLiveTrackingProps> = ({ isDark }) => {
  const [drivers, setDrivers] = useState<AdminDriver[]>(INITIAL_DRIVERS);
  const [selectedDriver, setSelectedDriver] = useState<AdminDriver | null>(drivers[0]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'busy' | 'offline'>('all');
  const [search, setSearch] = useState('');

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.zone.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSimulateMove = () => {
    setDrivers(prev =>
      prev.map(d => {
        if (d.status === 'offline') return d;
        const deltaLat = (Math.random() - 0.5) * 0.003;
        const deltaLng = (Math.random() - 0.5) * 0.003;
        const newSpeed = d.status === 'busy' ? Math.floor(25 + Math.random() * 25) : 0;
        return {
          ...d,
          currentSpeed: newSpeed,
          coordinates: [d.coordinates[0] + deltaLat, d.coordinates[1] + deltaLng]
        };
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div>
          <h2 className="text-base font-bold font-display text-neutral-900 dark:text-white flex items-center space-x-2">
            <span>Fleet GPS Telemetry & Radar</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
              LIVE RADAR
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Active Boda-boda couriers and delivery routes across Dar es Salaam
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSimulateMove}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Ping Drivers</span>
          </button>
        </div>
      </div>

      {/* Main Tracking Grid: Map on Left (7 cols), Fleet List on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Radar Map View */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden flex flex-col">
          <div className="relative w-full h-[450px] bg-[#e6e2d8] dark:bg-[#181a20] overflow-hidden select-none">
            {/* SVG Roads & Waterway */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" preserveAspectRatio="none">
              <path
                d="M 0,0 L 260,0 C 290,90 240,160 210,240 C 180,310 240,380 320,450 L 0,450 Z"
                fill={isDark ? '#141e2b' : '#c9e2f5'}
              />
              <path
                d="M 160,450 Q 320,300 420,180 T 800,40"
                stroke={isDark ? '#2e3340' : '#ffffff'}
                strokeWidth="12"
                fill="none"
              />
              <path
                d="M 160,450 Q 320,300 420,180 T 800,40"
                stroke={isDark ? '#3d4454' : '#f5e4bd'}
                strokeWidth="8"
                fill="none"
              />
              <line x1="240" y1="80" x2="800" y2="80" stroke={isDark ? '#272b35' : '#ffffff'} strokeWidth="5" />
              <line x1="280" y1="180" x2="800" y2="180" stroke={isDark ? '#272b35' : '#ffffff'} strokeWidth="5" />
              <line x1="320" y1="280" x2="800" y2="280" stroke={isDark ? '#272b35' : '#ffffff'} strokeWidth="5" />
              <line x1="360" y1="380" x2="800" y2="380" stroke={isDark ? '#272b35' : '#ffffff'} strokeWidth="5" />
            </svg>

            {/* Drivers markers */}
            {filteredDrivers.map((driver, idx) => {
              const isSelected = selectedDriver?.id === driver.id;
              // Visual position offsets
              const offsets = [
                { top: '25%', left: '48%' },
                { top: '45%', left: '38%' },
                { top: '65%', left: '55%' },
                { top: '35%', left: '70%' },
                { top: '75%', left: '42%' },
                { top: '50%', left: '60%' }
              ];
              const pos = offsets[idx % offsets.length];

              return (
                <div
                  key={driver.id}
                  onClick={() => setSelectedDriver(driver)}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform hover:scale-110"
                >
                  <div
                    className={`relative p-2 rounded-2xl flex items-center space-x-1.5 shadow-xl transition-all ${
                      isSelected
                        ? 'bg-orange-600 text-white ring-4 ring-orange-500/30 scale-110'
                        : driver.status === 'busy'
                        ? 'bg-blue-600 text-white'
                        : driver.status === 'active'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-600 text-white opacity-70'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                    <span className="text-[11px] font-bold whitespace-nowrap">{driver.name.split(' ')[0]}</span>
                    {driver.currentSpeed > 0 && (
                      <span className="text-[9px] bg-black/30 px-1 rounded-sm">{driver.currentSpeed} km/h</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Driver Inspector Footer */}
          {selectedDriver && (
            <div className="p-4 border-t border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#151518] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedDriver.avatar}
                  alt={selectedDriver.name}
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-orange-500"
                />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white">
                    {selectedDriver.name} • <span className="font-mono text-orange-600 dark:text-orange-400">{selectedDriver.plateNumber}</span>
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    {selectedDriver.vehicle} • {selectedDriver.zone}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={`tel:${selectedDriver.phone}`}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Rider</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Fleet Roster List (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs p-4 sm:p-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white">
              Fleet Status ({filteredDrivers.length})
            </h3>

            <div className="flex space-x-1">
              {(['all', 'active', 'busy', 'offline'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg capitalize ${
                    filterStatus === st
                      ? 'bg-orange-600 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search rider, plate, zone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
            />
          </div>

          {/* Driver Cards */}
          <div className="space-y-2.5 overflow-y-auto max-h-[380px] no-scrollbar pr-1">
            {filteredDrivers.map(driver => (
              <div
                key={driver.id}
                onClick={() => setSelectedDriver(driver)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  selectedDriver?.id === driver.id
                    ? 'border-orange-500 bg-orange-50/20 dark:bg-orange-950/20 shadow-xs'
                    : 'border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={driver.avatar}
                      alt={driver.name}
                      className="w-9 h-9 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{driver.name}</h4>
                      <p className="text-[10px] text-neutral-400">{driver.plateNumber} • {driver.zone}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      driver.status === 'busy'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : driver.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-neutral-500/10 text-neutral-500'
                    }`}
                  >
                    {driver.status}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-500">
                  <span className="flex items-center space-x-1">
                    <Battery className="w-3 h-3 text-emerald-500" />
                    <span>{driver.batteryPercent}%</span>
                  </span>
                  <span>{driver.deliveriesCompleted} deliveries</span>
                  <span className="text-amber-500 font-bold">★ {driver.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
