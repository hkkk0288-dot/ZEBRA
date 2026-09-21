import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { USSD_NETWORKS } from '../data/mockData';
import { formatPrice } from '../utils/formatters';
import { PhoneCall, Copy, Check, ShieldCheck, AlertCircle, Smartphone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const UssdPaymentModal: React.FC = () => {
  const { ussdModalOrder, setUssdModalOrder, completeUssdPayment, currency, theme } = useApp();

  const [selectedNetwork, setSelectedNetwork] = useState(USSD_NETWORKS[0]);
  const [copied, setCopied] = useState(false);
  
  // Interactive USSD prompt simulator
  const [showCarrierPrompt, setShowCarrierPrompt] = useState(false);
  const [ussdPin, setUssdPin] = useState('');
  const [isProcessingPush, setIsProcessingPush] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);

  if (!ussdModalOrder) return null;

  const isDark = theme === 'dark';
  const orderAmountTZS = Math.round(ussdModalOrder.total * 2600);
  const formattedTZS = `${orderAmountTZS.toLocaleString()} TZS`;

  const ussdFullString = `${selectedNetwork.code.replace('#', '')}*1*${selectedNetwork.paybill}*${orderAmountTZS}#`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(ussdFullString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDial = () => {
    window.location.href = `tel:${encodeURIComponent(ussdFullString)}`;
  };

  const handleNumberClick = (digit: string) => {
    if (ussdPin.length < 4) {
      setUssdPin(prev => prev + digit);
    }
  };

  const handlePinClear = () => {
    setUssdPin('');
  };

  const handlePinSubmit = () => {
    if (ussdPin.length < 4) return;
    setIsProcessingPush(true);

    setTimeout(() => {
      setIsProcessingPush(false);
      setPushSuccess(true);
      
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      setTimeout(() => {
        completeUssdPayment(ussdModalOrder.id, ussdModalOrder.ussdDetails?.referenceCode || 'MP994827');
        setShowCarrierPrompt(false);
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border transition-colors ${
          isDark
            ? 'bg-[#141418] border-neutral-800 text-neutral-100'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800/20">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-lg">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display">Mlipo kupitia USSD</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Offline & Mobile Money Integration (Tanzania)
              </p>
            </div>
          </div>
          <button
            onClick={() => setUssdModalOrder(null)}
            className="p-2 rounded-full text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Amount Due Box */}
          <div
            className={`p-4 rounded-2xl border text-center transition-colors ${
              isDark
                ? 'bg-neutral-900/80 border-neutral-800'
                : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Kiasi cha Kulipwa (Total Due)
            </span>
            <div className="text-2xl font-black font-display text-emerald-500 mt-1">
              {formattedTZS}{' '}
              <span className="text-xs font-normal text-neutral-400">
                ({formatPrice(ussdModalOrder.total, 'USD')})
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Agizo Namba: <span className="font-mono font-bold text-neutral-300">{ussdModalOrder.orderNumber}</span>
            </p>
          </div>

          {/* Telco Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-2">
              Chagua Mtandao wa Simu (Select Mobile Network)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {USSD_NETWORKS.map(net => {
                const isSelected = selectedNetwork.id === net.id;
                return (
                  <button
                    key={net.id}
                    onClick={() => setSelectedNetwork(net)}
                    className={`p-3 rounded-2xl border text-left flex flex-col transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                        : isDark
                        ? 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                        : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-100">
                      {net.name}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      {net.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generated USSD String with Copy and Direct Dial */}
          <div
            className={`p-4 rounded-2xl border ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
              <span className="font-medium">Direct USSD Code:</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                Till: {selectedNetwork.paybill}
              </span>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="font-mono font-bold text-sm tracking-wide overflow-x-auto text-emerald-500 select-all py-1">
                {ussdFullString}
              </div>
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                title="Copy USSD string"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            {/* Primary Action: Interactive Carrier USSD PIN Simulator */}
            <button
              onClick={() => {
                setShowCarrierPrompt(true);
                setUssdPin('');
                setPushSuccess(false);
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Simulate USSD Push & PIN</span>
            </button>

            {/* Direct Phone Dial (works on real Android devices without internet) */}
            <button
              onClick={handleDial}
              className={`w-full py-3 px-4 rounded-2xl border font-semibold text-xs flex items-center justify-center space-x-2 transition-colors ${
                isDark
                  ? 'border-neutral-700 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200'
                  : 'border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <PhoneCall className="w-4 h-4 text-emerald-500" />
              <span>Dial on Phone Dialer ({selectedNetwork.name})</span>
            </button>
          </div>

          {/* Security & Offline Notice */}
          <div className="flex items-start space-x-2 text-[11px] text-neutral-400 bg-neutral-900/50 p-3 rounded-xl border border-neutral-800/60">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              Inawezekana kulipa hata ukiwa huna bando (Offline USSD capability). Jina la biashara: <strong className="text-neutral-200">ZEBRA RESTAURANT (AmourCodes)</strong>.
            </p>
          </div>
        </div>

        {/* Carrier Popup Simulation Modal (Android Dialog Style) */}
        <AnimatePresence>
          {showCarrierPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-center items-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                className="w-full max-w-xs bg-[#1f1f23] rounded-3xl border border-neutral-700 p-5 shadow-2xl text-center"
              >
                {!pushSuccess ? (
                  <>
                    <div className="flex items-center justify-between mb-3 text-left">
                      <span className="text-xs font-bold text-amber-400 font-mono tracking-wider">
                        {selectedNetwork.name} USSD
                      </span>
                      <button
                        onClick={() => setShowCarrierPrompt(false)}
                        className="text-neutral-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-neutral-300 text-left mb-4 leading-relaxed">
                      Lipa {formattedTZS} kwa <strong className="text-white">ZEBRA RESTAURANT</strong> (AmourCodes Till 445566).
                      <br />
                      Weka namba ya siri (PIN):
                    </p>

                    {/* PIN Display Dots */}
                    <div className="flex items-center justify-center space-x-3 mb-5 py-2 bg-neutral-900/80 rounded-xl border border-neutral-800">
                      {[0, 1, 2, 3].map(index => (
                        <div
                          key={index}
                          className={`w-3.5 h-3.5 rounded-full border transition-all ${
                            index < ussdPin.length
                              ? 'bg-emerald-500 border-emerald-400 scale-110 shadow-sm shadow-emerald-500/50'
                              : 'border-neutral-600 bg-transparent'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Keypad */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map(key => {
                        if (key === 'C') {
                          return (
                            <button
                              key={key}
                              onClick={handlePinClear}
                              className="py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-rose-400 font-bold text-xs"
                            >
                              CLEAR
                            </button>
                          );
                        }
                        if (key === 'OK') {
                          return (
                            <button
                              key={key}
                              onClick={handlePinSubmit}
                              disabled={ussdPin.length < 4 || isProcessingPush}
                              className="py-2.5 rounded-xl bg-emerald-500 disabled:opacity-40 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/30"
                            >
                              {isProcessingPush ? '...' : 'SEND'}
                            </button>
                          );
                        }
                        return (
                          <button
                            key={key}
                            onClick={() => handleNumberClick(key)}
                            className="py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm"
                          >
                            {key}
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-[10px] text-neutral-500">
                      Bonyeza 4 digits (e.g. 1234) kisha gusa SEND
                    </p>
                  </>
                ) : (
                  <div className="py-4 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Check className="w-7 h-7 stroke-[3]" />
                    </div>
                    <h3 className="font-bold text-white text-base">Malipo Yamethibitishwa!</h3>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Asante! Umelipa <strong className="text-emerald-400">{formattedTZS}</strong> kwa Zebra Restaurant.
                      <br />
                      Kumbukumbu:{' '}
                      <span className="font-mono text-amber-400">
                        {ussdModalOrder.ussdDetails?.referenceCode || 'MP994827'}
                      </span>
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
