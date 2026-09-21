import React, { useState } from 'react';
import {
  Receipt,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Phone,
  Download,
  Filter,
  X
} from 'lucide-react';
import { INITIAL_TRANSACTIONS, AdminTransaction } from './adminMockData';
import { formatPrice } from '../../utils/formatters';

interface AdminTransactionsViewProps {
  currency: 'USD' | 'TZS';
}

export const AdminTransactionsView: React.FC<AdminTransactionsViewProps> = ({ currency }) => {
  const [transactions, setTransactions] = useState<AdminTransaction[]>(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState<AdminTransaction | null>(null);

  const filtered = transactions.filter(t => {
    return (
      t.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.referenceCode.toLowerCase().includes(search.toLowerCase()) ||
      t.provider.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div>
          <h2 className="text-base font-bold font-display text-neutral-900 dark:text-white flex items-center space-x-2">
            <span>Payment & USSD Transactions</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full">
              Till #445566 (Lipa Namba)
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time webhook settlements from M-Pesa, Tigo Pesa, Airtel Money, and HaloPesa
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search reference, customer, order..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-500 font-semibold">
                <th className="py-3 px-4">Ref Code</th>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-white">
                    {t.referenceCode}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-orange-600 dark:text-orange-400 font-semibold">
                    {t.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-neutral-900 dark:text-white">{t.customerName}</p>
                    <p className="text-[10px] text-neutral-400">{t.customerPhone}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {t.provider}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(t.amount, currency)}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400">
                    {t.date} {t.time}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        t.status === 'success'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedTx(t)}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#18181b] rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">USSD Transaction Receipt</h3>
              <button onClick={() => setSelectedTx(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Payment Channel:</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedTx.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Merchant Till:</span>
                  <span className="font-mono font-bold">{selectedTx.tillNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Reference Token:</span>
                  <span className="font-mono font-bold text-orange-600">{selectedTx.referenceCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Customer Payer:</span>
                  <span className="font-bold">{selectedTx.customerName}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span>Amount Settled:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatPrice(selectedTx.amount, currency)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
