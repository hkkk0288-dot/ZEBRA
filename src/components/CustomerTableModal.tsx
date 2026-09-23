import React, { useState } from 'react';
import {
  X,
  UtensilsCrossed,
  Sparkles,
  CheckCircle2,
  Users,
  Bell,
  ArrowRight,
  MapPin,
  QrCode
} from 'lucide-react';
import { RestaurantTable } from '../types';

interface CustomerTableModalProps {
  tables: RestaurantTable[];
  activeTable: RestaurantTable | null;
  onSelectTable: (table: RestaurantTable) => void;
  onClearTable: () => void;
  onClose: () => void;
  onCallWaiter?: (tableNumber: string, reason: string) => void;
}

export const CustomerTableModal: React.FC<CustomerTableModalProps> = ({
  tables,
  activeTable,
  onSelectTable,
  onClearTable,
  onClose,
  onCallWaiter
}) => {
  const [selectedSection, setSelectedSection] = useState<'All' | 'Indoor' | 'Garden Terrace' | 'VIP Lounge'>('All');
  const [callNotice, setCallNotice] = useState<string | null>(null);

  const filteredTables = tables.filter(t => {
    if (selectedSection === 'All') return true;
    return t.section === selectedSection;
  });

  const handleCall = (reason: string) => {
    if (!activeTable) return;
    if (onCallWaiter) {
      onCallWaiter(activeTable.name, reason);
    }
    setCallNotice(`Mhudumu ametaarifiwa kwa ajili ya "${reason}" kwenye ${activeTable.name}!`);
    setTimeout(() => setCallNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-[#151518] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden relative my-auto animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                <span>Chagua Namba ya Meza Yako</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Weka namba ya meza uliyoketi ili oda yako ifikishwe moja kwa moja mezani
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Active Table Status If Already Seated */}
          {activeTable && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-xs text-neutral-900 dark:text-white">
                    Umeketi: {activeTable.name} ({activeTable.section})
                  </h4>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Oda zako zote zitafikishwa kwenye meza hii bila gharama ya delivery!
                  </p>
                </div>
              </div>

              <button
                onClick={onClearTable}
                className="text-xs text-rose-500 hover:text-rose-600 font-bold px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors"
              >
                Ondoka Mezani
              </button>
            </div>
          )}

          {/* Call Waiter Quick Actions if at Table */}
          {activeTable && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-neutral-500 flex items-center space-x-1">
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>Huduma ya Haraka kwa Meza {activeTable.name}:</span>
              </span>

              {callNotice && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                  {callNotice}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleCall('Mhudumu anahitajika')}
                  className="py-2 px-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all text-center"
                >
                  🙋 Mhudumu
                </button>
                <button
                  onClick={() => handleCall('Maji au Kinywaji')}
                  className="py-2 px-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all text-center"
                >
                  💧 Maji / Drinks
                </button>
                <button
                  onClick={() => handleCall('Bili ya Malipo')}
                  className="py-2 px-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all text-center"
                >
                  🧾 Lete Bili
                </button>
              </div>
            </div>
          )}

          {/* Section filter tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
            {(['All', 'Indoor', 'Garden Terrace', 'VIP Lounge'] as const).map(sec => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedSection === sec
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {sec === 'All' ? 'Meza Zote' : sec}
              </button>
            ))}
          </div>

          {/* Grid of Tables */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
            {filteredTables.map(t => {
              const isCurrent = activeTable?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTable(t);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 hover:border-emerald-500'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">
                        {t.section}
                      </span>
                      {isCurrent && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white flex items-center space-x-1">
                      <span>{t.name}</span>
                      {t.section.includes('VIP') && (
                        <Sparkles className="w-3 h-3 text-amber-500" />
                      )}
                    </h4>
                  </div>

                  <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500">
                    <span className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{t.capacity} Viti</span>
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Chagua →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-center text-neutral-400">
            💡 Kila meza ina QR Code yake iliyowekwa juu ya meza. Unaweza kuichanganua kwa kamera ya simu wakati wowote!
          </p>
        </div>
      </div>
    </div>
  );
};
