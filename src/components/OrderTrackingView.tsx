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
  ChevronRight
} from 'lucide-react';
import { OrderStatus } from '../types';
import confetti from 'canvas-confetti';

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
    addToCart
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
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-500/30"
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
      {/* Header */}
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
          title="Advance delivery status (Demo Simulator)"
          className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-2.5 py-1.5 rounded-full border border-emerald-500/30 flex items-center space-x-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Step</span>
        </button>
      </div>

      <div className="px-5 space-y-5">
        {/* Interactive Delivery Map Simulation */}
        <div className="relative w-full h-52 rounded-3xl overflow-hidden border border-neutral-800 shadow-xl bg-neutral-900">
          {/* Stylized SVG Map Graphics */}
          <svg className="w-full h-full object-cover" viewBox="0 0 400 220">
            {/* Background Grid & Roads */}
            <rect width="400" height="220" fill={isDark ? '#14161b' : '#e5e7eb'} />
            
            {/* Road vectors */}
            <path
              d="M 20,40 Q 120,60 200,40 T 380,50"
              fill="none"
              stroke={isDark ? '#262933' : '#cbd5e1'}
              strokeWidth="16"
            />
            <path
              d="M 50,200 Q 160,140 220,160 T 360,180"
              fill="none"
              stroke={isDark ? '#262933' : '#cbd5e1'}
              strokeWidth="16"
            />
            <path
              d="M 40,30 C 80,110 120,130 180,100 S 280,140 340,180"
              fill="none"
              stroke={isDark ? '#2c313d' : '#cbd5e1'}
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Active Delivery Route Line (Glowing Emerald) */}
            <path
              d="M 60,60 C 120,120 180,90 260,130 S 320,160 340,170"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />

            {/* Restaurant Pin Origin */}
            <g transform="translate(60, 60)">
              <circle r="16" fill="#f59e0b" opacity="0.25" />
              <circle r="10" fill="#f59e0b" />
              <text x="0" y="4" textAnchor="middle" fontSize="10" fill="#fff">🍕</text>
            </g>

            {/* Customer Home Pin */}
            <g transform="translate(340, 170)">
              <circle r="18" fill="#10b981" opacity="0.25" />
              <circle r="11" fill="#10b981" />
              <text x="0" y="4" textAnchor="middle" fontSize="11" fill="#fff">📍</text>
            </g>

            {/* Moving Courier Rider */}
            <g
              transform={`translate(${60 + (340 - 60) * (courierProgress / 100)}, ${
                60 + (170 - 60) * (courierProgress / 100)
              })`}
              className="transition-all duration-1000 ease-out"
            >
              <circle r="16" fill="#10b981" opacity="0.3" className="animate-ping" />
              <circle r="13" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
              <text x="0" y="4" textAnchor="middle" fontSize="12" fill="#fff">🛵</text>
            </g>
          </svg>

          {/* Floating ETA overlay card */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center space-x-2 text-white text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold">
              {order.status === 'delivered'
                ? 'Arrived & Delivered'
                : `Estimated Delivery: ~${order.rider?.currentEtaMinutes || 12} mins`}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px] text-amber-400 font-semibold">
            Masaki Peninsula
          </div>
        </div>

        {/* Courier Rider Contact Card */}
        {order.rider && (
          <div
            className={`p-4 rounded-3xl border flex items-center justify-between ${
              isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-emerald-500/50">
                <img
                  src={order.rider.photo}
                  alt={order.rider.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                  {order.rider.name}
                </h4>
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

        {/* Order Progress Stepper */}
        <div
          className={`p-5 rounded-3xl border space-y-4 ${
            isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <h3 className="text-sm font-bold font-display text-neutral-900 dark:text-white">
            Order Status
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
                    <p className="text-[11px] text-neutral-400 mt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* USSD / Payment Details Badge */}
        <div
          className={`p-4 rounded-3xl border ${
            isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-neutral-400">Payment Status:</span>
            <span
              className={`font-bold px-2.5 py-0.5 rounded-full ${
                order.paymentStatus === 'paid'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {order.paymentStatus.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Method:</span>
            <span className="font-medium text-neutral-200">
              {order.paymentMethod === 'ussd_mpesa'
                ? 'Vodacom M-Pesa (*150*00#)'
                : order.paymentMethod.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {order.ussdDetails?.referenceCode && (
            <div className="flex items-center justify-between text-xs text-neutral-400 mt-1">
              <span>USSD Reference:</span>
              <span className="font-mono font-bold text-amber-400">
                {order.ussdDetails.referenceCode}
              </span>
            </div>
          )}

          <div className="border-t border-neutral-800 mt-3 pt-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Total Paid:</span>
            <span className="font-bold text-sm text-emerald-500 font-display">
              {formatPrice(order.total, currency)}
            </span>
          </div>
        </div>

        {/* Ordered Items List */}
        <div
          className={`p-4 rounded-3xl border space-y-3 ${
            isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
          }`}
        >
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Items in this order ({order.items.length})
          </h3>

          <div className="space-y-2">
            {order.items.map(ci => (
              <div
                key={ci.cartItemId}
                className="flex items-center justify-between py-1.5 border-b border-neutral-800/40 last:border-none"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-bold text-emerald-500">
                    {ci.quantity}x
                  </span>
                  <span className="text-xs font-medium text-neutral-900 dark:text-neutral-200">
                    {ci.menuItem.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                    {formatPrice(ci.totalPrice, currency)}
                  </span>
                  <button
                    onClick={() => handleReorder(ci)}
                    className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full hover:bg-emerald-500/20"
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
          <div>
            <h4 className="text-xs font-bold text-neutral-400 mb-2">Previous Orders</h4>
            <div className="space-y-2">
              {orders
                .filter(o => o.id !== order.id)
                .map(prevOrd => (
                  <div
                    key={prevOrd.id}
                    onClick={() => setActiveOrder(prevOrd)}
                    className="flex items-center justify-between p-3 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 cursor-pointer transition-colors"
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
  );
};
