import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  FileText,
  ChefHat,
  Receipt,
  Copy,
  Check,
  Share2,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react';
import { TableOrder, Order } from '../types';
import { formatPrice } from '../utils/formatters';

interface ThermalReceiptModalProps {
  tableOrder?: TableOrder | null;
  onlineOrder?: Order | null;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  tableOrder,
  onlineOrder,
  onClose
}) => {
  const [receiptType, setReceiptType] = useState<'kot' | 'customer_bill'>('customer_bill');
  const [copied, setCopied] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const orderNumber = tableOrder?.orderNumber || onlineOrder?.orderNumber || 'ORD-001';
  const tableNumber = tableOrder?.tableNumber || onlineOrder?.tableNumber || 'Table 01';
  const waiterName = tableOrder?.waiterName || 'Staff POS';
  const timestamp = tableOrder?.createdAt
    ? new Date(tableOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : onlineOrder?.createdAt
    ? new Date(onlineOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  // Items
  const items = tableOrder
    ? tableOrder.items.map(it => ({
        name: it.name,
        qty: it.quantity,
        price: it.priceTZS,
        total: it.quantity * it.priceTZS,
        notes: it.notes
      }))
    : (onlineOrder?.items || []).map(ci => ({
        name: `${ci.menuItem.name} (${ci.selectedSize.name})`,
        qty: ci.quantity,
        price: Math.round(ci.unitPrice * 2600),
        total: Math.round(ci.totalPrice * 2600),
        notes: ci.specialInstructions
      }));

  const totalAmountTZS = tableOrder?.totalTZS || (onlineOrder ? Math.round(onlineOrder.total * 2600) : 0);
  const guestCount = tableOrder?.guestCount || 2;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let text = '';
    if (receiptType === 'kot') {
      text = `=== KITCHEN ORDER TICKET (KOT) ===\nZEBRA RESTAURANT - MASAKI\nOrder: ${orderNumber} | Table: ${tableNumber}\nTime: ${timestamp} | Waiter: ${waiterName}\n----------------------------------\n`;
      items.forEach(i => {
        text += `[${i.qty}x] ${i.name}\n${i.notes ? `   * Maelekezo: ${i.notes}\n` : ''}`;
      });
      text += `----------------------------------\nTotal Items: ${items.reduce((acc, c) => acc + c.qty, 0)}`;
    } else {
      text = `=== ZEBRA RESTAURANT & LOUNGE ===\nPlot 44, Toure Drive, Masaki, Dar es Salaam\nTel: +255 712 345 678 | TIN: 142-990-881\nDate: ${dateStr} ${timestamp}\nTable: ${tableNumber} | Order: ${orderNumber}\n----------------------------------\n`;
      items.forEach(i => {
        text += `${i.qty}x ${i.name.padEnd(24, ' ')} ${formatPrice(i.total, 'TZS')}\n`;
      });
      text += `----------------------------------\nTOTAL: ${formatPrice(totalAmountTZS, 'TZS')}\nLIPA KWA M-PESA / TIGO: 445566\nAsante sana, Karibu tena!`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 overflow-y-auto">
      {/* Print-only CSS to isolate the thermal receipt on 80mm/58mm rolls */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #thermal-receipt-paper, #thermal-receipt-paper * {
            visibility: visible;
          }
          #thermal-receipt-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm !important;
            padding: 4mm !important;
            font-size: 11px !important;
            color: #000 !important;
            background: #fff !important;
          }
        }
      `}</style>

      <div className="w-full max-w-md bg-white dark:bg-[#16161a] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden relative my-auto animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Thermal POS Receipt / KOT
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono">
                {orderNumber} • {tableNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector: KOT (Kitchen Ticket) vs Customer Dine-In Bill */}
        <div className="p-3 bg-neutral-100 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
          <button
            onClick={() => setReceiptType('customer_bill')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              receiptType === 'customer_bill'
                ? 'bg-white dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 shadow-xs border border-emerald-500/30'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Risiti ya Bili (Guest Bill)</span>
          </button>

          <button
            onClick={() => setReceiptType('kot')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              receiptType === 'kot'
                ? 'bg-white dark:bg-neutral-800 text-amber-600 dark:text-amber-400 shadow-xs border border-amber-500/30'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>KOT ya Jikoni (Kitchen Ticket)</span>
          </button>
        </div>

        {/* Simulated Thermal Paper Container */}
        <div className="p-4 bg-neutral-200 dark:bg-[#0d0d10] max-h-[460px] overflow-y-auto flex justify-center">
          <div
            id="thermal-receipt-paper"
            ref={receiptRef}
            className="w-full max-w-[340px] bg-[#fffdfa] text-neutral-950 p-5 rounded-sm shadow-md font-mono text-[11px] leading-relaxed border-t-4 border-dashed border-neutral-300 relative select-text"
          >
            {/* Top jagged cut indicator */}
            <div className="text-center text-neutral-400 text-[9px] -mt-3 mb-2 tracking-widest">
              - - - - - - - - TEAR HERE - - - - - - - -
            </div>

            {/* Receipt Header */}
            {receiptType === 'customer_bill' ? (
              <div className="text-center space-y-0.5 border-b border-dashed border-neutral-300 pb-2 mb-2">
                <h2 className="text-sm font-black tracking-tight uppercase">ZEBRA RESTAURANT & LOUNGE</h2>
                <p className="text-[10px] text-neutral-600">Masaki Peninsula, Toure Drive, Dar es Salaam</p>
                <p className="text-[10px] text-neutral-600">Tel: +255 712 345 678 | TIN: 142-990-881</p>
                <p className="text-[10px] font-bold text-neutral-800 mt-1">*** GUEST RECEIPT / BILI YA CHAKULA ***</p>
              </div>
            ) : (
              <div className="text-center space-y-0.5 border-b-2 border-black pb-2 mb-2 bg-neutral-100 p-1.5 rounded-sm">
                <h2 className="text-base font-black tracking-wider uppercase">⚡ K.O.T - JIKONI ⚡</h2>
                <p className="text-[11px] font-bold">ZEBRA RESTAURANT KITCHEN PASS</p>
                <p className="text-[10px] text-neutral-600">Ticket No: KOT-{orderNumber.slice(-4)}</p>
              </div>
            )}

            {/* Meta details */}
            <div className="text-[10px] space-y-0.5 border-b border-dashed border-neutral-300 pb-2 mb-2">
              <div className="flex justify-between font-bold">
                <span className="text-xs">MEZA: {tableNumber}</span>
                <span>Wageni: {guestCount}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Oda: #{orderNumber}</span>
                <span>Mhudumu: {waiterName}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Tarehe: {dateStr}</span>
                <span>Muda: {timestamp}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-1.5 border-b border-dashed border-neutral-300 pb-2 mb-2">
              <div className="flex justify-between font-bold text-[10px] text-neutral-600 border-b border-neutral-200 pb-0.5 mb-1">
                <span>MAELEZO YA CHAKULA</span>
                {receiptType === 'customer_bill' && <span>BEI (TZS)</span>}
              </div>

              {items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-start font-semibold">
                    <div className="flex-1 pr-2">
                      <span className="font-bold text-xs">[{item.qty}x]</span> {item.name}
                    </div>
                    {receiptType === 'customer_bill' && (
                      <span className="font-mono text-right whitespace-nowrap">
                        {formatPrice(item.total, 'TZS').replace('TZS', '').trim()}
                      </span>
                    )}
                  </div>
                  {item.notes && (
                    <div className="text-[9.5px] italic text-red-600 pl-4 bg-red-50 py-0.5 rounded-xs">
                      * Maelekezo: {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Totals & Payments (Only for Customer Bill) */}
            {receiptType === 'customer_bill' ? (
              <div className="space-y-1 border-b border-dashed border-neutral-300 pb-2 mb-2 text-[10px]">
                <div className="flex justify-between text-neutral-600">
                  <span>Jumla Ndogo (Subtotal):</span>
                  <span>{formatPrice(totalAmountTZS, 'TZS')}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>VAT (18% Inclusive):</span>
                  <span>{formatPrice(Math.round(totalAmountTZS * 0.18), 'TZS')}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Huduma ya Mezani (Dine-In):</span>
                  <span>BURE (0 TZS)</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-1 border-t border-black text-black">
                  <span>JUMLA KUU (TOTAL):</span>
                  <span>{formatPrice(totalAmountTZS, 'TZS')}</span>
                </div>
              </div>
            ) : (
              <div className="py-1 text-center font-bold text-xs bg-neutral-100 rounded-sm mb-2">
                Jumla ya Sahani: {items.reduce((sum, it) => sum + it.qty, 0)} Pcs
              </div>
            )}

            {/* Payment & Barcode Instructions */}
            {receiptType === 'customer_bill' && (
              <div className="text-center space-y-1 pt-1">
                <div className="p-2 border border-neutral-300 rounded-sm bg-neutral-50 text-[10px]">
                  <p className="font-bold text-neutral-900">LIPA HAPA KWA SIMU:</p>
                  <p className="font-mono font-bold text-xs text-red-700">M-PESA / TIGO LIPA: 445566</p>
                  <p className="text-[9px] text-neutral-500">Jina: ZEBRA RESTAURANT MASAKI</p>
                </div>
                <p className="text-[10px] font-bold mt-2">ASANTE SANA KWA KUCHAGUA ZEBRA!</p>
                <p className="text-[9px] text-neutral-500">Mfumo rasmi wa POS & KDS unaoendeshwa na AmourCodes</p>
              </div>
            )}

            {/* Bottom cut line */}
            <div className="text-center text-neutral-400 text-[9px] mt-4 tracking-widest">
              - - - - - - - - END OF TICKET - - - - - - - -
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white dark:bg-[#16161a] border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
          <button
            onClick={handleCopyText}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Imenakiliwa!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-500" />
                <span>Nakili Risiti</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Chapisha (Thermal 80mm)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
