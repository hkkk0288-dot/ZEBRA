import { Category, MenuItem, PromoOffer, UserProfile, SlideBanner, RestaurantTable, TableOrder } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Dishes', swahiliName: 'Vyakula Vyote', icon: '🍽️' },
  { id: 'meat', name: 'Meat', swahiliName: 'Nyama', icon: '🥩' },
  { id: 'fast_food', name: 'Fast Food', swahiliName: 'Vyakula Vya Haraka', icon: '🍔' },
  { id: 'pizza', name: 'Pizza', swahiliName: 'Piza', icon: '🍕' },
  { id: 'sushi', name: 'Sushi', swahiliName: 'Sushi', icon: '🍣' },
  { id: 'swahili', name: 'Swahili Local', swahiliName: 'Vyakula Vya Asili', icon: '🍲' },
  { id: 'drinks', name: 'Drinks', swahiliName: 'Vinywaji', icon: '🍹' },
  { id: 'desserts', name: 'Desserts', swahiliName: 'Vitafunwa', icon: '🍰' }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Melting Cheese Pizza',
    swahiliName: 'Piza ya Jibini Laini',
    description: 'Crispy artisanal crust loaded with rich molten mozzarella, roasted garlic, sun-dried tomatoes, and fresh aromatic basil leaves.',
    price: 10.99,
    priceTZS: 28500,
    category: 'pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80',
    rating: 4.8,
    reviewsCount: '2.2k',
    calories: 44,
    prepTimeMinutes: 20,
    restaurantName: 'Pizza Italiano - Zebra Branch',
    restaurantBranch: 'Masaki Peninsula',
    isBestSeller: true,
    isSpecial: true,
    isAvailable: true,
    sizes: [
      { id: 's', name: '6" - Small', price: 8.99, label: '6" Small' },
      { id: 'm', name: '8" - Medium', price: 10.99, label: '8" Medium' },
      { id: 'l', name: '10" - Large', price: 12.99, label: '10" Large' }
    ],
    ingredients: [
      { id: 'ing-1', name: 'Chicken Breast', weight: '250 gm', price: 1.40, defaultChecked: true },
      { id: 'ing-2', name: 'Mushroom', weight: '50 gm', price: 0.40, defaultChecked: false },
      { id: 'ing-3', name: 'Extra Mozzarella', weight: '60 gm', price: 1.20, defaultChecked: false },
      { id: 'ing-4', name: 'Black Olives', weight: '30 gm', price: 0.60, defaultChecked: false },
      { id: 'ing-5', name: 'Sweet Corn', weight: '40 gm', price: 0.50, defaultChecked: false }
    ]
  },
  {
    id: 'item-2',
    name: 'Cheese burger',
    swahiliName: 'Baga ya Jibini Mbili',
    description: 'Double grilled prime beef patty stacked with double melted cheddar, crisp lettuce, ripe red tomato, and special burger hunt sauce in a brioche bun.',
    price: 4.99,
    priceTZS: 12900,
    category: 'fast_food',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80',
    rating: 4.9,
    reviewsCount: '1.8k',
    calories: 44,
    prepTimeMinutes: 20,
    restaurantName: 'Burger Hunt',
    restaurantBranch: 'Oysterbay',
    isBestSeller: true,
    isAvailable: true,
    sizes: [
      { id: 'single', name: 'Single Patty', price: 4.99, label: 'Single' },
      { id: 'double', name: 'Double Stack', price: 6.99, label: 'Double Stack' },
      { id: 'triple', name: 'Triple Beast', price: 8.99, label: 'Triple Beast' }
    ],
    ingredients: [
      { id: 'b-1', name: 'Crispy Bacon', weight: '40 gm', price: 1.20, defaultChecked: false },
      { id: 'b-2', name: 'Caramelized Onions', weight: '50 gm', price: 0.50, defaultChecked: true },
      { id: 'b-3', name: 'Extra Cheddar Slice', weight: '30 gm', price: 0.80, defaultChecked: false },
      { id: 'b-4', name: 'Pickles & Jalapeno', weight: '25 gm', price: 0.40, defaultChecked: false }
    ]
  },
  {
    id: 'item-3',
    name: 'Chicken Salad',
    swahiliName: 'Saladi ya Kuku wa Kuchoma',
    description: 'Tender seasoned roasted chicken breast chunks over farm-fresh mixed greens, cherry tomatoes, cucumbers, feta cheese and honey mustard dressing.',
    price: 4.56,
    priceTZS: 11800,
    category: 'meat',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
    rating: 4.7,
    reviewsCount: '940',
    calories: 32,
    prepTimeMinutes: 15,
    restaurantName: 'Melt House',
    restaurantBranch: 'Mikocheni',
    isBestSeller: true,
    isAvailable: true,
    sizes: [
      { id: 'regular', name: 'Standard Bowl', price: 4.56, label: 'Standard' },
      { id: 'large', name: 'Jumbo Protein Bowl', price: 6.50, label: 'Jumbo' }
    ],
    ingredients: [
      { id: 'cs-1', name: 'Avocado Slices', weight: '60 gm', price: 1.00, defaultChecked: true },
      { id: 'cs-2', name: 'Parmesan Shavings', weight: '30 gm', price: 0.80, defaultChecked: false },
      { id: 'cs-3', name: 'Toasted Almonds', weight: '20 gm', price: 0.50, defaultChecked: false }
    ]
  },
  {
    id: 'item-4',
    name: 'Zebra Special Mishkaki Skewers',
    swahiliName: 'Mishkaki ya Zebra na Pilipili',
    description: 'Tender marinated beef skewers char-grilled over acacia charcoal, infused with ginger, tamarind, and East African spicy kachumbari.',
    price: 6.50,
    priceTZS: 17000,
    category: 'swahili',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80',
    rating: 5.0,
    reviewsCount: '3.1k',
    calories: 52,
    prepTimeMinutes: 18,
    restaurantName: 'Zebra BBQ Grill',
    restaurantBranch: 'Kariakoo & Masaki',
    isBestSeller: true,
    isSpecial: true,
    isAvailable: true,
    sizes: [
      { id: '4skewers', name: '4 Skewers Combo', price: 6.50, label: '4 Pcs' },
      { id: '8skewers', name: '8 Skewers Feast', price: 11.50, label: '8 Pcs' },
      { id: '12skewers', name: 'Family Platter (12)', price: 16.50, label: '12 Pcs' }
    ],
    ingredients: [
      { id: 'm-1', name: 'Fresh Kachumbari Salad', weight: '100 gm', price: 0.80, defaultChecked: true },
      { id: 'm-2', name: 'Hot Chili Tamarind Dip', weight: '50 gm', price: 0.40, defaultChecked: true },
      { id: 'm-3', name: 'Crispy Potato Wedges', weight: '150 gm', price: 1.50, defaultChecked: false }
    ]
  },
  {
    id: 'item-5',
    name: 'Swahili Biryani ya Kuku',
    swahiliName: 'Biriani ya Kuku na Ndizi Kaanga',
    description: 'Fragrant basmati rice layered with slow-cooked chicken in aromatic spices, fried onions, boiled egg, and rich yogurt-tomato gravy.',
    price: 8.99,
    priceTZS: 23500,
    category: 'swahili',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
    rating: 4.9,
    reviewsCount: '1.4k',
    calories: 68,
    prepTimeMinutes: 25,
    restaurantName: 'Zebra Swahili Delights',
    restaurantBranch: 'Kinondoni',
    isBestSeller: true,
    isAvailable: true,
    sizes: [
      { id: 'regular', name: 'Regular Portion', price: 8.99, label: 'Regular' },
      { id: 'family', name: 'Family Tray (2-3 Pax)', price: 15.99, label: 'Family Tray' }
    ],
    ingredients: [
      { id: 'b-1', name: 'Extra Boiled Spiced Egg', weight: '1 pc', price: 0.70, defaultChecked: false },
      { id: 'b-2', name: 'Fried Plantains (Ndizi)', weight: '4 pcs', price: 1.20, defaultChecked: true },
      { id: 'b-3', name: 'Mango Pickle Achar', weight: '40 gm', price: 0.50, defaultChecked: false }
    ]
  },
  {
    id: 'item-6',
    name: 'Chips Mayai Special (Zege)',
    swahiliName: 'Chips Mayai na Sausage & Mishkaki',
    description: 'Classic Tanzanian street delicacy: Golden potato french fries pan-fried in seasoned eggs with bell peppers, fresh onion, and tomato relish.',
    price: 4.20,
    priceTZS: 11000,
    category: 'fast_food',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=700&q=80',
    rating: 4.8,
    reviewsCount: '2.5k',
    calories: 45,
    prepTimeMinutes: 12,
    restaurantName: 'Zebra Street Bites',
    restaurantBranch: 'Sinza Corner',
    isBestSeller: true,
    isAvailable: true,
    sizes: [
      { id: '2eggs', name: '2 Eggs Standard', price: 4.20, label: 'Standard' },
      { id: '3eggs', name: '3 Eggs Jumbo Zege', price: 5.50, label: 'Jumbo Zege' }
    ],
    ingredients: [
      { id: 'cm-1', name: 'Grilled Beef Sausage', weight: '1 pc', price: 1.00, defaultChecked: true },
      { id: 'cm-2', name: 'Extra Melted Cheddar', weight: '40 gm', price: 0.80, defaultChecked: false },
      { id: 'cm-3', name: 'Pili Pili Sauce Extra', weight: '30 ml', price: 0.30, defaultChecked: true }
    ]
  },
  {
    id: 'item-7',
    name: 'Atlantic Salmon Sushi Roll',
    swahiliName: 'Sushi ya Salmoni na parachichi',
    description: 'Fresh Atlantic salmon, ripe avocado, crisp cucumber, toasted sesame seeds with wasabi and low-sodium soy sauce.',
    price: 9.50,
    priceTZS: 24700,
    category: 'sushi',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=700&q=80',
    rating: 4.8,
    reviewsCount: '820',
    calories: 38,
    prepTimeMinutes: 16,
    restaurantName: 'Tokyo Fusion - Zebra Partner',
    restaurantBranch: 'Slipway Beach',
    isBestSeller: false,
    isAvailable: true,
    sizes: [
      { id: '6rolls', name: '6 Pieces Roll', price: 9.50, label: '6 Pcs' },
      { id: '12rolls', name: '12 Pieces Combo', price: 17.50, label: '12 Pcs' }
    ],
    ingredients: [
      { id: 's-1', name: 'Extra Wasabi & Ginger', weight: '30 gm', price: 0.60, defaultChecked: false },
      { id: 's-2', name: 'Spicy Mayo Drizzle', weight: '30 ml', price: 0.80, defaultChecked: true }
    ]
  },
  {
    id: 'item-8',
    name: 'Fresh Passion & Ukwaju Mojito',
    swahiliName: 'Juisi ya Ukwaju na Pasheni Asilia',
    description: 'Ice-chilled organic passion fruit blended with tangy Zanzibari tamarind (ukwaju), mint leaves, and lime soda.',
    price: 2.80,
    priceTZS: 7300,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80',
    rating: 4.9,
    reviewsCount: '1.2k',
    calories: 18,
    prepTimeMinutes: 6,
    restaurantName: 'Zebra Bar & Lounge',
    restaurantBranch: 'Masaki Waterfront',
    isBestSeller: true,
    isAvailable: true,
    sizes: [
      { id: 'reg', name: '350ml Glass', price: 2.80, label: '350ml' },
      { id: 'large', name: '500ml Jumbo Cup', price: 3.80, label: '500ml' }
    ],
    ingredients: [
      { id: 'd-1', name: 'Chia Seeds Boost', weight: '15 gm', price: 0.50, defaultChecked: false },
      { id: 'd-2', name: 'Pure Honey Sweetener', weight: '20 ml', price: 0.40, defaultChecked: false }
    ]
  }
];

export const PROMO_OFFERS: PromoOffer[] = [
  {
    code: 'ZEBRA30',
    title: 'New Year Offer 30% OFF',
    discountPercent: 30,
    description: 'Enjoy 30% discount on orders above $15. Limited time festival feast!',
    expiryDate: '31 Dec 2026',
    minSpend: 15
  },
  {
    code: 'AMOUR20',
    title: 'AmourCodes Special 20%',
    discountPercent: 20,
    description: 'Created with love by AmourCodes for Zebra Restaurant foodies!',
    expiryDate: '31 Jan 2027',
    minSpend: 10
  },
  {
    code: 'KARIBU10',
    title: 'Karibu Welcome 10%',
    discountPercent: 10,
    description: 'Welcome bonus for first-time orders across all Dar es Salaam branches.',
    expiryDate: 'Always Active',
    minSpend: 5
  }
];

export const GUEST_USER: UserProfile = {
  id: '',
  name: 'Mgeni (Guest)',
  email: '',
  phone: '',
  role: 'customer',
  avatar: '',
  addresses: [],
  favoriteItemIds: []
};

export const DEFAULT_USER: UserProfile = {
  id: 'usr-delisas-01',
  name: 'Delisas Agency',
  email: 'delisas@amourcodes.com',
  phone: '+255 712 345 678',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  addresses: [
    {
      id: 'addr-1',
      label: 'Home',
      street: 'Plot 44, Toure Drive, Masaki Peninsula',
      city: 'Dar es Salaam',
      isDefault: true
    },
    {
      id: 'addr-2',
      label: 'Office (AmourCodes HQ)',
      street: 'Floor 5, IT Plaza, Ohio Street',
      city: 'Dar es Salaam',
      isDefault: false
    }
  ],
  favoriteItemIds: ['item-1', 'item-4', 'item-8']
};

export const USSD_NETWORKS = [
  {
    id: 'ussd_mpesa',
    name: 'Vodacom M-Pesa',
    brandColor: '#E60000',
    code: '*150*00#',
    sampleDial: '*150*00*1*445566*{AMOUNT}#',
    paybill: '445566',
    accountName: 'ZEBRA RESTAURANT (AMOURCODES)',
    currency: 'TZS',
    logo: '🔴 M-PESA'
  },
  {
    id: 'ussd_tigopesa',
    name: 'Tigo Pesa / Mixx by Yas',
    brandColor: '#0033A0',
    code: '*150*01#',
    sampleDial: '*150*01*1*445566*{AMOUNT}#',
    paybill: '445566',
    accountName: 'ZEBRA RESTAURANT TIGO',
    currency: 'TZS',
    logo: '🔵 TIGO PESA'
  },
  {
    id: 'ussd_airtel',
    name: 'Airtel Money',
    brandColor: '#FF0000',
    code: '*150*60#',
    sampleDial: '*150*60*1*445566*{AMOUNT}#',
    paybill: '445566',
    accountName: 'ZEBRA AIRTEL PAY',
    currency: 'TZS',
    logo: '🔴 AIRTEL'
  },
  {
    id: 'ussd_halopesa',
    name: 'HaloPesa',
    brandColor: '#FF8200',
    code: '*150*88#',
    sampleDial: '*150*88*1*445566*{AMOUNT}#',
    paybill: '445566',
    accountName: 'ZEBRA HALOPESA',
    currency: 'TZS',
    logo: '🟠 HALOPESA'
  }
];

export const INITIAL_SLIDE_BANNERS: SlideBanner[] = [
  {
    id: 'banner-1',
    tag: 'Festive Offer • Zebra Restaurant',
    title: '30% OFF',
    titleHighlight: 'Everything',
    description: 'Authentic wood-fired pizzas, gourmet smash burgers, and fresh Swahili mishkaki & biryani delivered hot across Dar es Salaam.',
    ctaText: 'Claim 30% Off',
    promoCode: 'ZEBRA30',
    ussdNumber: '*150*00#',
    bgGradient: 'from-emerald-950 via-neutral-900 to-amber-950',
    accentColor: '#10b981',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    decorativeEmoji: '🍕',
    targetCategory: 'all',
    active: true,
    orderIndex: 0,
    createdAt: Date.now() - 3600000
  },
  {
    id: 'banner-2',
    tag: 'Weekend Special • Nyama Choma Carnival',
    title: 'Mishkaki & BBQ',
    titleHighlight: '25% OFF',
    description: 'Juicy tenderloin beef skewers, spiced chicken wings, charcoal grilled lamb chops and crispy chips mayai delivered hot in Masaki & Slipway.',
    ctaText: 'Agiza Nyama Choma',
    promoCode: 'MISHKAKI25',
    ussdNumber: '*150*00#',
    bgGradient: 'from-orange-950 via-neutral-900 to-rose-950',
    accentColor: '#f97316',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    decorativeEmoji: '🥩',
    targetCategory: 'meat',
    active: true,
    orderIndex: 1,
    createdAt: Date.now() - 7200000
  },
  {
    id: 'banner-3',
    tag: 'Zanzibar Spice Feast • Coastal Delicacy',
    title: 'Swahili Biryani & Pilau',
    titleHighlight: 'Buy 2 Get 1 Free',
    description: 'Aromatic coastal biryani layered with tender spiced mutton, fried onions, boiled eggs, sweet raisins, and fresh cucumber kachumbari.',
    ctaText: 'Onja Biryani Sasa',
    promoCode: 'BIRYANI2X',
    ussdNumber: '*150*00#',
    bgGradient: 'from-amber-950 via-neutral-900 to-emerald-950',
    accentColor: '#f59e0b',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    decorativeEmoji: '🍗',
    targetCategory: 'swahili',
    active: true,
    orderIndex: 2,
    createdAt: Date.now() - 10800000
  },
  {
    id: 'banner-4',
    tag: 'Artisan Gourmet Burgers • Fresh & Juicy',
    title: 'Smash Truffle Burgers',
    titleHighlight: 'Combo Free Drink',
    description: 'Double smashed Wagyu patties, melted mature cheddar, caramelized onions, smoked beef bacon, and secret Zebra burger sauce on a brioche bun.',
    ctaText: 'Agiza Burger Combo',
    promoCode: 'BURGERZEBRA',
    ussdNumber: '*150*00#',
    bgGradient: 'from-red-950 via-neutral-900 to-amber-950',
    accentColor: '#ef4444',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    decorativeEmoji: '🍔',
    targetCategory: 'fast_food',
    active: true,
    orderIndex: 3,
    createdAt: Date.now() - 14400000
  }
];

export const DEFAULT_RESTAURANT_TABLES: RestaurantTable[] = [
  { id: 'tbl-1', name: 'Table 01', section: 'Indoor', capacity: 4, status: 'available' },
  { id: 'tbl-2', name: 'Table 02', section: 'Indoor', capacity: 2, status: 'available' },
  { id: 'tbl-3', name: 'Table 03', section: 'Garden Terrace', capacity: 6, status: 'available' },
  { id: 'tbl-4', name: 'Table 04', section: 'Indoor', capacity: 4, status: 'available' },
  { id: 'tbl-5', name: 'VIP Lounge 1', section: 'VIP Lounge', capacity: 8, status: 'available' },
  { id: 'tbl-6', name: 'Table 06', section: 'Garden Terrace', capacity: 4, status: 'available' },
  { id: 'tbl-7', name: 'Table 07', section: 'Indoor', capacity: 2, status: 'available' },
  { id: 'tbl-8', name: 'VIP Deck 2', section: 'VIP Lounge', capacity: 10, status: 'available' },
];

export const INITIAL_TABLE_ORDERS: TableOrder[] = [
  {
    id: 'tord-101',
    orderNumber: 'TBL-101',
    tableNumber: 'Table 01',
    waiterName: 'Neema Mwamburi',
    waiterId: 'usr-wtr-5',
    guestCount: 3,
    items: [
      { dishId: 'dish-1', name: 'Mishkaki ya Ng\'ombe (Beef Skewers)', quantity: 3, priceTZS: 12000, notes: 'Pili pili pembeni' },
      { dishId: 'dish-6', name: 'Chips Mayai Special na Kachumbari', quantity: 2, priceTZS: 7000 },
      { dishId: 'drink-1', name: 'Passion Juice ya Baridi (Fresh)', quantity: 3, priceTZS: 4500 }
    ],
    totalTZS: 63500,
    status: 'kitchen_prep',
    notes: 'Haraka kidogo wateja wana kikao saa nane',
    createdAt: Date.now() - 15 * 60 * 1000
  }
];


