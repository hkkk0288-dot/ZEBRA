import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  Bike,
  Utensils,
  MapPin,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { OrderStatus } from '../types';
import confetti from 'canvas-confetti';
import { DarEsSalaamMap } from './DarEsSalaamMap';

export const OrderTrackingView: React.FC = () => {
  const {
    orders,
    activeOrder,
    setActiveOrder,
    updateOrderStatus,
    currency,
    setActiveTab,
    theme,
    setSelectedDish,
    addToCart,
    androidFrame
  } = useApp();

  const isDark = theme === 'dark';
  const order = activeOrder || orders[0];

  // Rider animated progress on the map
  const [courierProgress, setCourierProgress] = useState(65);

  useEffect(() => {
    if (order?.status === 'on_the_way') {
      const interval = setInterval(() => {
        setCourierProgress(prev => (prev >= 95 ? 40 : prev + 3));
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [order?.status]);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 text-3xl">
          📦
        </div>
        <h2 className="text-xl font-bold font-display text-neutral-900 dark:text-white mb-2">
          No Orders Yet
        </h2>
        <p className="text-sm text-neutral-500 max-w-xs mb-6">
          Order something delicious from Zebra Restaurant to track your delivery in real-time!
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-500/30 text-xs"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
    { key: 'pending', label: 'Order Received', desc: 'Sent to restaurant kitchen', icon: Clock },
    { key: 'preparing', label: 'Preparing Food', desc: 'Chef is cooking your meal', icon: Utensils },
    { key: 'on_the_way', label: 'Out for Delivery', desc: 'Courier is heading to you', icon: Bike },
    { key: 'delivered', label: 'Delivered', desc: 'Enjoy your delicious feast!', icon: CheckCircle2 }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 0;
      case 'preparing': return 1;
      case 'on_the_way': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  const handleSimulateNextStatus = () => {
    const sequence: OrderStatus[] = ['pending', 'preparing', 'on_the_way', 'delivered'];
    const nextIdx = (currentStepIdx + 1) % sequence.length;
    const nextStatus = sequence[nextIdx];
    updateOrderStatus(order.id, nextStatus);

    if (nextStatus === 'delivered') {
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch {}
    }
  };

  const handleReorder = (item: any) => {
    addToCart(item.menuItem, item.selectedSize, item.selectedIngredients, item.quantity);
    setActiveTab('cart');
  };

  return (
    <div className="flex flex-col min-h-screen pb-32">
      {/* Mobile Header (only in mobile frame) */}
      {androidFrame && (
        <div
          className={`sticky top-0 z-20 flex items-center justify-between px-5 py-4 transition-colors ${
            isDark ? 'bg-[#0f0f11]/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'
          }`}
        >
          <button
            onClick={() => setActiveTab('home')}
            className={`p-2 rounded-full ${
              isDark ? 'hover:bg-neutral-800 text-neutral-200' : 'hover:bg-neutral-100 text-neutral-800'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h1 className="text-base font-bold font-display text-neutral-900 dark:text-white">
              Order Tracking
            </h1>
            <p className="text-[11px] font-mono text-emerald-500 font-semibold">
              {order.orderNumber}
            </p>
          </div>

          <button
            onClick={handleSimulateNextStatus}
            className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-[11px] font-bold flex items-center space-x-1"
            title="Simulate Next Status"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Step</span>
          </button>
        </div>
      )}

      {/* Main Tracking Content */}
      <div className={`w-full ${androidFrame ? 'px-4 space-y-4' : 'max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6'}`}>
        
        {/* Clean Breadcrumb & Order Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-neutral-800/80 pb-3 sm:pb-4 mb-4 sm:mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black font-display text-neutral-900 dark:text-white tracking-tight">
                Track Order Live
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                {order.orderNumber}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 flex flex-wrap items-center gap-1 sm:gap-2">
              <span>Inafika: <strong className="text-emerald-400 font-bold">{order.rider?.currentEtaMinutes ? `${order.rider.currentEtaMinutes} mins` : '15-20 mins'}</strong></span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-300 truncate max-w-xs">{order.customer?.address || 'Plot 44, Toure Drive, Masaki Peninsula'}</span>
            </p>
          </div>

          {/* Clean, discreet status stepper button (Not a giant intrusive banner) */}
          <div className="flex items-center self-start sm:self-auto">
            <button
              onClick={handleSimulateNextStatus}
              className="px-3 py-1.5 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 border border-neutral-700/70 transition-all active:scale-95 shadow-sm"
              title="Jaribu hatua inayofuata ya oda"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hatua: {steps[currentStepIdx]?.label}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className={androidFrame ? 'space-y-4' : 'lg:grid lg:grid-cols-12 lg:gap-8 items-start'}>
          
          {/* Left Column: Map & Courier Info */}
          <div className={androidFrame ? 'space-y-4' : 'lg:col-span-7 space-y-4 sm:space-y-5'}>
            {/* Live Dar es Salaam Interactive GPS Delivery Map */}
            <DarEsSalaamMap
              riderProgress={courierProgress}
              customerLocationName={order.customer?.address || 'Plot 44, Toure Drive, Masaki Peninsula'}
              orderNumber={order.orderNumber}
              etaMinutes={order.rider?.currentEtaMinutes || 8}
              compact={androidFrame}
            />

            {/* Rider Contact Card */}
            {order.rider && (
              <div
                className={`p-4 rounded-3xl border flex items-center justify-between ${
                  isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <img
                    src={order.rider.photo}
                    alt={order.rider.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                        {order.rider.name}
                      </h4>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-1.5 py-0.2 rounded">
                        Courier
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      {order.rider.vehicle} •{' '}
                      <span className="text-amber-400 font-semibold">★ {order.rider.rating}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={`tel:${order.rider.phone}`}
                    className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors"
                    title="Call Rider"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://wa.me/${order.rider.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-2xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white flex items-center justify-center transition-colors"
                    title="WhatsApp Rider"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Destination & Payment Details Card */}
            <div
              className={`p-5 rounded-3xl border space-y-3 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Delivery Details
                </span>
                <span className="text-xs text-emerald-400 font-semibold uppercase">
                  {order.paymentMethod.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-start space-x-2 text-xs text-neutral-700 dark:text-neutral-300">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{order.customer?.address || 'Dar es Salaam, Masaki'}</span>
              </div>

              {order.ussdDetails?.referenceCode && (
                <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800/40">
                  <span>USSD Reference (Lipa Namba 445566):</span>
                  <span className="font-mono font-bold text-amber-400">
                    {order.ussdDetails.referenceCode}
                  </span>
                </div>
              )}

              <div className="border-t border-neutral-800/40 pt-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-400">Total Paid:</span>
                <span className="font-bold text-base text-emerald-500 font-display">
                  {formatPrice(order.total, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Status Stepper & Ordered Items */}
          <div className={androidFrame ? 'space-y-4' : 'lg:col-span-5 space-y-5'}>
            
            {/* Order Progress Stepper */}
            <div
              className={`p-5 rounded-3xl border space-y-4 ${
                isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              <h3 className="text-sm font-bold font-display text-neutral-900 dark:text-white">
                Order Live Timeline
              </h3>

              <div className="relative pl-6 space-y-5">
                {/* Vertical connector line */}
                <div className="absolute top-2.5 bottom-2.5 left-[11px] w-0.5 bg-neutral-800 dark:bg-neutral-800"></div>

                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="relative flex items-start space-x-3">
                      {/* Step Dot */}
                      <div
                        className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/40'
                            : isDark
                            ? 'bg-neutral-900 border-neutral-700 text-neutral-600'
                            : 'bg-neutral-100 border-neutral-300 text-neutral-400'
                        }`}
                      >
                        <Icon className="w-3 h-3 stroke-[2.5]" />
                      </div>

                      <div>
                        <p
                          className={`text-xs font-bold leading-none ${
                            isCurrent
                              ? 'text-emerald-500'
                              : isCompleted
                              ? 'text-neutral-900 dark:text-white'
                              : 'text-neutral-400'
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ordered Items List */}
            <div
              className={`p-5 rounded-3xl border space-y-3 ${
                isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Items in this order ({order.items.length})
              </h3>

              <div className="space-y-2.5">
                {order.items.map(ci => (
                  <div
                    key={ci.cartItemId}
                    className="flex items-center justify-between py-2 border-b border-neutral-800/40 last:border-none"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-bold text-emerald-500">
                        {ci.quantity}x
                      </span>
                      <div>
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-200 block">
                          {ci.menuItem.name}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {ci.selectedSize.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {formatPrice(ci.totalPrice, currency)}
                      </span>
                      <button
                        onClick={() => handleReorder(ci)}
                        className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full hover:bg-emerald-500/20"
                      >
                        Reorder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Switch order if multiple orders exist */}
            {orders.length > 1 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Other Orders</h4>
                <div className="space-y-2">
                  {orders
                    .filter(o => o.id !== order.id)
                    .map(prevOrd => (
                      <div
                        key={prevOrd.id}
                        onClick={() => setActiveOrder(prevOrd)}
                        className="flex items-center justify-between p-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{prevOrd.orderNumber}</p>
                          <p className="text-[11px] text-neutral-400">{prevOrd.date}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-emerald-500">
                            {formatPrice(prevOrd.total, currency)}
                          </span>
                          <ChevronRight className="w-4 h-4 text-neutral-500" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
