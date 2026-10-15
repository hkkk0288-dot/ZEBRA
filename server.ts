import express, { Request, Response } from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = 3000;
const isDev = process.env.NODE_ENV !== 'production';

app.use(express.json());

// Normalize Tanzanian phone number to international format without '+'
// e.g. "0712 345 678" -> "255712345678", "+255712345678" -> "255712345678"
function normalizeTzPhone(rawPhone: string): string {
  if (!rawPhone) return '';
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return '255' + digits.substring(1);
  }
  if (digits.startsWith('255')) {
    return digits;
  }
  return digits;
}

const MONGIKE_BASE_URL = 'https://mongike.com/api/v1';

function getMongikeApiKey(): string {
  return process.env.MONGIKE_API_KEY || process.env.VITE_MONGIKE_API_KEY || '';
}

// 1. Gateway status endpoint (never exposes secret key)
app.get('/api/mongike/status', (_req: Request, res: Response) => {
  const apiKey = getMongikeApiKey();
  res.json({
    status: 'success',
    gateway: 'Mongike Tanzania Mobile Money',
    configured: Boolean(apiKey && apiKey.length > 5),
    mode: apiKey && apiKey.length > 5 ? 'live' : 'simulation',
    supportedCarriers: ['Vodacom M-Pesa', 'Tigo Pesa', 'Airtel Money', 'HaloPesa'],
    endpoints: {
      initiatePayment: '/api/v1/payments/mobile-money/tanzania',
      withdraw: '/api/v1/payouts/withdraw',
      balance: '/api/v1/wallet/balance',
      history: '/api/v1/wallet/history'
    }
  });
});

// 2. Initiate Mobile Money Payment (Tanzania STK Push / USSD Prompt)
// POST https://mongike.com/api/v1/payments/mobile-money/tanzania
app.post('/api/mongike/payments/mobile-money/tanzania', async (req: Request, res: Response) => {
  try {
    const { order_id, amount, buyer_phone, fee_payer, buyer_name, buyer_email, metadata } = req.body;

    if (!order_id || !amount || !buyer_phone) {
      return res.status(400).json({
        status: 'error',
        message: 'order_id, amount, and buyer_phone are required'
      });
    }

    const formattedPhone = normalizeTzPhone(buyer_phone);
    const parsedAmount = typeof amount === 'number' ? amount : parseFloat(amount);
    const feePayer = fee_payer === 'CUSTOMER' ? 'CUSTOMER' : 'MERCHANT';
    const apiKey = getMongikeApiKey();

    const payload = {
      order_id: String(order_id),
      amount: parsedAmount,
      buyer_phone: formattedPhone,
      fee_payer: feePayer,
      buyer_name: buyer_name || 'Customer',
      buyer_email: buyer_email || undefined,
      metadata: metadata || {}
    };

    // If API key is configured, forward to live Mongike API
    if (apiKey && apiKey.trim().length > 5) {
      console.log(`[Mongike] Forwarding real payment request for order: ${order_id}, phone: ${formattedPhone}, amount: ${parsedAmount}`);
      const mongikeRes = await fetch(`${MONGIKE_BASE_URL}/payments/mobile-money/tanzania`, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey.trim(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await mongikeRes.json().catch(() => null);

      if (!mongikeRes.ok) {
        console.warn(`[Mongike] Live API error (${mongikeRes.status}):`, data);
        return res.status(mongikeRes.status).json(data || {
          status: 'error',
          message: `Mongike gateway responded with status ${mongikeRes.status}`
        });
      }

      return res.status(mongikeRes.status).json(data);
    }

    // Fallback Simulation Mode (when MONGIKE_API_KEY is not yet in .env)
    // Allows previewing the exact STK Push prompt experience
    console.log(`[Mongike] Simulating STK push for order: ${order_id} (set MONGIKE_API_KEY in .env for live carrier calls)`);
    const mockGatewayRef = `MGK_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    return res.status(201).json({
      status: 'success',
      message: 'Payment initiated successfully (Mongike Simulation Mode)',
      isSimulated: true,
      data: {
        id: `sim-uuid-${Date.now()}`,
        order_id: String(order_id),
        gateway_ref: mockGatewayRef,
        amount: parsedAmount,
        status: 'PENDING',
        expires_at: expiresAt
      }
    });
  } catch (error: any) {
    console.error('[Mongike Error - Initiate Payment]:', error);
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Internal server error while communicating with Mongike Gateway'
    });
  }
});

// 3. Withdraw / Payout to Mobile Money
// POST https://mongike.com/api/v1/payouts/withdraw
app.post('/api/mongike/payouts/withdraw', async (req: Request, res: Response) => {
  try {
    const { amount, recipient_phone, recipient_name, narration } = req.body;

    if (!amount || !recipient_phone) {
      return res.status(400).json({
        status: 'error',
        message: 'amount and recipient_phone are required'
      });
    }

    const formattedPhone = normalizeTzPhone(recipient_phone);
    const parsedAmount = typeof amount === 'number' ? amount : parseFloat(amount);
    const apiKey = getMongikeApiKey();

    const payload = {
      amount: parsedAmount,
      recipient_phone: formattedPhone,
      recipient_name: recipient_name || undefined,
      narration: narration || 'Zebra Restaurant Payout'
    };

    if (apiKey && apiKey.trim().length > 5) {
      console.log(`[Mongike] Forwarding payout for phone: ${formattedPhone}, amount: ${parsedAmount}`);
      const mongikeRes = await fetch(`${MONGIKE_BASE_URL}/payouts/withdraw`, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey.trim(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await mongikeRes.json().catch(() => null);

      if (!mongikeRes.ok) {
        return res.status(mongikeRes.status).json(data || {
          status: 'error',
          message: `Mongike payout failed with status ${mongikeRes.status}`
        });
      }

      return res.status(mongikeRes.status).json(data);
    }

    // Simulated Payout
    return res.status(200).json({
      status: 'success',
      message: 'Payout sent successfully (Simulation Mode)',
      isSimulated: true,
      data: {
        reference: `PO_${Math.floor(100000 + Math.random() * 900000)}`,
        amount: parsedAmount,
        status: 'COMPLETED'
      }
    });
  } catch (error: any) {
    console.error('[Mongike Error - Payout]:', error);
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Internal server error while initiating payout'
    });
  }
});

// 4. Get Wallet Balance
// GET https://mongike.com/api/v1/wallet/balance
app.get('/api/mongike/wallet/balance', async (_req: Request, res: Response) => {
  try {
    const apiKey = getMongikeApiKey();

    if (apiKey && apiKey.trim().length > 5) {
      const mongikeRes = await fetch(`${MONGIKE_BASE_URL}/wallet/balance`, {
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'x-api-key': apiKey.trim()
        }
      });

      const data = await mongikeRes.json().catch(() => null);

      if (!mongikeRes.ok) {
        return res.status(mongikeRes.status).json(data || {
          status: 'error',
          message: 'Unable to retrieve wallet balance from Mongike'
        });
      }

      return res.status(200).json(data);
    }

    // Simulated Wallet Balance
    return res.status(200).json({
      status: 'success',
      isSimulated: true,
      data: {
        balance: 1450000,
        currency: 'TZS'
      }
    });
  } catch (error: any) {
    console.error('[Mongike Error - Balance]:', error);
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Internal server error while fetching balance'
    });
  }
});

// 5. Get Transaction History
// GET https://mongike.com/api/v1/wallet/history
app.get('/api/mongike/wallet/history', async (_req: Request, res: Response) => {
  try {
    const apiKey = getMongikeApiKey();

    if (apiKey && apiKey.trim().length > 5) {
      const mongikeRes = await fetch(`${MONGIKE_BASE_URL}/wallet/history`, {
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'x-api-key': apiKey.trim()
        }
      });

      const data = await mongikeRes.json().catch(() => null);

      if (!mongikeRes.ok) {
        return res.status(mongikeRes.status).json(data || {
          status: 'error',
          message: 'Unable to retrieve transaction history from Mongike'
        });
      }

      return res.status(200).json(data);
    }

    // Simulated Transaction History
    return res.status(200).json({
      status: 'success',
      isSimulated: true,
      data: [
        {
          id: 'tx-mgk-01',
          type: 'COLLECTION',
          amount: 48000,
          status: 'COMPLETED',
          created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
          gateway_ref: 'MGK_99182A',
          payer_phone: '255754123456',
          carrier: 'Vodacom M-Pesa'
        },
        {
          id: 'tx-mgk-02',
          type: 'COLLECTION',
          amount: 32000,
          status: 'COMPLETED',
          created_at: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
          gateway_ref: 'MGK_44129B',
          payer_phone: '255714992019',
          carrier: 'Tigo Pesa'
        },
        {
          id: 'tx-mgk-03',
          type: 'PAYOUT',
          amount: 15000,
          status: 'COMPLETED',
          created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          gateway_ref: 'PO_773120',
          payer_phone: '255788910245',
          carrier: 'Airtel Money'
        }
      ]
    });
  } catch (error: any) {
    console.error('[Mongike Error - History]:', error);
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Internal server error while fetching history'
    });
  }
});

// ==========================================
// REAL-TIME WEBSOCKET: LIVE CALL & CHAT SYSTEM
// ==========================================

interface ConnectedClient {
  ws: WebSocket;
  clientId: string;
  name: string;
  role: 'customer' | 'waiter' | 'admin';
  roomId: string;
  tableNumber?: string;
}

const connectedClients = new Map<string, ConnectedClient>();
const roomMessages = new Map<string, any[]>();
const activeCalls = new Map<string, any>();

// Seed default welcome messages for common tables
const DEFAULT_WELCOME_MSG = (table: string) => ({
  id: `msg-welcome-${table}`,
  roomId: table,
  senderId: 'sys-waiter',
  senderName: 'Mhudumu wa Zamu (Neema M.)',
  senderRole: 'waiter',
  tableNumber: table,
  text: `Habari na Karibu Zebra Restaurant! Naitwa Neema, mhudumu wako wa leo kwenye ${table}. Unaweza kuniandikia hapa au kupiga Simu ya Sauti / Video papo kwa hapo ukihitaji chochote.`,
  timestamp: Date.now() - 5 * 60 * 1000,
  status: 'delivered'
});

function getRoomHistory(roomId: string) {
  if (!roomMessages.has(roomId)) {
    roomMessages.set(roomId, [DEFAULT_WELCOME_MSG(roomId)]);
  }
  return roomMessages.get(roomId)!;
}

function broadcastToRoom(roomId: string, message: any, excludeClientId?: string) {
  const payload = JSON.stringify(message);
  for (const client of connectedClients.values()) {
    if (client.clientId === excludeClientId) continue;
    if (client.ws.readyState === WebSocket.OPEN) {
      if (client.roomId === roomId || client.role === 'waiter' || client.role === 'admin') {
        client.ws.send(payload);
      }
    }
  }
}

function broadcastToWaiters(message: any) {
  const payload = JSON.stringify(message);
  for (const client of connectedClients.values()) {
    if (client.ws.readyState === WebSocket.OPEN && (client.role === 'waiter' || client.role === 'admin')) {
      client.ws.send(payload);
    }
  }
}

function sendToClient(clientId: string, message: any) {
  const client = connectedClients.get(clientId);
  if (client && client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify(message));
  }
}

// REST endpoints for chat and calls
app.get('/api/live/active-calls', (_req: Request, res: Response) => {
  const list = Array.from(activeCalls.values()).filter(c => c.status === 'ringing' || c.status === 'connected');
  res.json({
    status: 'success',
    activeCalls: list,
    connectedUsersCount: connectedClients.size
  });
});

app.get('/api/live/messages/:roomId', (req: Request, res: Response) => {
  const { roomId } = req.params;
  const messages = getRoomHistory(roomId);
  res.json({
    status: 'success',
    roomId,
    messages
  });
});

app.post('/api/live/reject-call', (req: Request, res: Response) => {
  const { callId, reason } = req.body;
  const session = activeCalls.get(callId);
  if (session) {
    session.status = 'rejected';
    broadcastToRoom(session.roomId, {
      type: 'call_rejected',
      callId,
      reason: reason || 'Kataa kutoka Notification'
    });
    broadcastToWaiters({
      type: 'call_rejected',
      callId
    });
    activeCalls.delete(callId);
  }
  res.json({ status: 'success' });
});

// Setup WebSocket server on path /live-ws
const wss = new WebSocketServer({ server, path: '/live-ws' });

wss.on('connection', (ws: WebSocket) => {
  let registeredClientId: string | undefined = undefined;

  ws.on('message', (raw: string) => {
    try {
      const data = JSON.parse(raw.toString());
      const { type } = data;

      switch (type) {
        case 'join': {
          const { clientId, name, role, roomId, tableNumber } = data;
          const assignedId = (clientId as string) || `client-${Date.now()}`;
          registeredClientId = assignedId;
          
          connectedClients.set(assignedId, {
            ws,
            clientId: assignedId,
            name: name || 'Mteja',
            role: role || 'customer',
            roomId: roomId || 'general',
            tableNumber: tableNumber || (role === 'customer' ? roomId : undefined)
          });

          // Send back chat history for this room
          const history = getRoomHistory(roomId || 'general');
          ws.send(JSON.stringify({
            type: 'history',
            roomId: roomId || 'general',
            messages: history
          }));

          // Send active calls if waiter
          if (role === 'waiter' || role === 'admin') {
            const currentCalls = Array.from(activeCalls.values()).filter(
              c => c.status === 'ringing' || c.status === 'connected'
            );
            ws.send(JSON.stringify({
              type: 'active_calls_sync',
              calls: currentCalls
            }));
          }

          // Broadcast user joined
          broadcastToRoom(roomId || 'general', {
            type: 'user_joined',
            clientId: assignedId,
            name: name || 'Mteja',
            role: role || 'customer',
            tableNumber
          }, assignedId);
          break;
        }

        case 'chat_message': {
          const { roomId, senderId, senderName, senderRole, tableNumber, text, quickAction } = data;
          if (!text || !text.trim()) return;

          const newMsg = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            roomId: roomId || 'general',
            senderId: senderId || registeredClientId || 'unknown',
            senderName: senderName || 'Mteja',
            senderRole: senderRole || 'customer',
            tableNumber: tableNumber || roomId,
            text: text.trim(),
            quickAction: quickAction || undefined,
            timestamp: Date.now(),
            status: 'delivered'
          };

          const history = getRoomHistory(roomId || 'general');
          history.push(newMsg);
          if (history.length > 200) history.shift();

          // Broadcast to everyone in room and all waiters
          broadcastToRoom(roomId || 'general', {
            type: 'chat_message',
            message: newMsg
          });
          break;
        }

        case 'chat_typing': {
          const { roomId, senderName, isTyping } = data;
          broadcastToRoom(roomId || 'general', {
            type: 'chat_typing',
            roomId: roomId || 'general',
            senderName,
            isTyping: Boolean(isTyping)
          }, registeredClientId || undefined);
          break;
        }

        case 'call_initiate': {
          const { callId, roomId, callerId, callerName, callerRole, tableNumber, callType } = data;
          const session = {
            id: callId || `call-${Date.now()}`,
            roomId: roomId || 'general',
            callerId: callerId || registeredClientId,
            callerName: callerName || 'Mteja wa Meza',
            callerRole: callerRole || 'customer',
            tableNumber: tableNumber || roomId,
            callType: callType === 'video' ? 'video' : 'audio',
            status: 'ringing',
            startedAt: Date.now()
          };

          activeCalls.set(session.id, session);

          // Broadcast incoming call to room & all staff/waiters
          broadcastToRoom(session.roomId, {
            type: 'incoming_call',
            call: session
          });
          broadcastToWaiters({
            type: 'incoming_call',
            call: session
          });
          break;
        }

        case 'call_accept': {
          const { callId, responderId, responderName, responderRole } = data;
          const session = activeCalls.get(callId);
          if (session) {
            session.status = 'connected';
            session.responderId = responderId || registeredClientId;
            session.responderName = responderName || 'Mhudumu';
            session.responderRole = responderRole || 'waiter';
            session.startedAt = Date.now();

            broadcastToRoom(session.roomId, {
              type: 'call_accepted',
              call: session
            });
            broadcastToWaiters({
              type: 'call_accepted',
              call: session
            });
          }
          break;
        }

        case 'call_reject': {
          const { callId, reason } = data;
          const session = activeCalls.get(callId);
          if (session) {
            session.status = 'rejected';
            broadcastToRoom(session.roomId, {
              type: 'call_rejected',
              callId,
              reason: reason || 'Mhudumu yuko bize kwa sasa'
            });
            broadcastToWaiters({
              type: 'call_rejected',
              callId
            });
            activeCalls.delete(callId);
          }
          break;
        }

        case 'call_end': {
          const { callId } = data;
          const session = activeCalls.get(callId);
          if (session) {
            session.status = 'ended';
            session.endedAt = Date.now();
            session.durationSeconds = Math.round((session.endedAt - session.startedAt) / 1000);

            broadcastToRoom(session.roomId, {
              type: 'call_ended',
              callId,
              durationSeconds: session.durationSeconds
            });
            broadcastToWaiters({
              type: 'call_ended',
              callId
            });
            activeCalls.delete(callId);
          }
          break;
        }

        case 'webrtc_signal': {
          // WebRTC Signaling: offer, answer, or ice-candidate
          const { callId, roomId, targetPeerId, signalType, data: signalData } = data;
          const payload = {
            type: 'webrtc_signal',
            callId,
            roomId,
            from: registeredClientId || 'unknown',
            signalType,
            data: signalData
          };

          if (targetPeerId) {
            sendToClient(targetPeerId, payload);
          } else {
            // Forward to peers in the call
            broadcastToRoom(roomId || 'general', payload, registeredClientId || undefined);
          }
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.warn('[WS Message Error]:', err);
    }
  });

  ws.on('close', () => {
    if (registeredClientId) {
      const client = connectedClients.get(registeredClientId);
      if (client) {
        broadcastToRoom(client.roomId, {
          type: 'user_left',
          clientId: registeredClientId,
          name: client.name
        }, registeredClientId);
      }
      connectedClients.delete(registeredClientId);
    }
  });

  ws.on('error', (err) => {
    console.warn('[WS Client Error]:', err);
  });
});

// Setup Vite middleware in dev or static files in production
async function initServer() {
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Zebra Server] Server running on port ${PORT} with WebSockets & Mongike Gateway`);
  });
}

initServer();
