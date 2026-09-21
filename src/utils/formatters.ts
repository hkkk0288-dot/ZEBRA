export const USD_TO_TZS_RATE = 2600;

export function formatPrice(amountUSD: number, currency: 'USD' | 'TZS' = 'USD'): string {
  if (currency === 'TZS') {
    const tzsAmount = Math.round(amountUSD * USD_TO_TZS_RATE);
    return `${tzsAmount.toLocaleString()} TZS`;
  }
  return `$${amountUSD.toFixed(2)}`;
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
