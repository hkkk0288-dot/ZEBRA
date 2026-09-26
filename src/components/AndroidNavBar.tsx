import React from 'react';
import { Home, Heart, ShoppingBag, Clock, User, ShieldCheck, LogIn, Tv } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';

export const AndroidNavBar: React.FC = () => {
  const { activeTab, setActiveTab, cart, orders, theme, user, isLoggedIn } = useApp();
  const [avatarLoadFailed, setAvatarLoadFailed] = React.useState(false);
  const isDark = theme === 'dark';

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const activeOrdersCount = orders.filter(
    o => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto pointer-events-none pb-4 px-4">
      <div
        className={`pointer-events-auto flex items-center justify-around py-2 px-3 rounded-full shadow-2xl transition-all duration-300 ${
          isDark
            ? 'bg-[#18181b]/95 backdrop-blur-xl border border-white/10 text-neutral-400'
            : 'bg-white/95 backdrop-blur-xl border border-neutral-200/80 text-neutral-500 shadow-neutral-300/50'
        }`}
      >
        {/* Home Button with expanding pill when active (exact match to screenshot 2) */}
        <button
          onClick={() => setActiveTab('home')}
          className="relative flex items-center focus:outline-none transition-all duration-200"
        >
          {activeTab === 'home' ? (
            <motion.div
              layoutId="navPill"
              className="flex items-center space-x-1.5 bg-emerald-500 text-white px-4 py-2 rounded-full font-medium text-sm shadow-md shadow-emerald-500/30"
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            >
              <Home className="w-4 h-4" />
              <span className="font-semibold text-xs tracking-wide">Home</span>
            </motion.div>
          ) : (
            <div className="p-2.5 rounded-full hover:text-emerald-500 transition-colors">
              <Home className="w-5 h-5" />
            </div>
          )}
        </button>

        {/* Favorites */}
        <button
          onClick={() => setActiveTab('favorites')}
          className="relative flex items-center focus:outline-none transition-all duration-200"
        >
          {activeTab === 'favorites' ? (
            <motion.div
              layoutId="navPill"
              className="flex items-center space-x-1.5 bg-emerald-500 text-white px-4 py-2 rounded-full font-medium text-sm shadow-md shadow-emerald-500/30"
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            >
              <Heart className="w-4 h-4 fill-white" />
              <span className="font-semibold text-xs">Favorites</span>
            </motion.div>
          ) : (
            <div className="p-2.5 rounded-full hover:text-emerald-500 transition-colors">
              <Heart className="w-5 h-5" />
            </div>
          )}
        </button>

        {/* Cart */}
        <button
          onClick={() => setActiveTab('cart')}
          className="relative flex items-center focus:outline-none transition-all duration-200"
        >
          {activeTab === 'cart' ? (
            <motion.div
              layoutId="navPill"
              className="flex items-center space-x-1.5 bg-emerald-500 text-white px-4 py-2 rounded-full font-medium text-sm shadow-md shadow-emerald-500/30"
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-semibold text-xs">Cart</span>
            </motion.div>
          ) : (
            <div className="relative p-2.5 rounded-full hover:text-emerald-500 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute 1 top-1 right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </div>
          )}
        </button>

        {/* OSS Tokens Screen (Accessible to all: Table & Waiting line customers) */}
        <button
          onClick={() => setActiveTab('oss')}
          className="relative flex items-center focus:outline-none transition-all duration-200"
          title="Fuatilia Token ya Oda Yako (OSS Screen)"
        >
          {activeTab === 'oss' ? (
            <motion.div
              layoutId="navPill"
              className="flex items-center space-x-1.5 bg-emerald-500 text-white px-3.5 py-2 rounded-full font-bold text-sm shadow-md shadow-emerald-500/30"
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            >
              <Tv className="w-4 h-4" />
              <span className="font-semibold text-xs">Tokens</span>
            </motion.div>
          ) : (
            <div className="relative p-2.5 rounded-full hover:text-emerald-500 transition-colors">
              <Tv className="w-5 h-5 text-teal-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            </div>
          )}
        </button>

        {/* Orders / Live Tracking (Only if logged in) */}
        {isLoggedIn && (
          <button
            onClick={() => setActiveTab('orders')}
            className="relative flex items-center focus:outline-none transition-all duration-200"
          >
            {activeTab === 'orders' ? (
              <motion.div
                layoutId="navPill"
                className="flex items-center space-x-1.5 bg-emerald-500 text-white px-4 py-2 rounded-full font-medium text-sm shadow-md shadow-emerald-500/30"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              >
                <Clock className="w-4 h-4" />
                <span className="font-semibold text-xs">Orders</span>
              </motion.div>
            ) : (
              <div className="relative p-2.5 rounded-full hover:text-emerald-500 transition-colors">
                <Clock className="w-5 h-5" />
                {activeOrdersCount > 0 && (
                  <span className="absolute 1 top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                )}
              </div>
            )}
          </button>
        )}

        {/* Profile (Only if logged in) */}
        {isLoggedIn ? (
          <button
            onClick={() => setActiveTab('profile')}
            className="relative flex items-center focus:outline-none transition-all duration-200"
          >
            {activeTab === 'profile' ? (
              <motion.div
                layoutId="navPill"
                className="flex items-center space-x-1.5 bg-emerald-500 text-white px-3.5 py-1.5 rounded-full font-medium text-sm shadow-md shadow-emerald-500/30"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              >
                {user.avatar && !avatarLoadFailed ? (
                  <img
                    src={user.avatar}
                    alt=""
                    onError={() => setAvatarLoadFailed(true)}
                    className="w-5 h-5 rounded-full object-cover border border-white shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-4 h-4 shrink-0" />
                )}
                <span className="font-semibold text-xs">Profile</span>
              </motion.div>
            ) : (
              <div className="p-1.5 rounded-full hover:scale-105 transition-all">
                {user.avatar && !avatarLoadFailed ? (
                  <img
                    src={user.avatar}
                    alt=""
                    onError={() => setAvatarLoadFailed(true)}
                    className="w-7 h-7 rounded-full object-cover border-2 border-emerald-500/80 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="p-1 hover:text-emerald-500 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            )}
          </button>
        ) : (
          /* Login button for guests / unauthenticated users */
          <button
            onClick={() => setActiveTab('auth')}
            className="relative flex items-center focus:outline-none transition-all duration-200"
          >
            {activeTab === 'auth' ? (
              <motion.div
                layoutId="navPill"
                className="flex items-center space-x-1.5 bg-amber-500 text-neutral-950 px-3.5 py-2 rounded-full font-bold text-sm shadow-md shadow-amber-500/30"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              >
                <LogIn className="w-4 h-4" />
                <span className="font-bold text-xs">Ingia</span>
              </motion.div>
            ) : (
              <div className="p-2.5 rounded-full text-amber-400 hover:text-amber-300 transition-colors flex items-center space-x-1">
                <LogIn className="w-5 h-5" />
              </div>
            )}
          </button>
        )}

        {/* Admin Quick Entry if admin */}
        {user.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            title="Admin Dashboard"
            className={`p-2 rounded-full transition-colors ${
              activeTab === 'admin'
                ? 'bg-amber-500 text-neutral-900 font-bold'
                : 'text-amber-500 hover:bg-amber-500/20'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Android Gesture Bar */}
      <div className="w-32 h-1 bg-neutral-400/40 rounded-full mx-auto mt-2"></div>
    </div>
  );
};
