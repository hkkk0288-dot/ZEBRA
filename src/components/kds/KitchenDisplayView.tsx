import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import {
  Utensils,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bell,
  Volume2,
  VolumeX,
  Tv,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ChefHat
} from 'lucide-react';

export const KitchenDisplayView: React.FC = () => {
  const { orders, tableOrders, updateOrderStatus, setActiveTab, currency } = useApp();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'preparing' | 'ready'>('all');

  // Ring Kitchen Bell
  const ringKitchenBell = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn('Audio notice:', e);
    }
  };

  const handleAdvanceStatus = (orderId: string, currentStatus: string) => {
    if (currentStatus === 'pending') {
      updateOrderStatus(orderId, 'preparing');
    } else if (currentStatus === 'preparing') {
      updateOrderStatus(orderId, 'on_the_way');
      if (soundEnabled) ringKitchenBell();
    } else if (currentStatus === 'on_the_way') {
      updateOrderStatus(orderId, 'delivered');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filterType === 'preparing') return o.status === 'preparing' || o.status === 'pending';
    if (filterType === 'ready') return o.status === 'on_the_way' || o.status === 'delivered';
    return true;
  });

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#0d111a] text-white p-4 sm:p-6 flex flex-col">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-neutral-800 gap-3 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-neutral-950 font-black flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
            🍳
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-black font-display text-white">
                Kitchen Display System (KDS)
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-[10px] border border-amber-500/30">
                WAPISHI JIKONI
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Dhibiti maagizo ya vyakula yanayopikwa na yapo tayari kwa wateja
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500'
            }`}
            title="Kengele ya Oda"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Shortcut to OSS */}
          <button
            type="button"
            onClick={() => setActiveTab('oss')}
            className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Tazama OSS Screen</span>
          </button>

          {/* Shortcut to POS */}
          <button
            type="button"
            onClick={() => setActiveTab('pos')}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-all cursor-pointer"
          >
            Nenda POS
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 my-4">
        {(['all', 'preparing', 'ready'] as const).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilterType(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              filterType === tab
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/30 font-black'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {tab === 'all' ? 'Oda Zote' : tab === 'preparing' ? 'Inaandaliwa (Cooking)' : 'Ipo Tayari (Ready)'}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-center text-neutral-500">
            <ChefHat className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-bold text-sm">Hakuna maagizo kwa sasa jikoni</p>
            <p className="text-xs text-neutral-600 mt-1">Oda mpya zikitumwa kutoka POS au App zitatokea hapa moja kwa moja.</p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const isCooking = order.status === 'preparing' || order.status === 'pending';
            const isReady = order.status === 'on_the_way' || order.status === 'delivered';
            const addressStr = order.deliveryAddress || order.customer?.address || '';
            const tokenMatch = addressStr.match(/Token #([0-9A-Z]+)/);
            const token = tokenMatch ? tokenMatch[1] : order.orderNumber?.slice(-4);

            return (
              <div
                key={order.id}
                className={`rounded-2xl border p-4 flex flex-col justify-between transition-all shadow-xl ${
                  isCooking
                    ? 'bg-[#141b29] border-teal-500/40 shadow-teal-500/5'
                    : 'bg-[#111f19] border-emerald-500/40 shadow-emerald-500/5'
                }`}
              >
                <div>
                  {/* Card Header with Token Badge */}
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-xl bg-teal-500/20 text-teal-400 font-mono font-black text-sm border border-teal-500/30">
                        #{token}
                      </span>
                      <span className="font-bold text-xs text-white">
                        {order.orderType === 'pickup' ? 'Takeaway' : (order.orderType === 'dine_in' ? 'Mezani' : 'Delivery')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-[11px] text-neutral-400 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{order.date?.split(',')[1] || 'Sasa hivi'}</span>
                    </div>
                  </div>

                  {/* Customer / Address */}
                  <div className="py-2 text-xs text-neutral-400 border-b border-neutral-800/60">
                    <p className="font-bold text-white truncate">{order.customer?.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{addressStr}</p>
                  </div>

                  {/* Dish Items */}
                  <div className="py-2.5 space-y-1.5 max-h-48 overflow-y-auto">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs">
                        <span className="w-5 h-5 rounded-md bg-neutral-800 text-teal-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                          {item.quantity}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white truncate">{item.menuItem?.name || item.name || 'Dish'}</p>
                          {item.specialInstructions && (
                            <p className="text-[10px] text-amber-400 italic">
                              * {item.specialInstructions}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Action Button */}
                <div className="pt-3 border-t border-neutral-800/80">
                  {isCooking ? (
                    <button
                      type="button"
                      onClick={() => handleAdvanceStatus(order.id, order.status)}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black text-xs shadow-md shadow-emerald-500/30 flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ipo Tayari (Mark as Ready)</span>
                    </button>
                  ) : (
                    <div className="py-2 text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      ✓ Ipo Tayari / Imekabidhiwa
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
