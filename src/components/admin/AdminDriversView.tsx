import React, { useState } from 'react';
import {
  Bike,
  Plus,
  Search,
  Phone,
  Battery,
  Star,
  CheckCircle2,
  X,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { INITIAL_DRIVERS, AdminDriver } from './adminMockData';

interface AdminDriversViewProps {
  isDark: boolean;
}

export const AdminDriversView: React.FC<AdminDriversViewProps> = () => {
  const [drivers, setDrivers] = useState<AdminDriver[]>(INITIAL_DRIVERS);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Driver Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+255 ');
  const [vehicle, setVehicle] = useState('Boxer BM 150 (Black)');
  const [plateNumber, setPlateNumber] = useState('MC ');
  const [zone, setZone] = useState('Masaki & Oysterbay');

  const filtered = drivers.filter(
    d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.zone.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !plateNumber) return;

    const newDriver: AdminDriver = {
      id: `drv-${Date.now()}`,
      name,
      phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      vehicle,
      plateNumber,
      zone,
      status: 'active',
      rating: 5.0,
      deliveriesCompleted: 0,
      batteryPercent: 100,
      currentSpeed: 0,
      coordinates: [-6.7760, 39.2780]
    };

    setDrivers([newDriver, ...drivers]);
    setShowAddModal(false);
    setName('');
    setPlateNumber('MC ');
  };

  const toggleStatus = (id: string) => {
    setDrivers(prev =>
      prev.map(d => {
        if (d.id !== id) return d;
        const nextStatus = d.status === 'active' ? 'busy' : d.status === 'busy' ? 'offline' : 'active';
        return { ...d, status: nextStatus };
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div>
          <h2 className="text-base font-bold font-display text-neutral-900 dark:text-white flex items-center space-x-2">
            <span>Drivers & Courier Fleet</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
              {drivers.length} Registered
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage rider accounts, motorcycle plates, zone assignments, and delivery performance
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search driver, plate, zone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Driver</span>
          </button>
        </div>
      </div>

      {/* Drivers Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(driver => (
          <div
            key={driver.id}
            className="p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={driver.avatar}
                  alt={driver.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-neutral-100 dark:border-neutral-800"
                />
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">{driver.name}</h3>
                  <p className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
                    {driver.plateNumber}
                  </p>
                  <p className="text-[11px] text-neutral-400">{driver.vehicle}</p>
                </div>
              </div>

              <button
                onClick={() => toggleStatus(driver.id)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize transition-all cursor-pointer ${
                  driver.status === 'busy'
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20'
                    : driver.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-neutral-500/10 text-neutral-500 hover:bg-neutral-500/20'
                }`}
                title="Click to toggle status"
              >
                ● {driver.status}
              </button>
            </div>

            <div className="p-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 text-xs space-y-1">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-neutral-400" />
                  <span>Zone:</span>
                </span>
                <span className="font-semibold text-neutral-900 dark:text-white">{driver.zone}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                <span>Completed Orders:</span>
                <span className="font-mono font-bold">{driver.deliveriesCompleted}</span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                <span>Driver Rating:</span>
                <span className="font-bold text-amber-500">★ {driver.rating}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <a
                href={`tel:${driver.phone}`}
                className="flex-1 py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <span>Call Driver</span>
              </a>
              <button
                onClick={() => toggleStatus(driver.id)}
                className="py-2 px-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold transition-colors"
              >
                Switch Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#18181b] rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Register New Fleet Courier</h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">Driver Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Baraka Elias"
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+255 712 000 000"
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">Vehicle Model</label>
                  <input
                    type="text"
                    value={vehicle}
                    onChange={e => setVehicle(e.target.value)}
                    placeholder="Boxer 150"
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">Plate Number</label>
                  <input
                    type="text"
                    required
                    value={plateNumber}
                    onChange={e => setPlateNumber(e.target.value)}
                    placeholder="MC 991 DAK"
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">Operating Zone</label>
                <select
                  value={zone}
                  onChange={e => setZone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                >
                  <option value="Masaki & Oysterbay">Masaki & Oysterbay</option>
                  <option value="Kariakoo & CBD">Kariakoo & CBD</option>
                  <option value="Mikocheni & Msasani">Mikocheni & Msasani</option>
                  <option value="Kinondoni & Sinza">Kinondoni & Sinza</option>
                  <option value="Upanga & Ilala">Upanga & Ilala</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Confirm & Register
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
