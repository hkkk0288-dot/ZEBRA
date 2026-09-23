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
  UserProfile,
  NavigationTab,
  AuthMode,
  PendingAction,
  SystemRole,
  RolePermissions,
  SlideBanner
} from '../types';
import {
  DEFAULT_USER,
  GUEST_USER,
  INITIAL_MENU_ITEMS,
  PROMO_OFFERS,
  USSD_NETWORKS,
  INITIAL_SLIDE_BANNERS
} from '../data/mockData';
import {
  fetchBannersFromFirestore,
  saveBannerToFirestore,
  deleteBannerFromFirestore,
  subscribeToSlideBanners
} from '../services/firebaseDbService';
import { generateOrderNumber, generateUssdRef } from '../utils/formatters';

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currency: 'USD' | 'TZS';
  setCurrency: (c: 'USD' | 'TZS') => void;
  androidFrame: boolean;
  setAndroidFrame: (val: boolean) => void;

  banners: SlideBanner[];
  addBanner: (b: Omit<SlideBanner, 'id' | 'createdAt'>) => Promise<void>;
  updateBanner: (b: SlideBanner) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  
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

  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  isLoggedIn: boolean;
  login: (identifier: string, password?: string) => Promise<boolean>;
  signup: (params: {
    fullName: string;
    phone: string;
    email?: string;
    avatar?: string;
    birthday?: string;
    location: string;
    coordinates?: { latitude: number; longitude: number };
    password?: string;
  }) => Promise<boolean>;
  logout: () => void;
  loginWithSocial: (provider: 'google' | 'facebook') => Promise<void>;

  ussdModalOrder: Order | null;
  setUssdModalOrder: (order: Order | null) => void;
  completeUssdPayment: (orderId: string, refCode: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  authRedirectMessage: string | null;
  setAuthRedirectMessage: (msg: string | null) => void;
  pendingAction: PendingAction | null;
  setPendingAction: (action: PendingAction | null) => void;
  clearPendingAction: () => void;
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

  // Navigation & Authentication states
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('zebra_logged_in');
    return saved === 'true';
  });

  // User state: If not logged in, must be guest user (not exposing private account details)
  const [user, setUser] = useState<UserProfile>(() => {
    const isSavedLoggedIn = localStorage.getItem('zebra_logged_in') === 'true';
    if (!isSavedLoggedIn) return GUEST_USER;
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

  // Slide Banners state (Admin can add/edit/delete, displays as slider)
  const [banners, setBanners] = useState<SlideBanner[]>(() => {
    const saved = localStorage.getItem('zebra_slide_banners');
    return saved ? JSON.parse(saved) : INITIAL_SLIDE_BANNERS;
  });

  // Sync banners with localStorage
  useEffect(() => {
    localStorage.setItem('zebra_slide_banners', JSON.stringify(banners));
  }, [banners]);

  // Sync banners with Firebase Firestore & subscribe
  useEffect(() => {
    const initCloudBanners = async () => {
      try {
        const cloudBanners = await fetchBannersFromFirestore();
        if (cloudBanners && cloudBanners.length > 0) {
          setBanners(cloudBanners);
        } else {
          // Seed initial banners to Firestore
          for (const b of INITIAL_SLIDE_BANNERS) {
            await saveBannerToFirestore(b);
          }
        }
      } catch (err) {
        console.warn('Banner Firestore init notice:', err);
      }
    };
    initCloudBanners();

    // Subscribe to live Firestore changes
    const unsub = subscribeToSlideBanners(updatedBanners => {
      if (updatedBanners && updatedBanners.length > 0) {
        setBanners(updatedBanners);
      }
    });
    return () => unsub();
  }, []);

  const addBanner = async (b: Omit<SlideBanner, 'id' | 'createdAt'>) => {
    const newBanner: SlideBanner = {
      ...b,
      id: `banner-${Date.now()}`,
      createdAt: Date.now()
    };
    setBanners(prev => [...prev, newBanner]);
    await saveBannerToFirestore(newBanner);
  };

  const updateBanner = async (b: SlideBanner) => {
    setBanners(prev => prev.map(item => item.id === b.id ? b : item));
    await saveBannerToFirestore(b);
  };

  const deleteBanner = async (id: string) => {
    setBanners(prev => prev.filter(item => item.id !== id));
    await deleteBannerFromFirestore(id);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Auth gating & pending actions (for redirecting to signup/login on add to cart or checkout)
  const [authRedirectMessage, setAuthRedirectMessage] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const clearPendingAction = () => {
    setPendingAction(null);
    setAuthRedirectMessage(null);
  };

  // Promo code
  const [appliedPromo, setAppliedPromo] = useState<PromoOffer | null>(null);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  // USSD modal state
  const [ussdModalOrder, setUssdModalOrder] = useState<Order | null>(null);

  // Orders state: If not logged in, orders MUST be empty so unauthenticated users cannot see private orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const isSavedLoggedIn = localStorage.getItem('zebra_logged_in') === 'true';
    if (!isSavedLoggedIn) return [];
    const saved = localStorage.getItem('zebra_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    const isSavedLoggedIn = localStorage.getItem('zebra_logged_in') === 'true';
    if (!isSavedLoggedIn) return null;
    const saved = localStorage.getItem('zebra_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed[0] || null;
      } catch {
        return null;
      }
    }
    return null;
  });

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

  useEffect(() => {
    if (isLoggedIn && user.id !== 'guest-1') {
      localStorage.setItem('zebra_user', JSON.stringify(user));
    }
  }, [user, isLoggedIn]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const loginAsGuest = () => {
    setUser(GUEST_USER);
    setIsLoggedIn(false);
  };

  const resolvePendingAction = () => {
    if (pendingAction) {
      if (pendingAction.type === 'add_to_cart') {
        const p = pendingAction;
        executeAddToCart(p.item, p.size, p.ingredients, p.quantity, p.specialInstructions);
        setPendingAction(null);
        setAuthRedirectMessage(null);
        setActiveTab('cart');
        return;
      } else if (pendingAction.type === 'checkout') {
        setPendingAction(null);
        setAuthRedirectMessage(null);
        setActiveTab('cart');
        return;
      }
    }
    setActiveTab('home');
  };

  const login = async (identifier: string, _password?: string): Promise<boolean> => {
    const trimmed = identifier.trim();
    // Check if identifier is email, phone, or 3-part name
    let displayName = user.name || 'David Johnson';
    let userEmail = user.email || 'customer@zebradsm.com';
    let userPhone = user.phone || '+255 754 123 456';
    let systemRole: SystemRole = 'Customer';
    let rolePermissions: RolePermissions | undefined = undefined;
    let branch: string | undefined = undefined;
    let userAvatar = user.avatar || DEFAULT_USER.avatar;

    // Check against saved admin/staff accounts in local store or default
    try {
      const savedStaffStr = localStorage.getItem('zebra_admin_users');
      if (savedStaffStr) {
        const staffList: any[] = JSON.parse(savedStaffStr);
        const match = staffList.find(
          s =>
            s.email?.toLowerCase() === trimmed.toLowerCase() ||
            s.phone?.replace(/[\s-]/g, '') === trimmed.replace(/[\s-]/g, '') ||
            s.name?.toLowerCase() === trimmed.toLowerCase()
        );
        if (match) {
          systemRole = match.role;
          rolePermissions = match.permissions;
          branch = match.assignedBranch;
          displayName = match.name;
          userEmail = match.email;
          userPhone = match.phone;
          if (match.avatar) userAvatar = match.avatar;
        }
      }
    } catch {}

    if (trimmed.toLowerCase().includes('waiter') || trimmed.toLowerCase().includes('mhudumu')) {
      systemRole = 'Waiter';
    } else if (trimmed.toLowerCase().includes('admin')) {
      systemRole = 'Super Admin';
    }

    if (trimmed.includes('@')) {
      userEmail = trimmed;
      const part = trimmed.split('@')[0].replace(/[._-]/g, ' ');
      if (displayName === 'David Johnson') {
        displayName = part.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    } else if (/^(\+?255|0)[67]\d{8}$/.test(trimmed.replace(/\s+/g, ''))) {
      userPhone = trimmed;
    } else {
      if (displayName === 'David Johnson') {
        displayName = trimmed.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }
    
    const isAdminLike = systemRole === 'Super Admin' || systemRole === 'Kitchen Manager' || trimmed.toLowerCase().includes('admin');

    const updatedUser: UserProfile = {
      ...user,
      id: `usr-${Date.now()}`,
      name: displayName,
      email: userEmail,
      phone: userPhone,
      avatar: userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: isAdminLike ? 'admin' : 'customer',
      systemRole,
      permissions: rolePermissions,
      assignedBranch: branch
    };
    setUser(updatedUser);
    setIsLoggedIn(true);
    localStorage.setItem('zebra_logged_in', 'true');
    localStorage.setItem('zebra_user', JSON.stringify(updatedUser));
    
    // Restore saved orders if available
    const savedOrders = localStorage.getItem('zebra_orders');
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        setOrders(parsed);
        setActiveOrder(parsed[0] || null);
      } catch {
        // ignore
      }
    }

    if (systemRole === 'Waiter') {
      setActiveTab('waiter');
    } else if (systemRole === 'Super Admin') {
      setActiveTab('admin');
    } else {
      resolvePendingAction();
    }
    return true;
  };

  const signup = async (params: {
    fullName: string;
    phone: string;
    email?: string;
    avatar?: string;
    birthday?: string;
    location: string;
    coordinates?: { latitude: number; longitude: number };
    password?: string;
  }): Promise<boolean> => {
    const formattedName = params.fullName
      .trim()
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    const newAddress = {
      id: `addr-${Date.now()}`,
      label: 'Nyumbani / Makazi',
      street: params.location || 'Masaki, Dar es Salaam',
      city: 'Dar es Salaam',
      isDefault: true
    };

    const newUser: UserProfile = {
      ...user,
      id: `usr-${Date.now()}`,
      name: formattedName,
      phone: params.phone.trim(),
      email: params.email?.trim() || `${formattedName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      avatar: params.avatar || user.avatar,
      birthday: params.birthday,
      locationCoordinates: params.coordinates,
      addresses: [newAddress, ...user.addresses.filter(a => !a.isDefault)],
      role: 'customer'
    };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('zebra_logged_in', 'true');
    localStorage.setItem('zebra_user', JSON.stringify(newUser));
    resolvePendingAction();
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('zebra_logged_in');
    localStorage.removeItem('zebra_user');
    setUser(GUEST_USER);
    setOrders([]);
    setActiveOrder(null);
    setPendingAction(null);
    setAuthRedirectMessage(null);
    setActiveTab('home');
  };

  const loginWithSocial = async (provider: 'google' | 'facebook'): Promise<void> => {
    const socialUser: UserProfile = {
      ...user,
      id: `usr-${provider}-${Date.now()}`,
      name: 'David Johnson',
      email: provider === 'google' ? 'davidjonson@gmail.com' : 'davidjonson@facebook.com',
      avatar: provider === 'google'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
    };
    setUser(socialUser);
    setIsLoggedIn(true);
    localStorage.setItem('zebra_logged_in', 'true');
    localStorage.setItem('zebra_user', JSON.stringify(socialUser));
    resolvePendingAction();
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

  const executeAddToCart = (
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

  const addToCart = (
    item: MenuItem,
    size: SizeOption,
    ingredients: IngredientOption[],
    quantity: number,
    specialInstructions?: string
  ) => {
    if (!isLoggedIn) {
      setAuthRedirectMessage('Tafadhali jisajili au ingia kwanza kwenye akaunti yako ili uweze kuongeza vyakula kwenye kapu na kuagiza.');
      setPendingAction({
        type: 'add_to_cart',
        item,
        size,
        ingredients,
        quantity,
        specialInstructions
      });
      setAuthMode('signup');
      setActiveTab('auth');
      return;
    }

    executeAddToCart(item, size, ingredients, quantity, specialInstructions);
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
    if (!isLoggedIn) {
      setAuthRedirectMessage('Tafadhali ingia au jisajili kwanza ili ukamilishe malipo na uagize chakula chako.');
      setPendingAction({ type: 'checkout' });
      setAuthMode('login');
      setActiveTab('auth');
      throw new Error('Tafadhali ingia au jisajili kwanza');
    }

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
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
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
        authMode,
        setAuthMode,
        isLoggedIn,
        login,
        signup,
        logout,
        loginWithSocial,
        ussdModalOrder,
        setUssdModalOrder,
        completeUssdPayment,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        authRedirectMessage,
        setAuthRedirectMessage,
        pendingAction,
        setPendingAction,
        clearPendingAction
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
