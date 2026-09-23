import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Users,
  MapPin,
  Sparkles,
  CheckCircle2,
  Phone,
  User,
  Heart,
  Briefcase,
  Cake,
  ArrowRight,
  UtensilsCrossed
} from 'lucide-react';
import { RestaurantTable, TableReservation } from '../types';
import { useApp } from '../context/AppContext';
import { playScanSuccessSound } from '../utils/soundEffects';

interface TableReservationModalProps {
  onClose: () => void;
}

const TIME_SLOTS = [
  '12:00 PM', '13:00 PM', '14:00 PM', '18:00 PM', '19:00 PM', '19:30 PM', '20:15 PM', '21:00 PM'
];

const OCCASIONS = [
  { id: 'birthday', label: 'Birthday Celebration 🎂', icon: Cake },
  { id: 'date', label: 'Romantic Date / Dinner ❤️', icon: Heart },
  { id: 'business', label: 'Business Meeting / Kikao 💼', icon: Briefcase },
  { id: 'casual', label: 'Casual Dining / Marafiki 🍽️', icon: UtensilsCrossed }
];

export const TableReservationModal: React.FC<TableReservationModalProps> = ({ onClose }) => {
  const { user, tables, reservations, addReservation } = useApp();

  const [date, setDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>('19:30 PM');
  const [guestCount, setGuestCount] = useState<number>(4);
  const [section, setSection] = useState<'Indoor' | 'Garden Terrace' | 'VIP Lounge'>('Garden Terrace');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+255 7XX XXX XXX');
  const [email, setEmail] = useState(user?.email || '');
  const [occasion, setOccasion] = useState('Romantic Date / Dinner ❤️');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedCode, setConfirmedCode] = useState('');
  const [activeTab, setActiveTab] = useState<'new' | 'my_reservations'>('new');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const resCode = `RES-ZB-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRes: TableReservation = {
      id: `res-${Date.now()}`,
      reservationCode: resCode,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      date,
      timeSlot,
      guestCount,
      section,
      occasion,
      specialRequests,
      status: 'confirmed',
      createdAt: Date.now()
    };

    addReservation(newRes);
    playScanSuccessSound();
    setConfirmedCode(resCode);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-[#16161a] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden relative my-auto animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                <span>Hifadhi Meza Kabla (Table Reservation)</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Zebra Restaurant & Lounge • Masaki Peninsula
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Switch between New Reservation and Existing Reservations */}
        <div className="px-5 pt-3 pb-1 border-b border-neutral-100 dark:border-neutral-800 flex items-center space-x-2">
          <button
            type="button"
            onClick={() => { setActiveTab('new'); setIsSuccess(false); }}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'new'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            + Hifadhi Meza Mpya
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my_reservations')}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'my_reservations'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Nafasi Zangu ({reservations.length})
          </button>
        </div>

        <div className="p-4 sm:p-5 max-h-[75vh] overflow-y-auto">
          {activeTab === 'my_reservations' ? (
            <div className="space-y-3">
              {reservations.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold">Huna nafasi ya meza iliyohifadhiwa bado.</p>
                </div>
              ) : (
                reservations.map(res => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                        {res.reservationCode}
                      </span>
                      <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                        {res.status === 'confirmed' ? '✓ Imethibitishwa' : res.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-neutral-400 block text-[10px]">Tarehe & Saa</span>
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {res.date} saa {res.timeSlot}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[10px]">Eneo & Wageni</span>
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {res.section} • {res.guestCount} Wageni
                        </span>
                      </div>
                    </div>

                    {res.occasion && (
                      <p className="text-[11px] text-neutral-500 italic">
                        {res.occasion} {res.specialRequests ? `• ${res.specialRequests}` : ''}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : isSuccess ? (
            <div className="text-center py-6 space-y-4 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto text-2xl">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Meza Yako Imehifadhiwa Kikamilifu!
                </h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Tumekutumia uthibitisho na namba ya kumbukumbu. Karibu sana Zebra Masaki.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-w-xs mx-auto text-left space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Ref Code:</span>
                  <span className="font-bold text-emerald-500">{confirmedCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Tarehe:</span>
                  <span>{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Saa:</span>
                  <span>{timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Eneo:</span>
                  <span>{section}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Wageni:</span>
                  <span>{guestCount} watu</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                Sawa, Nimekamilisha
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                    Tarehe ya Kufika
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                    Idadi ya Wageni
                  </label>
                  <select
                    value={guestCount}
                    onChange={e => setGuestCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs outline-none focus:border-emerald-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map(cnt => (
                      <option key={cnt} value={cnt}>
                        {cnt} {cnt === 1 ? 'Mgeni (Mtu 1)' : `Wageni (Watu ${cnt})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Chagua Saa (Time Slot)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {TIME_SLOTS.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        timeSlot === slot
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 border border-transparent'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Choice */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1.5">
                  Eneo la Meza (Section)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Garden Terrace', 'Indoor', 'VIP Lounge'] as const).map(sec => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setSection(sec)}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        section === sec
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      <span className="block text-xs font-bold">
                        {sec === 'Garden Terrace' ? '🌿 Bustani' : sec === 'VIP Lounge' ? '👑 VIP Lounge' : '❄️ AC Indoor'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                    Jina Kamili la Mgeni
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Mfano: Juma Khamis"
                    required
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                    Namba ya Simu
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+255 7XX XXX XXX"
                    required
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Occasion & Special Requests */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                  Aina ya Tukio (Occasion)
                </label>
                <select
                  value={occasion}
                  onChange={e => setOccasion(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs outline-none focus:border-emerald-500"
                >
                  {OCCASIONS.map(occ => (
                    <option key={occ.id} value={occ.label}>
                      {occ.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1">
                  Maelekezo Maalum (Special Requests)
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={e => setSpecialRequests(e.target.value)}
                  placeholder="Mfano: Maua meza ya katikati, viti vya watoto, bili ya pamoja"
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs outline-none focus:border-emerald-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Thibitisha Meza Yangu (Book Table)</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
