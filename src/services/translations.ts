import { AppLanguage } from '../types';

export const TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  sw: {
    // Header & Navigation
    home: 'Mwanzo',
    menu: 'Menyu',
    favorites: 'Vipendwa',
    cart: 'Kikapu',
    orders: 'Oda Zangu',
    profile: 'Akaunti',
    admin: 'Admin',
    pos: 'Keshia (POS)',
    oss: 'Skrini ya TV (OSS)',
    kds: 'Jikoni (KDS)',
    waiter: 'Wahudumu',
    login: 'Ingia / Jisajili',
    welcome: 'Karibu',
    searchPlaceholder: 'Tafuta piza, burger, mishkaki, vinywaji...',
    changeLocation: 'Badilisha',
    deliverTo: 'Leta hadi',

    // Food categories
    allFoods: 'Vyakula Vyote',
    bestSellers: 'Vinavyopendwa Zaidi & Chef Specials',

    // Detail modal & Cart
    addToCart: 'Ongeza Kwenye Kikapu',
    specialInstructions: 'Maagizo Maalum (Special Instructions)',
    specialInstructionsPlaceholder: 'Mfano: Bila pilipili, vitunguu pembeni, kinywaji cha baridi sana...',
    selectSize: 'Chagua Saizi',
    extraIngredients: 'Viungo vya Ziada (Toppings)',
    smartPairingTitle: 'Wateja Wanaopenda Hiki Pia Huagiza:',
    smartPairingSubtitle: 'Ongeza kinywaji au kiongezi cha pembeni kinachoendana na chakula hiki:',
    addPairing: '+ Ongeza',

    // Cart View
    myCart: 'Kikapu Changu cha Vyakula',
    emptyCart: 'Kikapu chako hakina chakula bado',
    emptyCartSub: 'Angalia menyu yetu safi ya vyakula vya kisasa na uweke oda sasa!',
    exploreMenu: 'Gundua Menyu',
    orderSummary: 'Muhtasari wa Oda',
    subtotal: 'Jumla Ndogo',
    deliveryFee: 'Gharama ya Usafiri',
    discount: 'Punguzo',
    total: 'Jumla Kuu',
    checkout: 'Kamilisha Oda',
    loyaltyPoints: 'Zebra Points za Uaminifu',
    usePoints: 'Tumia pointi kupata punguzo la TZS',
    pointsAvailable: 'pointi zinapatikana',

    // Receipts & Actions
    viewReceipt: 'Tazama Risiti',
    printReceipt: 'Chapisha Risiti (Thermal POS)',
    shareWhatsApp: 'Tuma Risiti WhatsApp',
    copySummary: 'Nakili Muhtasari',
    liveTracking: 'Fuatilia Dereva Moja kwa Moja',
    scratchAndWin: 'Kadi ya Kujikuna (Scratch & Win)',

    // Statuses
    orderPending: 'Inasubiri',
    orderConfirmed: 'Imethibitishwa',
    orderPreparing: 'Inapikwa Jikoni',
    orderOnTheWay: 'Dereva Yupo Njia',
    orderDelivered: 'Imefikishwa',
    orderCancelled: 'Imeghairiwa'
  },
  en: {
    // Header & Navigation
    home: 'Home',
    menu: 'Menu',
    favorites: 'Favorites',
    cart: 'Cart',
    orders: 'My Orders',
    profile: 'Profile',
    admin: 'Admin',
    pos: 'Cashier (POS)',
    oss: 'TV Screen (OSS)',
    kds: 'Kitchen (KDS)',
    waiter: 'Waiters',
    login: 'Sign In / Register',
    welcome: 'Welcome',
    searchPlaceholder: 'Search pizza, burgers, barbecue, drinks...',
    changeLocation: 'Change',
    deliverTo: 'Deliver to',

    // Food categories
    allFoods: 'All Dishes',
    bestSellers: 'Best Sellers & Chef Specials',

    // Detail modal & Cart
    addToCart: 'Add to Cart',
    specialInstructions: 'Special Instructions',
    specialInstructionsPlaceholder: 'e.g. No chili, sauce on the side, extra cold drink...',
    selectSize: 'Select Size',
    extraIngredients: 'Add-ons & Toppings',
    smartPairingTitle: 'Frequently Ordered Together:',
    smartPairingSubtitle: 'Add a complementary drink or side dish that pairs perfectly:',
    addPairing: '+ Add',

    // Cart View
    myCart: 'My Food Cart',
    emptyCart: 'Your cart is currently empty',
    emptyCartSub: 'Explore our delicious fresh modern menu and place an order!',
    exploreMenu: 'Explore Menu',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    discount: 'Discount',
    total: 'Total',
    checkout: 'Proceed to Checkout',
    loyaltyPoints: 'Zebra Loyalty Points',
    usePoints: 'Redeem points for discount of TZS',
    pointsAvailable: 'points available',

    // Receipts & Actions
    viewReceipt: 'View Receipt',
    printReceipt: 'Print Thermal Receipt (POS)',
    shareWhatsApp: 'Send Receipt to WhatsApp',
    copySummary: 'Copy Summary',
    liveTracking: 'Live Driver Tracker',
    scratchAndWin: 'Scratch & Win Card',

    // Statuses
    orderPending: 'Pending',
    orderConfirmed: 'Confirmed',
    orderPreparing: 'Preparing in Kitchen',
    orderOnTheWay: 'Out for Delivery',
    orderDelivered: 'Delivered',
    orderCancelled: 'Cancelled'
  }
};

export function getTranslation(lang: AppLanguage, key: string, fallback?: string): string {
  return TRANSLATIONS[lang]?.[key] || fallback || key;
}
