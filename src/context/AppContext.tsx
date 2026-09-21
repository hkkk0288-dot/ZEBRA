import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CartItem,
  IngredientOption,
  MenuItem,
  Order,
  OrderStatus,
  PaymentProvider,
  PromoOffer,
  SizeOption,
  UserProfile
} from '../types';
import {
  DEFAULT_USER,
  INITIAL_MENU_ITEMS,
  PROMO_OFFERS,
  USSD_NETWORKS
} from '../data/mockData';
import { generateOrderNumber, generateUssdRef } from '../utils/formatters';

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currency: 'USD' | 'TZS';
  setCurrency: (c: 'USD' | 'TZS') => void;
  androidFrame: boolean;
  setAndroidFrame: (val: boolean) => void;
  
  user: UserProfile;
  loginAsGuest: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  toggleFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;

  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;

  selectedDish: MenuItem | null;
  setSelectedDish: (item: MenuItem | null) => void;

  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    size: SizeOption,
    ingredients: IngredientOption[],
    quantity: number,
    specialInstructions?: string
  ) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  
  appliedPromo: PromoOffer | null;
  promoCodeInput: string;
  setPromoCodeInput: (val: string) => void;
  promoError: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;

  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;

  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  placeOrder: (details: {
    paymentMethod: PaymentProvider;
    phoneNumber?: string;
    deliveryAddress: string;
    notes?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  activeTab: 'home' | 'favorites' | 'cart' | 'orders' | 'profile' | 'admin';
  setActiveTab: (tab: 'home' | 'favorites' | 'cart' | 'orders' | 'profile' | 'admin') => void;

  ussdModalOrder: Order | null;
  setUssdModalOrder: (order: Order | null) => void;
  completeUssdPayment: (orderId: string, refCode: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state: default dark as requested ("premium dark food-themed and light theme design")
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('zebra_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const [currency, setCurrency] = useState<'USD' | 'TZS'>('USD');
  const [androidFrame, setAndroidFrameState] = useState<boolean>(() => {
    const saved = localStorage.getItem('zebra_android_frame');
    return saved === 'true'; // Default to false so user gets full website view
  });

  const setAndroidFrame = (val: boolean) => {
    setAndroidFrameState(val);
    localStorage.setItem('zebra_android_frame', String(val));
  };

  // User state
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('zebra_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  // Menu Items state (synced with admin edits)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('zebra_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  // Selected dish for detail modal (Screenshot 1 view)
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('zebra_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'favorites' | 'cart' | 'orders' | 'profile' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Promo code
  const [appliedPromo, setAppliedPromo] = useState<PromoOffer | null>(null);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  // USSD modal state
  const [ussdModalOrder, setUssdModalOrder] = useState<Order | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('zebra_orders');
    if (saved) return JSON.parse(saved);
    // Default initial simulated active order for realistic order tracking
    const initialOrder: Order = {
      id: 'ord-zebra-001',
      orderNumber: 'ZBR-782194',
      date: 'Today, 7:15 PM',
      status: 'on_the_way',
      items: [
        {
          cartItemId: 'init-c1',
          menuItem: INITIAL_MENU_ITEMS[0],
          selectedSize: INITIAL_MENU_ITEMS[0].sizes[1],
          selectedIngredients: [INITIAL_MENU_ITEMS[0].ingredients[0]],
          quantity: 1,
          unitPrice: 12.39,
          totalPrice: 12.39
        },
        {
          cartItemId: 'init-c2',
          menuItem: INITIAL_MENU_ITEMS[1],
          selectedSize: INITIAL_MENU_ITEMS[1].sizes[0],
          selectedIngredients: [],
          quantity: 2,
          unitPrice: 4.99,
          totalPrice: 9.98
        }
      ],
      subtotal: 22.37,
      deliveryFee: 5.00,
      discount: 3.00,
      total: 24.37,
      currency: 'USD',
      paymentMethod: 'ussd_mpesa',
      paymentStatus: 'paid',
      ussdDetails: {
        network: 'Vodacom M-Pesa',
        phoneNumber: '+255 712 345 678',
        referenceCode: 'MP994827',
        ussdString: '*150*00*1*445566*2437#'
      },
      customer: {
        name: 'Delisas Agency',
        phone: '+255 712 345 678',
        address: 'Plot 44, Toure Drive, Masaki Peninsula, Dar es Salaam'
      },
      rider: {
        name: 'Juma "Zebra Rider" Bakari',
        phone: '+255 684 902 114',
        vehicle: 'Yamaha YBR 125 (MC-8821)',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
        currentEtaMinutes: 8
      },
      createdAt: Date.now() - 1000 * 60 * 14
    };
    return [initialOrder];
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(orders[0] || null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('zebra_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('zebra_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('zebra_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('zebra_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('zebra_orders', JSON.stringify(orders));
  }, [orders]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const loginAsGuest = () => {
    setUser({
      ...DEFAULT_USER,
      id: `guest-${Date.now()}`,
      name: 'Mgeni (Guest User)'
    });
  };

  const toggleFavorite = (itemId: string) => {
    setUser(prev => {
      const exists = prev.favoriteItemIds.includes(itemId);
      const updated = exists
        ? prev.favoriteItemIds.filter(id => id !== itemId)
        : [...prev.favoriteItemIds, itemId];
      return { ...prev, favoriteItemIds: updated };
    });
  };

  const isFavorite = (itemId: string) => {
    return user.favoriteItemIds.includes(itemId);
  };

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = cart.length === 0 ? 0 : subtotal > 35 ? 0 : 5.00;
  const discountAmount = appliedPromo ? (subtotal * appliedPromo.discountPercent) / 100 : 0;
  const totalAmount = Math.max(0, subtotal + deliveryFee - discountAmount);

  const addToCart = (
    item: MenuItem,
    size: SizeOption,
    ingredients: IngredientOption[],
    quantity: number,
    specialInstructions?: string
  ) => {
    const ingredientsExtraPrice = ingredients.reduce((sum, ing) => sum + ing.price, 0);
    const unitPrice = size.price + ingredientsExtraPrice;
    const totalPrice = unitPrice * quantity;

    const cartItemId = `${item.id}-${size.id}-${ingredients.map(i => i.id).sort().join('_')}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(ci => ci.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: updated[existingIndex].unitPrice * newQty,
          specialInstructions: specialInstructions || updated[existingIndex].specialInstructions
        };
        return updated;
      }
      const newItem: CartItem = {
        cartItemId,
        menuItem: item,
        selectedSize: size,
        selectedIngredients: ingredients,
        quantity,
        unitPrice,
        totalPrice,
        specialInstructions
      };
      return [...prev, newItem];
    });
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code: string): boolean => {
    setPromoError(null);
    const found = PROMO_OFFERS.find(p => p.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      setPromoError('Invalid coupon code.');
      return false;
    }
    if (subtotal < found.minSpend) {
      setPromoError(`Minimum spend of $${found.minSpend} required for ${found.code}`);
      return false;
    }
    setAppliedPromo(found);
    return true;
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
  };

  // Place order
  const placeOrder = async (details: {
    paymentMethod: PaymentProvider;
    phoneNumber?: string;
    deliveryAddress: string;
    notes?: string;
  }): Promise<Order> => {
    const isUssd = details.paymentMethod.startsWith('ussd_');
    const netConfig = USSD_NETWORKS.find(n => n.id === details.paymentMethod);
    const refCode = generateUssdRef();

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      date: 'Just now',
      status: 'pending',
      items: [...cart],
      subtotal,
      deliveryFee,
      discount: discountAmount,
      total: totalAmount,
      currency,
      paymentMethod: details.paymentMethod,
      paymentStatus: isUssd ? 'pending' : 'paid',
      customer: {
        name: user.name,
        phone: details.phoneNumber || user.phone,
        email: user.email,
        address: details.deliveryAddress,
        notes: details.notes
      },
      rider: {
        name: 'Rashid "Speedy" Mwinyi',
        phone: '+255 744 192 883',
        vehicle: 'Boxer 150cc (MC-3910)',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        rating: 4.95,
        currentEtaMinutes: 20
      },
      createdAt: Date.now()
    };

    if (isUssd && netConfig) {
      const amountTZS = Math.round(totalAmount * 2600);
      newOrder.ussdDetails = {
        network: netConfig.name,
        phoneNumber: details.phoneNumber || user.phone,
        referenceCode: refCode,
        ussdString: `*150*00*1*445566*${amountTZS}#`
      };
    }

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();

    if (isUssd) {
      setUssdModalOrder(newOrder);
    } else {
      setActiveTab('orders');
    }

    return newOrder;
  };

  const completeUssdPayment = (orderId: string, refCode: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            paymentStatus: 'paid',
            status: 'preparing',
            ussdDetails: ord.ussdDetails
              ? { ...ord.ussdDetails, referenceCode: refCode, paidAt: new Date().toLocaleTimeString() }
              : undefined
          };
        }
        return ord;
      })
    );

    setActiveOrder(prev => {
      if (prev && prev.id === orderId) {
        return {
          ...prev,
          paymentStatus: 'paid',
          status: 'preparing'
        };
      }
      return prev;
    });

    setUssdModalOrder(null);
    setActiveTab('orders');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status } : ord))
    );
    setActiveOrder(prev => (prev && prev.id === orderId ? { ...prev, status } : prev));
  };

  // Admin menu management
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`
    };
    setMenuItems(prev => [newItem, ...prev]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== id));
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems(prev =>
      prev.map(m => (m.id === id ? { ...m, isAvailable: !m.isAvailable } : m))
    );
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currency,
        setCurrency,
        androidFrame,
        setAndroidFrame,
        user,
        loginAsGuest,
        updateUser,
        toggleFavorite,
        isFavorite,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        selectedDish,
        setSelectedDish,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedPromo,
        promoCodeInput,
        setPromoCodeInput,
        promoError,
        applyPromoCode,
        removePromoCode,
        subtotal,
        deliveryFee,
        discountAmount,
        totalAmount,
        orders,
        activeOrder,
        setActiveOrder,
        placeOrder,
        updateOrderStatus,
        activeTab,
        setActiveTab,
        ussdModalOrder,
        setUssdModalOrder,
        completeUssdPayment,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
