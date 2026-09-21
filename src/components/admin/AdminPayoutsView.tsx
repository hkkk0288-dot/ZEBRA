import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  Download,
  DollarSign,
  ArrowUpRight,
  Filter,
  Check
} from 'lucide-react';
import { INITIAL_PAYOUTS, AdminPayout } from './adminMockData';
import { formatPrice } from '../../utils/formatters';

interface AdminPayoutsViewProps {
  currency: 'USD' | 'TZS';
}

export const AdminPayoutsView: React.FC<AdminPayoutsViewProps> = ({ currency }) => {
  const [payouts, setPayouts] = useState<AdminPayout[]>(INITIAL_PAYOUTS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'processing'>('all');

  const filtered = payouts.filter(p => {
    const matchesSearch =
      p.merchantName.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.bankOrTill.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleProcessPayout = (id: string) => {
    setPayouts(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'paid' as const } : p))
    );
    alert('Payout processed successfully! Funds transferred to merchant till/bank account.');
  };

  const totalPaid = payouts
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payouts
    .filter(p => p.status !== 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div>
          <h2 className="text-base font-bold font-display text-neutral-900 dark:text-white flex items-center space-x-2">
            <span>Merchant Payouts & Settlement</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full">
              Automated Banking
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Disburse restaurant kitchen branch earnings, review bank statements, and track tax deductions
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              alert('Downloading monthly Payouts Statement CSV...');
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold shadow-2xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <span className="text-xs text-neutral-500 block">Total Settled Disbursements</span>
          <h3 className="text-2xl font-black font-display font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {formatPrice(totalPaid, currency)}
          </h3>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <span className="text-xs text-neutral-500 block">Pending Payout Approvals</span>
          <h3 className="text-2xl font-black font-display font-mono text-orange-600 dark:text-orange-400 mt-1">
            {formatPrice(totalPending, currency)}
          </h3>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-500 font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Merchant Kitchen</th>
                <th className="py-3 px-4">Payout Amount</th>
                <th className="py-3 px-4">Bank / Till Account</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-white">
                    {p.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                    {p.merchantName}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(p.amount, currency)}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-300">
                    {p.bankOrTill}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400">
                    {p.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        p.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : p.status === 'processing'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {p.status !== 'paid' ? (
                      <button
                        onClick={() => handleProcessPayout(p.id)}
                        className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        Release Funds
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-500 font-bold flex items-center justify-end space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Settled</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
