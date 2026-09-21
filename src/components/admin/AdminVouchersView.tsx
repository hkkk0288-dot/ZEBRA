import React, { useState } from 'react';
import {
  Gift,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Percent,
  Tag,
  Copy,
  Check,
  X
} from 'lucide-react';
import { INITIAL_VOUCHERS, AdminVoucher } from './adminMockData';

interface AdminVouchersViewProps {
  currency: 'USD' | 'TZS';
}

export const AdminVouchersView: React.FC<AdminVouchersViewProps> = ({ currency }) => {
  const [vouchers, setVouchers] = useState<AdminVoucher[]>(INITIAL_VOUCHERS);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Voucher State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [discountValue, setDiscountValue] = useState('20');
  const [minOrder, setMinOrder] = useState('20000');
  const [maxUsage, setMaxUsage] = useState('500');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const filtered = vouchers.filter(
    v => v.code.toLowerCase().includes(search.toLowerCase()) || v.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !title) return;

    const newV: AdminVoucher = {
      id: `vch-${Date.now()}`,
      code: code.toUpperCase().trim(),
      title,
      discountType: 'percentage',
      discountValue: parseInt(discountValue) || 20,
      minOrder: parseInt(minOrder) || 15000,
      usageCount: 0,
      maxUsage: parseInt(maxUsage) || 500,
      expiryDate,
      status: 'active'
    };

    setVouchers([newV, ...vouchers]);
    setShowAddModal(false);
    setCode('');
    setTitle('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div>
          <h2 className="text-base font-bold font-display text-neutral-900 dark:text-white flex items-center space-x-2">
            <span>Promotions & Coupon Vouchers</span>
            <span className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold px-2.5 py-0.5 rounded-full">
              {vouchers.length} Active Codes
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Create discount campaign codes, set minimum checkout baskets, and track redemptions
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search code or offer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Voucher</span>
          </button>
        </div>
      </div>

      {/* Vouchers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(v => {
          const usagePercent = Math.round((v.usageCount / v.maxUsage) * 100);

          return (
            <div
              key={v.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white font-mono tracking-wider">
                      {v.code}
                    </h3>
                    <p className="text-[11px] text-neutral-400">{v.title}</p>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(v.code)}
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  title="Copy Promo Code"
                >
                  {copiedCode === v.code ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Discount:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {v.discountValue}% OFF
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Min Order:</span>
                  <span className="font-bold text-neutral-900 dark:text-white font-mono">
                    {v.minOrder.toLocaleString()} TZS
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Expires:</span>
                  <span className="text-neutral-700 dark:text-neutral-300">{v.expiryDate}</span>
                </div>

                {/* Usage Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-neutral-400">
                    <span>Redemptions</span>
                    <span>{v.usageCount} / {v.maxUsage} ({usagePercent}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, usagePercent)}%` }}
                      className="h-full bg-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Voucher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#18181b] rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Create New Promo Voucher</h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">Voucher Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. KARIBU50"
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono uppercase font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. 50% Weekend Feast Discount"
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">Discount (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={discountValue}
                    onChange={e => setDiscountValue(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">Min Spend (TZS)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={e => setMinOrder(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Publish Voucher
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
