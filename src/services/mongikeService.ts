/**
 * Mongike Payment Gateway Client Service
 * Integrates Tanzania Mobile Money (Vodacom M-Pesa, Tigo Pesa, Airtel Money, HaloPesa)
 * via backend proxy routes to protect API keys.
 */

export interface MongikeInitiatePaymentParams {
  orderId: string;
  amount: number;
  buyerPhone: string;
  feePayer?: 'MERCHANT' | 'CUSTOMER';
  buyerName?: string;
  buyerEmail?: string;
  metadata?: Record<string, any>;
}

export interface MongikePaymentResponse {
  status: 'success' | 'error';
  message?: string;
  isSimulated?: boolean;
  data?: {
    id?: string;
    order_id: string;
    gateway_ref: string;
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | string;
    expires_at?: string;
  };
  code?: string;
}

export interface MongikePayoutParams {
  amount: number;
  recipientPhone: string;
  recipientName?: string;
  narration?: string;
}

export interface MongikePayoutResponse {
  status: 'success' | 'error';
  message?: string;
  isSimulated?: boolean;
  data?: {
    reference: string;
    amount: number;
    status: string;
  };
}

export interface MongikeBalanceResponse {
  status: 'success' | 'error';
  isSimulated?: boolean;
  data?: {
    balance: number;
    currency: string;
  };
  message?: string;
}

export interface MongikeTransactionItem {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  gateway_ref: string;
  payer_phone?: string;
  carrier?: string;
}

export interface MongikeHistoryResponse {
  status: string;
  isSimulated?: boolean;
  data?: MongikeTransactionItem[];
  message?: string;
}

export interface MongikeGatewayStatus {
  status: string;
  gateway: string;
  configured: boolean;
  mode: 'live' | 'simulation';
  supportedCarriers: string[];
}

export const mongikeService = {
  /**
   * Check Gateway connectivity & configuration status
   */
  async getStatus(): Promise<MongikeGatewayStatus> {
    try {
      const res = await fetch('/api/mongike/status');
      if (!res.ok) throw new Error('Status endpoint failed');
      return await res.json();
    } catch (err) {
      return {
        status: 'error',
        gateway: 'Mongike Tanzania Mobile Money',
        configured: false,
        mode: 'simulation',
        supportedCarriers: ['Vodacom M-Pesa', 'Tigo Pesa', 'Airtel Money', 'HaloPesa']
      };
    }
  },

  /**
   * Initiate Mobile Money STK Push to customer's phone in Tanzania
   * POST /api/v1/payments/mobile-money/tanzania
   */
  async initiatePayment(params: MongikeInitiatePaymentParams): Promise<MongikePaymentResponse> {
    const res = await fetch('/api/mongike/payments/mobile-money/tanzania', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_id: params.orderId,
        amount: params.amount,
        buyer_phone: params.buyerPhone,
        fee_payer: params.feePayer || 'MERCHANT',
        buyer_name: params.buyerName,
        buyer_email: params.buyerEmail,
        metadata: params.metadata
      })
    });

    const data = await res.json().catch(() => ({
      status: 'error',
      message: `HTTP Error ${res.status}`
    }));

    return data;
  },

  /**
   * Withdraw / Send Payout to Mobile Money number
   * POST /api/v1/payouts/withdraw
   */
  async withdraw(params: MongikePayoutParams): Promise<MongikePayoutResponse> {
    const res = await fetch('/api/mongike/payouts/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: params.amount,
        recipient_phone: params.recipientPhone,
        recipient_name: params.recipientName,
        narration: params.narration
      })
    });

    const data = await res.json().catch(() => ({
      status: 'error',
      message: `HTTP Error ${res.status}`
    }));

    return data;
  },

  /**
   * Get current merchant wallet balance
   * GET /api/v1/wallet/balance
   */
  async getBalance(): Promise<MongikeBalanceResponse> {
    try {
      const res = await fetch('/api/mongike/wallet/balance');
      if (!res.ok) throw new Error('Balance request failed');
      return await res.json();
    } catch (err: any) {
      return {
        status: 'error',
        message: err.message || 'Failed to fetch balance'
      };
    }
  },

  /**
   * Get transaction history
   * GET /api/v1/wallet/history
   */
  async getHistory(): Promise<MongikeHistoryResponse> {
    try {
      const res = await fetch('/api/mongike/wallet/history');
      if (!res.ok) throw new Error('History request failed');
      return await res.json();
    } catch (err: any) {
      return {
        status: 'error',
        message: err.message || 'Failed to fetch transaction history'
      };
    }
  }
};
