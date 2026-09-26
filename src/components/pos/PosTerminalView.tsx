import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/formatters';
import { MenuItem, Category } from '../../types';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  UserPlus,
  CreditCard,
  Banknote,
  Smartphone,
  Layers,
  Printer,
  CheckCircle2,
  X,
  Tv,
  Utensils,
  ChevronDown,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Truck,
  RotateCcw,
  Maximize2,
  Gift,
  Building2,
  QrCode,
  Tag,
  Hash,
  Users,
  AlertCircle
} from 'lucide-react';

export type PosOrderType = 'dine_in' | 'takeaway' | 'delivery';

interface PosCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  points?: number;
  customerType?: 'regular' | 'vip' | 'corporate';
}

interface PosPaymentMethodOption {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'mfs' | 'points' | 'bank' | 'other';
  icon: string;
  accountDetails?: string;
}

const DEFAULT_POS_CUSTOMERS: PosCustomer[] = [
  { id: 'walkin', name: 'Walk-in Customer (Mteja wa Kaunta)', phone: '+255 700 000 000', email: 'walkin@zebra.co.tz', address: 'Dine-In Kaunta', points: 40, customerType: 'regular' },
  { id: 'c1', name: 'Amina Salum', phone: '+255 712 345 678', email: 'amina@gmail.com', address: 'Mikocheni A, Mwai Kibaki Rd', points: 350, customerType: 'vip' },
  { id: 'c2', name: 'Juma Rashid', phone: '+255 754 998 877', email: 'juma@yahoo.com', address: 'Masaki Toure Drive, Dar es Salaam', points: 180, customerType: 'regular' },
  { id: 'c3', name: 'Dhaka Bangladesh Guest', phone: '+880 1780-642054', email: 'guest@dhaka.bd', address: 'Home - Dhaka Bangladesh', points: 90, customerType: 'regular' }
];

const PRESET_ADDRESSES = [
  'Home - Dhaka Bangladesh',
  'Home - Plot 44 Toure Drive, Masaki Peninsula',
  'Mikocheni A, Mwai Kibaki Rd, Dar es Salaam',
  'Kariakoo, Uhuru Street, China Plaza',
  'Oysterbay, Haile Selassie Road',
  'Msasani Bay Waterfront, Slipway Pier'
];

const PRESET_TABLES = [
  'Meza 1 (Ndani)',
  'Meza 2 (Dirishani)',
  'Meza 3 (Bustani)',
  'Meza 4 (VIP Lounge)',
  'Meza 5 (Baraza)',
  'Meza 6 (Ghorofani)',
  'Meza 7 (Kando ya Mti)',
  'Meza 8 (Kaunta Kuu)',
  'Meza 9 (Bustani ya Nje)',
  'Meza 10 (Familia Kubwa)',
  'Meza 11 (Terrace View)',
  'Meza 12 (Romantic Corner)'
];

const DEFAULT_PAYMENT_METHODS: PosPaymentMethodOption[] = [
  { id: 'cash', name: 'Cash', type: 'cash', icon: '💵' },
  { id: 'card', name: 'Card (POS)', type: 'card', icon: '💳' },
  { id: 'mfs', name: 'MFS (Simu)', type: 'mfs', icon: '📱', accountDetails: 'M-Pesa / Tigo / Airtel Lipa: 445566' },
  { id: 'points', name: 'Zebra Points', type: 'points', icon: '🎁', accountDetails: 'Pointi za Zawadi' },
  { id: 'bank_crdb', name: 'CRDB Lipa', type: 'bank', icon: '🏦', accountDetails: 'Lipa Namba: 01529944' },
  { id: 'bank_nmb', name: 'NMB Quick', type: 'bank', icon: '🏛️', accountDetails: 'Lipa Namba: 778899' }
];

export const PosTerminalView: React.FC = () => {
  const {
    menuItems,
    categories,
    currency,
    placeOrder,
    setActiveTab,
    theme
  } = useApp();

  const isDark = theme === 'dark';

  // 1. Order Type on POS: Dine-in, Takeaway, Delivery
  const [orderType, setOrderType] = useState<PosOrderType>('dine_in');
  const [selectedTable, setSelectedTable] = useState<string>(PRESET_TABLES[0]);
  const [customTable, setCustomTable] = useState<string>('');
  const [showTableDropdown, setShowTableDropdown] = useState<boolean>(false);
  const [guestsCount, setGuestsCount] = useState<number>(2);

  // Delivery state
  const [selectedAddress, setSelectedAddress] = useState<string>('Mikocheni A, Mwai Kibaki Rd, Dar es Salaam');
  const [customAddress, setCustomAddress] = useState<string>('');
  const [showAddressDropdown, setShowAddressDropdown] = useState<boolean>(false);

  // 2. Add Customer on POS
  const [customers, setCustomers] = useState<PosCustomer[]>(DEFAULT_POS_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<PosCustomer>(DEFAULT_POS_CUSTOMERS[0]);
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState<boolean>(false);

  // New Customer Form State
  const [newCustName, setNewCustName] = useState<string>('');
  const [newCustPhoneCode, setNewCustPhoneCode] = useState<string>('+255');
  const [newCustPhone, setNewCustPhone] = useState<string>('');
  const [newCustEmail, setNewCustEmail] = useState<string>('');
  const [newCustAddress, setNewCustAddress] = useState<string>('');
  const [newCustType, setNewCustType] = useState<'regular' | 'vip' | 'corporate'>('regular');
  const [newCustNotes, setNewCustNotes] = useState<string>('');

  // 3. Add Payment Method on POS
  const [paymentMethods, setPaymentMethods] = useState<PosPaymentMethodOption[]>(DEFAULT_PAYMENT_METHODS);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>('cash');
  const [showAddPaymentMethodModal, setShowAddPaymentMethodModal] = useState<boolean>(false);

  // New Payment Method Form State
  const [newMethodName, setNewMethodName] = useState<string>('');
  const [newMethodType, setNewMethodType] = useState<'cash' | 'card' | 'mfs' | 'bank' | 'points' | 'other'>('mfs');
  const [newMethodIcon, setNewMethodIcon] = useState<string>('📱');
  const [newMethodDetails, setNewMethodDetails] = useState<string>('');

  // Menu Search & Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // POS Cart
  const [cartItems, setCartItems] = useState<
    Array<{ item: MenuItem; quantity: number; notes?: string }>
  >([]);

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [receivedAmount, setReceivedAmount] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Receipt Modal State
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [printedOrderData, setPrintedOrderData] = useState<{
    tokenNumber: string;
    orderId: string;
    customer: PosCustomer;
    items: Array<{ item: MenuItem; quantity: number }>;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    paymentMethod: string;
    receivedAmount: number;
    changeDue: number;
    transactionId?: string;
    orderType: string;
    address: string;
    timestamp: string;
  } | null>(null);

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, curr) => {
      const price = currency === 'TZS' ? curr.item.priceTZS : (curr.item.priceUSD ?? curr.item.price);
      return acc + price * curr.quantity;
    }, 0);
  }, [cartItems, currency]);

  const deliveryCharge = orderType === 'delivery' ? (currency === 'TZS' ? 2500 : 0.25) : 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const totalAmount = Math.max(0, subtotal + deliveryCharge - discountAmount);

  const numReceived = parseFloat(receivedAmount) || 0;
  const changeDue = Math.max(0, numReceived - totalAmount);

  const selectedPaymentMethod = useMemo(() => {
    return paymentMethods.find(p => p.id === selectedPaymentMethodId) || paymentMethods[0];
  }, [paymentMethods, selectedPaymentMethodId]);

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.swahiliName?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Cart operations
  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.item.id === item.id);
      if (existing) {
        return prev.map(p =>
          p.item.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(p => {
          if (p.item.id === itemId) {
            const newQty = p.quantity + delta;
            return newQty > 0 ? { ...p, quantity: newQty } : null;
          }
          return p;
        })
        .filter(Boolean) as Array<{ item: MenuItem; quantity: number }>
    );
  };

  const clearCart = () => setCartItems([]);

  // State for form validation errors
  const [posError, setPosError] = useState<string | null>(null);

  // Add Customer handler
  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) {
      setPosError('Tafadhali jaza Jina la mteja!');
      return;
    }
    setPosError(null);

    const fullPhone = newCustPhone.trim() ? `${newCustPhoneCode} ${newCustPhone.trim()}` : '+255 700 000 000';
    const newCust: PosCustomer = {
      id: `cust_${Date.now()}`,
      name: newCustName.trim(),
      phone: fullPhone,
      email: newCustEmail.trim() || `${newCustName.toLowerCase().replace(/\s+/g, '')}@zebra.co.tz`,
      address: newCustAddress.trim() || (orderType === 'dine_in' ? selectedTable : selectedAddress),
      points: newCustType === 'vip' ? 200 : 50,
      customerType: newCustType
    };

    setCustomers(prev => [newCust, ...prev]);
    setSelectedCustomer(newCust);
    setShowAddCustomerModal(false);

    // Reset Form
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setNewCustAddress('');
    setNewCustNotes('');
    setNewCustType('regular');
  };

  // Add Payment Method handler
  const handleAddPaymentMethodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMethodName.trim()) {
      setPosError('Tafadhali jaza Jina la Njia ya Malipo!');
      return;
    }
    setPosError(null);

    const newId = `pm_${Date.now()}`;
    const newMethod: PosPaymentMethodOption = {
      id: newId,
      name: newMethodName.trim(),
      type: newMethodType,
      icon: newMethodIcon || '💳',
      accountDetails: newMethodDetails.trim() || undefined
    };

    setPaymentMethods(prev => [...prev, newMethod]);
    setSelectedPaymentMethodId(newId);
    setShowAddPaymentMethodModal(false);

    // Reset Form
    setNewMethodName('');
    setNewMethodDetails('');
  };

  // Numpad key press handler
  const handleKeypadPress = (val: string) => {
    setPosError(null);
    if (val === 'clear') {
      setReceivedAmount('');
    } else if (val === 'backspace') {
      setReceivedAmount(prev => prev.slice(0, -1));
    } else {
      if (val === '.' && receivedAmount.includes('.')) return;
      setReceivedAmount(prev => prev + val);
    }
  };

  // Quick cash buttons for TZS
  const handleQuickCash = (amount: number) => {
    setPosError(null);
    setReceivedAmount(amount.toString());
  };

  // Open Payment Modal
  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      setPosError('Tafadhali chagua angalau chakula kimoja kuweka kwenye oda!');
      return;
    }
    setPosError(null);
    setReceivedAmount(totalAmount.toString());
    setShowPaymentModal(true);
  };

  // Confirm & Print Receipt
  const handleConfirmAndPrint = async () => {
    if (selectedPaymentMethod.type === 'cash' && numReceived < totalAmount) {
      setPosError(`Kiasi kilichopokelewa (${formatPrice(numReceived, currency)}) kiko chini ya jumla ya bili (${formatPrice(totalAmount, currency)})!`);
      return;
    }

    if ((selectedPaymentMethod.type === 'mfs' || selectedPaymentMethod.type === 'bank') && !transactionId.trim()) {
      setPosError('Tafadhali ingiza Transaction ID au Namba ya Kumbukumbu ya malipo!');
      return;
    }
    setPosError(null);

    // Generate Token Number e.g. "0105", "1020", "124"
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const tokenNumber = `0${randomSuffix}`;
    const orderId = `25${Date.now().toString().slice(-6)}`;

    let orderTypeLabel = 'Takeaway';
    let locationDescription = 'Waiting Line / Kaunta';

    if (orderType === 'dine_in') {
      const finalTable = customTable.trim() || selectedTable;
      orderTypeLabel = `Dine-In (${finalTable})`;
      locationDescription = `${finalTable} • Wateja: ${guestsCount}`;
    } else if (orderType === 'delivery') {
      const finalAddress = customAddress.trim() || selectedAddress;
      orderTypeLabel = 'Delivery (Bodaboda)';
      locationDescription = finalAddress;
    }

    const receiptData = {
      tokenNumber,
      orderId,
      customer: selectedCustomer,
      items: cartItems,
      subtotal,
      deliveryFee: deliveryCharge,
      discount: discountAmount,
      total: totalAmount,
      paymentMethod: selectedPaymentMethod.name.toUpperCase(),
      receivedAmount: selectedPaymentMethod.type === 'cash' ? numReceived : totalAmount,
      changeDue: selectedPaymentMethod.type === 'cash' ? changeDue : 0,
      transactionId: transactionId.trim() || undefined,
      orderType: orderTypeLabel,
      address: locationDescription,
      timestamp: new Date().toLocaleString()
    };

    setPrintedOrderData(receiptData);
    setShowPaymentModal(false);
    setShowReceiptModal(true);

    // Save order in AppContext orders list so OSS & Tracking screen sync in real-time!
    try {
      await placeOrder({
        paymentMethod: selectedPaymentMethod.type === 'cash' ? 'cash_on_delivery' : 'card',
        phoneNumber: selectedCustomer.phone,
        deliveryAddress: `${orderType.toUpperCase()} - ${locationDescription} (Token #${tokenNumber})`,
        notes: `POS Terminal Order | ${orderTypeLabel} | Method: ${selectedPaymentMethod.name}${transactionId ? ` | Ref: ${transactionId}` : ''}`,
        orderType: orderType === 'delivery' ? 'delivery' : (orderType === 'dine_in' ? 'dine_in' : 'pickup')
      });
    } catch (e) {
      console.warn('POS place order notice:', e);
    }

    // Clear cart for next order
    setCartItems([]);
    setTransactionId('');
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col bg-[#0b0f17] text-white">
      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-[#111723] border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-neutral-950 font-black flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
            🦓
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base sm:text-lg font-display tracking-wide text-white">
                Zebra POS Terminal
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30">
                POINT OF SALE
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Oda za Kaunta, Mezani (Dine-in), Takeaway, na Bodaboda Delivery
            </p>
          </div>
        </div>

        {/* Quick Nav: OSS Screen & KDS */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('oss')}
            className="px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
            title="Fungua Skrini ya Wateja ya Token (OSS Screen)"
          >
            <Tv className="w-3.5 h-3.5 text-teal-400" />
            <span>OSS Token Screen</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-all cursor-pointer"
          >
            Rudi Menu
          </button>
        </div>
      </div>

      {/* Control Strip: 1. Order Type ("oda taip on pos") & 2. Customer Selector ("add custore on pos") */}
      <div className="px-4 py-2.5 bg-[#0e141f] border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Left: Order Type Selector ("oda taip on pos") */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap gap-y-2">
          <span className="text-xs font-bold text-neutral-300 whitespace-nowrap">Order Type:</span>
          
          <div className="flex items-center space-x-1.5 bg-neutral-900/90 p-1 rounded-2xl border border-neutral-800">
            {/* 1. DINE-IN (Kula Hapa Mezani) */}
            <button
              type="button"
              onClick={() => setOrderType('dine_in')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                orderType === 'dine_in'
                  ? 'bg-emerald-500 text-neutral-950 shadow-md font-extrabold ring-1 ring-emerald-400'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Dine-In (Mezani)</span>
            </button>

            {/* 2. TAKEAWAY (Pakia Nyumbani) */}
            <button
              type="button"
              onClick={() => setOrderType('takeaway')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                orderType === 'takeaway'
                  ? 'bg-amber-400 text-neutral-950 shadow-md font-extrabold ring-1 ring-amber-300'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Takeaway (Pakia)</span>
            </button>

            {/* 3. DELIVERY (Bodaboda) */}
            <button
              type="button"
              onClick={() => setOrderType('delivery')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                orderType === 'delivery'
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30 font-extrabold ring-1 ring-teal-300'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Delivery (Bodaboda)</span>
            </button>
          </div>

          {/* Context Options depending on Order Type */}
          {orderType === 'dine_in' && (
            <div className="relative flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowTableDropdown(!showTableDropdown)}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700/80 text-xs text-white font-medium flex items-center space-x-2 hover:border-emerald-500 transition-colors cursor-pointer"
              >
                <span className="text-emerald-400 font-bold">Meza:</span>
                <span className="truncate max-w-[150px]">{customTable.trim() || selectedTable}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <div className="flex items-center space-x-1 bg-neutral-900 px-2 py-1 rounded-xl border border-neutral-800 text-xs">
                <Users className="w-3.5 h-3.5 text-neutral-400" />
                <select
                  value={guestsCount}
                  onChange={e => setGuestsCount(Number(e.target.value))}
                  className="bg-transparent text-white font-bold outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                    <option key={n} value={n} className="bg-neutral-900 text-white">
                      {n} Wateja
                    </option>
                  ))}
                </select>
              </div>

              {showTableDropdown && (
                <div className="absolute left-0 top-10 w-72 bg-neutral-900 border border-neutral-700 rounded-2xl p-2 shadow-2xl z-50 space-y-1 max-h-64 overflow-y-auto">
                  <div className="text-[10px] font-bold text-neutral-400 px-2 py-1 uppercase">
                    Chagua Meza ya Mteja
                  </div>
                  {PRESET_TABLES.map(tbl => (
                    <button
                      key={tbl}
                      type="button"
                      onClick={() => {
                        setSelectedTable(tbl);
                        setCustomTable('');
                        setShowTableDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                        selectedTable === tbl && !customTable ? 'bg-emerald-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      {tbl}
                    </button>
                  ))}
                  <div className="pt-2 border-t border-neutral-800 px-1">
                    <input
                      type="text"
                      placeholder="Au andika namba/jina la meza..."
                      value={customTable}
                      onChange={e => setCustomTable(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {orderType === 'delivery' && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700/80 text-xs text-white font-medium flex items-center space-x-2 hover:border-teal-500 transition-colors cursor-pointer"
              >
                <span className="text-teal-400 font-bold">Anwani:</span>
                <span className="truncate max-w-[180px] sm:max-w-[240px]">{customAddress.trim() || selectedAddress}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {showAddressDropdown && (
                <div className="absolute left-0 top-10 w-72 bg-neutral-900 border border-neutral-700 rounded-2xl p-1.5 shadow-2xl z-50 space-y-1">
                  <div className="text-[10px] font-bold text-neutral-400 px-2 py-1 uppercase">
                    Chagua Anwani ya Mteja
                  </div>
                  {PRESET_ADDRESSES.map(addr => (
                    <button
                      key={addr}
                      type="button"
                      onClick={() => {
                        setSelectedAddress(addr);
                        setCustomAddress('');
                        setShowAddressDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                        selectedAddress === addr && !customAddress ? 'bg-teal-500 text-white font-bold' : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      {addr}
                    </button>
                  ))}
                  <div className="pt-1 border-t border-neutral-800 px-1">
                    <input
                      type="text"
                      placeholder="Au andika anwani maalum..."
                      value={customAddress}
                      onChange={e => setCustomAddress(e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-neutral-950 border border-neutral-700 rounded-lg text-white outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: 2. Add Customer on POS ("add custore on pos") */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800">
            <span className="text-xs text-neutral-400">Mteja:</span>
            <select
              value={selectedCustomer.id}
              onChange={e => {
                const found = customers.find(c => c.id === e.target.value);
                if (found) setSelectedCustomer(found);
              }}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
            {selectedCustomer.points !== undefined && (
              <span className="px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold" title="Pointi za Uaminifu">
                ⭐ {selectedCustomer.points} pts
              </span>
            )}
          </div>

          {/* "+ Add Customer" Button */}
          <button
            type="button"
            onClick={() => setShowAddCustomerModal(true)}
            className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer shadow-md shadow-teal-500/20 active:scale-95"
            title="Sajili Mteja Mpya kwenye Mfumo"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Customer</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Split Menu (Left) and Order Cart (Right) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Product Menu */}
        <div className="flex-1 flex flex-col border-r border-neutral-800 overflow-hidden">
          {/* Category Tabs & Search Bar */}
          <div className="p-3 bg-[#0d1219] border-b border-neutral-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
            {/* Category Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-black'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                Vyakula Vyote
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1 ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-black'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Menu Search */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Tafuta chakula au kinywaji..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2.5">
            {filteredItems.map(item => {
              const price = currency === 'TZS' ? item.priceTZS : (item.priceUSD ?? item.price);
              const cartEntry = cartItems.find(c => c.item.id === item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className={`bg-[#121824] rounded-2xl border p-2.5 flex flex-col justify-between hover:border-teal-500/50 hover:bg-[#162030] transition-all cursor-pointer group shadow-sm select-none relative ${
                    cartEntry ? 'border-teal-500/80 bg-teal-950/20' : 'border-neutral-800/80'
                  }`}
                >
                  {cartEntry && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] font-black flex items-center justify-center shadow-md">
                      {cartEntry.quantity}
                    </span>
                  )}

                  <div className="w-full h-24 rounded-xl overflow-hidden mb-2 bg-neutral-900">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-xs text-white line-clamp-1 group-hover:text-teal-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-neutral-400 line-clamp-1">
                      {item.swahiliName || item.category}
                    </p>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400">
                      {formatPrice(price, currency)}
                    </span>
                    <span className="w-5 h-5 rounded-lg bg-neutral-800 group-hover:bg-teal-500 text-neutral-400 group-hover:text-white flex items-center justify-center transition-colors">
                      <Plus className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Order Cart & Bill Breakdown */}
        <div className="w-full lg:w-96 xl:w-[420px] bg-[#0f141f] flex flex-col shrink-0 border-t lg:border-t-0 border-neutral-800">
          {/* Cart Header */}
          <div className="p-3.5 bg-[#141b29] border-b border-neutral-800 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-teal-400" />
              <h2 className="font-bold text-sm text-white">Current Order</h2>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black">
                {cartItems.reduce((acc, c) => acc + c.quantity, 0)} items
              </span>
            </div>

            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] text-red-400 hover:text-red-300 flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {cartItems.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-neutral-500 space-y-2">
                <Utensils className="w-8 h-8 text-neutral-600" />
                <p className="text-xs font-medium">Bado hakuna chakula kilichochaguliwa</p>
                <p className="text-[10px] text-neutral-600">Bofya vyakula kwenye menyu kuweka kwenye oda</p>
              </div>
            ) : (
              cartItems.map(({ item, quantity }) => {
                const price = currency === 'TZS' ? item.priceTZS : (item.priceUSD ?? item.price);
                const lineTotal = price * quantity;

                return (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-[#141c2b] border border-neutral-800/80 flex items-center justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-white truncate">{item.name}</h4>
                      <p className="text-[10px] text-neutral-400">
                        {formatPrice(price, currency)} × {quantity}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 bg-neutral-900 rounded-lg p-0.5 border border-neutral-800">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-5 h-5 rounded text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-black text-white">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-5 h-5 rounded text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="font-bold text-xs text-teal-400">
                        {formatPrice(lineTotal, currency)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Summary & Checkout */}
          <div className="p-3.5 bg-[#121824] border-t border-neutral-800 space-y-2 shrink-0">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Subtotal:</span>
              <span className="font-bold text-white">{formatPrice(subtotal, currency)}</span>
            </div>

            {/* Delivery Charge (if Delivery) */}
            {orderType === 'delivery' && (
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Delivery Charge (Bodaboda):</span>
                <span className="font-bold text-teal-400">+{formatPrice(deliveryCharge, currency)}</span>
              </div>
            )}

            {/* Dine-in Table Notice */}
            {orderType === 'dine_in' && (
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Dine-In Table:</span>
                <span className="font-bold text-emerald-400">{customTable.trim() || selectedTable} ({guestsCount} Guests)</span>
              </div>
            )}

            {/* Discount selector */}
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <span>Punguzo (Discount):</span>
              <div className="flex items-center space-x-1">
                {[0, 5, 10, 15].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscountPercent(pct)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      discountPercent === pct
                        ? 'bg-amber-500 text-neutral-950 font-black'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
              <span className="font-black text-sm text-white">Total Amount:</span>
              <span className="font-black text-lg text-teal-400">
                {formatPrice(totalAmount, currency)}
              </span>
            </div>

            {/* Payment Proceed Button */}
            <button
              type="button"
              onClick={handleProceedToPayment}
              disabled={cartItems.length === 0}
              className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg ${
                cartItems.length > 0
                  ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/25 active:scale-95'
                  : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <span>Pokea Malipo (Pay Now)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD CUSTOMER MODAL ("add custore on pos")                          */}
      {/* ========================================================================= */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-[#121824] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-scale-in flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                  Add New Customer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="p-4 sm:p-5 space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                  CUSTOMER NAME <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={e => setNewCustName(e.target.value)}
                  placeholder="e.g. Amina Salum au Juma Rashid"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#1a2232] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                  PHONE NUMBER
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={newCustPhoneCode}
                    onChange={e => setNewCustPhoneCode(e.target.value)}
                    className="px-2.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#1a2232] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs outline-none font-bold cursor-pointer"
                  >
                    <option value="+255">🇹🇿 +255</option>
                    <option value="+254">🇰🇪 +254</option>
                    <option value="+256">🇺🇬 +256</option>
                    <option value="+880">🇧🇩 +880</option>
                    <option value="+1">🇺🇸 +1</option>
                  </select>
                  <input
                    type="tel"
                    value={newCustPhone}
                    onChange={e => setNewCustPhone(e.target.value)}
                    placeholder="712 345 678"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#1a2232] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                  EMAIL ADDRESS (OPTIONAL)
                </label>
                <input
                  type="email"
                  value={newCustEmail}
                  onChange={e => setNewCustEmail(e.target.value)}
                  placeholder="amina@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#1a2232] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                  DEFAULT ADDRESS / PREFERRED AREA
                </label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={e => setNewCustAddress(e.target.value)}
                  placeholder="Mikocheni B, Mwai Kibaki Rd"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#1a2232] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                  CUSTOMER MEMBERSHIP TIER
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['regular', 'vip', 'corporate'] as const).map(tier => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setNewCustType(tier)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${
                        newCustType === tier
                          ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                          : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-extrabold text-xs shadow-lg shadow-teal-500/25 active:scale-95 transition-all cursor-pointer mt-2"
              >
                Hifadhi Mteja (Save & Select)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ORDER PAYMENT MODAL WITH "+ ADD PAYMENT METHOD"                  */}
      {/* ========================================================================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-[#121824] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                Order Payment
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowPaymentModal(false);
                  setPosError(null);
                }}
                className="w-7 h-7 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-500 flex items-center justify-center hover:bg-pink-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {posError && (
              <div className="mx-4 mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center space-x-1.5 shrink-0">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{posError}</span>
              </div>
            )}

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              {/* Total Amount Pill */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-100 dark:bg-[#182131] border border-neutral-200 dark:border-neutral-700/60">
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Total Amount</span>
                <span className="text-lg font-black text-teal-600 dark:text-teal-400">
                  {formatPrice(totalAmount, currency)}
                </span>
              </div>

              {/* 3. Payment Method on POS: Grid with "+ Add Payment Method" button */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Select Payment Method:
                  </label>
                  {/* "+ Add Payment Method" button */}
                  <button
                    type="button"
                    onClick={() => setShowAddPaymentMethodModal(true)}
                    className="text-[11px] font-bold text-teal-500 hover:text-teal-400 flex items-center space-x-1 cursor-pointer"
                    title="Ongeza Njia Mpya ya Malipo"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Payment Method</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                  {paymentMethods.map(pm => {
                    const isSelected = selectedPaymentMethodId === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setSelectedPaymentMethodId(pm.id)}
                        className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-500/15 border-teal-500 text-teal-600 dark:text-teal-300 font-extrabold ring-1 ring-teal-400 shadow-sm'
                            : 'bg-neutral-50 dark:bg-[#17202e] border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <span className="text-base">{pm.icon}</span>
                        <span className="text-[11px] font-bold truncate max-w-full">{pm.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PAYMENT VIEW 1: CASH WITH NUMERIC KEYPAD & QUICK DENOMINATIONS */}
              {selectedPaymentMethod.type === 'cash' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Enter Received Amount (Kiasi Kilichopokelewa)
                    </label>
                    <div className="px-3.5 py-2.5 rounded-2xl bg-neutral-50 dark:bg-[#182131] border border-neutral-300 dark:border-neutral-700 flex items-center justify-between text-base font-black">
                      <span className="text-teal-600 dark:text-teal-400">{currency}</span>
                      <span className="text-neutral-900 dark:text-white tracking-wider">
                        {receivedAmount || '0'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Cash Buttons */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
                    <button
                      type="button"
                      onClick={() => setReceivedAmount(totalAmount.toString())}
                      className="px-2.5 py-1 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-extrabold whitespace-nowrap cursor-pointer hover:bg-teal-500/30"
                    >
                      Bila Chenji (Exact)
                    </button>
                    {[5000, 10000, 20000, 50000, 100000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleQuickCash(amt)}
                        className="px-2 py-1 rounded-xl bg-neutral-100 dark:bg-[#192233] text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 text-[10px] font-bold whitespace-nowrap cursor-pointer hover:border-teal-500"
                      >
                        {formatPrice(amt, 'TZS')}
                      </button>
                    ))}
                  </div>

                  {/* Change Calculation */}
                  {numReceived > 0 && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                      <span className="text-neutral-600 dark:text-neutral-400 font-semibold">Change Due (Chenji ya Mteja):</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatPrice(changeDue, currency)}
                      </span>
                    </div>
                  )}

                  {/* Numeric Keypad */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-3 grid grid-cols-3 gap-2">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '.'].map(key => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleKeypadPress(key)}
                          className="py-2 rounded-xl bg-neutral-100 dark:bg-[#1a2333] hover:bg-neutral-200 dark:hover:bg-[#202c40] text-neutral-900 dark:text-white font-extrabold text-sm active:scale-95 transition-all cursor-pointer shadow-sm"
                        >
                          {key}
                        </button>
                      ))}
                    </div>

                    <div className="col-span-1 flex flex-col space-y-2">
                      <button
                        type="button"
                        onClick={() => handleKeypadPress('backspace')}
                        className="flex-1 rounded-xl bg-neutral-100 dark:bg-[#1a2333] hover:bg-red-500/20 text-neutral-900 dark:text-white font-bold flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-sm"
                        title="Futa tarakimu"
                      >
                        ⌫
                      </button>
                      <button
                        type="button"
                        onClick={() => handleKeypadPress('clear')}
                        className="flex-1 rounded-xl bg-neutral-100 dark:bg-[#1a2333] hover:bg-neutral-200 dark:hover:bg-[#202c40] text-neutral-600 dark:text-neutral-400 font-bold text-xs flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-sm"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT VIEW 2: MFS (MOBILE MONEY) OR BANK */}
              {(selectedPaymentMethod.type === 'mfs' || selectedPaymentMethod.type === 'bank') && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      Enter Transaction ID / Kumbukumbu Namba <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={e => setTransactionId(e.target.value.toUpperCase())}
                      placeholder="e.g. 9A82BK7192 (M-Pesa / Tigo / Airtel / CRDB)"
                      className="w-full px-3.5 py-3 rounded-2xl bg-neutral-50 dark:bg-[#182131] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-mono font-bold tracking-wider outline-none focus:border-teal-500"
                    />
                  </div>

                  {selectedPaymentMethod.accountDetails && (
                    <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 space-y-1">
                      <p className="font-bold flex items-center space-x-1">
                        <span>ℹ️</span>
                        <span>Maelezo ya Akaunti:</span>
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        {selectedPaymentMethod.accountDetails}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* PAYMENT VIEW 3: ZEBRA POINTS */}
              {selectedPaymentMethod.type === 'points' && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-sm">Malipo ya Pointi za Zawadi</span>
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Mteja {selectedCustomer.name} ana jumla ya pointi <strong>{selectedCustomer.points || 0}</strong>. Pointi zitakatwa moja kwa moja kufidia oda hii.
                  </p>
                </div>
              )}

              {/* PAYMENT VIEW 4: CARD OR OTHER */}
              {(selectedPaymentMethod.type === 'card' || selectedPaymentMethod.type === 'other') && (
                <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-[#182131] border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-400 text-center space-y-2">
                  <CreditCard className="w-8 h-8 text-teal-400 mx-auto" />
                  <p className="font-bold text-neutral-900 dark:text-white">
                    {selectedPaymentMethod.name}
                  </p>
                  <p className="text-[11px]">
                    Swipe au chomeka kadi ya Visa / Mastercard kwenye mashine ya benki ya POS, kisha bonyeza kitufe cha kukamilisha hapa chini.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 font-bold text-xs hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAndPrint}
                  className="flex-1 py-3 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-extrabold text-xs shadow-lg shadow-teal-500/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Confirm & Print</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD PAYMENT METHOD MODAL ("add payment method on pos")             */}
      {/* ========================================================================= */}
      {showAddPaymentMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-[#121824] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-scale-in flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                  Add Custom Payment Method
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPaymentMethodModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPaymentMethodSubmit} className="p-4 sm:p-5 space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                  PAYMENT METHOD NAME <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newMethodName}
                  onChange={e => setNewMethodName(e.target.value)}
                  placeholder="e.g. Selcom Pay, CRDB Lipa, Corporate Voucher"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#1a2232] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                  TYPE OF METHOD
                </label>
                <select
                  value={newMethodType}
                  onChange={e => setNewMethodType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#1a2232] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs outline-none font-bold cursor-pointer"
                >
                  <option value="mfs">Mobile Money (MFS: M-Pesa, Tigo, Airtel)</option>
                  <option value="bank">Bank Transfer / Lipa Namba (CRDB, NMB, KCB)</option>
                  <option value="card">Card Machine (POS Terminal)</option>
                  <option value="points">Loyalty Points / Gift Card</option>
                  <option value="other">Other / Corporate Voucher</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                  ACCOUNT DETAILS / LIPA NAMBA
                </label>
                <input
                  type="text"
                  value={newMethodDetails}
                  onChange={e => setNewMethodDetails(e.target.value)}
                  placeholder="e.g. Lipa Namba: 556677 / Account: 01J123456"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-[#1a2232] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-extrabold text-xs shadow-lg shadow-teal-500/25 active:scale-95 transition-all cursor-pointer mt-2"
              >
                Ongeza Njia Hii ya Malipo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: THERMAL RECEIPT MODAL                                            */}
      {/* ========================================================================= */}
      {showReceiptModal && printedOrderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-sm bg-white text-neutral-900 rounded-3xl shadow-2xl overflow-hidden animate-scale-in flex flex-col font-mono text-xs">
            {/* Top Receipt Bar */}
            <div className="bg-neutral-900 text-white px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-xs tracking-wider">ZEBRA POS RECEIPT</span>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Paper Receipt Body */}
            <div className="p-5 space-y-3 bg-[#fffefc] border-b border-dashed border-neutral-300">
              <div className="text-center space-y-1">
                <div className="text-2xl font-black">🦓 ZEBRA RESTAURANT</div>
                <div className="text-[10px] text-neutral-600">Mikocheni & Shoppers Plaza, Dar es Salaam</div>
                <div className="text-[10px] text-neutral-600">Simu: +255 700 000 000</div>
              </div>

              <div className="border-t border-b border-dashed border-neutral-300 py-2 space-y-1 text-[11px]">
                <div className="flex justify-between font-bold text-base text-teal-700">
                  <span>TOKEN #</span>
                  <span className="font-black text-xl">{printedOrderData.tokenNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span>#{printedOrderData.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Type:</span>
                  <span className="font-bold">{printedOrderData.orderType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-bold truncate max-w-[180px]">{printedOrderData.address}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-bold">{printedOrderData.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{printedOrderData.timestamp}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 py-1">
                {printedOrderData.items.map(({ item, quantity }) => {
                  const price = currency === 'TZS' ? item.priceTZS : (item.priceUSD ?? item.price);
                  return (
                    <div key={item.id} className="flex justify-between text-[11px]">
                      <span className="truncate max-w-[180px]">{quantity}x {item.name}</span>
                      <span className="font-bold">{formatPrice(price * quantity, currency)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-dashed border-neutral-300 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(printedOrderData.subtotal, currency)}</span>
                </div>
                {printedOrderData.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span>+{formatPrice(printedOrderData.deliveryFee, currency)}</span>
                  </div>
                )}
                {printedOrderData.discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount:</span>
                    <span>-{formatPrice(printedOrderData.discount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm pt-1 border-t border-neutral-300">
                  <span>TOTAL PAID:</span>
                  <span>{formatPrice(printedOrderData.total, currency)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Method:</span>
                  <span>{printedOrderData.paymentMethod}</span>
                </div>
                {printedOrderData.changeDue > 0 && (
                  <div className="flex justify-between font-bold text-teal-700">
                    <span>Change Due (Chenji):</span>
                    <span>{formatPrice(printedOrderData.changeDue, currency)}</span>
                  </div>
                )}
                {printedOrderData.transactionId && (
                  <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>Ref / Trx ID:</span>
                    <span className="font-mono">{printedOrderData.transactionId}</span>
                  </div>
                )}
              </div>

              {/* Barcode & Thank You */}
              <div className="text-center pt-3 space-y-1">
                <div className="text-[10px] tracking-widest text-neutral-400 font-mono">
                  ||||| | |||| ||| |||||| |||| ||
                </div>
                <p className="text-[10px] font-bold text-neutral-700">
                  Asante kwa kuchagua Zebra Restaurant! Karibu tena.
                </p>
              </div>
            </div>

            {/* Receipt Actions */}
            <div className="p-3 bg-neutral-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowReceiptModal(false);
                  setActiveTab('oss');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer"
                title="Tazama maendeleo ya token hii kwenye OSS Screen"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Angalia OSS</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
