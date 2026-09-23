import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import { ArrowLeft, Trash2, Tag, Plus, Minus, MapPin, Check, Smartphone, CreditCard, Banknote, ShieldCheck, UtensilsCrossed, QrCode } from 'lucide-react';
import { PaymentProvider } from '../types';
import { FoodImage } from './FoodImage';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedPromo,
    promoCodeInput,
    setPromoCodeInput,
    promoError,
    applyPromoCode,
    removePromoCode,
    subtotal,
    deliveryFee,
    discountAmount,
    totalAmount,
    currency,
    placeOrder,
    setActiveTab,
    setSelectedDish,
    theme,
    user,
    androidFrame,
    isLoggedIn,
    setAuthRedirectMessage,
    setPendingAction,
    setAuthMode,
    activeTable,
    setActiveTable,
    setShowCustomerTableModal,
    loyaltyPoints,
    redeemLoyaltyDiscount,
    setRedeemLoyaltyDiscount,
    loyaltyDiscountAmount,
    openSplitBill
  } = useApp();

  const isDark = theme === 'dark';
  const [diningMode, setDiningMode] = useState<'delivery' | 'dine_in'>(activeTable ? 'dine_in' : 'delivery');

  useEffect(() => {
    if (activeTable) {
      setDiningMode('dine_in');
    }
  }, [activeTable]);

  const [selectedPayment, setSelectedPayment] = useState<PaymentProvider>('mongike_mobile_money');
  const [deliveryAddress, setDeliveryAddress] = useState(
    user.addresses[0]?.street || 'Plot 44, Toure Drive, Masaki Peninsula, Dar es Salaam'
  );
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '+255 712 345 678');
  const [tableNotes, setTableNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effective delivery fee based on dining mode
  const effectiveDeliveryFee = diningMode === 'dine_in' ? 0 : deliveryFee;
  const effectiveTotal = Math.max(0, subtotal + effectiveDeliveryFee - discountAmount - loyaltyDiscountAmount);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!isLoggedIn) {
      setAuthRedirectMessage('Tafadhali jisajili au ingia kwanza kwenye akaunti yako ili ukamilishe malipo na kuagiza chakula chako.');
      setPendingAction({ type: 'checkout' });
      setAuthMode('login');
      setActiveTab('auth');
      return;
    }

    if (diningMode === 'dine_in' && !activeTable) {
      setShowCustomerTableModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await placeOrder({
        paymentMethod: selectedPayment,
        phoneNumber,
        deliveryAddress: diningMode === 'dine_in' ? `Meza: ${activeTable?.name} (Dine-In Masaki)` : deliveryAddress,
        notes: tableNotes,
        orderType: diningMode,
        tableNumber: activeTable?.name,
        tableId: activeTable?.id
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
          <span className="text-4xl">🛒</span>
        </div>
        <h2 className="text-xl font-bold font-display text-neutral-900 dark:text-neutral-100 mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mb-6">
          Explore our mouthwatering dishes, wood-fired pizzas, and Swahili specialties from Zebra Restaurant!
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-32">
      {/* Mobile Top Header (only in mobile frame) */}
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

          <h1 className="text-lg font-bold font-display text-neutral-900 dark:text-white">
            Cart
          </h1>

          <button
            onClick={clearCart}
            title="Clear Cart"
            className="p-2 rounded-full text-neutral-400 hover:text-rose-500 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main Responsive Cart Container */}
      <div className={`w-full ${androidFrame ? 'px-5 space-y-5' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
        
        {/* Full Web Breadcrumbs & Clear All Button */}
        {!androidFrame && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800/80">
            <div>
              <h1 className="text-2xl font-bold font-display text-neutral-900 dark:text-white tracking-tight">
                Review Your Order
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items in your basket from Zebra Restaurant
              </p>
            </div>

            <button
              onClick={clearCart}
              className="flex items-center space-x-1.5 text-xs font-semibold text-rose-500 hover:text-rose-400 px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Cart</span>
            </button>
          </div>
        )}

        {/* 2-Column Responsive Layout for Desktop, 1-Column for Phone Frame */}
        <div className={androidFrame ? 'space-y-5' : 'lg:grid lg:grid-cols-12 lg:gap-8 items-start'}>
          
          {/* Left Column: Items & Delivery Address */}
          <div className={androidFrame ? 'space-y-4' : 'lg:col-span-7 space-y-5'}>
            
            {/* Cart Items List */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Order Items ({cart.length})
              </h2>

              {cart.map(item => (
                <div
                  key={item.cartItemId}
                  className={`flex items-center justify-between p-4 rounded-3xl border transition-colors ${
                    isDark
                      ? 'bg-neutral-900/90 border-neutral-800'
                      : 'bg-white border-neutral-200 shadow-sm'
                  }`}
                >
                  {/* Image & details */}
                  <div
                    className="flex items-center space-x-3.5 cursor-pointer flex-1 mr-3"
                    onClick={() => setSelectedDish(item.menuItem)}
                  >
                    <div className="w-18 h-18 rounded-2xl overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700/40">
                      <FoodImage
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        category={item.menuItem.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                        {item.menuItem.name}
                      </h3>
                      {item.menuItem.swahiliName && (
                        <p className="text-xs text-amber-500 font-medium truncate">
                          {item.menuItem.swahiliName}
                        </p>
                      )}
                      <p className="text-[11px] text-neutral-400 truncate">
                        {item.selectedSize.name}
                        {item.selectedIngredients.length > 0 &&
                          ` + ${item.selectedIngredients.map(i => i.name).join(', ')}`}
                      </p>
                      <p className="text-sm font-extrabold text-emerald-500 mt-1">
                        {formatPrice(item.totalPrice, currency)}
                      </p>
                    </div>
                  </div>

                  {/* Stepper Pill */}
                  <div className="flex items-center bg-emerald-500 text-white rounded-2xl px-2 py-1 space-x-2.5 shadow-sm shadow-emerald-500/20 shrink-0">
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, -1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-emerald-600 rounded-lg transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>

                    <span className="font-bold text-xs w-4 text-center select-none">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-emerald-600 rounded-lg transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Dining Mode Selection: Mezani (Dine-In QR) vs Delivery */}
            <div
              className={`p-4 rounded-3xl border space-y-3 ${
                isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              <div className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                <span>Chaguo la Huduma / Service Type</span>
                {activeTable && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
                    Mezani: {activeTable.name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDiningMode('dine_in')}
                  className={`py-3 px-3 rounded-2xl border text-left transition-all flex flex-col items-center justify-center space-y-1 text-center cursor-pointer ${
                    diningMode === 'dine_in'
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                      : isDark
                      ? 'bg-neutral-800/60 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  <span className="font-bold text-xs">🍽️ Kula Mezani (Dine-In)</span>
                  <span className={`text-[10px] ${diningMode === 'dine_in' ? 'text-white/80' : 'text-emerald-500 font-semibold'}`}>
                    Delivery Bure (0 TZS)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDiningMode('delivery')}
                  className={`py-3 px-3 rounded-2xl border text-left transition-all flex flex-col items-center justify-center space-y-1 text-center cursor-pointer ${
                    diningMode === 'delivery'
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                      : isDark
                      ? 'bg-neutral-800/60 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="font-bold text-xs">🛵 Lete Mahali Nilipo</span>
                  <span className={`text-[10px] ${diningMode === 'delivery' ? 'text-white/80' : 'text-neutral-400'}`}>
                    Dar es Salaam Delivery
                  </span>
                </button>
              </div>

              {/* Dine-In Table Status and Selector */}
              {diningMode === 'dine_in' && (
                <div className="pt-2 space-y-2">
                  {activeTable ? (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                          ✓
                        </div>
                        <div>
                          <p className="font-bold text-xs text-neutral-900 dark:text-white">
                            {activeTable.name} • {activeTable.section}
                          </p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            Chakula kitaletwa moja kwa moja mezani kwako
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowCustomerTableModal(true)}
                        className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline px-2 py-1"
                      >
                        Badili Meza
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                      <div className="text-xs text-amber-700 dark:text-amber-400">
                        <span className="font-bold">Bado haujachagua meza!</span>
                        <p className="text-[10px] text-neutral-500">
                          Tafadhali chagua au changanua QR ya meza uliyoketi
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowCustomerTableModal(true)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors shrink-0"
                      >
                        Chagua Meza
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Maelekezo Maalum ya Mezani (Hiari)
                    </label>
                    <input
                      type="text"
                      value={tableNotes}
                      onChange={e => setTableNotes(e.target.value)}
                      placeholder="Mfano: Pili pili pembeni, vinywaji vitangulie kabla ya msosi"
                      className={`w-full p-2.5 rounded-xl text-xs outline-none border transition-colors ${
                        isDark
                          ? 'bg-neutral-800/80 border-neutral-700 text-white focus:border-emerald-500'
                          : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Address & Contact Section (shown if delivery mode) */}
            {diningMode === 'delivery' && (
              <div
                className={`p-5 rounded-3xl border space-y-3.5 ${
                  isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span>Delivery Location (Dar es Salaam)</span>
                </div>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  className={`w-full p-3 rounded-2xl text-xs outline-none border transition-colors ${
                    isDark
                      ? 'bg-neutral-800/80 border-neutral-700 text-white focus:border-emerald-500'
                      : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-emerald-500'
                  }`}
                  placeholder="Street address, building, or area in Dar es Salaam"
                />

                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Recipient Phone (kwa ajili ya USSD Push & Rider Contact)
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className={`w-full p-3 rounded-2xl text-xs font-mono outline-none border transition-colors ${
                      isDark
                        ? 'bg-neutral-800/80 border-neutral-700 text-emerald-400 focus:border-emerald-500'
                        : 'bg-neutral-50 border-neutral-300 text-emerald-600 focus:border-emerald-500'
                    }`}
                    placeholder="+255 7XX XXX XXX"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Promo, Payment & Bill Summary */}
          <div className={androidFrame ? 'space-y-4' : 'lg:col-span-5 space-y-5'}>
            
            {/* Promo Code Input */}
            <div
              className={`p-3.5 rounded-3xl border flex items-center space-x-2 ${
                isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-2 flex-1 pl-2">
                <Tag className="w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Promo code (e.g. ZEBRA30)"
                  value={promoCodeInput}
                  onChange={e => setPromoCodeInput(e.target.value.toUpperCase())}
                  disabled={!!appliedPromo}
                  className="w-full bg-transparent text-xs font-bold outline-none text-neutral-900 dark:text-white uppercase placeholder-neutral-400"
                />
              </div>

              {appliedPromo ? (
                <button
                  onClick={removePromoCode}
                  className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-semibold py-2 px-3.5 rounded-xl transition-colors"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => applyPromoCode(promoCodeInput)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-5 rounded-2xl shadow-sm transition-all"
                >
                  Apply
                </button>
              )}
            </div>

            {appliedPromo && (
              <div className="flex items-center space-x-2 text-xs text-emerald-500 bg-emerald-500/10 px-4 py-2.5 rounded-2xl border border-emerald-500/30">
                <Check className="w-4 h-4" />
                <span>
                  Coupon <strong>{appliedPromo.code}</strong> applied ({appliedPromo.discountPercent}% OFF)!
                </span>
              </div>
            )}

            {promoError && (
              <p className="text-xs text-rose-400 pl-2 font-medium">{promoError}</p>
            )}

            {/* Zebra Loyalty Points & Cashback Redemption */}
            <div
              className={`p-4 rounded-3xl border transition-all ${
                isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black text-sm">
                    💎
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        Zebra Rewards Club
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded-full">
                        {user.loyaltyTier || 'Gold'} Member
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Una pointi <strong>{loyaltyPoints}</strong> (Thamani: {formatPrice((loyaltyPoints / 100) * 1000, 'TZS')})
                    </p>
                  </div>
                </div>

                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={redeemLoyaltyDiscount}
                    onChange={e => setRedeemLoyaltyDiscount(e.target.checked)}
                    disabled={loyaltyPoints < 100}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Tumia Pointi
                  </span>
                </label>
              </div>

              {redeemLoyaltyDiscount && (
                <div className="mt-2.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium flex items-center justify-between">
                  <span>Punguzo la Pointi Linalotumika:</span>
                  <span className="font-bold font-mono">-{formatPrice(loyaltyDiscountAmount, currency)}</span>
                </div>
              )}

              <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400 flex items-center justify-between">
                <span>Pointi zitakazoongezwa kwa oda hii:</span>
                <span className="font-bold text-emerald-500">+{Math.max(10, Math.floor(subtotal * 2600 / 1000) * 10)} Pts</span>
              </div>
            </div>

            {/* Split Bill Trigger if Dine-In */}
            {diningMode === 'dine_in' && (
              <div className="p-3.5 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-xs">
                    👥
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900 dark:text-white">Mmeketi wengi mezani?</p>
                    <p className="text-[11px] text-neutral-500">Gawana bili kwa viwango sawa na lipeni tofauti</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openSplitBill()}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Gawana Bili
                </button>
              </div>
            )}

            {/* Payment Method Selector */}
            <div
              className={`p-5 rounded-3xl border space-y-3.5 ${
                isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              <div className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Payment Method / Njia ya Malipo
              </div>

              <div className="space-y-2">
                {/* Mongike Mobile Money (Live STK Push) */}
                <label
                  onClick={() => setSelectedPayment('mongike_mobile_money')}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedPayment === 'mongike_mobile_money'
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-sm ring-1 ring-emerald-500/30'
                      : isDark
                      ? 'border-neutral-800 bg-neutral-800/50 hover:border-neutral-700'
                      : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center font-black text-sm shadow-sm">
                      ⚡
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                        <span>Mongike Mobile Money</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                          Live STK Push TZ
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        Vodacom M-Pesa, Tigo Pesa, Airtel Money, HaloPesa
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === 'mongike_mobile_money'
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-neutral-500'
                    }`}
                  >
                    {selectedPayment === 'mongike_mobile_money' && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </label>

                {/* USSD Mobile Money */}
                <label
                  onClick={() => setSelectedPayment('ussd_mpesa')}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedPayment.startsWith('ussd_')
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : isDark
                      ? 'border-neutral-800 bg-neutral-800/50 hover:border-neutral-700'
                      : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                        <span>USSD Mobile Money</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 font-semibold px-1.5 py-0.5 rounded">
                          Lipa Namba: 445566
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        Vodacom M-Pesa (*150*00#), Tigo, Airtel, HaloPesa
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment.startsWith('ussd_')
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-neutral-500'
                    }`}
                  >
                    {selectedPayment.startsWith('ussd_') && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => setSelectedPayment('cash_on_delivery')}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedPayment === 'cash_on_delivery'
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : isDark
                      ? 'border-neutral-800 bg-neutral-800/50 hover:border-neutral-700'
                      : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        Cash on Delivery
                      </div>
                      <p className="text-[11px] text-neutral-400">Pay cash or mobile money to courier upon arrival</p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === 'cash_on_delivery'
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-neutral-500'
                    }`}
                  >
                    {selectedPayment === 'cash_on_delivery' && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </label>

                {/* Credit / Debit Card */}
                <label
                  onClick={() => setSelectedPayment('card')}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedPayment === 'card'
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : isDark
                      ? 'border-neutral-800 bg-neutral-800/50 hover:border-neutral-700'
                      : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        Debit / Credit Card
                      </div>
                      <p className="text-[11px] text-neutral-400">Visa, Mastercard online</p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === 'card'
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-neutral-500'
                    }`}
                  >
                    {selectedPayment === 'card' && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Bill Summary */}
            <div
              className={`p-5 rounded-3xl border space-y-3 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200 shadow-sm'
              }`}
            >
              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>

              <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>{diningMode === 'dine_in' ? 'Huduma Mezani (Dine-In)' : 'Delivery (Dar es Salaam)'}</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {effectiveDeliveryFee === 0 ? (
                    <span className="text-emerald-500 font-bold">BURE (0 TZS)</span>
                  ) : (
                    formatPrice(effectiveDeliveryFee, currency)
                  )}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-xs text-emerald-500 font-bold">
                  <span>Discount ({appliedPromo?.code})</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}

              {loyaltyDiscountAmount > 0 && (
                <div className="flex justify-between text-xs text-amber-500 font-bold">
                  <span>Punguzo la Pointi (Loyalty)</span>
                  <span>-{formatPrice(loyaltyDiscountAmount, currency)}</span>
                </div>
              )}

              <div className="border-t border-neutral-800/40 dark:border-neutral-700/40 pt-3 flex justify-between items-baseline">
                <span className="text-base font-bold text-neutral-900 dark:text-white font-display">
                  Total
                </span>
                <div className="text-right">
                  <span className="text-2xl font-black font-display text-emerald-500">
                    {formatPrice(effectiveTotal, currency)}
                  </span>
                  {currency === 'USD' && (
                    <div className="text-xs text-neutral-400 font-mono">
                      ≈ {formatPrice(effectiveTotal, 'TZS')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Checkout CTA */}
            <div>
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className={`w-full active:scale-[0.98] font-bold py-4 px-6 rounded-full shadow-lg flex items-center justify-center space-x-2 text-base transition-all disabled:opacity-50 ${
                  !isLoggedIn
                    ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/25'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
                }`}
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : !isLoggedIn ? (
                  <span>
                    🔑 Ingia / Jisajili ili Kulipa · {formatPrice(totalAmount, currency)}
                  </span>
                ) : (
                  <span>
                    Checkout Now · {formatPrice(totalAmount, currency)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
