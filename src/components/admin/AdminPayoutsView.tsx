import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  Download,
  DollarSign,
  ArrowUpRight,
  Filter,
  Check,
  Send,
  RefreshCw,
  X,
  Wallet
} from 'lucide-react';
import { INITIAL_PAYOUTS, AdminPayout } from './adminMockData';
import { formatPrice } from '../../utils/formatters';
import { mongikeService } from '../../services/mongikeService';

interface AdminPayoutsViewProps {
  currency: 'USD' | 'TZS';
}

export const AdminPayoutsView: React.FC<AdminPayoutsViewProps> = ({ currency }) => {
  const [payouts, setPayouts] = useState<AdminPayout[]>(INITIAL_PAYOUTS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'processing'>('all');

  // Mongike Wallet Balance & Payout State
  const [mongikeBalance, setMongikeBalance] = useState<number>(500000);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawPhone, setWithdrawPhone] = useState('255712345678');
  const [withdrawAmount, setWithdrawAmount] = useState('10000');
  const [recipientName, setRecipientName] = useState('Rashid Rider');
  const [narration, setNarration] = useState('Weekly Courier Settlement');
  const [isSendingWithdraw, setIsSendingWithdraw] = useState(false);
  const [withdrawNotice, setWithdrawNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchBalance = async () => {
    setIsLoadingBalance(true);
    try {
      const res = await mongikeService.getBalance();
      if (res.data?.balance !== undefined) {
        setMongikeBalance(res.data.balance);
      }
    } catch (err) {
      console.warn('Balance fetch error:', err);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (!amountNum || amountNum <= 0) {
      setWithdrawNotice({ type: 'error', message: 'Kiasi hakiko sahihi' });
      return;
    }

    setIsSendingWithdraw(true);
    setWithdrawNotice(null);

    try {
      const res = await mongikeService.withdraw({
        amount: amountNum,
        recipientPhone: withdrawPhone,
        recipientName,
        narration
      });

      if (res.status === 'success' && res.data) {
        setWithdrawNotice({
          type: 'success',
          message: `Payout ya TZS ${amountNum.toLocaleString()} imetumwa kikamilifu kwenda ${withdrawPhone}! Ref: ${res.data.reference}`
        });

        // Add to local list
        const newPayout: AdminPayout = {
          id: `po-${Date.now()}`,
          merchantId: 'm-01',
          currency: 'TZS',
          invoiceNumber: res.data.reference || `PO_${Date.now()}`,
          merchantName: recipientName || 'Rider / Supplier',
          amount: amountNum / 2600,
          date: 'Leo, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'paid',
          bankOrTill: `Mongike Mobile Money (${withdrawPhone})`
        };

        setPayouts(prev => [newPayout, ...prev]);
        setMongikeBalance(prev => Math.max(0, prev - amountNum));

        setTimeout(() => {
          setShowWithdrawModal(false);
          setWithdrawNotice(null);
        }, 2500);
      } else {
        setWithdrawNotice({
          type: 'error',
          message: res.message || 'Mongike Payout imeshindikana. Kagua namba na salio.'
        });
      }
    } catch (err: any) {
      setWithdrawNotice({
        type: 'error',
        message: err.message || 'Error occurred during Mongike payout'
      });
    } finally {
      setIsSendingWithdraw(false);
    }
  };

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
            <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <span>⚡</span>
              <span>Mongike API Connected</span>
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Disburse restaurant earnings, send mobile money payouts (POST /api/v1/payouts/withdraw)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Tuma Payout (Mongike)</span>
          </button>

          <button
            onClick={() => {
              alert('Downloading monthly Payouts Statement CSV...');
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Mongike Live Wallet Balance */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:bg-[#151518] border border-emerald-500/30 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <Wallet className="w-3.5 h-3.5" />
              <span>Salio la Mongike Wallet</span>
            </span>
            <button
              onClick={fetchBalance}
              disabled={isLoadingBalance}
              title="Refresh Mongike Balance"
              className="p-1 rounded-lg hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingBalance ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <h3 className="text-2xl font-black font-display font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {mongikeBalance.toLocaleString()} TZS
          </h3>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
            GET /api/v1/wallet/balance (Instant Liquid Balance)
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <span className="text-xs text-neutral-500 block">Total Settled Disbursements</span>
          <h3 className="text-2xl font-black font-display font-mono text-neutral-900 dark:text-white mt-1">
            {formatPrice(totalPaid, currency)}
          </h3>
          <p className="text-[10px] text-neutral-400 mt-1">Zilizoidhinishwa na kulipwa</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <span className="text-xs text-neutral-500 block">Pending Payout Approvals</span>
          <h3 className="text-2xl font-black font-display font-mono text-orange-600 dark:text-orange-400 mt-1">
            {formatPrice(totalPending, currency)}
          </h3>
          <p className="text-[10px] text-neutral-400 mt-1">Zinazosubiri uhakiki</p>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#151518] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-lg">
                ⚡
              </div>
              <div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                  Tuma Payout kupitia Mongike
                </h3>
                <p className="text-xs text-neutral-500">
                  POST https://mongike.com/api/v1/payouts/withdraw
                </p>
              </div>
            </div>

            {withdrawNotice && (
              <div
                className={`p-3 rounded-2xl mb-4 text-xs font-semibold ${
                  withdrawNotice.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                }`}
              >
                {withdrawNotice.message}
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Namba ya Simu ya Mpokeaji (recipient_phone)
                </label>
                <input
                  type="text"
                  value={withdrawPhone}
                  onChange={e => setWithdrawPhone(e.target.value)}
                  placeholder="255712345678 (Bila +)"
                  required
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Jina la Mpokeaji (recipient_name - optional)
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder="e.g. Rashid Juma Mwinyi"
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Kiasi cha TZS (amount)
                </label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  placeholder="10000"
                  required
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm"
                />
                <span className="text-[10px] text-neutral-400 mt-0.5 block">
                  Salio lililopo: {mongikeBalance.toLocaleString()} TZS
                </span>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Maelezo (narration - optional)
                </label>
                <input
                  type="text"
                  value={narration}
                  onChange={e => setNarration(e.target.value)}
                  placeholder="Malipo ya oda au delivery"
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  disabled={isSendingWithdraw}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/30 transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5"
                >
                  {isSendingWithdraw ? (
                    <span>Inatuma...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Tuma Sasa</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
