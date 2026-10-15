import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Video,
  MessageSquare,
  X,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Send,
  Sparkles,
  Volume2,
  Clock,
  User,
  Coffee,
  Receipt,
  Droplets,
  UtensilsCrossed,
  Maximize2,
  Minimize2,
  ChevronDown,
  Bell
} from 'lucide-react';
import { useLiveCall } from '../../context/LiveCallContext';
import { useApp } from '../../context/AppContext';

export const LiveCallModal: React.FC = () => {
  const {
    isCallModalOpen,
    closeCallModal,
    activeModalTab,
    roomId,
    setRoomId,
    messages,
    sendChatMessage,
    typingUsers,
    sendTyping,
    activeCall,
    initiateCall,
    endCurrentCall,
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    toggleMute,
    toggleVideo,
    callDuration,
    socketConnected,
    notificationPermission,
    requestNotificationPermission
  } = useLiveCall();

  const { tables, theme } = useApp();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'chat' | 'audio' | 'video'>(activeModalTab);
  const [inputText, setInputText] = useState('');
  const [isTypingLocal, setIsTypingLocal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTableSelect, setShowTableSelect] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  // Sync activeTab when context opens with a specific tab
  useEffect(() => {
    setActiveTab(activeModalTab);
  }, [activeModalTab]);

  // Attach local and remote media streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, activeTab]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, activeTab]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  if (!isCallModalOpen) return null;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim());
    setInputText('');
    sendTyping(false);
    setIsTypingLocal(false);
  };

  const handleQuickAction = (text: string, actionType: string) => {
    sendChatMessage(text, actionType);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!isTypingLocal) {
      setIsTypingLocal(true);
      sendTyping(true);
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTypingLocal(false);
      sendTyping(false);
    }, 2000);
  };

  const isCallActive = Boolean(activeCall);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full ${
          isFullscreen ? 'h-full max-w-full rounded-none' : 'max-w-2xl max-h-[92vh] rounded-3xl'
        } flex flex-col overflow-hidden shadow-2xl border transition-all duration-300 ${
          isDark
            ? 'bg-neutral-900/95 border-white/10 text-white'
            : 'bg-white/95 border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-black/10 dark:border-white/10 bg-amber-500/10 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/20">
                {activeTab === 'video' ? (
                  <Video className="w-5 h-5" />
                ) : activeTab === 'audio' ? (
                  <Phone className="w-5 h-5" />
                ) : (
                  <MessageSquare className="w-5 h-5" />
                )}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 ${
                  socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`}
                title={socketConnected ? 'Imeunganishwa Moja kwa Moja' : 'Inaunganisha...'}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold tracking-tight">Mhudumu Live Center</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {socketConnected ? 'Online' : 'Connecting'}
                </span>
              </div>

              {/* Table Selector Dropdown */}
              <div className="relative inline-block mt-0.5">
                <button
                  type="button"
                  onClick={() => setShowTableSelect(!showTableSelect)}
                  className="flex items-center space-x-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-amber-500 transition-colors"
                >
                  <span>Chumba: <strong className="text-amber-500 font-semibold">{roomId}</strong></span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showTableSelect && (
                  <div className="absolute left-0 top-full mt-1 w-48 max-h-48 overflow-y-auto rounded-xl p-1 shadow-xl border bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 z-50 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setRoomId('Online Order / General');
                        setShowTableSelect(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 font-medium"
                    >
                      🌐 Online / General
                    </button>
                    {tables && tables.length > 0 ? (
                      tables.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setRoomId(t.name);
                            setShowTableSelect(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 font-medium ${
                            roomId === t.name ? 'bg-amber-500/20 text-amber-500 font-bold' : ''
                          }`}
                        >
                          🍽️ {t.name} ({t.section})
                        </button>
                      ))
                    ) : (
                      ['Table 01', 'Table 02', 'Table 03', 'Table 04', 'VIP Lounge 1'].map((tName) => (
                        <button
                          key={tName}
                          type="button"
                          onClick={() => {
                            setRoomId(tName);
                            setShowTableSelect(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 font-medium ${
                            roomId === tName ? 'bg-amber-500/20 text-amber-500 font-bold' : ''
                          }`}
                        >
                          🍽️ {tName}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={closeCallModal}
              className="p-2 rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              title="Funga"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Call from Notification Permission Prompt */}
        {notificationPermission !== 'granted' && (
          <div className="px-4 py-2 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-emerald-500/15 border-b border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2 text-neutral-800 dark:text-neutral-200">
              <Bell className="w-4 h-4 text-amber-500 shrink-0 animate-bounce" />
              <span>
                <strong>Pokea Simu kutoka Notification:</strong> Washa notifikasi ili simu ikipiga uweze kuipokea au kuikataa moja kwa moja hata ukiwa nje ya app!
              </span>
            </div>
            <button
              type="button"
              onClick={() => requestNotificationPermission()}
              className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shrink-0 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              Washa Notifikasi Sasa
            </button>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex border-b border-black/5 dark:border-white/5 bg-neutral-100/60 dark:bg-neutral-800/40 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 px-3 rounded-2xl flex items-center justify-center space-x-2 text-xs font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chati ya Papo kwa Papo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('audio');
              if (!isCallActive) {
                initiateCall('audio');
              }
            }}
            className={`flex-1 py-2 px-3 rounded-2xl flex items-center justify-center space-x-2 text-xs font-semibold transition-all ${
              activeTab === 'audio'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Simu ya Sauti {isCallActive && activeCall?.callType === 'audio' && `(${formatDuration(callDuration)})`}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('video');
              if (!isCallActive) {
                initiateCall('video');
              }
            }}
            className={`flex-1 py-2 px-3 rounded-2xl flex items-center justify-center space-x-2 text-xs font-semibold transition-all ${
              activeTab === 'video'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Simu ya Video {isCallActive && activeCall?.callType === 'video' && `(${formatDuration(callDuration)})`}</span>
          </button>
        </div>

        {/* Content Body Based on Tab */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {/* TAB 1: LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-[380px] max-h-[520px]">
              {/* Quick Actions Bar */}
              <div className="p-2 sm:px-4 border-b border-black/5 dark:border-white/5 flex items-center space-x-2 overflow-x-auto no-scrollbar bg-amber-500/5">
                <span className="text-[11px] text-neutral-400 shrink-0 font-medium">Ombi la Haraka:</span>
                <button
                  type="button"
                  onClick={() => handleQuickAction('Tafadhali naomba bili ya meza yangu', 'bill')}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500 text-[11px] font-medium flex items-center space-x-1.5 shrink-0 transition-all hover:scale-105 active:scale-95"
                >
                  <Receipt className="w-3 h-3 text-amber-500" />
                  <span>Lete Bili</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAction('Tafadhali tuletee chupa ya maji ya baridi', 'water')}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500 text-[11px] font-medium flex items-center space-x-1.5 shrink-0 transition-all hover:scale-105 active:scale-95"
                >
                  <Droplets className="w-3 h-3 text-sky-500" />
                  <span>Maji ya Baridi</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAction('Tafadhali ongeza sahani ya ziada mezani', 'extra_plate')}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500 text-[11px] font-medium flex items-center space-x-1.5 shrink-0 transition-all hover:scale-105 active:scale-95"
                >
                  <UtensilsCrossed className="w-3 h-3 text-emerald-500" />
                  <span>Sahani ya Ziada</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAction('Mhudumu tafadhali fika meza yetu', 'call_waiter')}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500 text-[11px] font-medium flex items-center space-x-1.5 shrink-0 transition-all hover:scale-105 active:scale-95"
                >
                  <User className="w-3 h-3 text-purple-500" />
                  <span>Mhudumu Njoo</span>
                </button>
              </div>

              {/* Chat Message Stream */}
              <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                    <Sparkles className="w-10 h-10 text-amber-500 mb-2 opacity-50" />
                    <p className="text-sm font-semibold">Ukurasa wa Moja kwa Moja na Mhudumu</p>
                    <p className="text-xs max-w-xs mt-1">
                      Andika ujumbe wowote, agiza chakula, au piga simu ya sauti/video papo kwa hapo!
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isStaff = msg.senderRole === 'waiter' || msg.senderRole === 'admin';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isStaff ? 'items-start' : 'items-end'}`}
                      >
                        <div className="flex items-center space-x-1.5 text-[10px] text-neutral-400 mb-0.5 px-1">
                          <span className="font-semibold text-neutral-600 dark:text-neutral-300">
                            {msg.senderName}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isStaff
                              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-black/5 dark:border-white/5 rounded-tl-sm'
                              : 'bg-amber-500 text-white rounded-tr-sm font-medium'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}

                {typingUsers.length > 0 && (
                  <div className="flex items-center space-x-2 text-xs text-neutral-400 italic">
                    <div className="flex space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce delay-100" />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce delay-200" />
                    </div>
                    <span>{typingUsers.join(', ')} anaandika...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder={`Andika ujumbe kwa Mhudumu wa ${roomId}...`}
                  className="flex-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-4 py-2.5 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: LIVE AUDIO CALL */}
          {activeTab === 'audio' && (
            <div className="flex-1 flex flex-col items-center justify-between p-8 min-h-[400px]">
              <div className="text-center mt-4">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-500">
                  Simu ya Sauti ya Moja kwa Moja
                </span>
                <h4 className="text-lg font-bold mt-1 text-neutral-900 dark:text-white">
                  {isCallActive ? `Mhudumu wa ${roomId}` : `Anza Simu na Mhudumu`}
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {isCallActive
                    ? activeCall?.status === 'connected'
                      ? `Imeunganishwa • Muda: ${formatDuration(callDuration)}`
                      : 'Inapiga simu kwa mhudumu...'
                    : 'Bofya kitufe cha kijani kuanza kupiga simu'}
                </p>
              </div>

              {/* Wave Animated Calling Circle */}
              <div className="relative my-8 flex items-center justify-center">
                {isCallActive && (
                  <>
                    <div className="absolute w-44 h-44 rounded-full bg-amber-500/10 animate-ping" />
                    <div className="absolute w-36 h-36 rounded-full bg-amber-500/20 animate-pulse" />
                  </>
                )}
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-xl shadow-amber-500/30 text-white">
                  <Phone className="w-12 h-12 animate-wiggle" />
                </div>
              </div>

              {/* Live Audio Activity Bars */}
              {isCallActive && activeCall?.status === 'connected' && (
                <div className="flex items-center space-x-1.5 h-8">
                  {[40, 75, 55, 90, 60, 85, 45, 95, 50, 70].map((h, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 rounded-full bg-amber-500 transition-all duration-150 animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${idx * 100}ms`
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Action Controls */}
              <div className="flex items-center justify-center space-x-4 mb-4">
                {isCallActive ? (
                  <>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className={`p-4 rounded-full transition-all shadow-md ${
                        isMuted
                          ? 'bg-rose-500 text-white shadow-rose-500/30'
                          : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-white hover:bg-neutral-300'
                      }`}
                      title={isMuted ? 'Washa Maikrofoni' : 'Zima Maikrofoni'}
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        endCurrentCall();
                        initiateCall('video');
                      }}
                      className="p-4 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-white hover:bg-neutral-300 transition-all shadow-md"
                      title="Badilisha kuwa Video Call"
                    >
                      <Video className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={endCurrentCall}
                      className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/40 transition-all hover:scale-105 active:scale-95"
                      title="Kata Simu"
                    >
                      <PhoneOff className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => initiateCall('audio')}
                    className="py-3 px-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/30 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Piga Simu ya Sauti Sasa</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE VIDEO CALL */}
          {activeTab === 'video' && (
            <div className="flex-1 flex flex-col relative bg-black min-h-[420px] max-h-[580px] overflow-hidden">
              {/* Remote Video (Full Screen / Main Canvas) */}
              <div className="relative w-full h-full flex-1 flex items-center justify-center bg-neutral-950 overflow-hidden">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* If remote stream not yet active, show placeholder waiter view */}
                {!remoteStream && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white/80 bg-neutral-900/90 backdrop-blur-sm">
                    <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center mb-3 animate-pulse">
                      <User className="w-10 h-10 text-amber-500" />
                    </div>
                    <h5 className="font-bold text-base text-white">Kamera ya Mhudumu wa Zebra</h5>
                    <p className="text-xs text-neutral-400 max-w-xs mt-1">
                      {isCallActive
                        ? 'Simu inaunganishwa na Mhudumu... Picha itatokea hapa akipokea.'
                        : 'Bofya "Anza Simu ya Video" ili kumwita mhudumu kwa kamera.'}
                    </p>
                    {isCallActive && (
                      <span className="mt-3 text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>Muda: {formatDuration(callDuration)}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Top Status Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center space-x-2 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>Live Video • {roomId}</span>
                  </div>
                  {isCallActive && (
                    <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono border border-white/10">
                      {formatDuration(callDuration)}
                    </div>
                  )}
                </div>

                {/* Picture-in-Picture Local Video (Customer / Caller Camera) */}
                <div className="absolute bottom-20 right-3 w-28 sm:w-36 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-neutral-900 z-20">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                  {isVideoOff && (
                    <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center text-white/50 text-[10px]">
                      <VideoOff className="w-5 h-5 mb-1" />
                      <span>Kamera Imezimwa</span>
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white">
                    Wewe
                  </div>
                </div>

                {/* Bottom Call Controls Toolbar */}
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-3 z-30 px-4">
                  {isCallActive ? (
                    <>
                      <button
                        type="button"
                        onClick={toggleMute}
                        className={`p-3.5 rounded-full shadow-lg transition-all ${
                          isMuted
                            ? 'bg-rose-500 text-white shadow-rose-500/30'
                            : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'
                        }`}
                        title={isMuted ? 'Washa Maikrofoni' : 'Zima Maikrofoni'}
                      >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>

                      <button
                        type="button"
                        onClick={toggleVideo}
                        className={`p-3.5 rounded-full shadow-lg transition-all ${
                          isVideoOff
                            ? 'bg-rose-500 text-white shadow-rose-500/30'
                            : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'
                        }`}
                        title={isVideoOff ? 'Washa Kamera' : 'Zima Kamera'}
                      >
                        {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('chat')}
                        className="p-3.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all shadow-lg"
                        title="Fungua Chati"
                      >
                        <MessageSquare className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        onClick={endCurrentCall}
                        className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/40 transition-all hover:scale-105 active:scale-95"
                        title="Kata Simu"
                      >
                        <PhoneOff className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => initiateCall('video')}
                      className="py-3 px-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/30 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
                    >
                      <Video className="w-5 h-5" />
                      <span>Anza Simu ya Video Sasa</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
