import { Category, MenuItem, PromoOffer, UserProfile, SlideBanner, RestaurantTable, TableOrder, TableReservation } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Menu', swahiliName: 'Menyu Yote', icon: '🍗' },
  { id: 'boxes', name: 'Signature Boxes', swahiliName: 'Maboksi ya Mlo', icon: '📦' },
  { id: 'chicken', name: 'Crispy Chicken', swahiliName: 'Kuku wa Kukaanga', icon: '🍗' },
  { id: 'burgers', name: 'Chicken Burgers', swahiliName: 'Baga za Kuku', icon: '🍔' },
  { id: 'tenders', name: 'Tenders & Pops', swahiliName: 'Tenders na Pops', icon: '🍿' },
  { id: 'sides', name: 'Fresh Cut Fries & Sides', swahiliName: 'Chipsi na Ziada', icon: '🍟' },
  { id: 'dips', name: 'Dips & Sauces', swahiliName: 'Michuzi Maalum', icon: '🥣' },
  { id: 'drinks', name: 'Drinks & Shakes', swahiliName: 'Vinywaji na Shakes', icon: '🥤' }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-bomba-box',
    name: 'Kookoos Bomba Box',
    swahiliName: 'Bomba Box ya Kookoos',
    description: 'Boksi yetu maarufu zaidi! Vipande 2 vya kuku wa kukaanga aliyekolea viungo vya asili, chipsi freshi za viazi zilizokatwa asubuhi hii, mkate laini wa siagi, na mchuzi maalum wa Kookoos.',
    price: 6.99,
    priceTZS: 18500,
    category: 'boxes',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: '3.4k',
    calories: 620,
    prepTimeMinutes: 12,
    restaurantName: 'Kookoos',
    restaurantBranch: 'Mwenge HQ & All Branches',
    isBestSeller: true,
    isSpecial: true,
    isAvailable: true,
    sizes: [
      { id: 's2', name: '2 Pcs Bomba Box', price: 6.99, label: '2 Pcs Box' },
      { id: 's3', name: '3 Pcs Super Bomba Box', price: 8.99, label: '3 Pcs Box' }
    ],
    ingredients: [
      { id: 'ing-dip', name: 'Kookoos Signature Sauce', weight: '50 ml', price: 0.50, defaultChecked: true },
      { id: 'ing-spicy', name: 'Spicy Peri-Peri Seasoning', weight: '10 gm', price: 0.30, defaultChecked: false },
      { id: 'ing-drink', name: 'Add Cold Soda (350ml)', weight: '1 can', price: 0.80, defaultChecked: true },
      { id: 'ing-coleslaw', name: 'Creamy Coleslaw Cup', weight: '80 gm', price: 0.60, defaultChecked: false }
    ]
  },
  {
    id: 'item-bahati-box',
    name: 'Kookoos Bahati Box',
    swahiliName: 'Bahati Box (Kuku + Baga + Chips)',
    description: 'Mchanganyiko kamili wa bahati! Kipande 1 cha kuku mkavu, Kookoos crunch chicken burger yenye jibini, chipsi za viazi vya asili, mchuzi maalum na soda ya baridi.',
    price: 7.50,
    priceTZS: 19500,
    category: 'boxes',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: '2.8k',
    calories: 740,
    prepTimeMinutes: 14,
    restaurantName: 'Kookoos',
    restaurantBranch: 'Sinza Mori & All Branches',
    isBestSeller: true,
    isSpecial: true,
    isAvailable: true,
    sizes: [
      { id: 'reg', name: 'Standard Bahati Box', price: 7.50, label: 'Bahati Box' },
      { id: 'large', name: 'Large Bahati Box (+Extra Fries & Drink)', price: 9.20, label: 'Large Combo' }
    ],
    ingredients: [
      { id: 'ing-cheese', name: 'Extra Melted Cheddar', weight: '40 gm', price: 0.60, defaultChecked: true },
      { id: 'ing-sauce', name: 'Garlic Mayo Dip', weight: '50 ml', price: 0.40, defaultChecked: true },
      { id: 'ing-masala', name: 'Masala Fries Upgrade', weight: 'Portion', price: 0.50, defaultChecked: false }
    ]
  },
  {
    id: 'item-boneless-box',
    name: 'Kookoos Boneless Box',
    swahiliName: 'Boksi Isiyo na Mifupa (Tenders + Pops)',
    description: 'Vipande 4 vya minofu laini ya kuku (chicken tenders) bila mfupa, kuku pops 6 wa kukoroma, chipsi motomoto, na mchuzi wa kuchovya.',
    price: 6.50,
    priceTZS: 17000,
    category: 'boxes',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: '1.9k',
    calories: 580,
    prepTimeMinutes: 10,
    restaurantName: 'Kookoos',
    restaurantBranch: 'Kamata Kariakoo & All Branches',
    isBestSeller: true,
    isAvailable: true,
    sizes: [
      { id: 'b-reg', name: 'Regular Boneless Box', price: 6.50, label: 'Regular' },
      { id: 'b-mega', name: 'Mega Boneless Box (Double Tenders)', price: 9.00, label: 'Mega' }
    ],
    ingredients: [
      { id: 'ing-sweet-chili', name: 'Sweet Chili Dip', weight: '50 ml', price: 0.40, defaultChecked: true },
      { id: 'ing-bbq', name: 'Smoky BBQ Sauce', weight: '50 ml', price: 0.40, defaultChecked: false }
    ]
  },
  {
    id: 'item-double-crunch-burger',
    name: 'Double Crunch Chicken Burger',
    swahiliName: 'Baga ya Minofu Miwili ya Kuku',
    description: 'Minofu miwili ya kuku crispy iliyokaangwa vizuri, jibini laini ya cheddar inayovutika, lettuce bichi, kachumbari ya tango na mchuzi mtamu wa Kookoos ndani ya mkate wa brioche.',
    price: 5.50,
    priceTZS: 14500,
    category: 'burgers',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: '2.1k',
    calories: 520,
    prepTimeMinutes: 12,
    restaurantName: 'Kookoos',
    restaurantBranch: 'All Branches',
    isBestSeller: true,
    isAvailable: true,
    sizes: [
      { id: 'single', name: 'Single Fillet Burger', price: 4.50, label: 'Single Fillet' },
      { id: 'double', name: 'Double Fillet Burger', price: 5.50, label: 'Double Crunch' }
    ],
    ingredients: [
      { id: 'ing-bacon', name: 'Crispy Beef Strip', weight: '30 gm', price: 0.80, defaultChecked: false },
      { id: 'ing-jalapeno', name: 'Spicy Jalapeños', weight: '20 gm', price: 0.30, defaultChecked: false }
    ]
  },
  {
    id: 'item-crispy-bucket-8',
    name: 'Kookoos 8 Pcs Crispy Chicken Bucket',
    swahiliName: 'Bakuli Kubwa la Kuku Vipande 8',
    description: 'Vipande 8 vya kuku wa kukaanga wa Kookoos (mapaja, mbawa na vidari) wenye koti nene la viungo vikavu, vikombe 3 vya michuzi maalum na chipsi kubwa mbili za familia.',
    price: 17.50,
    priceTZS: 45000,
    category: 'chicken',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: '4.2k',
    calories: 1450,
    prepTimeMinutes: 18,
    restaurantName: 'Kookoos',
    restaurantBranch: 'Family Feast Delivery',
    isBestSeller: true,
    isSpecial: true,
    isAvailable: true,
    sizes: [
      { id: 'b4', name: '4 Pcs Bucket + 1 Large Fries', price: 9.50, label: '4 Pcs Bucket' },
      { id: 'b8', name: '8 Pcs Family Bucket + 2 Fries', price: 17.50, label: '8 Pcs Bucket' },
      { id: 'b12', name: '12 Pcs Mega Party Bucket + 3 Fries', price: 25.00, label: '12 Pcs Party' }
    ],
    ingredients: [
      { id: 'ing-spicy-flavor', name: 'Extra Spicy Flavour Coating', weight: 'Spice mix', price: 0.00, defaultChecked: false },
      { id: 'ing-garlic-dip', name: 'Extra Garlic Dip Cup', weight: '60 ml', price: 0.50, defaultChecked: true }
    ]
  },
  {
    id: 'item-crispy-piece',
    name: 'Kookoos Classic Crispy Chicken (2 Pcs)',
    swahiliName: 'Vipande 2 vya Kuku wa Kukaanga',
    description: 'Vipande 2 vitamu vya kuku wa kizalendo vilivyotiwa viungo maalum na kukaangwa vikiwa bichi hadi kuwa vya dhahabu na kukoroma.',
    price: 3.50,
    priceTZS: 9000,
    category: 'chicken',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: '1.5k',
    calories: 380,
    prepTimeMinutes: 10,
    restaurantName: 'Kookoos',
    restaurantBranch: 'All Branches',
    isBestSeller: true,
    isAvailable: true,
    sizes: [
      { id: 'c1', name: '1 Pc Chicken Piece', price: 2.00, label: '1 Piece' },
      { id: 'c2', name: '2 Pcs Chicken Pieces', price: 3.50, label: '2 Pieces' },
      { id: 'c3', name: '3 Pcs Chicken Pieces', price: 5.00, label: '3 Pieces' }
    ],
    ingredients: [
      { id: 'ing-dip-peri', name: 'Hot Peri-Peri Sauce', weight: '40 ml', price: 0.40, defaultChecked: true }
    ]
  },
  {
    id: 'item-golden-tenders',
    name: 'Kookoos Golden Chicken Tenders (5 Pcs)',
    swahiliName: 'Tenders za Kuku Zisizo na Mfupa (5 Pcs)',
    description: 'Minofu safi 5 ya kidari cha kuku isiyo na mfupa kabisa, iliyokolea viungo na kukaangwa kiasi cha dhahabu. Inakuja na mchuzi wa kuchovya.',
    price: 4.60,
    priceTZS: 12000,
    category: 'tenders',
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: '1.2k',
    calories: 410,
    prepTimeMinutes: 8,
    restaurantName: 'Kookoos',
    restaurantBranch: 'All Branches',
    isBestSeller: false,
    isAvailable: true,
    sizes: [
      { id: 't3', name: '3 Pcs Snack Tenders', price: 3.00, label: '3 Pcs' },
      { id: 't5', name: '5 Pcs Tenders Box', price: 4.60, label: '5 Pcs' }
    ],
    ingredients: [
      { id: 'ing-honey-mustard', name: 'Honey Mustard Dip', weight: '40 ml', price: 0.40, defaultChecked: true }
    ]
  },
  {
    id: 'item-popcorn-chicken',
    name: 'Kookoos Popcorn Chicken (Chicken Pops)',
    swahiliName: 'Kuku Pops / Popcorn Chicken',
    description: 'Vipande vidogo vidogo vya kuku vilivyokaangwa kama bisi, vitamu sana kwa kutafuna popote au safarini.',
    price: 3.30,
    priceTZS: 8500,
    category: 'tenders',
    image: 'https://images.unsplash.com/photo-1527477321079-5e72d2427f71?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: '950',
    calories: 340,
    prepTimeMinutes: 6,
    restaurantName: 'Kookoos',
    restaurantBranch: 'All Branches',
    isAvailable: true,
    sizes: [
      { id: 'p-reg', name: 'Regular Cup', price: 3.30, label: 'Regular' },
      { id: 'p-large', name: 'Large Cup', price: 5.00, label: 'Large' }
    ],
    ingredients: [
      { id: 'ing-peri-seasoning', name: 'Dust with Peri-Peri Salt', weight: 'Pinch', price: 0.20, defaultChecked: true }
    ]
  },
  {
    id: 'item-fresh-cut-fries',
    name: 'Fresh Daily Hand-Cut Kookoos Fries',
    swahiliName: 'Chipsi Freshi Zilizokatwa kwa Mkono',
    description: 'Viazi freshi vinavyokatwa kwa mkono kila asubuhi, havijawahi kugandishwa! Vinaangikwa motomoto na kutiwa chumvi maalum ya Kookoos.',
    price: 1.95,
    priceTZS: 5000,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: '2.4k',
    calories: 280,
    prepTimeMinutes: 6,
    restaurantName: 'Kookoos',
    restaurantBranch: 'All Branches',
    isBestSeller: true,
    isAvailable: true,
    sizes: [
      { id: 'f-reg', name: 'Regular Fries', price: 1.95, label: 'Regular' },
      { id: 'f-large', name: 'Large Fries', price: 2.80, label: 'Large' }
    ],
    ingredients: [
      { id: 'ing-mayo', name: 'Creamy Garlic Mayo Dip', weight: '40 ml', price: 0.40, defaultChecked: true }
    ]
  },
  {
    id: 'item-masala-fries',
    name: 'Kookoos Masala Fries (Chipsi Masala)',
    swahiliName: 'Chipsi Masala Motomoto ya Kookoos',
    description: 'Chipsi zilizokaangwa na kuchanganywa kwenye mchuzi mzito wa nyanya, pilipili mboga, viungo vya masala, ndimu na majani ya kotmiri.',
    price: 2.90,
    priceTZS: 7500,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: '1.7k',
    calories: 360,
    prepTimeMinutes: 8,
    restaurantName: 'Kookoos',
    restaurantBranch: 'All Branches',
    isBestSeller: true,
    isAvailable: true,
    sizes: [
      { id: 'm-reg', name: 'Standard Masala Plate', price: 2.90, label: 'Standard' },
      { id: 'm-large', name: 'Super Masala Plate', price: 3.90, label: 'Super' }
    ],
    ingredients: [
      { id: 'ing-extra-lime', name: 'Ndimu ya Ziada na Pilipili', weight: 'Fresh', price: 0.10, defaultChecked: true }
    ]
  },
  {
    id: 'item-loaded-fries',
    name: 'Kookoos Loaded Cheesy Chicken Fries',
    swahiliName: 'Chipsi Zenye Jibini & Minofu ya Kuku',
    description: 'Sahani ya chipsi zilizomwagiwa jibini ya cheddar ya moto, vipande vya kuku crispy vilivyokatwa, kitunguu swaumu na mchuzi mtamu wa ranch.',
    price: 5.00,
    priceTZS: 13000,
    category: 'sides',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: '1.4k',
    calories: 610,
    prepTimeMinutes: 10,
    restaurantName: 'Kookoos',
    restaurantBranch: 'All Branches',
    isAvailable: true,
    sizes: [
      { id: 'l-std', name: 'Loaded Fries Portion', price: 5.00, label: 'Loaded' }
    ],
    ingredients: [
      { id: 'ing-jalapenos', name: 'Pickled Jalapeños', weight: '20 gm', price: 0.30, defaultChecked: false }
    ]
  },
  {
    id: 'item-dips-duo',
    name: 'Kookoos Signature Sauce & Dip Duo',
    swahiliName: 'Michuzi Miwili ya Kookoos (Garlic & Peri-Peri)',
    description: 'Michuzi yetu miwili mashuhuri: Garlic Herb Mayo laini na Peri-Peri Hot Sauce ya pilipili kali ya asili.',
    price: 1.00,
    priceTZS: 2500,
    category: 'dips',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: '820',
    calories: 120,
    prepTimeMinutes: 2,
    restaurantName: 'Kookoos',
    restaurantBranch: 'All Branches',
    isAvailable: true,
    sizes: [
      { id: 'd2', name: 'Duo Pack (2 Cups)', price: 1.00, label: '2 Cups' },
      { id: 'd4', name: 'Party Pack (4 Cups)', price: 1.80, label: '4 Cups' }
    ],
    ingredients: []
  },
  {
    id: 'item-passion-mocktail',
    name: 'Fresh Passion Fruit & Mint Mocktail',
    swahiliName: 'Kinywaji cha Baridi cha Passheni na Nanaa',
    description: 'Juisi freshi ya passheni iliyokamuliwa kutoka matunda ya asili ya Tanzania, ikiwa na barafu, majani ya nanaa na kipande cha limao.',
    price: 1.75,
    priceTZS: 4500,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: '2.2k',
    calories: 110,
    prepTimeMinutes: 4,
    restaurantName: 'Kookoos',
    restaurantBranch: 'All Branches',
    isBestSeller: true,
    isAvailable: true,
    sizes: [
      { id: 'p-std', name: '400ml Glass', price: 1.75, label: '400ml' },
      { id: 'p-big', name: '700ml Jumbo', price: 2.50, label: '700ml' }
    ],
    ingredients: [
      { id: 'ing-ice', name: 'Extra Crushed Ice', weight: 'Ice', price: 0.00, defaultChecked: true }
    ]
  },
  {
    id: 'item-creamy-milkshake',
    name: 'Kookoos Thick Milkshake (Vanilla / Choco / Strawberry)',
    swahiliName: 'Milkshake Nzito ya Maziwa na Aiskrimu',
    description: 'Maziwa mazito yaliyochanganywa na aiskrimu halisi ya vanilla au chokoleti, ikiwa na krimu nzito juu.',
    price: 3.10,
    priceTZS: 8000,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: '910',
    calories: 390,
    prepTimeMinutes: 5,
    restaurantName: 'Kookoos',
    restaurantBranch: 'All Branches',
    isAvailable: true,
    sizes: [
      { id: 'vanilla', name: 'Classic Vanilla Shake', price: 3.10, label: 'Vanilla' },
      { id: 'chocolate', name: 'Rich Chocolate Shake', price: 3.10, label: 'Chocolate' },
      { id: 'strawberry', name: 'Berry Strawberry Shake', price: 3.10, label: 'Strawberry' }
    ],
    ingredients: [
      { id: 'ing-whipped', name: 'Extra Whipped Cream & Sprinkles', weight: 'Topping', price: 0.40, defaultChecked: true }
    ]
  },
  {
    id: 'item-cold-soda',
    name: 'Ice-Cold Soda 500ml (Coca-Cola / Fanta / Sprite)',
    swahiliName: 'Soda ya Baridi 500ml (Coke / Fanta / Sprite)',
    description: 'Chupa ya soda ya baridi sana ya kuburudisha na kuku wako wa kukaanga.',
    price: 0.80,
    priceTZS: 2000,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: '3.1k',
    calories: 140,
    prepTimeMinutes: 1,
    restaurantName: 'Kookoos',
    restaurantBranch: 'All Branches',
    isAvailable: true,
    sizes: [
      { id: 'coke', name: 'Coca-Cola 500ml', price: 0.80, label: 'Coca-Cola' },
      { id: 'fanta', name: 'Fanta Orange 500ml', price: 0.80, label: 'Fanta' },
      { id: 'sprite', name: 'Sprite 500ml', price: 0.80, label: 'Sprite' }
    ],
    ingredients: []
  }
];

export const PROMO_OFFERS: PromoOffer[] = [
  {
    code: 'KOOKOOS20',
    title: 'Kookoos Special 20%',
    discountPercent: 20,
    description: 'Pata punguzo la 20% kwenye Boksi yoyote ya Kookoos Bomba au Bahati!',
    expiryDate: '31 Dec 2026',
    minSpend: 8
  },
  {
    code: 'BOMBAFREE',
    title: 'Free Chipsi Upgrade',
    discountPercent: 15,
    description: 'Ofa ya chipsi za bure unapoagiza kuku kuanzia vipande 4!',
    expiryDate: 'Always Active',
    minSpend: 10
  },
  {
    code: 'KARIBU10',
    title: 'Karibu Kookoos 10%',
    discountPercent: 10,
    description: 'Karibu Kookoos! Punguzo la 10% kwa oda yako ya kwanza kote Dar es Salaam.',
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
      street: 'Mwenge, Bagamoyo Road',
      city: 'Dar es Salaam',
      isDefault: true
    },
    {
      id: 'addr-2',
      label: 'Office',
      street: 'Sinza Mori, Shekilango Road',
      city: 'Dar es Salaam',
      isDefault: false
    }
  ],
  favoriteItemIds: ['item-bomba-box', 'item-bahati-box', 'item-double-crunch-burger'],
  loyaltyPoints: 520,
  loyaltyTier: 'Gold'
};

export const USSD_NETWORKS = [
  {
    id: 'ussd_mpesa',
    name: 'Vodacom M-Pesa',
    brandColor: '#E60000',
    code: '*150*00#',
    sampleDial: '*150*00*1*445566*{AMOUNT}#',
    paybill: '445566',
    accountName: 'KOOKOOS FRIED CHICKEN',
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
    accountName: 'KOOKOOS TIGO PESA',
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
    accountName: 'KOOKOOS AIRTEL PAY',
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
    accountName: 'KOOKOOS HALOPESA',
    currency: 'TZS',
    logo: '🟠 HALOPESA'
  }
];

export const INITIAL_SLIDE_BANNERS: SlideBanner[] = [
  {
    id: 'banner-kookoos-1',
    tag: 'BOMBA BOX',
    title: 'KOOKOOS BOMBA BOX',
    description: 'Kuku 2 Pcs, Chipsi Safi za Asubuhi, Mkate wa Siagi & Mchuzi Maalum TZS 18,500',
    ctaText: 'Agiza Bomba Box ➔',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-amber-600 via-orange-600 to-amber-950',
    accentColor: '#f59e0b',
    active: true,
    orderIndex: 0,
    createdAt: Date.now()
  },
  {
    id: 'banner-kookoos-2',
    tag: '100% HALAL',
    title: 'PROUDLY TANZANIAN FRIED CHICKEN',
    description: 'Kuku wa kukaanga anayekatwa na kutiwa viungo bichi kila siku. 100% Halal!',
    ctaText: 'Tazama Menyu ➔',
    imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-emerald-700 via-teal-800 to-emerald-950',
    accentColor: '#10b981',
    active: true,
    orderIndex: 1,
    createdAt: Date.now()
  },
  {
    id: 'banner-kookoos-3',
    tag: 'MATAWI 8',
    title: 'MATAWI 8 DAR ES SALAAM',
    description: 'Mwenge • Sinza Mori • Kariakoo • Tegeta • Masana • Bahari Beach • Kigamboni • Masaki',
    ctaText: 'Tazama Ramani ya Matawi ➔',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    bgGradient: 'from-rose-700 via-red-800 to-neutral-950',
    accentColor: '#ef4444',
    active: true,
    orderIndex: 2,
    createdAt: Date.now()
  }
];

export const DEFAULT_RESTAURANT_TABLES: RestaurantTable[] = [
  { id: 'tbl-1', name: 'Kaunta 01', section: 'Indoor', capacity: 2, status: 'available' },
  { id: 'tbl-2', name: 'Meza 02', section: 'Indoor', capacity: 4, status: 'available' },
  { id: 'tbl-3', name: 'Meza 03', section: 'Indoor', capacity: 4, status: 'available' },
  { id: 'tbl-4', name: 'Familia 04', section: 'VIP Lounge', capacity: 6, status: 'available' },
  { id: 'tbl-5', name: 'Terrace 05', section: 'Garden Terrace', capacity: 4, status: 'available' },
  { id: 'tbl-6', name: 'Meza 06', section: 'Indoor', capacity: 2, status: 'available' },
  { id: 'tbl-7', name: 'Kaunta 07', section: 'Indoor', capacity: 2, status: 'available' },
  { id: 'tbl-8', name: 'Familia 08', section: 'VIP Lounge', capacity: 8, status: 'available' }
];

export const INITIAL_TABLE_ORDERS: TableOrder[] = [
  {
    id: 'tord-101',
    orderNumber: 'KKS-101',
    tableNumber: 'Meza 02',
    waiterName: 'Bakari Mwenge',
    waiterId: 'usr-wtr-1',
    guestCount: 2,
    items: [
      { dishId: 'item-bomba-box', name: 'Kookoos Bomba Box (2 Pcs)', quantity: 2, priceTZS: 18500, notes: 'Pilipili pembeni' },
      { dishId: 'item-dips-duo', name: 'Signature Garlic & Peri-Peri Dips', quantity: 1, priceTZS: 2500 },
      { dishId: 'item-passion-mocktail', name: 'Fresh Passion Mocktail', quantity: 2, priceTZS: 4500 }
    ],
    totalTZS: 48500,
    status: 'kitchen_prep',
    notes: 'Kuku wawe wa moto sana na crispy',
    createdAt: Date.now() - 10 * 60 * 1000
  }
];

export const INITIAL_RESERVATIONS: TableReservation[] = [
  {
    id: 'res-101',
    reservationCode: 'RES-KKS-8821',
    customerName: 'Juma Khamis Mussa',
    customerPhone: '+255 773 892 110',
    customerEmail: 'juma.khamis@gmail.com',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '19:30',
    guestCount: 4,
    section: 'Indoor',
    tablePreference: 'Familia 04',
    occasion: 'Family Dinner',
    specialRequests: 'Bomba Boxes na kuku wa kutosha kwa watoto',
    status: 'confirmed',
    createdAt: Date.now() - 3600000 * 2
  }
];

export const DEFAULT_SPLASH_SLIDES = [
  {
    id: 'splash-1',
    type: 'video' as const,
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-slice-of-freshly-baked-pizza-42971-large.mp4',
    title: 'Karibu Kookoos - Proudly Tanzanian Fried Chicken',
    subtitle: 'Kuku wa kukaanga anayekatwa na kutiwa viungo vya asili kila asubuhi, 100% Halal na ladha halisi ya Dar!',
    durationSeconds: 5,
    buttonText: 'Agiza Sasa ➔',
    fitMode: 'fit' as const,
    active: true,
    orderIndex: 0
  },
  {
    id: 'splash-2',
    type: 'image' as const,
    mediaUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1600&q=85',
    title: 'Bomba Box & Bahati Box Zisizo na Mpinzani',
    subtitle: 'Kuku wa moto, chipsi freshi za viazi, michuzi maalum ya garlic mayo na vinywaji baridi!',
    durationSeconds: 4,
    buttonText: 'Gundua Maboksi ➔',
    fitMode: 'fit' as const,
    active: true,
    orderIndex: 1
  },
  {
    id: 'splash-3',
    type: 'video' as const,
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-a-red-drink-in-a-glass-with-ice-42472-large.mp4',
    title: 'Matawi 8 Dar Es Salaam • Uletewe Ndani ya Dakika 25',
    subtitle: 'Mwenge • Sinza • Kariakoo • Tegeta • Bahari Beach • Masana • Kigamboni • Masaki',
    durationSeconds: 5,
    buttonText: 'Anza Kuagiza ➔',
    fitMode: 'fit' as const,
    active: true,
    orderIndex: 2
  }
];

export const DEFAULT_BRANCHES = [
  {
    id: 'branch-mwenge',
    name: 'Kookoos Mwenge HQ Branch',
    area: 'Mwenge, Dar es Salaam',
    address: 'Bagamoyo Road, Karibu na Kituo cha Mwenge',
    phone: '+255 712 345 678',
    hours: '09:00 - 23:30',
    tag: 'Flagship Outlet & Drive-thru',
    lat: -6.7712,
    lng: 39.2215,
    active: true
  },
  {
    id: 'branch-sinza',
    name: 'Kookoos Sinza Mori Branch',
    area: 'Sinza Mori, Dar es Salaam',
    address: 'Shekilango Road, Mkabala na Mori Bus Stand',
    phone: '+255 754 998 877',
    hours: '10:00 - 00:00',
    tag: 'Late Night Crispy Chicken',
    lat: -6.7845,
    lng: 39.2310,
    active: true
  },
  {
    id: 'branch-kamata',
    name: 'Kookoos Kamata Kariakoo Branch',
    area: 'Kamata Kariakoo, Dar es Salaam',
    address: 'Msimbazi / Nyerere Road Junction, Kamata',
    phone: '+255 682 994 002',
    hours: '08:00 - 22:30',
    tag: 'City Center Express Kitchen',
    lat: -6.8240,
    lng: 39.2785,
    active: true
  },
  {
    id: 'branch-masana',
    name: 'Kookoos Masana Goba Branch',
    area: 'Masana / Goba Road, Dar es Salaam',
    address: 'Bagamoyo Rd, Masana Hospital Junction',
    phone: '+255 744 883 291',
    hours: '10:00 - 23:00',
    tag: 'Drive-Thru & Dine In',
    lat: -6.7210,
    lng: 39.1980,
    active: true
  },
  {
    id: 'branch-bahari',
    name: 'Kookoos Bahari Beach Branch',
    area: 'Bahari Beach, Dar es Salaam',
    address: 'Oryx Petrol Station, Bahari Beach Roundabout',
    phone: '+255 754 112 334',
    hours: '10:00 - 23:00',
    tag: 'Oryx Station Express',
    lat: -6.6540,
    lng: 39.1820,
    active: true
  },
  {
    id: 'branch-tegeta',
    name: 'Kookoos Tegeta Shoppers Branch',
    area: 'Tegeta, Dar es Salaam',
    address: 'Shoppers Plaza, Bagamoyo Road, Tegeta',
    phone: '+255 718 223 344',
    hours: '10:00 - 22:30',
    tag: 'Shoppers Plaza Food Court',
    lat: -6.6850,
    lng: 39.1950,
    active: true
  },
  {
    id: 'branch-kigamboni',
    name: 'Kookoos Kigamboni Branch',
    area: 'Kigamboni Ferry, Dar es Salaam',
    address: 'Puma Petrol Station, Ferry Road, Kigamboni',
    phone: '+255 765 443 322',
    hours: '09:30 - 23:00',
    tag: 'South Beach Delivery',
    lat: -6.8290,
    lng: 39.3050,
    active: true
  },
  {
    id: 'branch-masaki',
    name: 'Kookoos Masaki Peninsula Branch',
    area: 'Masaki Peninsula, Dar es Salaam',
    address: 'Plot 44, Toure Drive, Karibu na Slipway',
    phone: '+255 712 345 678',
    hours: '11:00 - 01:00',
    tag: 'Peninsula Delivery & Terrace',
    lat: -6.7538,
    lng: 39.2780,
    active: true
  }
];

export const DEFAULT_BRANDING_CONFIG = {
  logoUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=200&q=80',
  logoEmoji: '🍗',
  appName: 'Kookoos',
  tagline: 'Proudly Tanzanian Fried Chicken • Dar es Salaam',
  restaurantMode: 'multi' as const,
  branches: DEFAULT_BRANCHES,
  splashEnabled: false,
  splashSlides: DEFAULT_SPLASH_SLIDES,
  splashAutoSkip: true,
  splashShowOncePerSession: false
};
