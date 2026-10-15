import React from 'react';
import { Headset, Phone, Video } from 'lucide-react';
import { useLiveCall } from '../../context/LiveCallContext';
import { useApp } from '../../context/AppContext';

export const LiveFloatingButton: React.FC = () => {
  const { openCallModal, unreadMessagesCount, activeCall, socketConnected } = useLiveCall();
  const { activeTab, androidFrame } = useApp();

  // Hide in operations screens where waiter station or POS has its own full panel
  if (activeTab === 'pos' || activeTab === 'oss' || activeTab === 'kds' || activeTab === 'admin' || activeTab === 'waiter') {
    return null;
  }

  const isCallActive = Boolean(activeCall);

  return (
    <div
      className={`fixed ${
        androidFrame ? 'bottom-24 right-3' : 'bottom-24 right-4 sm:bottom-8 sm:right-8'
      } z-40 flex items-center justify-center`}
    >
      <button
        type="button"
        onClick={() => openCallModal(isCallActive ? (activeCall?.callType || 'chat') : 'chat')}
        className={`group relative flex items-center justify-center w-12 h-12 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border cursor-pointer ${
          isCallActive
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 shadow-emerald-500/40 animate-pulse'
            : 'bg-gradient-to-tr from-amber-500 via-amber-600 to-orange-500 text-white border-amber-400/50 shadow-amber-500/30 hover:shadow-amber-500/50'
        }`}
        title="Mhudumu Live: Chati na Piga Simu"
      >
        {isCallActive ? (
          activeCall?.callType === 'video' ? (
            <Video className="w-5 h-5 animate-pulse" />
          ) : (
            <Phone className="w-5 h-5 animate-bounce" />
          )
        ) : (
          <Headset className="w-5 h-5 transition-transform group-hover:scale-110" />
        )}

        {/* Online green indicator */}
        <span
          className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-neutral-900 ${
            socketConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-300'
          }`}
          title={socketConnected ? 'Mhudumu Yuko Hewani (Online)' : 'Inaunganisha...'}
        />

        {/* Unread badge */}
        {unreadMessagesCount > 0 && (
          <span className="absolute -top-1 -left-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 border border-white text-white text-[10px] font-black flex items-center justify-center shadow-md animate-bounce">
            {unreadMessagesCount}
          </span>
        )}
      </button>
    </div>
  );
};
