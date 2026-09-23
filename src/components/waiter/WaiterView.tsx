import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  Bell,
  Search,
  X,
  CreditCard,
  DollarSign,
  Coffee,
  Receipt,
  UserCheck,
  Send,
  RefreshCw,
  LogOut,
  ChevronRight,
  Printer,
  Sparkles,
  Layers,
  ChefHat,
  QrCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem, TableOrder, TableOrderItem, RestaurantTable } from '../../types';
import {
  fetchTableOrdersFromFirestore,
  saveTableOrderToFirestore,
  updateTableOrderStatusInFirestore,
  subscribeToTableOrders
} from '../../services/firebaseDbService';

const DEFAULT_TABLES: RestaurantTable[] = [
  { id: 'tbl-1', name: 'Table 01', section: 'Indoor', capacity: 4, status: 'occupied', currentOrderId: 'tord-101' },
  { id: 'tbl-2', name: 'Table 02', section: 'Indoor', capacity: 2, status: 'available' },
  { id: 'tbl-3', name: 'Table 03', section: 'Garden Terrace', capacity: 6, status: 'occupied', currentOrderId: 'tord-102' },
  { id: 'tbl-4', name: 'Table 04', section: 'Indoor', capacity: 4, status: 'billing', currentOrderId: 'tord-103' },
  { id: 'tbl-5', name: 'VIP Lounge 1', section: 'VIP Lounge', capacity: 8, status: 'occupied', currentOrderId: 'tord-104' },
  { id: 'tbl-6', name: 'Table 06', section: 'Garden Terrace', capacity: 4, status: 'available' },
  { id: 'tbl-7', name: 'Table 07', section: 'Indoor', capacity: 2, status: 'cleaning' },
  { id: 'tbl-8', name: 'VIP Deck 2', section: 'VIP Lounge', capacity: 10, status: 'available' },
];

const INITIAL_TABLE_ORDERS: TableOrder[] = [
  {
    id: 'tord-101',
    orderNumber: 'TBL-101',
    tableNumber: 'Table 01',
    waiterName: 'Neema Mwamburi',
    waiterId: 'usr-wtr-5',
    guestCount: 3,
    items: [
      { dishId: 'dish-1', name: 'Mishkaki ya Ng\'ombe (Beef Skewers)', quantity: 3, priceTZS: 12000, notes: 'Pili pili pembeni' },
      { dishId: 'dish-6', name: 'Chips Mayai Special na Kachumbari', quantity: 2, priceTZS: 7000 },
      { dishId: 'drink-1', name: 'Passion Juice ya Baridi (Fresh)', quantity: 3, priceTZS: 4500 }
    ],
    totalTZS: 63500,
    status: 'kitchen_prep',
    notes: 'Haraka kidogo wateja wana kikao saa nane',
    createdAt: Date.now() - 15 * 60 * 1000
  },
  {
    id: 'tord-102',
    orderNumber: 'TBL-102',
    tableNumber: 'Table 03',
    waiterName: 'Baraka Shaban',
    waiterId: 'usr-wtr-6',
    guestCount: 5,
    items: [
      { dishId: 'dish-2', name: 'Zebra Wagyu Double Smash Burger', quantity: 2, priceTZS: 24000 },
      { dishId: 'dish-7', name: 'Samaki wa Kupaka wa Nazi (Whole Tilapia)', quantity: 2, priceTZS: 32000 },
      { dishId: 'dish-8', name: 'Ugali ya Dona na Sukuma Wiki', quantity: 2, priceTZS: 4000 }
    ],
    totalTZS: 120000,
    status: 'ready_to_serve',
    notes: 'VIP Family - wape napkins za ziada',
    createdAt: Date.now() - 32 * 60 * 1000
  },
  {
    id: 'tord-103',
    orderNumber: 'TBL-103',
    tableNumber: 'Table 04',
    waiterName: 'Neema Mwamburi',
    waiterId: 'usr-wtr-5',
    guestCount: 2,
    items: [
      { dishId: 'dish-4', name: 'Truffle Mushroom Artisan Pizza', quantity: 1, priceTZS: 28000 },
      { dishId: 'drink-3', name: 'Espresso ya Kilimanjaro', quantity: 2, priceTZS: 5000 }
    ],
    totalTZS: 38000,
    status: 'served',
    notes: 'Wanaomba kulipa na M-Pesa lipa namba',
    createdAt: Date.now() - 50 * 60 * 1000
  }
];

export const WaiterView: React.FC = () => {
  const {
    menuItems,
    setActiveTab,
    user,
    tables,
    setTables,
    tableOrders: orders,
    setTableOrders: setOrders,
    waiterCalls,
    dismissWaiterCall,
    setActiveQrTable
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<'tables' | 'orders' | 'kitchen'>('tables');
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState<TableOrder | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New order state
  const [targetTable, setTargetTable] = useState('Table 02');
  const [guestCount, setGuestCount] = useState(2);
  const [orderNotes, setOrderNotes] = useState('');
  const [selectedDishes, setSelectedDishes] = useState<{ [dishId: string]: number }>({});
  const [dishSearch, setDishSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cloudSynced, setCloudSynced] = useState(false);

  const waiterDisplayName = user?.name || 'Neema Mwamburi (Staff Waiter)';

  // Sync with Firestore
  useEffect(() => {
    let unsubscribe = () => {};
    const initCloud = async () => {
      try {
        const cloudOrders = await fetchTableOrdersFromFirestore();
        if (cloudOrders && cloudOrders.length > 0) {
          setOrders(cloudOrders);
          setCloudSynced(true);
        } else {
          // Upload initial sample orders to Firestore so console is populated!
          for (const ord of INITIAL_TABLE_ORDERS) {
            await saveTableOrderToFirestore(ord);
          }
          setCloudSynced(true);
        }

        unsubscribe = subscribeToTableOrders((latest) => {
          if (latest && latest.length > 0) {
            setOrders(latest);
            setCloudSynced(true);
          }
        });
      } catch (err) {
        console.warn("Table orders cloud notice:", err);
      }
    };
    initCloud();
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleDishQtyChange = (dishId: string, delta: number) => {
    setSelectedDishes(prev => {
      const current = prev[dishId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[dishId];
        return copy;
      }
      return { ...prev, [dishId]: next };
    });
  };

  const calculateOrderTotal = () => {
    return Object.entries(selectedDishes).reduce((sum, [dishId, qty]) => {
      const item = menuItems.find(m => m.id === dishId);
      return sum + (item ? item.priceTZS * qty : 0);
    }, 0);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const items: TableOrderItem[] = Object.entries(selectedDishes).map(([dishId, qty]) => {
      const item = menuItems.find(m => m.id === dishId);
      return {
        dishId,
        name: item?.name || 'Chakula',
        quantity: qty,
        priceTZS: item?.priceTZS || 10000
      };
    });

    if (items.length === 0) {
      showToast('⚠️ Tafadhali chagua angalau chakula kimoja au kinywaji.');
      return;
    }

    const orderId = `tord-${Date.now()}`;
    const newOrder: TableOrder = {
      id: orderId,
      orderNumber: `TBL-${Math.floor(100 + Math.random() * 900)}`,
      tableNumber: targetTable,
      waiterName: waiterDisplayName,
      waiterId: user?.id || 'usr-wtr',
      guestCount,
      items,
      totalTZS: calculateOrderTotal(),
      status: 'kitchen_prep',
      notes: orderNotes.trim(),
      createdAt: Date.now()
    };

    // Update local state
    setOrders(prev => [newOrder, ...prev]);

    // Update Table status to occupied
    setTables(prev =>
      prev.map(t => (t.name === targetTable ? { ...t, status: 'occupied', currentOrderId: orderId } : t))
    );

    // Persist to Cloud Firestore
    await saveTableOrderToFirestore(newOrder);

    showToast(`✅ Oda ya ${targetTable} imepelekwa Jikoni na kuwekwa kwenye Cloud!`);
    setShowNewOrderModal(false);
    setSelectedDishes({});
    setOrderNotes('');
  };

  const handleStatusChange = async (orderId: string, nextStatus: TableOrder['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    await updateTableOrderStatusInFirestore(orderId, nextStatus);

    if (nextStatus === 'closed' || nextStatus === 'paid') {
      const targetOrder = orders.find(o => o.id === orderId);
      if (targetOrder) {
        setTables(prev =>
          prev.map(t =>
            t.name === targetOrder.tableNumber ? { ...t, status: 'cleaning', currentOrderId: undefined } : t
          )
        );
      }
      showToast('Oda imekamilika! Meza imewekwa tayari kusafishwa.');
    } else {
      showToast(`Hali ya oda imebadilishwa kuwa: ${nextStatus.toUpperCase()}`);
    }
  };

  const categories = ['all', ...Array.from(new Set(menuItems.map(m => m.category)))];

  const filteredMenuItems = menuItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(dishSearch.toLowerCase()) ||
      (item.swahiliName && item.swahiliName.toLowerCase().includes(dishSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-[#0c0c0e] text-neutral-900 dark:text-white p-3 sm:p-6 space-y-5">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold border border-white/10 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Waiter Navigation Bar */}
      <div className="bg-white dark:bg-[#151518] rounded-3xl p-4 sm:p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold font-display tracking-tight text-neutral-900 dark:text-white">
                Waiter & Floor Service Terminal
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live POS</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Mhudumu: <strong className="text-neutral-800 dark:text-neutral-200">{waiterDisplayName}</strong> • Kituo: Zebra Masaki Dining Hall
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {cloudSynced && (
            <span className="text-[11px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-3 py-1.5 rounded-xl border border-blue-500/20 flex items-center space-x-1.5">
              <span>☁️ Cloud Firestore Synced</span>
            </span>
          )}

          <button
            onClick={() => showToast('🔔 Kengele ya Jikoni imepigwa! Wapishi wamejulishwa mara moja.')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-xs transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Piga Kengele Jikoni</span>
          </button>

          <button
            onClick={() => setShowNewOrderModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Chukua Oda Mpya</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            <span>Admin Panel</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ACTIVE WAITER CALLS ALERTS */}
      {waiterCalls && waiterCalls.length > 0 && (
        <div className="space-y-2 animate-fadeIn">
          {waiterCalls.map(call => (
            <div
              key={call.id}
              className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-neutral-900 dark:text-white flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold animate-bounce">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400 flex items-center space-x-2">
                    <span>🚨 Kengele ya Mhudumu: {call.tableNumber}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">({call.time})</span>
                  </h4>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                    Ombi: &quot;{call.reason || 'Mhudumu anahitajika mezani'}&quot;
                  </p>
                </div>
              </div>

              <button
                onClick={() => dismissWaiterCall(call.id)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                Nimepokea (Done)
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tabs Switcher: Tables vs Orders vs Kitchen Monitor */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTabFilter('tables')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTabFilter === 'tables'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-[#151518] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Ramani ya Meza (Floor Tables)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-mono">
            {tables.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTabFilter('orders')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTabFilter === 'orders'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-[#151518] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Oda Zote za Meza (Active Orders)</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-mono">
            {orders.filter(o => o.status !== 'closed' && o.status !== 'paid').length}
          </span>
        </button>
      </div>

      {/* VIEW 1: TABLES FLOOR PLAN */}
      {activeTabFilter === 'tables' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map(table => {
              const activeOrder = orders.find(o => o.id === table.currentOrderId);
              return (
                <div
                  key={table.id}
                  onClick={() => {
                    setSelectedTable(table);
                    if (activeOrder) {
                      setShowBillModal(activeOrder);
                    } else {
                      setTargetTable(table.name);
                      setShowNewOrderModal(true);
                    }
                  }}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[170px] ${
                    table.status === 'occupied'
                      ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/40 hover:border-amber-500'
                      : table.status === 'billing'
                      ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/40 hover:border-blue-500'
                      : table.status === 'cleaning'
                      ? 'bg-neutral-200/50 dark:bg-neutral-800/40 border-neutral-300 dark:border-neutral-700'
                      : 'bg-white dark:bg-[#151518] border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                        {table.section}
                      </span>
                      <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center space-x-1.5">
                        <span>{table.name}</span>
                        {table.section.includes('VIP') && (
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        )}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">Viti: {table.capacity} Guests</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        table.status === 'occupied'
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          : table.status === 'billing'
                          ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                          : table.status === 'cleaning'
                          ? 'bg-neutral-500/20 text-neutral-600 dark:text-neutral-400'
                          : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {table.status === 'occupied'
                        ? '🟡 Wateja Wapo'
                        : table.status === 'billing'
                        ? '🔵 Bili Inasubiriwa'
                        : table.status === 'cleaning'
                        ? '⚪ Kusafisha'
                        : '🟢 Iko Wazi'}
                    </span>
                  </div>

                  {activeOrder ? (
                    <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                          {activeOrder.items.length} Aina za Vyakula
                        </span>
                        <span className="font-bold text-orange-600 dark:text-orange-400 font-mono">
                          TZS {activeOrder.totalTZS.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span>Hali: {activeOrder.status}</span>
                        <span className="text-amber-500 font-semibold underline">Ona Bili</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-neutral-400">
                      <span>Bofya kuanza oda</span>
                      <Plus className="w-4 h-4 text-emerald-500" />
                    </div>
                  )}

                  {/* QR Code Action Button */}
                  <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveQrTable(table);
                      }}
                      className="w-full py-1.5 px-2.5 rounded-xl bg-neutral-100 hover:bg-emerald-500 hover:text-white dark:bg-neutral-800 dark:hover:bg-emerald-600 text-neutral-700 dark:text-neutral-300 font-bold text-[11px] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                      title={`Tengeneza na chapisha QR Code ya ${table.name}`}
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-500 group-hover:text-white" />
                      <span>QR Code ya Meza</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: ORDERS MANAGEMENT */}
      {activeTabFilter === 'orders' && (
        <div className="space-y-3">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white dark:bg-[#151518] rounded-3xl p-4 sm:p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {order.orderNumber}
                  </span>
                  <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                    {order.tableNumber}
                  </h4>
                  <span className="text-xs text-neutral-400">({order.guestCount} Guests)</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.status === 'ready_to_serve'
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : order.status === 'kitchen_prep'
                        ? 'bg-amber-500/20 text-amber-600'
                        : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                    }`}
                  >
                    {order.status === 'kitchen_prep' && '👨‍🍳 Inapikwa Jikoni'}
                    {order.status === 'ready_to_serve' && '🍽️ Iko Tayari Kuhudumiwa!'}
                    {order.status === 'served' && '✅ Imeshahudumiwa'}
                    {order.status === 'paid' && '💰 Imelipwa'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                  {order.items.map((it, idx) => (
                    <span key={idx} className="bg-neutral-100 dark:bg-neutral-800/80 px-2 py-0.5 rounded-lg">
                      {it.quantity}x {it.name}
                    </span>
                  ))}
                </div>

                {order.notes && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium italic">
                    Maelekezo: "{order.notes}"
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3 self-end md:self-center">
                <div className="text-right">
                  <p className="text-[10px] text-neutral-400 uppercase font-bold">Jumla ya Bili</p>
                  <p className="text-base font-bold font-mono text-orange-600 dark:text-orange-400">
                    TZS {order.totalTZS.toLocaleString()}
                  </p>
                </div>

                {order.status === 'ready_to_serve' && (
                  <button
                    onClick={() => handleStatusChange(order.id, 'served')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Weka Alama: "Imeshahudumiwa"
                  </button>
                )}

                {order.status === 'served' && (
                  <button
                    onClick={() => setShowBillModal(order)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Tengeneza Bili & Lipa</span>
                  </button>
                )}

                {order.status === 'kitchen_prep' && (
                  <button
                    onClick={() => handleStatusChange(order.id, 'ready_to_serve')}
                    className="px-3 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 text-neutral-800 dark:text-neutral-200 font-semibold text-xs cursor-pointer"
                  >
                    Chef Tayari
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: TAKE NEW TABLE ORDER */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-[#18181b] rounded-3xl p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center space-x-2">
                  <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                  <span>Chukua Oda ya Meza (Table POS)</span>
                </h3>
                <p className="text-xs text-neutral-400">Chagua meza, idadi ya wageni na vyakula wanavyotaka</p>
              </div>
              <button onClick={() => setShowNewOrderModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Chagua Meza *
                  </label>
                  <select
                    value={targetTable}
                    onChange={e => setTargetTable(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold outline-none"
                  >
                    {tables.map(t => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.section} - {t.capacity} Viti)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Idadi ya Wageni (Guest Count)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={guestCount}
                    onChange={e => setGuestCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold outline-none"
                  />
                </div>
              </div>

              {/* Menu Dishes Picker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Chagua Vyakula na Vinywaji
                  </span>
                  <div className="relative w-48">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Tafuta chakula..."
                      value={dishSearch}
                      onChange={e => setDishSearch(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-[11px] text-neutral-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {categories.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCategory(c)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                        selectedCategory === c
                          ? 'bg-orange-500 text-white'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Dishes list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto no-scrollbar border border-neutral-200 dark:border-neutral-800 rounded-2xl p-2">
                  {filteredMenuItems.map(dish => {
                    const qty = selectedDishes[dish.id] || 0;
                    return (
                      <div
                        key={dish.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-neutral-900 dark:text-white truncate text-[11px]">
                            {dish.name}
                          </p>
                          <p className="text-[10px] text-orange-600 dark:text-orange-400 font-mono font-semibold">
                            TZS {dish.priceTZS.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {qty > 0 && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleDishQtyChange(dish.id, -1)}
                                className="w-6 h-6 rounded-lg bg-neutral-200 dark:bg-neutral-700 font-bold flex items-center justify-center text-xs"
                              >
                                -
                              </button>
                              <span className="w-5 text-center font-bold">{qty}</span>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDishQtyChange(dish.id, 1)}
                            className="w-6 h-6 rounded-lg bg-orange-600 text-white font-bold flex items-center justify-center text-xs shadow-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                  Maelekezo Maalumu (Kitchen Notes / Special Requests)
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={e => setOrderNotes(e.target.value)}
                  placeholder="mfano: Pili pili nyingi, maji yawe ya baridi sana"
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                />
              </div>

              {/* Total & Submit */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold">Jumla Kuu</span>
                  <p className="text-lg font-bold font-mono text-orange-600 dark:text-orange-400">
                    TZS {calculateOrderTotal().toLocaleString()}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowNewOrderModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold cursor-pointer"
                  >
                    Ghairi
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-md shadow-orange-600/30 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Tuma Oda Jikoni (KDS)</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINT BILL & SETTLE ORDER */}
      {showBillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#18181b] rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-emerald-500" />
                <span>Bili ya Meza: {showBillModal.tableNumber}</span>
              </h3>
              <button onClick={() => setShowBillModal(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Oda No: {showBillModal.orderNumber}</span>
                <span>Mhudumu: {showBillModal.waiterName}</span>
              </div>
              <div className="border-t border-dashed border-neutral-300 dark:border-neutral-700 my-2"></div>
              {showBillModal.items.map((it, i) => (
                <div key={i} className="flex justify-between font-medium">
                  <span>
                    {it.quantity}x {it.name}
                  </span>
                  <span className="font-mono">TZS {(it.priceTZS * it.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-dashed border-neutral-300 dark:border-neutral-700 my-2"></div>
              <div className="flex justify-between font-bold text-sm text-neutral-900 dark:text-white">
                <span>Jumla Kulipa</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  TZS {showBillModal.totalTZS.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-neutral-600 dark:text-neutral-300 font-semibold">
                Chagua Njia ya Malipo:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(showBillModal.id, 'paid')}
                  className="p-2.5 rounded-xl bg-emerald-600/10 border border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold text-center cursor-pointer"
                >
                  M-Pesa / Tigo
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(showBillModal.id, 'paid')}
                  className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-center cursor-pointer"
                >
                  Cash (Pesa Taslimu)
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(showBillModal.id, 'paid')}
                  className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-center cursor-pointer"
                >
                  POS / Card
                </button>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast('🖨️ Risiti inachapwa kwenye printer ya mezani...');
                  setShowBillModal(null);
                }}
                className="flex-1 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Risiti</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleStatusChange(showBillModal.id, 'paid');
                  setShowBillModal(null);
                }}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Thibitisha Malipo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
