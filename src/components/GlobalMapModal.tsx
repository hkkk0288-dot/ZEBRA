import React, { useState } from 'react';
import {
  Globe2,
  X,
  Maximize,
  Minimize,
  Navigation,
  Compass,
  MapPin,
  ChevronRight,
  Clock,
  Phone,
  ArrowLeft,
  LayoutGrid,
  SlidersHorizontal,
  Store
} from 'lucide-react';
import { InteractiveLiveMap, MapPreset } from './InteractiveLiveMap';
import { useApp } from '../context/AppContext';
import { RestaurantBranch } from '../types';

export type MapLayerKey = MapPreset;

interface GlobalMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  initialMode?: MapPreset;
  onOpenLocationPicker?: () => void;
}

export const GlobalMapModal: React.FC<GlobalMapModalProps> = ({
  isOpen,
  onClose,
  isDark,
  initialMode = 'dar_es_salaam',
  onOpenLocationPicker
}) => {
  const { appBranding, setShowLocationPickerModal } = useApp();
  const isMulti = appBranding.restaurantMode === 'multi';
  const isSingle = (appBranding.restaurantMode || 'single') === 'single';
  const activeBranches = (appBranding.branches || []).filter(b => b.active !== false);
  const showBranchMap = isMulti && activeBranches.length > 0;

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [isListView, setIsListView] = useState<boolean>(false);
  const [targetedLocation, setTargetedLocation] = useState<RestaurantBranch | null>(null);

  if (!isOpen) return null;

  const branches = activeBranches;

  const handleBranchSelect = (b: RestaurantBranch) => {
    setSelectedBranch(b.id);
    setTargetedLocation(b);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-0 sm:p-3 md:p-4">
      <div
        className={`w-full h-full sm:h-auto sm:max-w-6xl sm:max-h-[96vh] rounded-none sm:rounded-3xl border sm:border-neutral-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isFullscreen
            ? 'fixed inset-0 sm:inset-1 max-w-none max-h-none h-full sm:h-[calc(100vh-8px)] rounded-none'
            : ''
        } ${
          isDark
            ? 'bg-[#0d1017] border-neutral-800 text-white'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 border-b border-neutral-800/80 shrink-0 gap-2 bg-neutral-950/80 backdrop-blur-md">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {/* Back Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 shrink-0 border border-neutral-700 shadow-sm"
              title="Rudi Nyuma (Back)"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Rudi</span>
            </button>

            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg sm:text-xl shrink-0">
              🍗
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <h3 className="font-extrabold text-xs sm:text-base font-display truncate">
                  {isSingle ? 'Eneo la Mgahawa & Ramani' : 'Ramani ya Matawi ya Kookoos'}
                </h3>
                <span className="hidden xs:inline-flex px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] border border-amber-500/30">
                  {branches.length} Matawi
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-400 truncate max-w-[180px] xs:max-w-xs sm:max-w-md">
                {isSingle ? 'Kookoos Mwenge HQ & Eneo la kuletewa chakula' : 'Matawi 8 ya Kookoos Dar es Salaam'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Delivery address button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenLocationPicker) {
                  onOpenLocationPicker();
                } else {
                  setShowLocationPickerModal(true);
                }
              }}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold flex items-center space-x-1 transition-all cursor-pointer active:scale-95"
              title="Badilisha eneo lako la delivery"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Eneo Langu</span>
            </button>

            {/* Toggle view: Carousel vs Full List */}
            <button
              type="button"
              onClick={() => setIsListView(!isListView)}
              className="p-1.5 sm:p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center justify-center cursor-pointer"
              title={isListView ? 'Tazama Ramani Kubwa' : 'Tazama Orodha Kamili'}
            >
              {isListView ? <SlidersHorizontal className="w-4 h-4 text-amber-400" /> : <LayoutGrid className="w-4 h-4 text-neutral-300" />}
            </button>

            {/* Fullscreen toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 sm:p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors hidden sm:flex items-center justify-center cursor-pointer"
              title={isFullscreen ? 'Toka Skrini Kamili' : 'Skrini Kamili'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
              title="Funga"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Modal Map Body */}
        {!showBranchMap ? (
          <div className="p-10 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center text-3xl">
              🏪
            </div>
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
              Ramani ya Matawi Haipatikani
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              Mfumo umewekwa kwenye hali ya <strong>Single Restaurant</strong> au admin hajaweka tawi lolote.
            </p>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setShowLocationPickerModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs transition-all cursor-pointer"
              >
                Chagua Eneo la Delivery
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs transition-all cursor-pointer"
              >
                Funga
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            {/* The Live Interactive Map Viewport (Takes full available space on mobile!) */}
            <div className="flex-1 w-full min-h-[300px] relative overflow-hidden">
              <InteractiveLiveMap
                initialPreset={initialMode}
                className="w-full h-full"
                isDark={isDark}
                branches={branches}
                onSelectLocation={loc => {
                  const b = branches.find(item => item.id === loc.id);
                  if (b) setSelectedBranch(b.id);
                }}
              />
            </div>

            {/* Bottom Controls / Branch Viewer */}
            {isListView ? (
              /* Expandable List View */
              <div className="shrink-0 max-h-[45vh] overflow-y-auto p-3 bg-neutral-950/95 border-t border-neutral-800/80 space-y-2">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold text-neutral-200">Matawi Yote ya Dar es Salaam:</span>
                  <button
                    type="button"
                    onClick={() => setIsListView(false)}
                    className="text-[11px] text-amber-400 font-bold hover:underline"
                  >
                    Funga Orodha ➔
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {branches.map(b => (
                    <div
                      key={b.id}
                      onClick={() => handleBranchSelect(b)}
                      className={`p-2.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                        selectedBranch === b.id
                          ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                          : 'bg-neutral-900/80 border-neutral-800/80 hover:border-neutral-700 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-0.5">
                        <span className="font-extrabold text-amber-400">{b.tag || 'Tawi'}</span>
                        <span className="text-neutral-400">{b.hours}</span>
                      </div>
                      <div className="font-extrabold text-white truncate text-xs">{b.name}</div>
                      <div className="text-[11px] text-neutral-400 truncate mt-0.5">{b.area}</div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-1">{b.phone}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Sleek Mobile Horizontal Swipe Carousel (Takes only ~95px, gives 85%+ screen to map!) */
              <div className="shrink-0 p-2 sm:p-2.5 bg-neutral-950/95 border-t border-neutral-800/90 backdrop-blur-md">
                <div className="flex items-center justify-between px-1 mb-1.5 text-[11px]">
                  <span className="font-bold text-neutral-300 flex items-center space-x-1.5">
                    <span className="text-amber-400">🍗</span>
                    <span>Matawi ya Kookoos ({branches.length})</span>
                    <span className="text-neutral-500 text-[10px] hidden xs:inline">• Telezesha kidole kuona yote</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsListView(true)}
                    className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                  >
                    <span>Orodha Yote</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
                  {branches.map(b => {
                    const isSelected = selectedBranch === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => handleBranchSelect(b)}
                        className={`w-[240px] sm:w-[270px] p-2.5 sm:p-3 rounded-2xl border text-xs shrink-0 cursor-pointer transition-all active:scale-95 ${
                          isSelected
                            ? 'border-transparent text-white shadow-lg ring-1 ring-white/30'
                            : 'bg-neutral-900/90 border-neutral-800/90 hover:border-neutral-700 text-neutral-300'
                        }`}
                        style={isSelected ? {
                          backgroundColor: 'var(--brand-primary, #f59e0b)',
                          boxShadow: '0 8px 20px -4px var(--brand-primary-shadow, rgba(245, 158, 11, 0.4))'
                        } : undefined}
                      >
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="font-extrabold truncate max-w-[130px] opacity-95">
                            {b.tag || 'Tawi la Kookoos'}
                          </span>
                          <span className="font-mono text-[9px] opacity-80">{b.hours}</span>
                        </div>
                        <div className="font-extrabold text-white text-xs truncate flex items-center space-x-1">
                          <span>{b.name}</span>
                        </div>
                        <div className="text-[11px] truncate mt-0.5 opacity-90">
                          {b.area}
                        </div>

                        {isSelected && (
                          <div className="flex items-center space-x-1.5 mt-2 pt-1.5 border-t border-white/20">
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="flex-1 py-1 px-2 rounded-lg bg-black/30 hover:bg-black/50 text-white font-extrabold text-[10px] flex items-center justify-center space-x-1"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>Nielekeze</span>
                            </a>
                            {b.phone && (
                              <a
                                href={`tel:${b.phone}`}
                                onClick={e => e.stopPropagation()}
                                className="py-1 px-2 rounded-lg bg-black/30 hover:bg-black/50 text-white font-bold text-[10px] flex items-center justify-center space-x-1"
                              >
                                <Phone className="w-3 h-3" />
                                <span>Piga</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
