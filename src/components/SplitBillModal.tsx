import React, { useState } from 'react';
import {
  X,
  Users,
  UtensilsCrossed,
  Smartphone,
  CheckCircle2,
  Receipt,
  Plus,
  Minus,
  Sparkles,
  CreditCard,
  Banknote,
  Share2
} from 'lucide-react';
import { TableOrder, Order, BillSplitShare } from '../types';
import { formatPrice } from '../utils/formatters';
import { playPaymentSuccessChime } from '../utils/soundEffects';

interface SplitBillModalProps {
  tableOrder?: TableOrder | null;
  onlineOrder?: Order | null;
  onClose: () => void;
  onPaymentComplete?: () => void;
}

export const SplitBillModal: React.FC<SplitBillModalProps> = ({
  tableOrder,
  onlineOrder,
  onClose,
  onPaymentComplete
}) => {
  const totalAmountTZS = tableOrder?.totalTZS || (onlineOrder ? Math.round(onlineOrder.total * 2600) : 50000);
  const tableNumber = tableOrder?.tableNumber || onlineOrder?.tableNumber || 'Table 01';
  const orderNumber = tableOrder?.orderNumber || onlineOrder?.orderNumber || 'TBL-001';

  const [guestCount, setGuestCount] = useState<number>(tableOrder?.guestCount || 3);
  const [splitMode, setSplitMode] = useState<'equal' | 'custom'>('equal');

  // Generate shares for equal split
  const perPersonAmount = Math.ceil(totalAmountTZS / guestCount);
  
  const [shares, setShares] = useState<BillSplitShare[]>(() => {
    return Array.from({ length: guestCount }).map((_, idx) => ({
      id: `share-${idx + 1}`,
      guestName: `Mgeni #${idx + 1}`,
      guestPhone: '',
      amountTZS: perPersonAmount,
      status: 'pending'
    }));
  });

  const handleGuestCountChange = (newCount: number) => {
    if (newCount < 2 || newCount > 12) return;
    setGuestCount(newCount);
    const newPerPerson = Math.ceil(totalAmountTZS / newCount);
    setShares(prev => {
      return Array.from({ length: newCount }).map((_, idx) => {
        const existing = prev[idx];
        return {
          id: existing?.id || `share-${idx + 1}`,
          guestName: existing?.guestName || `Mgeni #${idx + 1}`,
          guestPhone: existing?.guestPhone || '',
          amountTZS: newPerPerson,
          status: existing?.status || 'pending',
          paidVia: existing?.paidVia,
          paidAt: existing?.paidAt
        };
      });
    });
  };

  const handleMarkPaid = (shareId: string, method: string) => {
    playPaymentSuccessChime();
    setShares(prev =>
      prev.map(sh =>
        sh.id === shareId
          ? {
              ...sh,
              status: 'paid',
              paidVia: method,
              paidAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : sh
      )
    );
  };

  const paidSharesCount = shares.filter(s => s.status === 'paid').length;
  const paidTotalTZS = shares
    .filter(s => s.status === 'paid')
    .reduce((acc, s) => acc + s.amountTZS, 0);
  const isFullySettled = paidSharesCount === shares.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-[#16161a] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden relative my-auto animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                <span>Gawana Bili ya Meza (Split Bill)</span>
              </h2>
              <p className="text-xs text-neutral-500">
                {tableNumber} • Jumla Kuu: {formatPrice(totalAmountTZS, 'TZS')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Progress Banner */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isFullySettled
              ? 'bg-emerald-500/10 border-emerald-500/40'
              : 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800'
          }`}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {isFullySettled ? '🎉 BILI IMELIPWA YOTE KIKAMILIFU!' : 'Maendeleo ya Malipo ya Meza:'}
              </span>
              <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {formatPrice(paidTotalTZS, 'TZS')} / {formatPrice(totalAmountTZS, 'TZS')}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (paidTotalTZS / totalAmountTZS) * 100)}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-2 text-[11px] text-neutral-500">
              <span>Wageni waliolipa: {paidSharesCount} kati ya {shares.length}</span>
              <span>Baki: {formatPrice(Math.max(0, totalAmountTZS - paidTotalTZS), 'TZS')}</span>
            </div>
          </div>

          {/* Guest Count Selector */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
            <div>
              <p className="text-xs font-bold text-neutral-900 dark:text-white">Idadi ya Wageni Mezani</p>
              <p className="text-[11px] text-neutral-500">Kila mmoja atalipa kiasi sawa cha mlo</p>
            </div>

            <div className="flex items-center space-x-3 bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-xs">
              <button
                type="button"
                onClick={() => handleGuestCountChange(guestCount - 1)}
                disabled={guestCount <= 2}
                className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="font-bold text-sm font-mono w-6 text-center text-neutral-900 dark:text-white">
                {guestCount}
              </span>

              <button
                type="button"
                onClick={() => handleGuestCountChange(guestCount + 1)}
                disabled={guestCount >= 12}
                className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Each Guest's Share Card */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Kila Mgeni Analipa: {formatPrice(perPersonAmount, 'TZS')}
            </p>

            {shares.map((share, idx) => (
              <div
                key={share.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  share.status === 'paid'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      share.status === 'paid'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}>
                      {share.status === 'paid' ? '✓' : idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-neutral-900 dark:text-white">
                        {share.guestName}
                      </h4>
                      <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {formatPrice(share.amountTZS, 'TZS')}
                      </p>
                    </div>
                  </div>

                  {share.status === 'paid' ? (
                    <div className="text-right">
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Imelipwa ({share.paidVia})</span>
                      </span>
                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{share.paidAt}</p>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleMarkPaid(share.id, 'M-Pesa / Tigo')}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1 cursor-pointer"
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>Lipa Simu</span>
                      </button>

                      <button
                        onClick={() => handleMarkPaid(share.id, 'Cash / Kadi')}
                        className="px-2 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
                        title="Lipa kwa pesa taslimu au kadi"
                      >
                        Cash
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Paybill instructions for the whole group */}
          <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between">
            <div>
              <p className="font-bold text-neutral-800 dark:text-white">Namba ya Lipa Meza:</p>
              <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                M-Pesa / Tigo: 445566 (Zebra Masaki)
              </p>
            </div>
            <span className="text-[11px] bg-neutral-200 dark:bg-neutral-700 px-2 py-1 rounded-lg font-mono">
              Ref: {orderNumber}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Funga
          </button>

          {isFullySettled ? (
            <button
              onClick={() => {
                if (onPaymentComplete) onPaymentComplete();
                onClose();
              }}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kamilisha & Funga Meza</span>
            </button>
          ) : (
            <div className="text-right text-xs text-neutral-500">
              Malipo yanakamilika baada ya wageni wote kulipa
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
