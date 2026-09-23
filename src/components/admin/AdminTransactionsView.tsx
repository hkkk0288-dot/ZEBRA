import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Phone,
  Download,
  Filter,
  X,
  Zap,
  RefreshCw,
  Send
} from 'lucide-react';
import { INITIAL_TRANSACTIONS, AdminTransaction } from './adminMockData';
import { formatPrice } from '../../utils/formatters';
import { mongikeService, MongikeGatewayStatus, MongikeTransactionItem } from '../../services/mongikeService';

interface AdminTransactionsViewProps {
  currency: 'USD' | 'TZS';
}

export const AdminTransactionsView: React.FC<AdminTransactionsViewProps> = ({ currency }) => {
  const [transactions, setTransactions] = useState<AdminTransaction[]>(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState<AdminTransaction | null>(null);

  // Mongike Status & Live History
  const [gatewayStatus, setGatewayStatus] = useState<MongikeGatewayStatus | null>(null);
  const [liveHistory, setLiveHistory] = useState<MongikeTransactionItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'mongike_live'>('all');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Test STK Push Modal
  const [showTestModal, setShowTestModal] = useState(false);
  const [testPhone, setTestPhone] = useState('255712345678');
  const [testAmount, setTestAmount] = useState('2000');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    mongikeService.getStatus().then(setGatewayStatus).catch(() => null);
    fetchLiveHistory();
  }, []);

  const fetchLiveHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await mongikeService.getHistory();
      if (res.data) {
        setLiveHistory(res.data);
      }
    } catch (err) {
      console.warn('History fetch error:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleTestStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingTest(true);
    setTestResult(null);

    try {
      const orderId = `TEST-${Math.floor(1000 + Math.random() * 9000)}`;
      const res = await mongikeService.initiatePayment({
        orderId,
        amount: parseFloat(testAmount),
        buyerPhone: testPhone,
        feePayer: 'MERCHANT',
        buyerName: 'Zebra Admin Tester'
      });

      setTestResult(res);

      if (res.status === 'success' && res.data) {
        // Add to live transactions
        const newTx: AdminTransaction = {
          id: `tx-${Date.now()}`,
          orderNumber: res.data.order_id,
          customerName: 'Mongike Test Customer',
          customerPhone: testPhone,
          amount: parseFloat(testAmount) / 2600,
          currency: 'TZS',
          tillNumber: '445566',
          date: 'Leo',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'success',
          provider: 'Mongike Mobile Money',
          referenceCode: res.data.gateway_ref
        };
        setTransactions(prev => [newTx, ...prev]);
      }
    } catch (err: any) {
      setTestResult({ status: 'error', message: err.message });
    } finally {
      setIsSendingTest(false);
    }
  };

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
            <span>Payment & Gateway Transactions</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <span>⚡</span>
              <span>Mongike Tanzania (API v1)</span>
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time Mobile Money Webhooks: M-Pesa, Tigo Pesa, Airtel Money, HaloPesa
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowTestModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Jaribu STK Push</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search reference, customer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Gateway Status Banner */}
      <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-neutral-800 dark:text-neutral-200">
            Mongike Endpoint:
          </span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            POST /api/v1/payments/mobile-money/tanzania
          </span>
        </div>

        <div className="flex items-center space-x-2 text-neutral-500 text-[11px]">
          <span>Carriers:</span>
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
            M-Pesa • Tigo Pesa • Airtel • HaloPesa
          </span>
          <button
            onClick={fetchLiveHistory}
            disabled={isLoadingHistory}
            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingHistory ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-500 font-semibold">
                <th className="py-3 px-4">Ref Code / Gateway Ref</th>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Provider / Method</th>
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
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
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

      {/* Test STK Push Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#151518] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowTestModal(false)}
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
                  Jaribu Mongike STK Push (TZ)
                </h3>
                <p className="text-xs text-neutral-500">
                  POST /api/v1/payments/mobile-money/tanzania
                </p>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-2xl mb-4 text-xs ${
                  testResult.status === 'success'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                }`}
              >
                <div className="font-bold mb-1">
                  {testResult.status === 'success' ? 'STK Push Imefanikiwa!' : 'Tatizo Limetokea'}
                </div>
                {testResult.data && (
                  <div className="space-y-0.5 font-mono text-[11px]">
                    <div>Gateway Ref: <strong>{testResult.data.gateway_ref}</strong></div>
                    <div>Status: <strong>{testResult.data.status}</strong></div>
                    <div>Expires: {new Date(testResult.data.expires_at).toLocaleTimeString()}</div>
                  </div>
                )}
                {testResult.message && <div>{testResult.message}</div>}
              </div>
            )}

            <form onSubmit={handleTestStkPush} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Namba ya Simu ya Mnunuzi (buyer_phone)
                </label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={e => setTestPhone(e.target.value)}
                  placeholder="255712345678 (Bila +)"
                  required
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Kiasi cha Malipo TZS (amount)
                </label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={testAmount}
                  onChange={e => setTestAmount(e.target.value)}
                  placeholder="2000"
                  required
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowTestModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Funga
                </button>
                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/30 transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5"
                >
                  {isSendingTest ? (
                    <span>Inatuma STK...</span>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Rushia Simu Sasa</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
