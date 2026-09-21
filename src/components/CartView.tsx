import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import { ArrowLeft, Trash2, Tag, Plus, Minus, MapPin, Check, Smartphone, CreditCard, Banknote } from 'lucide-react';
import { PaymentProvider } from '../types';

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
    user
  } = useApp();

  const isDark = theme === 'dark';
  const [selectedPayment, setSelectedPayment] = useState<PaymentProvider>('ussd_mpesa');
  const [deliveryAddress, setDeliveryAddress] = useState(
    user.addresses[0]?.street || 'Plot 44, Toure Drive, Masaki Peninsula, Dar es Salaam'
  );
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '+255 712 345 678');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      await placeOrder({
        paymentMethod: selectedPayment,
        phoneNumber,
        deliveryAddress
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
          Explore our mouthwatering dishes, pizzas, and Swahili specialties from Zebra Restaurant!
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
      {/* Header matching Screenshot 3 */}
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

      <div className="px-5 space-y-5">
        {/* Cart Items List */}
        <div className="space-y-3">
          {cart.map(item => (
            <div
              key={item.cartItemId}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${
                isDark
                  ? 'bg-neutral-900/90 border-neutral-800/90'
                  : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              {/* Image & details */}
              <div
                className="flex items-center space-x-3 cursor-pointer flex-1 mr-2"
                onClick={() => setSelectedDish(item.menuItem)}
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700/40">
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                    {item.menuItem.name}
                  </h3>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">
                    {item.menuItem.restaurantName}
                  </p>
                  <p className="text-[11px] text-amber-500 font-medium">
                    {item.selectedSize.name}
                    {item.selectedIngredients.length > 0 &&
                      ` + ${item.selectedIngredients.map(i => i.name).join(', ')}`}
                  </p>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                    {formatPrice(item.totalPrice, currency)}
                  </p>
                </div>
              </div>

              {/* Green Stepper Pill (exact look from Screenshot 3) */}
              <div className="flex items-center bg-emerald-500 text-white rounded-xl px-1.5 py-1 space-x-2 shadow-sm shadow-emerald-500/20 shrink-0">
                <button
                  onClick={() => updateCartQuantity(item.cartItemId, -1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-emerald-600 rounded-lg transition-colors"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                <span className="font-bold text-xs w-4 text-center select-none">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateCartQuantity(item.cartItemId, 1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-emerald-600 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Code Input (Matching Screenshot 3) */}
        <div
          className={`p-3 rounded-2xl border flex items-center space-x-2 ${
            isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-neutral-200'
          }`}
        >
          <div className="flex items-center space-x-2 flex-1 pl-2">
            <Tag className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Promo code (e.g., ZEBRA30)"
              value={promoCodeInput}
              onChange={e => setPromoCodeInput(e.target.value.toUpperCase())}
              disabled={!!appliedPromo}
              className="w-full bg-transparent text-xs font-medium outline-none text-neutral-900 dark:text-white uppercase placeholder-neutral-400"
            />
          </div>

          {appliedPromo ? (
            <button
              onClick={removePromoCode}
              className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={() => applyPromoCode(promoCodeInput)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all"
            >
              Apply
            </button>
          )}
        </div>

        {appliedPromo && (
          <div className="flex items-center space-x-2 text-xs text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/30">
            <Check className="w-4 h-4" />
            <span>
              Coupon <strong>{appliedPromo.code}</strong> applied ({appliedPromo.discountPercent}% OFF)!
            </span>
          </div>
        )}

        {promoError && (
          <p className="text-xs text-rose-400 pl-2 font-medium">{promoError}</p>
        )}

        {/* Delivery Address & Phone for USSD */}
        <div
          className={`p-4 rounded-2xl border space-y-3 ${
            isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200'
          }`}
        >
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>Delivery Destination (Dar es Salaam)</span>
          </div>
          <input
            type="text"
            value={deliveryAddress}
            onChange={e => setDeliveryAddress(e.target.value)}
            className={`w-full p-2.5 rounded-xl text-xs outline-none border transition-colors ${
              isDark
                ? 'bg-neutral-800/80 border-neutral-700 text-white focus:border-emerald-500'
                : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-emerald-500'
            }`}
            placeholder="Street address, building, or area"
          />

          <div className="pt-1">
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
              Mobile Money Phone Number (kwa ajili ya USSD Push)
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className={`w-full p-2.5 rounded-xl text-xs font-mono outline-none border transition-colors ${
                isDark
                  ? 'bg-neutral-800/80 border-neutral-700 text-emerald-400 focus:border-emerald-500'
                  : 'bg-neutral-50 border-neutral-300 text-emerald-600 focus:border-emerald-500'
              }`}
              placeholder="+255 7XX XXX XXX"
            />
          </div>
        </div>

        {/* Payment Method Selector with USSD Integration Highlight */}
        <div
          className={`p-4 rounded-2xl border space-y-3 ${
            isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200'
          }`}
        >
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Payment Method / Njia ya Malipo
          </div>

          <div className="grid grid-cols-1 gap-2">
            {/* USSD Mobile Money (Featured) */}
            <label
              onClick={() => setSelectedPayment('ussd_mpesa')}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                selectedPayment.startsWith('ussd_')
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : isDark
                  ? 'border-neutral-800 bg-neutral-800/50'
                  : 'border-neutral-200 bg-neutral-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center space-x-1.5">
                    <span>USSD Mobile Money</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 font-semibold px-1.5 py-0.5 rounded">
                      Offline Ready
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    M-Pesa (*150*00#), Tigo Pesa, Airtel, Halopesa
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
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                selectedPayment === 'cash_on_delivery'
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : isDark
                  ? 'border-neutral-800 bg-neutral-800/50'
                  : 'border-neutral-200 bg-neutral-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-300 flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">
                    Cash on Delivery (Lipa Ukipokea)
                  </div>
                  <p className="text-[11px] text-neutral-400">Pay directly to Zebra Rider</p>
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

            {/* Card */}
            <label
              onClick={() => setSelectedPayment('card')}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                selectedPayment === 'card'
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : isDark
                  ? 'border-neutral-800 bg-neutral-800/50'
                  : 'border-neutral-200 bg-neutral-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-300 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">
                    Debit / Credit Card
                  </div>
                  <p className="text-[11px] text-neutral-400">Visa, Mastercard</p>
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

        {/* Order Cost Breakdown (Exact layout from Screenshot 3) */}
        <div
          className={`p-4 rounded-2xl border space-y-2.5 ${
            isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
          }`}
        >
          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Subtotal</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {formatPrice(subtotal, currency)}
            </span>
          </div>

          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Delivery</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee, currency)}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-xs text-emerald-500">
              <span>Discount ({appliedPromo?.code})</span>
              <span className="font-semibold">-{formatPrice(discountAmount, currency)}</span>
            </div>
          )}

          <div className="border-t border-neutral-800/40 dark:border-neutral-700/40 pt-2 flex justify-between items-baseline">
            <span className="text-base font-bold text-neutral-900 dark:text-white font-display">
              Total
            </span>
            <div className="text-right">
              <span className="text-xl font-black font-display text-emerald-500">
                {formatPrice(totalAmount, currency)}
              </span>
              {currency === 'USD' && (
                <div className="text-[11px] text-neutral-400 font-mono">
                  ≈ {formatPrice(totalAmount, 'TZS')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-width Checkout CTA matching Screenshot 3 */}
        <div className="pt-2">
          <button
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold py-4 px-6 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 text-base transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Processing Order...</span>
            ) : (
              <span>
                Checkout · {formatPrice(totalAmount, currency)}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
