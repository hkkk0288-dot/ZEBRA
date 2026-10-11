import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { liveSocketService } from '../services/liveCallSocketService';
import { WebRtcManager } from '../services/webrtcService';
import { LiveChatMessage, LiveCallSession, CallType } from '../types';
import { playPhoneRingSound, playMessagePopSound } from '../utils/soundEffects';
import { useApp } from './AppContext';

interface LiveCallContextType {
  socketConnected: boolean;
  roomId: string;
  setRoomId: (id: string) => void;
  messages: LiveChatMessage[];
  typingUsers: string[];
  activeCall: LiveCallSession | null;
  incomingCall: LiveCallSession | null;
  activeWaitersCalls: LiveCallSession[];
  isCallModalOpen: boolean;
  activeModalTab: 'chat' | 'audio' | 'video';
  openCallModal: (tab?: 'chat' | 'audio' | 'video', tableNumber?: string) => void;
  closeCallModal: () => void;
  initiateCall: (type: CallType, tableNumber?: string) => Promise<void>;
  acceptIncomingCall: () => Promise<void>;
  rejectIncomingCall: (reason?: string) => void;
  endCurrentCall: () => void;
  sendChatMessage: (text: string, quickAction?: string) => void;
  sendTyping: (isTyping: boolean) => void;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isVideoOff: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
  callDuration: number;
  unreadMessagesCount: number;
  clearUnreadCount: () => void;
}

const LiveCallContext = createContext<LiveCallContextType | undefined>(undefined);

export const LiveCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, activeTable, activeTab } = useApp();

  const [socketConnected, setSocketConnected] = useState(false);
  const [roomId, setRoomId] = useState<string>(activeTable?.name || 'Table 01');
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [activeCall, setActiveCall] = useState<LiveCallSession | null>(null);
  const [incomingCall, setIncomingCall] = useState<LiveCallSession | null>(null);
  const [activeWaitersCalls, setActiveWaitersCalls] = useState<LiveCallSession[]>([]);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'chat' | 'audio' | 'video'>('chat');

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const webrtcManagerRef = useRef<WebRtcManager | null>(null);
  const ringIntervalRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  // Determine user role and identifier
  const userRole = activeTab === 'waiter' ? 'waiter' : user.role === 'admin' ? 'admin' : 'customer';
  const userName = user.name || (userRole === 'waiter' ? 'Mhudumu wa Zamu' : `Mteja (${roomId})`);
  const clientIdRef = useRef<string>(`client-${Math.random().toString(36).substring(2, 9)}`);

  // Sync roomId when activeTable changes
  useEffect(() => {
    if (activeTable?.name && userRole === 'customer') {
      setRoomId(activeTable.name);
    }
  }, [activeTable, userRole]);

  // Connect socket
  useEffect(() => {
    liveSocketService.connect({
      clientId: clientIdRef.current,
      name: userName,
      role: userRole,
      roomId,
      tableNumber: activeTable?.name || roomId
    });

    const unsubConn = liveSocketService.on('connection_status', (data) => {
      setSocketConnected(data.connected);
    });

    const unsubHistory = liveSocketService.on('history', (data) => {
      if (data.messages) {
        setMessages(data.messages);
      }
    });

    const unsubMsg = liveSocketService.on('chat_message', (data) => {
      if (data.message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
        playMessagePopSound();
        if (!isCallModalOpen) {
          setUnreadMessagesCount((prev) => prev + 1);
        }
      }
    });

    const unsubTyping = liveSocketService.on('chat_typing', (data) => {
      if (data.isTyping) {
        setTypingUsers((prev) => (prev.includes(data.senderName) ? prev : [...prev, data.senderName]));
      } else {
        setTypingUsers((prev) => prev.filter((n) => n !== data.senderName));
      }
    });

    const unsubIncomingCall = liveSocketService.on('incoming_call', (data) => {
      const call: LiveCallSession = data.call;
      // If this client is not the caller
      if (call.callerId !== clientIdRef.current) {
        setIncomingCall(call);
        // Play phone ring chime
        playPhoneRingSound();
        clearInterval(ringIntervalRef.current);
        ringIntervalRef.current = setInterval(() => {
          playPhoneRingSound();
        }, 2200);
      }
    });

    const unsubCallAccepted = liveSocketService.on('call_accepted', async (data) => {
      const call: LiveCallSession = data.call;
      clearInterval(ringIntervalRef.current);
      setIncomingCall(null);
      setActiveCall(call);

      // Start call timer
      setCallDuration(0);
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1000);

      // If this client initiated the call, create WebRTC offer
      if (call.callerId === clientIdRef.current && webrtcManagerRef.current) {
        await webrtcManagerRef.current.createOffer();
      }
    });

    const unsubCallRejected = liveSocketService.on('call_rejected', () => {
      clearInterval(ringIntervalRef.current);
      clearInterval(timerIntervalRef.current);
      setIncomingCall(null);
      setActiveCall(null);
      if (webrtcManagerRef.current) {
        webrtcManagerRef.current.stop();
        webrtcManagerRef.current = null;
      }
      setLocalStream(null);
      setRemoteStream(null);
    });

    const unsubCallEnded = liveSocketService.on('call_ended', () => {
      clearInterval(ringIntervalRef.current);
      clearInterval(timerIntervalRef.current);
      setIncomingCall(null);
      setActiveCall(null);
      if (webrtcManagerRef.current) {
        webrtcManagerRef.current.stop();
        webrtcManagerRef.current = null;
      }
      setLocalStream(null);
      setRemoteStream(null);
    });

    const unsubWebRtc = liveSocketService.on('webrtc_signal', async (payload) => {
      if (webrtcManagerRef.current && payload.signalType && payload.data) {
        await webrtcManagerRef.current.handleSignal(payload.signalType, payload.data);
      }
    });

    const unsubActiveSync = liveSocketService.on('active_calls_sync', (data) => {
      if (data.calls) {
        setActiveWaitersCalls(data.calls);
      }
    });

    return () => {
      unsubConn();
      unsubHistory();
      unsubMsg();
      unsubTyping();
      unsubIncomingCall();
      unsubCallAccepted();
      unsubCallRejected();
      unsubCallEnded();
      unsubWebRtc();
      unsubActiveSync();
      clearInterval(ringIntervalRef.current);
      clearInterval(timerIntervalRef.current);
    };
  }, [roomId, userRole, userName, activeTable, isCallModalOpen]);

  // Initiate a new live call
  const initiateCall = useCallback(
    async (type: CallType, tableNumber?: string) => {
      const targetTable = tableNumber || activeTable?.name || roomId;
      const callId = `call-${Date.now()}`;

      setActiveModalTab(type);
      setIsCallModalOpen(true);

      // Setup WebRTC manager
      const manager = new WebRtcManager({
        onLocalStream: (s) => setLocalStream(s),
        onRemoteStream: (s) => setRemoteStream(s),
        onConnectionState: (state) => {
          console.log('[WebRTC ConnectionState]:', state);
        }
      });
      webrtcManagerRef.current = manager;

      // Start local microphone & camera
      await manager.startLocalMedia(type);
      manager.initPeerConnection(callId, roomId, true);

      const session: LiveCallSession = {
        id: callId,
        roomId,
        callerId: clientIdRef.current,
        callerName: userName,
        callerRole: userRole,
        tableNumber: targetTable,
        callType: type,
        status: 'ringing',
        startedAt: Date.now()
      };
      setActiveCall(session);

      liveSocketService.initiateCall(type, callId, targetTable);

      // Play ringing sound on caller side
      playPhoneRingSound();
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = setInterval(() => {
        playPhoneRingSound();
      }, 2500);
    },
    [activeTable, roomId, userName, userRole]
  );

  // Accept incoming call
  const acceptIncomingCall = useCallback(async () => {
    if (!incomingCall) return;

    clearInterval(ringIntervalRef.current);
    setActiveModalTab(incomingCall.callType);
    setIsCallModalOpen(true);

    const manager = new WebRtcManager({
      onLocalStream: (s) => setLocalStream(s),
      onRemoteStream: (s) => setRemoteStream(s),
      onConnectionState: (state) => {
        console.log('[WebRTC ConnectionState Responder]:', state);
      }
    });
    webrtcManagerRef.current = manager;

    await manager.startLocalMedia(incomingCall.callType);
    manager.initPeerConnection(incomingCall.id, incomingCall.roomId, false);

    liveSocketService.acceptCall(incomingCall.id);
    setActiveCall({
      ...incomingCall,
      status: 'connected',
      responderId: clientIdRef.current,
      responderName: userName,
      responderRole: userRole
    });
    setIncomingCall(null);

    // Start timer
    setCallDuration(0);
    clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setCallDuration((d) => d + 1);
    }, 1000);
  }, [incomingCall, userName, userRole]);

  // Reject incoming call
  const rejectIncomingCall = useCallback(
    (reason?: string) => {
      if (!incomingCall) return;
      clearInterval(ringIntervalRef.current);
      liveSocketService.rejectCall(incomingCall.id, reason);
      setIncomingCall(null);
    },
    [incomingCall]
  );

  // End current call
  const endCurrentCall = useCallback(() => {
    clearInterval(ringIntervalRef.current);
    clearInterval(timerIntervalRef.current);
    if (activeCall) {
      liveSocketService.endCall(activeCall.id);
    }
    if (webrtcManagerRef.current) {
      webrtcManagerRef.current.stop();
      webrtcManagerRef.current = null;
    }
    setActiveCall(null);
    setLocalStream(null);
    setRemoteStream(null);
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoOff(false);
  }, [activeCall]);

  const toggleMute = useCallback(() => {
    if (webrtcManagerRef.current) {
      const muted = webrtcManagerRef.current.toggleMute();
      setIsMuted(muted);
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (webrtcManagerRef.current) {
      const videoOff = webrtcManagerRef.current.toggleVideo();
      setIsVideoOff(videoOff);
    }
  }, []);

  const sendChatMessage = useCallback(
    (text: string, quickAction?: string) => {
      liveSocketService.sendChatMessage(text, quickAction);
    },
    []
  );

  const sendTyping = useCallback((isTyping: boolean) => {
    liveSocketService.sendTyping(isTyping);
  }, []);

  const openCallModal = useCallback((tab: 'chat' | 'audio' | 'video' = 'chat', tableNumber?: string) => {
    if (tableNumber) {
      setRoomId(tableNumber);
    }
    setActiveModalTab(tab);
    setIsCallModalOpen(true);
    setUnreadMessagesCount(0);
  }, []);

  const closeCallModal = useCallback(() => {
    setIsCallModalOpen(false);
  }, []);

  const clearUnreadCount = useCallback(() => {
    setUnreadMessagesCount(0);
  }, []);

  return (
    <LiveCallContext.Provider
      value={{
        socketConnected,
        roomId,
        setRoomId,
        messages,
        typingUsers,
        activeCall,
        incomingCall,
        activeWaitersCalls,
        isCallModalOpen,
        activeModalTab,
        openCallModal,
        closeCallModal,
        initiateCall,
        acceptIncomingCall,
        rejectIncomingCall,
        endCurrentCall,
        sendChatMessage,
        sendTyping,
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        toggleMute,
        toggleVideo,
        callDuration,
        unreadMessagesCount,
        clearUnreadCount
      }}
    >
      {children}
    </LiveCallContext.Provider>
  );
};

export const useLiveCall = () => {
  const context = useContext(LiveCallContext);
  if (!context) {
    throw new Error('useLiveCall must be used within a LiveCallProvider');
  }
  return context;
};
