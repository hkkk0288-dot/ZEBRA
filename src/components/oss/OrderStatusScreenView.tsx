import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import {
  Tv,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Utensils,
  CheckCircle2,
  ArrowRight,
  Plus,
  Search,
  Users,
  ShoppingBag,
  Truck,
  RotateCcw,
  BellRing,
  AlertCircle,
  HelpCircle,
  QrCode
} from 'lucide-react';

interface OssTokenItem {
  id: string;
  tokenNumber: string;
  status: 'preparing' | 'ready' | 'served';
  type: 'dine_in' | 'waiting_line' | 'delivery';
  locationInfo: string;
  dishNames?: string;
  timeElapsed: number; // in minutes
  estimatedTotal: number;
}

const INITIAL_TOKENS: OssTokenItem[] = [
  { id: 't1', tokenNumber: '0104', status: 'preparing', type: 'dine_in', locationInfo: 'Meza 4 (VIP)', dishNames: 'Grilled Mixed Platter', timeElapsed: 7, estimatedTotal: 12 },
  { id: 't2', tokenNumber: '1020', status: 'preparing', type: 'waiting_line', locationInfo: 'Mstari #2 (Kaunta)', dishNames: 'Zebra Beef Burger + Chips', timeElapsed: 4, estimatedTotal: 8 },
  { id: 't3', tokenNumber: '0123', status: 'preparing', type: 'dine_in', locationInfo: 'Meza 2 (Dirishani)', dishNames: 'Samaki wa Kupaka', timeElapsed: 9, estimatedTotal: 15 },
  { id: 't4', tokenNumber: '0126', status: 'preparing', type: 'waiting_line', locationInfo: 'Mstari #5 (Takeaway)', dishNames: 'Chicken Biryani Special', timeElapsed: 3, estimatedTotal: 10 },
  { id: 't5', tokenNumber: '0130', status: 'preparing', type: 'delivery', locationInfo: 'Bodaboda - Mikocheni', dishNames: 'Swahili Coconut Fish', timeElapsed: 11, estimatedTotal: 16 },
  { id: 't6', tokenNumber: '0131', status: 'preparing', type: 'dine_in', locationInfo: 'Meza 7 (Bustani)', dishNames: 'Crispy Wings & Fries', timeElapsed: 2, estimatedTotal: 7 },
  
  // Ready tokens
  { id: 't7', tokenNumber: '0105', status: 'ready', type: 'dine_in', locationInfo: 'Meza 1 (Ndani)', dishNames: 'Chips Mayai Special', timeElapsed: 14, estimatedTotal: 14 },
  { id: 't8', tokenNumber: '0107', status: 'ready', type: 'waiting_line', locationInfo: 'Mstari #1 (Takeaway)', dishNames: 'Zebra Cheeseburger', timeElapsed: 9, estimatedTotal: 9 },
  { id: 't9', tokenNumber: '1030', status: 'ready', type: 'dine_in', locationInfo: 'Meza 6 (Ghorofani)', dishNames: 'Nyama Choma Ribs', timeElapsed: 18, estimatedTotal: 18 },
  { id: 't10', tokenNumber: '0124', status: 'ready', type: 'waiting_line', locationInfo: 'Mstari #3 (Kaunta)', dishNames: 'Passion Juice + Pizza', timeElapsed: 12, estimatedTotal: 12 },
  { id: 't11', tokenNumber: '0125', status: 'ready', type: 'delivery', locationInfo: 'Bodaboda - Masaki', dishNames: 'Chef Special Mishkaki', timeElapsed: 15, estimatedTotal: 15 }
];

export const OrderStatusScreenView: React.FC = () => {
  const { menuItems, currency, orders, setActiveTab, activeTable } = useApp();

  const [tokens, setTokens] = useState<OssTokenItem[]>(INITIAL_TOKENS);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Customer Token Search State (Requested: Customers can track their token from table or waiting line)
  const [searchTokenInput, setSearchTokenInput] = useState('');
  const [activeSearchedToken, setActiveSearchedToken] = useState<string | null>(null);
  const [tokenTypeFilter, setTokenTypeFilter] = useState<'all' | 'dine_in' | 'waiting_line' | 'delivery'>('all');

  // Staff manual add token state
  const [newTokenInput, setNewTokenInput] = useState('');
  const [newTokenType, setNewTokenType] = useState<'dine_in' | 'waiting_line' | 'delivery'>('dine_in');
  const [lastReadyToken, setLastReadyToken] = useState<string | null>(null);

  // Clock interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync real-time orders from AppContext into OSS Tokens
  useEffect(() => {
    if (!orders || orders.length === 0) return;

    setTokens(prevTokens => {
      const updated = [...prevTokens];

      orders.forEach(order => {
        // Extract token number from delivery address or orderNumber
        const match = order.deliveryAddress?.match(/Token #([0-9A-Z]+)/);
        const tokenNum = match ? match[1] : order.orderNumber?.slice(-4) || '0101';
        
        let type: 'dine_in' | 'waiting_line' | 'delivery' = 'waiting_line';
        if (order.deliveryAddress?.toLowerCase().includes('dine-in') || order.deliveryAddress?.toLowerCase().includes('meza')) {
          type = 'dine_in';
        } else if (order.deliveryAddress?.toLowerCase().includes('delivery') || order.deliveryAddress?.toLowerCase().includes('bodaboda')) {
          type = 'delivery';
        }

        const existingIdx = updated.findIndex(t => t.tokenNumber === tokenNum);
        const statusMap: 'preparing' | 'ready' | 'served' = 
          order.status === 'delivered' ? 'served' : ((order.status as string) === 'ready' || order.status === 'on_the_way' ? 'ready' : 'preparing');

        const dishSummary = order.items.map(i => `${i.quantity}x ${i.menuItem?.name || i.item?.name || 'Dish'}`).slice(0, 2).join(', ');

        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            status: statusMap,
            dishNames: dishSummary || updated[existingIdx].dishNames
          };
        } else {
          updated.unshift({
            id: `order_${order.id}`,
            tokenNumber: tokenNum,
            status: statusMap,
            type,
            locationInfo: type === 'dine_in' ? 'Mezani (Table Dine-In)' : (type === 'delivery' ? 'Bodaboda Express' : 'Mstari wa Kusubiri'),
            dishNames: dishSummary,
            timeElapsed: 2,
            estimatedTotal: 10
          });
        }
      });

      return updated;
    });
  }, [orders]);

  // Audio Chime when token becomes ready
  const playReadyChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      osc2.frequency.setValueAtTime(880, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.4); // D6

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.9);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.9);
      osc2.stop(ctx.currentTime + 0.9);
    } catch (e) {
      console.warn('Audio notice:', e);
    }
  };

  // Move token from preparing to ready
  const handleMoveToReady = (tokenNumber: string) => {
    setTokens(prev =>
      prev.map(t => (t.tokenNumber === tokenNumber ? { ...t, status: 'ready' } : t))
    );
    setLastReadyToken(tokenNumber);
    playReadyChime();
  };

  // Add new token manually
  const handleAddToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenInput.trim()) return;
    const token = newTokenInput.trim();

    const locationLabel = newTokenType === 'dine_in' 
      ? 'Mezani (Table Dine-In)' 
      : (newTokenType === 'delivery' ? 'Bodaboda Express' : 'Mstari wa Kusubiri');

    const newTok: OssTokenItem = {
      id: `tok_${Date.now()}`,
      tokenNumber: token,
      status: 'preparing',
      type: newTokenType,
      locationInfo: locationLabel,
      timeElapsed: 1,
      estimatedTotal: 10
    };

    setTokens(prev => [newTok, ...prev]);
    setNewTokenInput('');
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Filtered tokens
  const filteredTokens = useMemo(() => {
    return tokens.filter(t => {
      if (tokenTypeFilter === 'all') return true;
      return t.type === tokenTypeFilter;
    });
  }, [tokens, tokenTypeFilter]);

  const preparingList = filteredTokens.filter(t => t.status === 'preparing');
  const readyList = filteredTokens.filter(t => t.status === 'ready');

  // Customer Searched Token details
  const matchedCustomerToken = useMemo(() => {
    if (!activeSearchedToken) return null;
    return tokens.find(
      t => t.tokenNumber.toLowerCase() === activeSearchedToken.toLowerCase()
    );
  }, [tokens, activeSearchedToken]);

  // Handle Token Search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTokenInput.trim()) {
      setActiveSearchedToken(null);
      return;
    }
    setActiveSearchedToken(searchTokenInput.trim());
  };

  const popularItems = menuItems.slice(0, 6);

  return (
    <div
      className={`w-full min-h-[calc(100vh-80px)] flex flex-col bg-[#0b0e14] text-white ${
        isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto' : ''
      }`}
    >
      {/* Top Banner Header */}
      <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#121926] via-[#101520] to-[#121926] border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-lg">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-neutral-950 font-black flex items-center justify-center text-base shadow-md shadow-teal-500/30">
              📺
            </div>
            <h1 className="text-lg sm:text-xl font-black font-display tracking-tight text-white">
              Order Status Screen (OSS)
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30 animate-pulse">
              LIVE TV QUEUE
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Customers can see their order's current progress in real-time by the token number in OSS Screen from the table or waiting line.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono font-bold text-teal-400">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>{currentTime}</span>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500'
            }`}
            title={soundEnabled ? 'Sauti ya kengele imewashwa' : 'Sauti imezimwa'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Skrini Kamili (TV Fullscreen Display)"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pos')}
            className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold flex items-center space-x-1 shadow-md shadow-teal-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <span>POS Terminal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Customer Token Tracker Bar (Primary Requested Feature) */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#0f1422] border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
            <input
              type="text"
              value={searchTokenInput}
              onChange={e => setSearchTokenInput(e.target.value)}
              placeholder="Ingiza Token Yako (e.g. 0104, 1020, 0124) kutoka Mezani au Mstari..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-neutral-900 border border-teal-500/40 text-xs font-mono font-bold text-white placeholder-neutral-500 outline-none focus:border-teal-400"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
          >
            Fuatilia Token
          </button>
          {activeSearchedToken && (
            <button
              type="button"
              onClick={() => {
                setActiveSearchedToken(null);
                setSearchTokenInput('');
              }}
              className="px-2 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-xs font-bold transition-colors cursor-pointer"
            >
              Futa
            </button>
          )}
        </form>

        {/* Filter Pills for Table vs Waiting Line */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
          <button
            type="button"
            onClick={() => setTokenTypeFilter('all')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tokenTypeFilter === 'all'
                ? 'bg-white text-neutral-950 font-black'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            Token Zote ({tokens.length})
          </button>

          <button
            type="button"
            onClick={() => setTokenTypeFilter('dine_in')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
              tokenTypeFilter === 'dine_in'
                ? 'bg-emerald-500 text-neutral-950 font-black'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Utensils className="w-3 h-3" />
            <span>Mezani (Dine-In)</span>
          </button>

          <button
            type="button"
            onClick={() => setTokenTypeFilter('waiting_line')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
              tokenTypeFilter === 'waiting_line'
                ? 'bg-amber-400 text-neutral-950 font-black'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Mstari wa Kusubiri (Takeaway)</span>
          </button>
        </div>
      </div>

      {/* Real-time Customer Token Progress Spotlight (When Searched or Active) */}
      {matchedCustomerToken ? (
        <div className="mx-4 sm:mx-6 mt-4 p-4 rounded-3xl bg-gradient-to-r from-[#142033] to-[#122428] border-2 border-teal-500/60 shadow-2xl animate-scale-in">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500 text-neutral-950 flex flex-col items-center justify-center font-mono font-black shadow-lg shadow-teal-500/30">
                <span className="text-[10px] uppercase font-bold tracking-wider">TOKEN</span>
                <span className="text-xl">#{matchedCustomerToken.tokenNumber}</span>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-extrabold text-white">
                    Hali ya Oda Yako Sasa (Current Order Progress)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold text-[10px] border border-teal-500/40">
                    {matchedCustomerToken.locationInfo}
                  </span>
                </div>
                {matchedCustomerToken.dishNames && (
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Vyakula: <strong>{matchedCustomerToken.dishNames}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Status Phase Badge */}
            <div className="flex items-center space-x-3">
              {matchedCustomerToken.status === 'preparing' ? (
                <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300">
                  <Utensils className="w-5 h-5 animate-bounce" />
                  <div>
                    <div className="font-black text-xs uppercase tracking-wider">INATAYARISHWA JIKONI</div>
                    <div className="text-[10px] text-amber-200/80">Muda uliokadiriwa: Dakika 4 - 7</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-emerald-500 text-neutral-950 font-black animate-pulse shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5" />
                  <div>
                    <div className="text-xs uppercase tracking-wider">IPO TAYARI KUCHUKULIWA!</div>
                    <div className="text-[10px] font-bold">Tafadhali nenda kaunta au mhudumu analeta mezani!</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="mt-3.5">
            <div className="flex justify-between text-[11px] font-bold mb-1 text-neutral-400">
              <span>Hatua 1: Imepokelewa</span>
              <span className={matchedCustomerToken.status === 'preparing' ? 'text-amber-400' : 'text-emerald-400'}>
                {matchedCustomerToken.status === 'preparing' ? 'Hatua 2: Mpishi Anaandaa Jikoni 🍳' : 'Hatua 3: Tayari Mezani / Kaunta 🎉'}
              </span>
              <span>Hatua 4: Kukamilika</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-neutral-900 overflow-hidden p-0.5 border border-neutral-700">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  matchedCustomerToken.status === 'preparing'
                    ? 'w-3/5 bg-gradient-to-r from-teal-500 to-amber-400 animate-pulse'
                    : 'w-full bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
              />
            </div>
          </div>
        </div>
      ) : activeSearchedToken ? (
        <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Hatujaona token #{activeSearchedToken}. Hakikisha namba uliyoingiza inafanana na iliyo kwenye risiti au oda yako.</span>
        </div>
      ) : null}

      {/* Main OSS Display: Two-Column Layout */}
      <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        {/* LEFT COLUMN: Popular Menu Items Showcase */}
        <div className="lg:col-span-5 xl:col-span-4 bg-[#101522] rounded-3xl border border-neutral-800/90 shadow-2xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 shrink-0">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="font-black text-base text-white tracking-wide">
                Special Dishes & Specials
              </h2>
            </div>
            <span className="text-xs text-neutral-400 font-medium">Zebra Menu</span>
          </div>

          {/* Food Items Showcase Grid */}
          <div className="flex-1 py-4 grid grid-cols-2 gap-3 overflow-y-auto">
            {popularItems.map(dish => {
              const price = currency === 'TZS' ? dish.priceTZS : (dish.priceUSD ?? dish.price);
              return (
                <div
                  key={dish.id}
                  className="bg-[#141b2a] border border-neutral-800/80 rounded-2xl p-2.5 flex flex-col justify-between group hover:border-teal-500/40 transition-all shadow-md"
                >
                  <div className="w-full h-20 rounded-xl overflow-hidden mb-2 bg-neutral-900">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-white line-clamp-1">{dish.name}</h3>
                    <p className="text-[10px] text-neutral-400 line-clamp-1">
                      {dish.swahiliName || dish.category}
                    </p>
                  </div>
                  <div className="mt-2 pt-1 border-t border-neutral-800 text-xs font-black text-teal-400">
                    {formatPrice(price, currency)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Notice Card */}
          <div className="p-3 bg-neutral-900/90 border border-neutral-800 rounded-2xl flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2 text-xs text-neutral-300">
              <span className="text-base">🔔</span>
              <span>Sauti ya kengele hulia token yako ikikamilika</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 cursor-pointer"
            >
              Weka Oda
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Split Token Status (Preparing vs Ready) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-[#101522] rounded-3xl border border-neutral-800/90 shadow-2xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
          {/* Quick Staff Controls to add token manually */}
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-neutral-800 gap-2 shrink-0">
            <div className="flex items-center space-x-2">
              <h2 className="font-black text-base text-white">Live Kitchen & Counter Queue</h2>
              <span className="text-xs text-neutral-400">({filteredTokens.length} active orders)</span>
            </div>

            <form onSubmit={handleAddToken} className="flex items-center space-x-1.5">
              <select
                value={newTokenType}
                onChange={e => setNewTokenType(e.target.value as any)}
                className="px-2 py-1 text-[11px] rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 outline-none cursor-pointer"
              >
                <option value="dine_in">Mezani</option>
                <option value="waiting_line">Mstari</option>
                <option value="delivery">Delivery</option>
              </select>

              <input
                type="text"
                value={newTokenInput}
                onChange={e => setNewTokenInput(e.target.value)}
                placeholder="Token # (e.g. 0136)"
                className="px-2.5 py-1 text-xs rounded-xl bg-neutral-900 border border-neutral-700 text-white outline-none w-28 focus:border-teal-500 font-mono"
              />
              <button
                type="submit"
                className="p-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold cursor-pointer"
                title="Ongeza Token ya Kupikwa Jikoni"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Side-by-Side Split Columns: Preparing (Teal) vs Ready (Green) */}
          <div className="flex-1 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 overflow-hidden">
            {/* Column 1: Preparing (Inaandaliwa Jikoni) */}
            <div className="flex flex-col bg-[#0b0f17] rounded-2xl border border-teal-500/30 overflow-hidden shadow-inner">
              <div className="py-2.5 px-3 bg-teal-500 text-white font-black text-sm tracking-wide uppercase text-center shadow-md flex items-center justify-center space-x-1.5 shrink-0">
                <Utensils className="w-4 h-4 animate-spin" />
                <span>Preparing ({preparingList.length})</span>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                {preparingList.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-xs text-neutral-500 font-medium">
                    Hakuna oda zinazopikwa kwa sasa
                  </div>
                ) : (
                  preparingList.map(tok => {
                    const isSelected = activeSearchedToken === tok.tokenNumber;
                    return (
                      <div
                        key={tok.id}
                        onClick={() => handleMoveToReady(tok.tokenNumber)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer active:scale-95 group relative shadow-md ${
                          isSelected
                            ? 'bg-teal-500/25 border-teal-400 ring-2 ring-teal-400'
                            : 'bg-[#141b28] hover:bg-teal-500/15 border-neutral-800 hover:border-teal-500/40'
                        }`}
                        title="Bofya kuhamisha kwenda 'Ready'"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-2xl text-teal-300 tracking-wider">
                            #{tok.tokenNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-300">
                            {tok.locationInfo}
                          </span>
                        </div>

                        {tok.dishNames && (
                          <p className="text-[11px] text-neutral-400 line-clamp-1 mt-1 font-sans">
                            {tok.dishNames}
                          </p>
                        )}

                        <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-800/80">
                          <span>⏳ Inapikwa ({tok.timeElapsed}m zilizopita)</span>
                          <span className="text-teal-400 font-bold group-hover:underline">
                            Weka Ready ➔
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Column 2: Ready (Ipo Tayari Kuchukuliwa / Mezani) */}
            <div className="flex flex-col bg-[#0b0f17] rounded-2xl border border-emerald-500/40 overflow-hidden shadow-inner">
              <div className="py-2.5 px-3 bg-emerald-500 text-neutral-950 font-black text-sm tracking-wide uppercase text-center shadow-md flex items-center justify-center space-x-1.5 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ready ({readyList.length})</span>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                {readyList.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-xs text-neutral-500 font-medium">
                    Hakuna oda zilizo tayari kusubiri
                  </div>
                ) : (
                  readyList.map(tok => {
                    const isSelected = activeSearchedToken === tok.tokenNumber;
                    const isNewlyReady = lastReadyToken === tok.tokenNumber;

                    return (
                      <div
                        key={tok.id}
                        className={`p-3 rounded-2xl border transition-all shadow-md ${
                          isNewlyReady
                            ? 'bg-emerald-500/30 border-emerald-400 ring-2 ring-emerald-400 animate-pulse'
                            : isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400'
                            : 'bg-[#12231b] border-emerald-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-2xl text-emerald-400 tracking-wider">
                            #{tok.tokenNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-black text-emerald-300">
                            {tok.locationInfo}
                          </span>
                        </div>

                        {tok.dishNames && (
                          <p className="text-[11px] text-neutral-300 line-clamp-1 mt-1 font-sans">
                            {tok.dishNames}
                          </p>
                        )}

                        <div className="mt-2 flex items-center justify-between text-[10px] text-emerald-400/90 pt-1 border-t border-emerald-500/20">
                          <span>🔔 Tayari Kuchukua / Mezani</span>
                          <span className="font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-md">
                            Chukua Sasa
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Footer Guide for Table and Waiting Line Customers */}
          <div className="pt-2 text-center text-xs text-neutral-400 shrink-0 border-t border-neutral-800">
            Wateja wa Mezani na Mstari wa Kusubiri: Namba yako ikitokea kwenye safu ya kijani <strong>(Ready)</strong>, mhudumu analeta chakula mezani au nenda kaunta ya kuchukulia.
          </div>
        </div>
      </div>
    </div>
  );
};
