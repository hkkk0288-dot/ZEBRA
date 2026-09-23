import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  Copy,
  Check,
  Download,
  ExternalLink,
  UtensilsCrossed,
  Sparkles,
  Users,
  Smartphone
} from 'lucide-react';
import { RestaurantTable } from '../types';

interface TableQrModalProps {
  table: RestaurantTable;
  onClose: () => void;
  onSelectTableForDineIn?: (table: RestaurantTable) => void;
}

export const TableQrModal: React.FC<TableQrModalProps> = ({
  table,
  onClose,
  onSelectTableForDineIn
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Construct target URL for table ordering
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const tableUrl = `${origin}${pathname}?table=${encodeURIComponent(table.id)}`;

  useEffect(() => {
    // Generate high resolution QR code
    QRCode.toDataURL(tableUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR Generation failed:', err));
  }, [tableUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Zebra-Restaurant-QR-${table.name.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTestAsCustomer = () => {
    if (onSelectTableForDineIn) {
      onSelectTableForDineIn(table);
    } else {
      // Set query param and reload/navigate
      window.history.pushState({}, '', tableUrl);
      window.dispatchEvent(new Event('popstate'));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-[#151518] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden relative my-auto animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                <span>QR Code ya Meza: {table.name}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  {table.section}
                </span>
              </h2>
              <p className="text-xs text-neutral-500">
                Wateja wakiscani wataingia kwenye menyu na kuweka oda ya meza hii
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Printable Tent Card Preview */}
        <div className="p-6 space-y-5">
          <div
            ref={printRef}
            className="table-qr-printable bg-white text-neutral-900 rounded-3xl p-6 border-2 border-dashed border-neutral-200 dark:border-neutral-700 shadow-sm flex flex-col items-center text-center relative"
          >
            {/* Top Tent Header */}
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">🦓</span>
              <span className="font-extrabold font-display text-lg tracking-tight text-neutral-950">
                Zebra Restaurant & Lounge
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-medium">
              Masaki & Slipway • Dar es Salaam
            </p>

            {/* Table Badge */}
            <div className="mt-3.5 mb-3 inline-flex items-center space-x-1.5 bg-emerald-500 text-white px-4 py-1.5 rounded-full shadow-sm">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span className="font-black text-sm uppercase tracking-wide">{table.name}</span>
              <span className="text-xs opacity-80">({table.section})</span>
            </div>

            {/* Generated QR Code Canvas / Image */}
            <div className="w-56 h-56 bg-white p-3 rounded-2xl border-2 border-neutral-900 shadow-md flex items-center justify-center my-2">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code kwa ${table.name}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
              )}
            </div>

            {/* Instructions */}
            <div className="mt-2 space-y-1">
              <h4 className="font-bold text-sm text-neutral-900">
                Changanua Kuagiza Chakula na Vinywaji
              </h4>
              <p className="text-[11px] text-neutral-600 max-w-xs leading-relaxed">
                Scan with your phone camera or Google Lens to view full menu, customize dishes, and order directly to this table!
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-neutral-200 w-full flex items-center justify-between text-[10px] text-neutral-400 font-mono">
              <span className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>Uwezo: Viti {table.capacity}</span>
              </span>
              <span>Lipa Namba: 445566</span>
            </div>
          </div>

          {/* Quick URL Box */}
          <div className="flex items-center space-x-2 bg-neutral-100 dark:bg-neutral-900 p-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs font-mono">
            <span className="text-neutral-400 truncate flex-1">{tableUrl}</span>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shrink-0 flex items-center space-x-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Imenakiliwa!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Nakili Link</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              onClick={handleTestAsCustomer}
              className="py-2.5 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Jaribu Kama Mteja</span>
            </button>

            <button
              onClick={handleDownloadQr}
              className="py-2.5 px-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Pakua Picha (PNG)</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Kadi ya Meza</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
