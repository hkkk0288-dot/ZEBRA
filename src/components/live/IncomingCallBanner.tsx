import React from 'react';
import { Phone, Video, PhoneOff, Check, User } from 'lucide-react';
import { useLiveCall } from '../../context/LiveCallContext';

export const IncomingCallBanner: React.FC = () => {
  const { incomingCall, acceptIncomingCall, rejectIncomingCall } = useLiveCall();

  if (!incomingCall) return null;

  const isVideo = incomingCall.callType === 'video';

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md animate-bounce-short">
      <div className="bg-neutral-900/95 text-white border-2 border-amber-500/80 rounded-3xl p-3.5 shadow-2xl backdrop-blur-xl flex items-center justify-between space-x-3">
        {/* Caller Avatar & Ringing pulse */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
            {isVideo ? <Video className="w-6 h-6 animate-pulse" /> : <Phone className="w-6 h-6 animate-pulse" />}
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-neutral-900 animate-ping" />
        </div>

        {/* Call Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {isVideo ? 'Simu ya Video Inapiga' : 'Simu ya Sauti Inapiga'}
            </span>
          </div>
          <h4 className="text-sm font-bold truncate mt-0.5 text-white">
            {incomingCall.callerName || 'Mteja wa Meza'}
          </h4>
          <p className="text-xs text-neutral-300 truncate">
            {incomingCall.tableNumber ? `Chumba / Meza: ${incomingCall.tableNumber}` : 'Mteja wa Mgahawa'}
          </p>
        </div>

        {/* Action Buttons: Accept & Reject */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => rejectIncomingCall('Mhudumu anaomba radhi, yuko bize')}
            className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md shadow-rose-600/30 transition-all hover:scale-110 active:scale-95"
            title="Kataa Simu"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={acceptIncomingCall}
            className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 transition-all hover:scale-110 active:scale-95 animate-pulse"
            title="Pokea Simu Sasa"
          >
            {isVideo ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
