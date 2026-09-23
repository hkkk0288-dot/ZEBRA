import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Zebra Server] Server running on port ${PORT} with Mongike Payment Gateway`);
  });
}

initServer();
