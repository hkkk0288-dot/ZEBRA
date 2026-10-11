import { LiveChatMessage, LiveCallSession, WebRtcSignalPayload, CallType } from '../types';

export type SocketEventType =
  | 'chat_message'
  | 'history'
  | 'chat_typing'
  | 'incoming_call'
  | 'call_accepted'
  | 'call_rejected'
  | 'call_ended'
  | 'webrtc_signal'
  | 'active_calls_sync'
  | 'user_joined'
  | 'user_left';

type EventCallback = (data: any) => void;

class LiveCallSocketService {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private isConnecting: boolean = false;
  private reconnectTimeout: any = null;
  private currentParams: {
    clientId: string;
    name: string;
    role: 'customer' | 'waiter' | 'admin';
    roomId: string;
    tableNumber?: string;
  } | null = null;

  constructor() {
    // initialize listener sets
  }

  public connect(params: {
    clientId: string;
    name: string;
    role: 'customer' | 'waiter' | 'admin';
    roomId: string;
    tableNumber?: string;
  }) {
    this.currentParams = params;

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      // If already connected but room changed, send join again
      this.send({
        type: 'join',
        ...params
      });
      return;
    }

    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live-ws`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnecting = false;
        console.log('[LiveSocket] Connected to server successfully');
        if (this.currentParams) {
          this.send({
            type: 'join',
            ...this.currentParams
          });
        }
        this.emit('connection_status', { connected: true });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.type) {
            this.emit(data.type, data);
          }
        } catch (err) {
          console.warn('[LiveSocket] Parse error:', err);
        }
      };

      this.ws.onclose = () => {
        this.isConnecting = false;
        this.emit('connection_status', { connected: false });
        // Attempt reconnect after 3 seconds
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = setTimeout(() => {
          if (this.currentParams) {
            this.connect(this.currentParams);
          }
        }, 3000);
      };

      this.ws.onerror = (err) => {
        console.warn('[LiveSocket] Socket error:', err);
        this.isConnecting = false;
      };
    } catch (err) {
      console.warn('[LiveSocket] Failed to create socket:', err);
      this.isConnecting = false;
    }
  }

  public disconnect() {
    clearTimeout(this.reconnectTimeout);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnecting = false;
  }

  public on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  public off(event: string, callback: EventCallback) {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback);
    }
  }

  private emit(event: string, data: any) {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error('[LiveSocket] Listener error:', e);
        }
      });
    }
  }

  public send(payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  // High-level Actions
  public sendChatMessage(text: string, quickAction?: string) {
    if (!this.currentParams) return;
    this.send({
      type: 'chat_message',
      roomId: this.currentParams.roomId,
      senderId: this.currentParams.clientId,
      senderName: this.currentParams.name,
      senderRole: this.currentParams.role,
      tableNumber: this.currentParams.tableNumber || this.currentParams.roomId,
      text,
      quickAction
    });
  }

  public sendTyping(isTyping: boolean) {
    if (!this.currentParams) return;
    this.send({
      type: 'chat_typing',
      roomId: this.currentParams.roomId,
      senderName: this.currentParams.name,
      isTyping
    });
  }

  public initiateCall(callType: CallType, callId: string, customTable?: string) {
    if (!this.currentParams) return;
    this.send({
      type: 'call_initiate',
      callId,
      roomId: this.currentParams.roomId,
      callerId: this.currentParams.clientId,
      callerName: this.currentParams.name,
      callerRole: this.currentParams.role,
      tableNumber: customTable || this.currentParams.tableNumber || this.currentParams.roomId,
      callType
    });
  }

  public acceptCall(callId: string) {
    if (!this.currentParams) return;
    this.send({
      type: 'call_accept',
      callId,
      responderId: this.currentParams.clientId,
      responderName: this.currentParams.name,
      responderRole: this.currentParams.role
    });
  }

  public rejectCall(callId: string, reason?: string) {
    this.send({
      type: 'call_reject',
      callId,
      reason
    });
  }

  public endCall(callId: string) {
    this.send({
      type: 'call_end',
      callId
    });
  }

  public sendWebRtcSignal(payload: WebRtcSignalPayload) {
    this.send({
      type: 'webrtc_signal',
      signalType: payload.type,
      callId: payload.callId,
      roomId: payload.roomId,
      from: payload.from,
      target: payload.target,
      data: payload.data
    });
  }
}

export const liveSocketService = new LiveCallSocketService();
