import React from 'react';
import {
  Compass,
  Maximize2,
  Navigation,
  Clock,
  Sparkles,
  MapPin,
  Store
} from 'lucide-react';
import { InteractiveLiveMap, MapPreset } from './InteractiveLiveMap';
import { RestaurantBranch } from '../types';

interface HomeMapSectionProps {
  onOpenFullMap: (initialPreset?: MapPreset) => void;
  isDark: boolean;
  branches?: RestaurantBranch[];
}

export const HomeMapSection: React.FC<HomeMapSectionProps> = ({
  onOpenFullMap,
  isDark,
  branches = []
}) => {
  const [selectedBranchPreset, setSelectedBranchPreset] = React.useState<MapPreset>('mwenge_hq');

  const branchPresetMap: Record<string, MapPreset> = {
    'b-mwenge': 'mwenge_hq',
    'b-sinza': 'sinza_mori',
    'b-kariakoo': 'kariakoo_hub',
    'b-masaki': 'masaki_peninsula',
    'b-kigamboni': 'kigamboni_ferry',
    'b-tegeta': 'mikocheni_street'
  };

  return (
    <section className="w-full my-4 sm:my-8">
      <div
        className={`rounded-3xl border overflow-hidden shadow-2xl transition-all ${
          isDark
            ? 'bg-gradient-to-b from-[#10131a] via-[#0d1017] to-[#080b10] border-neutral-800'
            : 'bg-gradient-to-b from-neutral-50 via-white to-neutral-100 border-neutral-200'
        }`}
      >
        {/* Header Bar */}
        <div className="p-3.5 sm:p-5 border-b border-neutral-800/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl text-white flex items-center justify-center text-xl shadow-lg shrink-0"
              style={{
                backgroundColor: 'var(--brand-primary, #f59e0b)',
                boxShadow: '0 8px 20px -4px var(--brand-primary-shadow, rgba(245, 158, 11, 0.4))'
              }}
            >
              🏪
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-lg font-bold font-display text-neutral-900 dark:text-white">
                  Ramani ya Matawi ya Kookoos (Live Branches)
                </h2>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0"
                  style={{
                    backgroundColor: 'var(--brand-primary-light, rgba(245, 158, 11, 0.15))',
                    color: 'var(--brand-primary, #f59e0b)',
                    borderColor: 'var(--brand-primary-border, rgba(245, 158, 11, 0.35))'
                  }}
                >
                  {branches.length} {branches.length === 1 ? 'Tawi' : 'Matawi'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Gusa tawi au sogeza ramani kutazama vituo vya jikoni na maeneo ya Dar es Salaam
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => onOpenFullMap('mwenge_hq')}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
              style={{
                backgroundColor: 'var(--brand-primary, #f59e0b)',
                boxShadow: '0 8px 20px -4px var(--brand-primary-shadow, rgba(245, 158, 11, 0.35))'
              }}
              title="Fungua Ramani Kamili ya Matawi"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Skrini Kubwa (Fullscreen)</span>
            </button>
          </div>
        </div>

        {/* Mobile Quick Branch Chips */}
        {branches.length > 0 && (
          <div className="px-3 sm:px-5 py-2 bg-neutral-950/70 border-b border-neutral-800/60 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
              Chagua Tawi:
            </span>
            {branches.map(b => {
              const presetKey = branchPresetMap[b.id] || 'mwenge_hq';
              const isSelected = selectedBranchPreset === presetKey;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBranchPreset(presetKey)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'text-white border-transparent shadow-xs'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  }`}
                  style={isSelected ? {
                    backgroundColor: 'var(--brand-primary, #f59e0b)',
                    boxShadow: '0 4px 12px -2px var(--brand-primary-shadow, rgba(245, 158, 11, 0.35))'
                  } : undefined}
                >
                  <span>🍗 {b.name.replace('Kookoos ', '')}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Live Interactive Leaflet Map right on the page */}
        <div className="p-2 sm:p-4">
          <InteractiveLiveMap
            key={selectedBranchPreset}
            initialPreset={selectedBranchPreset}
            className="h-[340px] sm:h-[480px]"
            isDark={isDark}
            branches={branches}
            onSelectLocation={loc => {
              // Location selected
            }}
          />
        </div>
      </div>
    </section>
  );
};
