import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Bike,
  XCircle,
  Eye,
  Printer,
  ChevronDown,
  UserCheck,
  Plus,
  X,
  Phone,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { INITIAL_DRIVERS } from './adminMockData';

interface AdminOrdersViewProps {
  isDark: boolean;
}

export const AdminOrdersView: React.FC<AdminOrdersViewProps> = ({ isDark }) => {
  const { orders, updateOrderStatus, currency, openThermalReceipt } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New order form state
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [orderItemDesc, setOrderItemDesc] = useState('1x Melting Cheese Pizza, 1x Passion Mojito');
  const [orderPrice, setOrderPrice] = useState('28500');

  // Filter orders
  const filteredOrders = orders.filter(ord => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer.phone.toLowerCase().includes(search.toLowerCase()) ||
      ord.customer.address.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'all' ? true : ord.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
      case 'on_the_way':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-500/30';
      case 'preparing':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-500/30';
      case 'cancelled':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-500/30';
      default:
        return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div>
          <h2 className="text-base font-bold font-display text-neutral-900 dark:text-white flex items-center space-x-2">
            <span>Customer Orders Management</span>
            <span className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold px-2.5 py-0.5 rounded-full">
              {filteredOrders.length} Total
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage dispatch, update cooking status, assign couriers, and generate receipts
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search order, customer, phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
            />
          </div>

          <div className="flex space-x-1 overflow-x-auto no-scrollbar py-0.5">
            {['all', 'pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl whitespace-nowrap capitalize transition-all ${
                  filterStatus === st
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-500 font-semibold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-neutral-400">
                    No orders matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(ord => (
                  <tr
                    key={ord.id}
                    className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-600 dark:text-orange-400">
                      {ord.orderNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-neutral-900 dark:text-white">{ord.customer.name}</p>
                      <p className="text-[11px] text-neutral-400">{ord.customer.phone}</p>
                      <p className="text-[10px] text-neutral-400 truncate max-w-[160px]">{ord.customer.address}</p>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300 max-w-[200px]">
                      <p className="truncate font-medium">
                        {ord.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ') || 'Custom Dish'}
                      </p>
                      <span className="text-[10px] text-neutral-400">{ord.date}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-white">
                      {formatPrice(ord.total, currency)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {ord.paymentMethod === 'ussd_mpesa' ? 'M-Pesa USSD' : ord.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={ord.status}
                        onChange={e => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-bold rounded-xl px-2.5 py-1 outline-none cursor-pointer ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="on_the_way">On the Way</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => openThermalReceipt(null, ord)}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                          title="Print Thermal POS Receipt (80mm/58mm)"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                          title="View Details / Receipt"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setAssigningOrder(ord)}
                          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                          title="Assign Courier"
                        >
                          <Bike className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details / Receipt Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#18181b] rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                  Order Invoice {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-neutral-400">Date: {selectedOrder.date}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 space-y-1">
                <p className="font-bold text-neutral-900 dark:text-white">{selectedOrder.customer.name}</p>
                <p className="text-neutral-500">{selectedOrder.customer.phone}</p>
                <p className="text-neutral-600 dark:text-neutral-300">{selectedOrder.customer.address}</p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[11px]">
                  Ordered Items
                </p>
                <div className="space-y-1.5 divide-y divide-neutral-100 dark:divide-neutral-800">
                  {selectedOrder.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between py-1.5">
                      <span>{i.quantity}x {i.menuItem.name} ({i.selectedSize.label})</span>
                      <span className="font-mono font-bold">{formatPrice(i.totalPrice, currency)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1 text-right">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrder.subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Delivery Fee:</span>
                  <span>{formatPrice(selectedOrder.deliveryFee, currency)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white pt-1">
                  <span>Total Settled:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    {formatPrice(selectedOrder.total, currency)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Kitchen Receipt</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Courier Modal */}
      {assigningOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#18181b] rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                Dispatch Courier for {assigningOrder.orderNumber}
              </h3>
              <button onClick={() => setAssigningOrder(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-neutral-500">Select available Boda-boda driver in this zone:</p>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {INITIAL_DRIVERS.map(driver => (
                  <div
                    key={driver.id}
                    onClick={() => {
                      updateOrderStatus(assigningOrder.id, 'on_the_way');
                      alert(`Order ${assigningOrder.orderNumber} dispatched to ${driver.name} (${driver.plateNumber})!`);
                      setAssigningOrder(null);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-orange-500 hover:bg-orange-50/20 dark:hover:bg-orange-950/20 cursor-pointer transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      <img src={driver.avatar} alt={driver.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-white">{driver.name}</p>
                        <p className="text-[10px] text-neutral-400">{driver.plateNumber} • {driver.zone}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Assign →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
