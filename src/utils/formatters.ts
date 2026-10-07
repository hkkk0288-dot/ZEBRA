export const USD_TO_TZS_RATE = 2600;

/**
 * Formats an amount directly in TZS (Tanzanian Shillings) without any conversion.
 */
export function formatTzsPrice(tzsAmount: number): string {
  const safeNum = Math.round(tzsAmount || 0);
  return `${safeNum.toLocaleString()} TZS`;
}

/**
 * Formats a price in USD or TZS.
 * If currency is TZS:
 *   - If the amount is already a typical TZS value (> 200), it formats it directly as TZS without multiplying by 2600 again.
 *   - If the amount is a typical USD value (<= 200), it converts from USD to TZS (* 2600).
 * If currency is USD:
 *   - If the amount is a large TZS value (> 500), it converts to USD (/ 2600).
 *   - Otherwise formats as standard USD ($X.XX).
 */
export function formatPrice(amount: number, currency: 'USD' | 'TZS' = 'USD'): string {
  const safeAmount = Number(amount) || 0;
  if (currency === 'TZS') {
    // Prevent double conversion: if value is already in TZS range (e.g. 500 TZS up to millions), don't multiply by 2600!
    const tzsAmount = safeAmount > 200 ? Math.round(safeAmount) : Math.round(safeAmount * USD_TO_TZS_RATE);
    return `${tzsAmount.toLocaleString()} TZS`;
  }
  const usdAmount = safeAmount > 500 ? (safeAmount / USD_TO_TZS_RATE) : safeAmount;
  return `$${usdAmount.toFixed(2)}`;
}

export function generateOrderNumber(): string {
  const letters = 'ZBR';
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${letters}-${num}`;
}

export function generateUssdRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'MP';
  for (let i = 0; i < 7; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}
