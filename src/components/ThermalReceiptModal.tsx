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
  Sparkles,
  Download,
  Image as ImageIcon,
  FileCode,
  ChevronDown
} from 'lucide-react';
import { TableOrder, Order } from '../types';
import { formatPrice, formatTzsPrice } from '../utils/formatters';
import { useApp } from '../context/AppContext';
import {
  downloadElementAsImage,
  downloadHtmlDocument,
  downloadTextFile,
  printReceiptOrElement
} from '../utils/printAndDownload';

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
  const { appBranding } = useApp();
  const [receiptType, setReceiptType] = useState<'kot' | 'customer_bill'>('customer_bill');
  const [copied, setCopied] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [printStatus, setPrintStatus] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const brandName = appBranding?.appName || 'KOOKOOS';
  const brandTagline = appBranding?.tagline || 'Proudly Tanzanian Fried Chicken';

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

  const handlePrint = async () => {
    setIsPrinting(true);
    setPrintStatus('Inaandaa kuchapisha...');
    try {
      await printReceiptOrElement('thermal-receipt-paper', {
        title: `${brandName} - Risiti ${orderNumber}`,
        isThermal: true,
        widthMm: 80,
      });
      setPrintStatus('✅ Amri ya print imetumwa!');
      setTimeout(() => setPrintStatus(null), 3000);
    } catch (err) {
      console.error('Print failed, attempting fallback download:', err);
      setPrintStatus('⚠️ Print imeshindwa, unaweza kupakua (download) risiti hapa chini.');
    } finally {
      setIsPrinting(false);
    }
  };

  const getRawReceiptText = () => {
    let text = '';
    if (receiptType === 'kot') {
      text = `=== KITCHEN ORDER TICKET (KOT) ===\n${brandName.toUpperCase()} KITCHEN\nOrder: ${orderNumber} | Table: ${tableNumber}\nTime: ${timestamp} | Waiter: ${waiterName}\n----------------------------------\n`;
      items.forEach(i => {
        text += `[${i.qty}x] ${i.name}\n${i.notes ? `   * Maelekezo: ${i.notes}\n` : ''}`;
      });
      text += `----------------------------------\nTotal Items: ${items.reduce((acc, c) => acc + c.qty, 0)}`;
    } else {
      text = `=== ${brandName.toUpperCase()} ===\n${brandTagline}\nTel: +255 712 345 678 | TIN: 142-990-881\nDate: ${dateStr} ${timestamp}\nTable: ${tableNumber} | Order: ${orderNumber}\n----------------------------------\n`;
      items.forEach(i => {
        text += `${i.qty}x ${i.name.padEnd(24, ' ')} ${formatPrice(i.total, 'TZS')}\n`;
      });
      text += `----------------------------------\nTOTAL: ${formatPrice(totalAmountTZS, 'TZS')}\nLIPA KWA M-PESA / TIGO: 445566\nAsante sana, Karibu tena!`;
    }
    return text;
  };

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    setShowDownloadMenu(false);
    try {
      const ok = await downloadElementAsImage(
        'thermal-receipt-paper',
        `Risiti-${orderNumber}-${receiptType}.png`,
        { pixelRatio: 3, backgroundColor: '#fffdfa' }
      );
      if (ok) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadHtml = () => {
    setShowDownloadMenu(false);
    if (!receiptRef.current) return;
    downloadHtmlDocument(
      receiptRef.current.innerHTML,
      `${brandName} - Risiti #${orderNumber}`,
      `Risiti-${orderNumber}.html`,
      true
    );
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleDownloadText = () => {
    setShowDownloadMenu(false);
    downloadTextFile(getRawReceiptText(), `Risiti-${orderNumber}.txt`);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleShareWhatsApp = () => {
    let text = `*${brandName.toUpperCase()} - PROUDLY TANZANIAN FRIED CHICKEN*\n${brandTagline}\nTel: +255 712 345 678 | TIN: 142-990-881\n\n*RISITI YA ODA / INVOICE*\nOda: *#${orderNumber}*\nMeza/Eneo: *${tableNumber}*\nTarehe: ${dateStr} ${timestamp}\n\n*ORODHA YA VYAKULA:*\n`;
    items.forEach(i => {
      text += `• [${i.qty}x] ${i.name} - ${formatPrice(i.total, 'TZS')}\n`;
      if (i.notes) text += `   _(${i.notes})_\n`;
    });
    text += `\n*JUMLA KUU (TOTAL): ${formatPrice(totalAmountTZS, 'TZS')}*\nLipa Namba M-Pesa / Tigo: *445566*\nAsante sana kwa kuagiza ${brandName}! 🍗🔥`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    const text = getRawReceiptText();
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
                <h2 className="text-sm font-black tracking-tight uppercase">{brandName.toUpperCase()}</h2>
                <p className="text-[10px] text-neutral-600">{brandTagline}</p>
                <p className="text-[10px] text-neutral-600">Tel: +255 712 345 678 | TIN: 142-990-881</p>
                <p className="text-[10px] font-bold text-neutral-800 mt-1">*** GUEST RECEIPT / BILI YA CHAKULA ***</p>
              </div>
            ) : (
              <div className="text-center space-y-0.5 border-b-2 border-black pb-2 mb-2 bg-neutral-100 p-1.5 rounded-sm">
                <h2 className="text-base font-black tracking-wider uppercase">⚡ K.O.T - JIKONI ⚡</h2>
                <p className="text-[11px] font-bold">{brandName.toUpperCase()} KITCHEN PASS</p>
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
                  <span>{formatTzsPrice(totalAmountTZS)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>VAT (18% Inclusive):</span>
                  <span>{formatTzsPrice(Math.round(totalAmountTZS * 0.18))}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Huduma ya Mezani (Dine-In):</span>
                  <span>BURE (0 TZS)</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-1 border-t border-black text-black">
                  <span>JUMLA KUU (TOTAL):</span>
                  <span>{formatTzsPrice(totalAmountTZS)}</span>
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
                  <p className="text-[9px] text-neutral-500">Jina: KOOKOOS FRIED CHICKEN DAR</p>
                </div>
                <p className="text-[10px] font-bold mt-2">ASANTE SANA KWA KUCHAGUA KOOKOOS!</p>
                <p className="text-[9px] text-neutral-500">Mfumo rasmi wa POS & KDS unaoendeshwa na AmourCodes</p>
              </div>
            )}

            {/* Bottom cut line */}
            <div className="text-center text-neutral-400 text-[9px] mt-4 tracking-widest">
              - - - - - - - - END OF TICKET - - - - - - - -
            </div>
          </div>
        </div>

        {/* Status or Print Notice */}
        {printStatus && (
          <div className="px-4 py-2 bg-neutral-900 text-white text-xs flex items-center justify-between border-t border-neutral-800">
            <span className="truncate">{printStatus}</span>
            <button
              onClick={() => setPrintStatus(null)}
              className="text-neutral-400 hover:text-white text-[11px] underline ml-2 cursor-pointer"
            >
              Funga
            </button>
          </div>
        )}

        {/* Action Buttons: Download, Print, WhatsApp, Copy */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#16161a] border-t border-neutral-100 dark:border-neutral-800 space-y-2">
          
          {/* Main Actions Row */}
          <div className="flex items-center justify-between gap-2">
            {/* Download Button with Popover */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                disabled={isDownloading}
                className="w-full py-2.5 px-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all border border-amber-500/30 cursor-pointer disabled:opacity-50"
                title="Chagua muundo wa kupakua risiti"
              >
                <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                <span>{downloadSuccess ? 'Imepakuliwa!' : isDownloading ? 'Inapakua...' : 'Pakua Risiti'}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {/* Download Format Menu Popover */}
              {showDownloadMenu && (
                <div className="absolute left-0 bottom-full mb-2 w-56 bg-white dark:bg-[#1f1f23] rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xl p-1.5 z-50 text-xs animate-scaleUp">
                  <div className="px-2 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Chagua Muundo wa Kupakua
                  </div>
                  <button
                    onClick={handleDownloadImage}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center space-x-2 text-neutral-800 dark:text-neutral-200 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    <div>
                      <div className="font-bold">Pakua Picha (PNG)</div>
                      <div className="text-[10px] text-neutral-400">Picha safi ya HD ya risiti</div>
                    </div>
                  </button>
                  <button
                    onClick={handleDownloadHtml}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center space-x-2 text-neutral-800 dark:text-neutral-200 cursor-pointer transition-colors"
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-500" />
                    <div>
                      <div className="font-bold">Pakua Faili (HTML / PDF)</div>
                      <div className="text-[10px] text-neutral-400">Tayari kuprinti kwenye kifaa chochote</div>
                    </div>
                  </button>
                  <button
                    onClick={handleDownloadText}
                    className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center space-x-2 text-neutral-800 dark:text-neutral-200 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-500" />
                    <div>
                      <div className="font-bold">Pakua Nakala (Text / .txt)</div>
                      <div className="text-[10px] text-neutral-400">Muundo wa mashine ya POS</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex-1 py-2.5 px-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              title="Chapisha kwenye printer ya keshia au simu"
            >
              <Printer className={`w-4 h-4 ${isPrinting ? 'animate-spin' : ''}`} />
              <span>{isPrinting ? 'Inachapa...' : 'Print Risiti'}</span>
            </button>
          </div>

          {/* Secondary Actions Row */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800/60">
            <button
              onClick={handleCopyText}
              className="flex-1 py-1.5 px-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-[11px] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              title="Nakili maandishi ya risiti"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500">Imenakiliwa!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-neutral-500" />
                  <span>Nakili</span>
                </>
              )}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-1.5 px-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] font-semibold text-[11px] flex items-center justify-center space-x-1.5 transition-all border border-[#25D366]/30 cursor-pointer"
              title="Tuma Risiti WhatsApp"
            >
              <Share2 className="w-3 h-3 text-[#25D366]" />
              <span>WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
