import React, { useState } from 'react';
import { AdminLeafletMap } from './AdminLeafletMap';
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
          {/* Real Interactive Leaflet Fleet Radar */}
          <div className="relative w-full h-[450px] overflow-hidden">
            <AdminLeafletMap
              drivers={filteredDrivers}
              selectedDriver={selectedDriver}
              onSelectDriver={setSelectedDriver}
              isDark={isDark}
              className="w-full h-full"
            />
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
