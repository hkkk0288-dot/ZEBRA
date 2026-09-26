export interface SizeOption {
  id: string;
  name: string;
  price: number;
  label: string;
}

export interface IngredientOption {
  id: string;
  name: string;
  weight: string;
  price: number;
  defaultChecked?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  swahiliName?: string;
  description: string;
  price: number; // in USD
  priceUSD?: number; // alias for USD
  priceTZS: number; // in Tanzanian Shillings
  category: string;
  image: string;
  images?: string[];
  rating: number;
  reviewsCount: string;
  calories: number;
  prepTimeMinutes: number;
  restaurantName: string;
  restaurantBranch?: string;
  isBestSeller?: boolean;
  isSpecial?: boolean;
  isAvailable: boolean;
  sizes: SizeOption[];
  ingredients: IngredientOption[];
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  item?: MenuItem; // alias for menuItem
  name?: string; // alias for dish name
  selectedSize: SizeOption;
  selectedIngredients: IngredientOption[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

export interface Category {
  id: string;
  name: string;
  swahiliName: string;
  icon: string;
  image?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export type PaymentProvider =
  | 'mongike_mobile_money'
  | 'ussd_mpesa'
  | 'ussd_tigopesa'
  | 'ussd_airtel'
  | 'ussd_halopesa'
  | 'cash_on_delivery'
  | 'card';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  orderType?: 'delivery' | 'pickup' | 'dine_in' | 'takeaway';
  tableNumber?: string;
  tableId?: string;
  deliveryAddress?: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  currency: 'USD' | 'TZS';
  paymentMethod: PaymentProvider;
  paymentStatus: 'pending' | 'paid' | 'failed';
  mongikeDetails?: {
    id?: string;
    gatewayRef?: string;
    amount?: number;
    buyerPhone?: string;
    status?: string;
    expiresAt?: string;
    initiatedAt?: string;
    isSimulated?: boolean;
  };
  ussdDetails?: {
    network: string;
    phoneNumber: string;
    referenceCode: string;
    ussdString: string;
    paidAt?: string;
  };
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    notes?: string;
  };
  rider?: {
    name: string;
    phone: string;
    vehicle: string;
    photo: string;
    rating: number;
    currentEtaMinutes: number;
  };
  loyaltyPointsEarned?: number;
  loyaltyPointsRedeemed?: number;
  loyaltyDiscountTZS?: number;
  createdAt: number;
}

export type NavigationTab = 'home' | 'favorites' | 'cart' | 'orders' | 'profile' | 'admin' | 'waiter' | 'reservations' | 'auth' | 'pos' | 'oss' | 'kds';
export type AuthMode = 'login' | 'signup';

export interface BillSplitShare {
  id: string;
  guestName: string;
  guestPhone?: string;
  amountTZS: number;
  dishNames?: string[];
  status: 'pending' | 'paid';
  paidVia?: string;
  paidAt?: string;
}

export interface TableReservation {
  id: string;
  reservationCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "19:00"
  guestCount: number;
  section: 'Indoor' | 'Garden Terrace' | 'VIP Lounge';
  tablePreference?: string;
  occasion?: string;
  specialRequests?: string;
  preOrderItems?: Array<{ dishId: string; name: string; quantity: number; priceTZS: number }>;
  status: 'pending' | 'confirmed' | 'seated' | 'cancelled';
  createdAt: number;
}

export type SystemRole = 'Super Admin' | 'Kitchen Manager' | 'Waiter' | 'Dispatcher' | 'Driver' | 'Customer';

export interface RolePermissions {
  canTakeOrders: boolean; // Chukua Oda za Meza / Waiter POS
  canViewKitchen: boolean; // Tazama Skrini ya Jikoni (KDS)
  canManageProducts: boolean; // Ongeza au badili bei za vyakula
  canDispatchRiders: boolean; // Panga oda kwa madereva
  canManageUsers: boolean; // Fungua akaunti na badili roles
  canViewFinancials: boolean; // Tazama mapato na malipo
  canManageSettings: boolean; // Mipangilio ya mfumo
}

export interface TableOrderItem {
  dishId: string;
  name: string;
  quantity: number;
  priceTZS: number;
  notes?: string;
}

export interface TableOrder {
  id: string;
  orderNumber: string;
  tableNumber: string; // e.g. "Table 04", "VIP Lounge 1"
  waiterName: string;
  waiterId: string;
  guestCount: number;
  items: TableOrderItem[];
  totalTZS: number;
  status: 'ordered' | 'kitchen_prep' | 'ready_to_serve' | 'served' | 'paid' | 'closed';
  notes?: string;
  createdAt: number;
}


export interface RestaurantTable {
  id: string;
  name: string;
  section: 'Indoor' | 'Garden Terrace' | 'VIP Lounge';
  capacity: number;
  status: 'available' | 'occupied' | 'billing' | 'cleaning';
  currentOrderId?: string;
  qrCodeUrl?: string;
}

export interface WaiterCall {
  id: string;
  tableNumber: string;
  time: string;
  reason?: string;
}

export type PendingAction =
  | {
      type: 'add_to_cart';
      item: MenuItem;
      size: SizeOption;
      ingredients: IngredientOption[];
      quantity: number;
      specialInstructions?: string;
    }
  | {
      type: 'checkout';
    };

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  systemRole?: SystemRole;
  permissions?: RolePermissions;
  assignedBranch?: string;
  avatar?: string;
  birthday?: string;
  locationCoordinates?: {
    latitude: number;
    longitude: number;
  };
  addresses: Array<{
    id: string;
    label: string;
    street: string;
    city: string;
    isDefault: boolean;
  }>;
  favoriteItemIds: string[];
  loyaltyPoints?: number;
  loyaltyTier?: 'Silver' | 'Gold' | 'Platinum';
}

export interface PromoOffer {
  code: string;
  title: string;
  discountPercent: number;
  description: string;
  expiryDate: string;
  bannerImage?: string;
  minSpend: number;
}

export interface SlideBanner {
  id: string;
  tag: string;
  title: string;
  titleHighlight?: string;
  description: string;
  ctaText: string;
  promoCode?: string;
  ussdNumber?: string;
  bgGradient: string;
  accentColor: string;
  imageUrl?: string;
  decorativeEmoji?: string;
  targetCategory?: string;
  active: boolean;
  orderIndex: number;
  createdAt: number;
}

