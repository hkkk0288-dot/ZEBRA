export interface AdminDriver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  vehicle: string;
  plateNumber: string;
  zone: string;
  status: 'active' | 'busy' | 'offline';
  rating: number;
  deliveriesCompleted: number;
  currentOrder?: string;
  batteryPercent: number;
  currentSpeed: number; // km/h
  coordinates: [number, number]; // [lat, lng]
}

export interface AdminMerchant {
  id: string;
  name: string;
  branch: string;
  manager: string;
  phone: string;
  email: string;
  address: string;
  status: 'open' | 'closed';
  totalOrders: number;
  rating: number;
  payoutBalance: number;
  image: string;
}

export interface AdminPayout {
  id: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  currency: 'TZS' | 'USD';
  bankOrTill: string;
  status: 'paid' | 'pending' | 'processing';
  date: string;
  invoiceNumber: string;
}

export interface AdminTransaction {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  provider: 'M-Pesa USSD' | 'Tigo Pesa' | 'Airtel Money' | 'HaloPesa' | 'Visa/Mastercard';
  amount: number;
  currency: 'TZS' | 'USD';
  referenceCode: string;
  date: string;
  time: string;
  status: 'success' | 'pending' | 'failed';
  tillNumber: string;
}

export interface AdminVoucher {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  usageCount: number;
  maxUsage: number;
  expiryDate: string;
  status: 'active' | 'expired';
}

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Kitchen Manager' | 'Dispatcher' | 'Driver' | 'Customer';
  status: 'active' | 'suspended';
  ordersCount: number;
  totalSpent: number;
  joinedDate: string;
  avatar: string;
}

export interface AdminIssue {
  id: string;
  type: 'wrong_order' | 'missing_item' | 'cancelled_order' | 'complaint';
  title: string;
  customer: string;
  orderNumber: string;
  timeAgo: string;
  status: 'open' | 'investigating' | 'resolved';
  count: number;
  description: string;
  actionTaken?: string;
}

// Initial Mock Drivers in Dar es Salaam
export const INITIAL_DRIVERS: AdminDriver[] = [
  {
    id: 'drv-1',
    name: 'Juma Rashid',
    phone: '+255 714 882 119',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    vehicle: 'Boxer 150 (Black)',
    plateNumber: 'MC 492 DXB',
    zone: 'Masaki & Oysterbay',
    status: 'busy',
    rating: 4.9,
    deliveriesCompleted: 482,
    currentOrder: 'ZB-84920',
    batteryPercent: 88,
    currentSpeed: 34,
    coordinates: [-6.7780, 39.2785]
  },
  {
    id: 'drv-2',
    name: 'Hamisi Bakari',
    phone: '+255 754 119 402',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    vehicle: 'TVS King (Blue)',
    plateNumber: 'MC 819 BND',
    zone: 'Kariakoo & CBD',
    status: 'busy',
    rating: 4.8,
    deliveriesCompleted: 395,
    currentOrder: 'ZB-84921',
    batteryPercent: 74,
    currentSpeed: 28,
    coordinates: [-6.8160, 39.2750]
  },
  {
    id: 'drv-3',
    name: 'Kelvin John',
    phone: '+255 682 994 002',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    vehicle: 'Honda Ace (Red)',
    plateNumber: 'MC 214 KLA',
    zone: 'Mikocheni & Msasani',
    status: 'active',
    rating: 4.95,
    deliveriesCompleted: 610,
    batteryPercent: 95,
    currentSpeed: 0,
    coordinates: [-6.7650, 39.2620]
  },
  {
    id: 'drv-4',
    name: 'Ally Mwamba',
    phone: '+255 765 223 901',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    vehicle: 'Boxer BM 150 (Silver)',
    plateNumber: 'MC 701 TYP',
    zone: 'Upanga & Ilala',
    status: 'busy',
    rating: 4.7,
    deliveriesCompleted: 240,
    currentOrder: 'ZB-84923',
    batteryPercent: 62,
    currentSpeed: 42,
    coordinates: [-6.8040, 39.2810]
  },
  {
    id: 'drv-5',
    name: 'Peter Mushi',
    phone: '+255 712 345 999',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    vehicle: 'Bajaj Boxer 150 (White)',
    plateNumber: 'MC 330 KRT',
    zone: 'Kinondoni & Sinza',
    status: 'active',
    rating: 4.85,
    deliveriesCompleted: 512,
    batteryPercent: 81,
    currentSpeed: 0,
    coordinates: [-6.7910, 39.2550]
  },
  {
    id: 'drv-6',
    name: 'Emanuel Mollel',
    phone: '+255 744 100 234',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    vehicle: 'Yamaha Crux (Black)',
    plateNumber: 'MC 509 QWE',
    zone: 'Slipway & Kawe',
    status: 'offline',
    rating: 4.6,
    deliveriesCompleted: 198,
    batteryPercent: 45,
    currentSpeed: 0,
    coordinates: [-6.7550, 39.2710]
  }
];

// Initial Merchants / Kitchen Hubs
export const INITIAL_MERCHANTS: AdminMerchant[] = [
  {
    id: 'mrc-1',
    name: 'Zebra Central Masaki Kitchen',
    branch: 'Masaki Peninsula, Toure Dr',
    manager: 'David M. Johnson',
    phone: '+255 712 345 678',
    email: 'masaki@zebradsm.com',
    address: 'Plot 44, Toure Drive, Masaki Peninsula',
    status: 'open',
    totalOrders: 3410,
    rating: 4.9,
    payoutBalance: 4850000,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'mrc-2',
    name: 'Zebra Oysterbay Pizza & Grill',
    branch: 'Haile Selassie Rd, Oysterbay',
    manager: 'Amina Selemani',
    phone: '+255 744 883 291',
    email: 'oysterbay@zebradsm.com',
    address: 'Plot 12, Haile Selassie Road',
    status: 'open',
    totalOrders: 2150,
    rating: 4.8,
    payoutBalance: 3200000,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'mrc-3',
    name: 'Zebra Slipway Ocean Waterfront',
    branch: 'Msasani Slipway, Ocean Terrace',
    manager: 'Chef Hassan Mwita',
    phone: '+255 754 112 334',
    email: 'slipway@zebradsm.com',
    address: 'Msasani Pier, Slipway Centre',
    status: 'open',
    totalOrders: 1890,
    rating: 4.95,
    payoutBalance: 2940000,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'mrc-4',
    name: 'Zebra BBQ & Mishkaki Hub Kariakoo',
    branch: 'Kariakoo Market District',
    manager: 'Rashid Simba',
    phone: '+255 682 994 002',
    email: 'kariakoo@zebradsm.com',
    address: 'Msimbazi & Livingstone St',
    status: 'open',
    totalOrders: 2840,
    rating: 4.75,
    payoutBalance: 1850000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'
  }
];

// Initial Payouts
export const INITIAL_PAYOUTS: AdminPayout[] = [
  {
    id: 'PAY-1082',
    merchantId: 'mrc-1',
    merchantName: 'Zebra Central Masaki Kitchen',
    amount: 5400000,
    currency: 'TZS',
    bankOrTill: 'CRDB Bank A/C 0150992384',
    status: 'paid',
    date: '2026-09-20',
    invoiceNumber: 'INV-MSK-2026-09'
  },
  {
    id: 'PAY-1083',
    merchantId: 'mrc-2',
    merchantName: 'Zebra Oysterbay Pizza & Grill',
    amount: 3100000,
    currency: 'TZS',
    bankOrTill: 'NMB Bank A/C 2210884920',
    status: 'paid',
    date: '2026-09-19',
    invoiceNumber: 'INV-OYS-2026-09'
  },
  {
    id: 'PAY-1084',
    merchantId: 'mrc-3',
    merchantName: 'Zebra Slipway Ocean Waterfront',
    amount: 2940000,
    currency: 'TZS',
    bankOrTill: 'Vodacom Till 445566',
    status: 'pending',
    date: '2026-09-21',
    invoiceNumber: 'INV-SLP-2026-09'
  },
  {
    id: 'PAY-1085',
    merchantId: 'mrc-4',
    merchantName: 'Zebra BBQ & Mishkaki Hub Kariakoo',
    amount: 1850000,
    currency: 'TZS',
    bankOrTill: 'Tigo Pesa Till 445566',
    status: 'processing',
    date: '2026-09-21',
    invoiceNumber: 'INV-KRK-2026-09'
  }
];

// Initial Transactions
export const INITIAL_TRANSACTIONS: AdminTransaction[] = [
  {
    id: 'TRX-94821',
    orderNumber: 'ZB-84920',
    customerName: 'Sarah Kavishe',
    customerPhone: '+255 754 889 012',
    provider: 'M-Pesa USSD',
    amount: 48500,
    currency: 'TZS',
    referenceCode: 'QK89XZ21OP',
    date: '2026-09-21',
    time: '19:42',
    status: 'success',
    tillNumber: '445566'
  },
  {
    id: 'TRX-94822',
    orderNumber: 'ZB-84921',
    customerName: 'Michael John',
    customerPhone: '+255 712 994 551',
    provider: 'Tigo Pesa',
    amount: 32000,
    currency: 'TZS',
    referenceCode: 'TG992014LA',
    date: '2026-09-21',
    time: '19:35',
    status: 'success',
    tillNumber: '445566'
  },
  {
    id: 'TRX-94823',
    orderNumber: 'ZB-84922',
    customerName: 'Fideline Minja',
    customerPhone: '+255 768 114 902',
    provider: 'Airtel Money',
    amount: 65000,
    currency: 'TZS',
    referenceCode: 'AT481920KM',
    date: '2026-09-21',
    time: '19:15',
    status: 'success',
    tillNumber: '445566'
  },
  {
    id: 'TRX-94824',
    orderNumber: 'ZB-84923',
    customerName: 'Alex Msuya',
    customerPhone: '+255 744 330 918',
    provider: 'Visa/Mastercard',
    amount: 88000,
    currency: 'TZS',
    referenceCode: 'VS-77192834',
    date: '2026-09-21',
    time: '18:50',
    status: 'success',
    tillNumber: '445566'
  },
  {
    id: 'TRX-94825',
    orderNumber: 'ZB-84924',
    customerName: 'Zainab Rashid',
    customerPhone: '+255 682 771 902',
    provider: 'HaloPesa',
    amount: 24500,
    currency: 'TZS',
    referenceCode: 'HP881920BB',
    date: '2026-09-21',
    time: '18:32',
    status: 'pending',
    tillNumber: '445566'
  }
];

// Initial Vouchers
export const INITIAL_VOUCHERS: AdminVoucher[] = [
  {
    id: 'vch-1',
    code: 'ZEBRA30',
    title: 'Grand Festival 30% Discount',
    discountType: 'percentage',
    discountValue: 30,
    minOrder: 25000,
    usageCount: 412,
    maxUsage: 1000,
    expiryDate: '2026-12-31',
    status: 'active'
  },
  {
    id: 'vch-2',
    code: 'AMOUR20',
    title: 'AmourCodes VIP Special 20%',
    discountType: 'percentage',
    discountValue: 20,
    minOrder: 15000,
    usageCount: 890,
    maxUsage: 2000,
    expiryDate: '2026-11-30',
    status: 'active'
  },
  {
    id: 'vch-3',
    code: 'FREESHIP',
    title: 'Free Delivery on Orders above 40k',
    discountType: 'fixed',
    discountValue: 5000,
    minOrder: 40000,
    usageCount: 620,
    maxUsage: 1500,
    expiryDate: '2026-10-31',
    status: 'active'
  },
  {
    id: 'vch-4',
    code: 'KARIBU10',
    title: 'Welcome First Order 10k off',
    discountType: 'fixed',
    discountValue: 10000,
    minOrder: 30000,
    usageCount: 140,
    maxUsage: 500,
    expiryDate: '2026-12-15',
    status: 'active'
  }
];

// Initial Users List
export const INITIAL_USERS: AdminUserRecord[] = [
  {
    id: 'usr-adm-1',
    name: 'David Michael Johnson',
    email: 'david@zebradsm.com',
    phone: '+255 754 123 456',
    role: 'Super Admin',
    status: 'active',
    ordersCount: 84,
    totalSpent: 1850000,
    joinedDate: 'Jan 2025',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr-mgr-2',
    name: 'Amour Ally (AmourCodes)',
    email: 'amour@amourcodes.com',
    phone: '+255 744 883 291',
    role: 'Super Admin',
    status: 'active',
    ordersCount: 120,
    totalSpent: 3450000,
    joinedDate: 'Dec 2024',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr-kch-3',
    name: 'Amina Selemani',
    email: 'amina@zebradsm.com',
    phone: '+255 712 990 114',
    role: 'Kitchen Manager',
    status: 'active',
    ordersCount: 18,
    totalSpent: 420000,
    joinedDate: 'Mar 2025',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr-dsp-4',
    name: 'Kelvin Mwita',
    email: 'kelvin@zebradsm.com',
    phone: '+255 682 119 440',
    role: 'Dispatcher',
    status: 'active',
    ordersCount: 12,
    totalSpent: 280000,
    joinedDate: 'May 2025',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr-cst-5',
    name: 'Delisas Agency',
    email: 'delisas@amourcodes.com',
    phone: '+255 712 345 678',
    role: 'Customer',
    status: 'active',
    ordersCount: 32,
    totalSpent: 890000,
    joinedDate: 'Feb 2025',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr-cst-6',
    name: 'Dr. Joseph Temba',
    email: 'joseph.temba@gmail.com',
    phone: '+255 754 990 011',
    role: 'Customer',
    status: 'active',
    ordersCount: 45,
    totalSpent: 1250000,
    joinedDate: 'Jan 2025',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  }
];

// Issue Management Mock
export const INITIAL_ISSUES: AdminIssue[] = [
  {
    id: 'iss-1',
    type: 'wrong_order',
    title: 'Wrong items in burger combo',
    customer: 'Sarah Kavishe (+255 754 889 012)',
    orderNumber: 'ZB-84918',
    timeAgo: '12 min ago',
    status: 'open',
    count: 32,
    description: 'Ordered double patty with cheddar, kitchen dispatched regular single patty.',
  },
  {
    id: 'iss-2',
    type: 'missing_item',
    title: 'Missing drinks & fries in combo',
    customer: 'Alex Msuya (+255 744 330 918)',
    orderNumber: 'ZB-84914',
    timeAgo: '28 min ago',
    status: 'investigating',
    count: 18,
    description: 'Driver delivered pizza box but beverage bag was left on kitchen dispatch counter.'
  },
  {
    id: 'iss-3',
    type: 'cancelled_order',
    title: 'Customer requested cancellation (Late rider)',
    customer: 'Mariam Said (+255 712 994 220)',
    orderNumber: 'ZB-84910',
    timeAgo: '45 min ago',
    status: 'resolved',
    count: 24,
    description: 'Heavy rain delay in Kariakoo caused 40min wait. Refunded via M-Pesa.',
    actionTaken: 'Full M-Pesa refund processed'
  },
  {
    id: 'iss-4',
    type: 'complaint',
    title: 'Cold food delivered during peak traffic',
    customer: 'John Makonda (+255 768 001 922)',
    orderNumber: 'ZB-84905',
    timeAgo: '1 hr ago',
    status: 'investigating',
    count: 40,
    description: 'Thermal bag zip damaged on bike MC 701 TYP. Customer offered 50% discount coupon.'
  }
];

// Map Order Pins (Realistic Dar es Salaam delivery locations with coordinates and statuses)
export interface MapOrderPin {
  id: string;
  orderNumber: string;
  customerName: string;
  address: string;
  itemsSummary: string;
  total: number;
  currency: 'TZS' | 'USD';
  status: 'Delivered' | 'On the Way' | 'Preparing' | 'Delayed' | 'Canceled';
  coordinates: [number, number]; // [lat, lng]
  riderName?: string;
  etaMinutes?: number;
  timeAgo: string;
}

export const MAP_ORDER_PINS: MapOrderPin[] = [
  {
    id: 'pin-1',
    orderNumber: 'ZB-8412',
    customerName: 'Fatma Al-Harthy',
    address: 'Masaki Peninsula, Toure Drive Plot 44',
    itemsSummary: '1x Melting Cheese Pizza, 1x Passion Mojito',
    total: 34500,
    currency: 'TZS',
    status: 'On the Way',
    coordinates: [-6.7760, 39.2780],
    riderName: 'Juma Rashid (MC 492 DXB)',
    etaMinutes: 7,
    timeAgo: '14 min ago'
  },
  {
    id: 'pin-2',
    orderNumber: 'ZB-8411',
    customerName: 'David Michael Johnson',
    address: 'Oysterbay, Haile Selassie Road',
    itemsSummary: '2x Double Cheese Burger, 1x Fries',
    total: 28900,
    currency: 'TZS',
    status: 'Delivered',
    coordinates: [-6.7900, 39.2850],
    riderName: 'Hamisi Bakari',
    timeAgo: '35 min ago'
  },
  {
    id: 'pin-3',
    orderNumber: 'ZB-8410',
    customerName: 'Amina Selemani',
    address: 'Slipway Waterfront Residences, Msasani',
    itemsSummary: '1x Seafood Paella, 1x Fresh Avocado Smoothie',
    total: 42000,
    currency: 'TZS',
    status: 'Delivered',
    coordinates: [-6.7620, 39.2730],
    riderName: 'Kelvin John',
    timeAgo: '48 min ago'
  },
  {
    id: 'pin-4',
    orderNumber: 'ZB-8409',
    customerName: 'Rashid Bakari',
    address: 'Mikocheni B, Old Bagamoyo Road',
    itemsSummary: '1x BBQ Mishkaki Platter, 1x Savanna Biryani',
    total: 39500,
    currency: 'TZS',
    status: 'Preparing',
    coordinates: [-6.7720, 39.2550],
    etaMinutes: 18,
    timeAgo: '6 min ago'
  },
  {
    id: 'pin-5',
    orderNumber: 'ZB-8408',
    customerName: 'Emanuel Mollel',
    address: 'Kariakoo Market District, Livingstone St',
    itemsSummary: '3x Swahili Beef Samosas, 2x Ginger Masala Tea',
    total: 18500,
    currency: 'TZS',
    status: 'Delayed',
    coordinates: [-6.8195, 39.2730],
    riderName: 'Ally Mwamba',
    etaMinutes: 28,
    timeAgo: '50 min ago'
  },
  {
    id: 'pin-6',
    orderNumber: 'ZB-8407',
    customerName: 'Sarah Kavishe',
    address: 'Upanga East, United Nations Road',
    itemsSummary: '1x Pepperoni Feast, 1x Chocolate Lava Cake',
    total: 36000,
    currency: 'TZS',
    status: 'Canceled',
    coordinates: [-6.8080, 39.2820],
    timeAgo: '1 hr ago'
  },
  {
    id: 'pin-7',
    orderNumber: 'ZB-8406',
    customerName: 'Hassan Juma',
    address: 'Kinondoni Mkwajuni, Morogoro Rd',
    itemsSummary: '2x Zebra Special Burger combo',
    total: 26000,
    currency: 'TZS',
    status: 'On the Way',
    coordinates: [-6.7990, 39.2610],
    riderName: 'Peter Mushi (MC 330 KRT)',
    etaMinutes: 11,
    timeAgo: '18 min ago'
  },
  {
    id: 'pin-8',
    orderNumber: 'ZB-8405',
    customerName: 'Grace Mlay',
    address: 'City Centre, Samora Avenue',
    itemsSummary: '1x Caramel Frappuccino, 2x Glazed Donuts',
    total: 21000,
    currency: 'TZS',
    status: 'Canceled',
    coordinates: [-6.8140, 39.2890],
    timeAgo: '2 hrs ago'
  }
];

// Activity matrix for daily order volume (6 months: Nov - Apr)
export interface ActivityHeatmapDay {
  date: string;
  dayOfWeek: number; // 0 = Sun, 6 = Sat
  month: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export const generateOrderVolumeHeatmap = (): ActivityHeatmapDay[] => {
  const days: ActivityHeatmapDay[] = [];
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  const baseDate = new Date(2025, 10, 1); // Nov 1, 2025

  for (let i = 0; i < 168; i++) {
    const d = new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000);
    const monthName = months[Math.floor(i / 28)] || 'Apr';
    // Generate pseudo-random realistic pattern with weekends higher
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const seed = (Math.sin(i * 12.3) + 1) / 2;
    const baseCount = isWeekend ? 65 : 40;
    const count = Math.floor(baseCount + seed * 60);

    let level: 0 | 1 | 2 | 3 | 4 = 1;
    if (count < 45) level = 0;
    else if (count < 65) level = 1;
    else if (count < 85) level = 2;
    else if (count < 105) level = 3;
    else level = 4;

    days.push({
      date: d.toISOString().split('T')[0],
      dayOfWeek: d.getDay(),
      month: monthName,
      count,
      level
    });
  }

  return days;
};
