import React from 'react';
import { Headset, Phone, MessageSquare, Video } from 'lucide-react';
import { useLiveCall } from '../../context/LiveCallContext';
import { useApp } from '../../context/AppContext';

export const LiveFloatingButton: React.FC = () => {
  const { openCallModal, unreadMessagesCount, activeCall, socketConnected } = useLiveCall();
  const { activeTab, androidFrame } = useApp();

  // Hide in operations screens where waiter station or POS has its own full panel
  if (activeTab === 'pos' || activeTab === 'oss' || activeTab === 'kds') {
    return null;
  }

  const isCallActive = Boolean(activeCall);

  return (
    <div
      className={`fixed ${
        androidFrame ? 'bottom-20 left-4' : 'bottom-6 left-4 sm:left-6'
      } z-40 flex items-center space-x-2`}
    >
      <button
        type="button"
        onClick={() => openCallModal(isCallActive ? (activeCall?.callType || 'chat') : 'chat')}
        className={`group relative flex items-center space-x-2.5 px-3.5 sm:px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border ${
          isCallActive
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 shadow-emerald-500/30 animate-pulse'
            : 'bg-neutral-900/90 hover:bg-neutral-900 text-white border-amber-500/30 hover:border-amber-500 shadow-black/40 backdrop-blur-md'
        }`}
        title="Mhudumu Live: Chati na Piga Simu"
      >
        <div className="relative">
          <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white">
            {isCallActive ? (
              activeCall?.callType === 'video' ? (
                <Video className="w-3.5 h-3.5" />
              ) : (
                <Phone className="w-3.5 h-3.5" />
              )
            ) : (
              <Headset className="w-3.5 h-3.5" />
            )}
          </div>
          {/* Online green indicator */}
          <span
            className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-neutral-900 ${
              socketConnected ? 'bg-emerald-500' : 'bg-amber-400'
            }`}
          />
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[11px] font-bold tracking-tight leading-tight flex items-center space-x-1">
            <span>Mhudumu Live</span>
            {isCallActive && <span className="text-[9px] text-emerald-200 uppercase font-mono">• Active</span>}
          </span>
          <span className="text-[9px] text-neutral-300 leading-tight">
            {isCallActive ? 'Simu inaendelea' : 'Chat & Call Mezani'}
          </span>
        </div>

        {/* Unread badge */}
        {unreadMessagesCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-bounce">
            {unreadMessagesCount}
          </span>
        )}
      </button>
    </div>
  );
};
