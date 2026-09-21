import React, { useState } from 'react';
import { AdminLeafletMap } from './AdminLeafletMap';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  Store,
  DollarSign,
  Search,
  Maximize2,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Clock,
  Bike,
  AlertCircle,
  XCircle,
  Phone,
  Eye,
  ChevronRight,
  X,
  Package,
  Plus,
  UtensilsCrossed
} from 'lucide-react';
import {
  MAP_ORDER_PINS,
  MapOrderPin,
  INITIAL_ISSUES,
  AdminIssue,
  generateOrderVolumeHeatmap,
  ActivityHeatmapDay
} from './adminMockData';
import { formatPrice } from '../../utils/formatters';

interface AdminDashboardOverviewProps {
  onNavigateToTab: (tab: any) => void;
  currency: 'USD' | 'TZS';
  isDark: boolean;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onNavigateToTab,
  currency,
  isDark
}) => {
  const [mapSearch, setMapSearch] = useState('');
  const [mapFilter, setMapFilter] = useState<'All' | 'Delivered' | 'On the Way' | 'Preparing' | 'Delayed' | 'Canceled'>('All');
  const [selectedPin, setSelectedPin] = useState<MapOrderPin | null>(null);
  const [activeStatusTab, setActiveStatusTab] = useState<'Overview' | 'Routes' | 'Alerts'>('Overview');
  const [selectedIssue, setSelectedIssue] = useState<AdminIssue | null>(null);
  const [heatmapDays] = useState<ActivityHeatmapDay[]>(() => generateOrderVolumeHeatmap());
  const [hoveredDay, setHoveredDay] = useState<ActivityHeatmapDay | null>(null);

  // Filter map pins
  const filteredPins = MAP_ORDER_PINS.filter(pin => {
    const matchesSearch =
      pin.orderNumber.toLowerCase().includes(mapSearch.toLowerCase()) ||
      pin.customerName.toLowerCase().includes(mapSearch.toLowerCase()) ||
      pin.address.toLowerCase().includes(mapSearch.toLowerCase());

    const matchesStatus = mapFilter === 'All' ? true : pin.status === mapFilter;
    return matchesSearch && matchesStatus;
  });

  // Heatmap months row
  const heatmapMonths = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

  return (
    <div className="space-y-5">
      {/* Admin Quick Action Hub */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-500/20 dark:border-orange-500/15">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/30 shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Admin Quick Launchpad
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Direct access to product catalog additions, user permission controls, and order dispatch
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateToTab('products')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/25 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={() => onNavigateToTab('users')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-neutral-500" />
            <span>Manage Users & Staff</span>
          </button>

          <button
            onClick={() => onNavigateToTab('tracking')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <Bike className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Fleet Radar</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards (Matching Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
          <div className="flex items-center space-y-0 text-neutral-500 dark:text-neutral-400">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mr-2 text-neutral-600 dark:text-neutral-300">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">Total Orders</span>
          </div>

          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-neutral-900 dark:text-white tracking-tight">
              8,412
            </h2>
            <div className="flex items-center space-x-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>8.12%</span>
            </div>
          </div>
        </div>

        {/* Active Drivers */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
          <div className="flex items-center space-y-0 text-neutral-500 dark:text-neutral-400">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mr-2 text-neutral-600 dark:text-neutral-300">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">Active Drivers</span>
          </div>

          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-neutral-900 dark:text-white tracking-tight">
              342
            </h2>
            <div className="flex items-center space-x-0.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>4.32%</span>
            </div>
          </div>
        </div>

        {/* Total Merchants */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
          <div className="flex items-center space-y-0 text-neutral-500 dark:text-neutral-400">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mr-2 text-neutral-600 dark:text-neutral-300">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">Total Merchants</span>
          </div>

          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-neutral-900 dark:text-white tracking-tight">
              156
            </h2>
            <div className="flex items-center space-x-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>8.62%</span>
            </div>
          </div>
        </div>

        {/* Revenue with mini stacked bar chart */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-neutral-500 dark:text-neutral-400">
              <div className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold">Revenue</span>
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-xs bg-orange-500 inline-block" />
                <span>Offline</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-xs bg-amber-400 inline-block" />
                <span>Online</span>
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between pt-1">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-neutral-900 dark:text-white tracking-tight">
                $128,450
              </h2>
              <p className="text-[11px] text-neutral-400">8,412 Total Orders</p>
            </div>

            {/* Mini Stacked Bars */}
            <div className="flex items-end space-x-1.5 h-10 pb-1">
              {[
                { offline: 14, online: 16 },
                { offline: 18, online: 22 },
                { offline: 22, online: 26 },
                { offline: 28, online: 32 }
              ].map((q, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-0.5">
                  <div className="w-3 bg-neutral-100 dark:bg-neutral-800 rounded-t-xs flex flex-col justify-end overflow-hidden h-9">
                    <div style={{ height: `${q.online}%` }} className="w-full bg-amber-400" />
                    <div style={{ height: `${q.offline}%` }} className="w-full bg-orange-500" />
                  </div>
                  <span className="text-[9px] text-neutral-400">Q{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Map + Right Volume/Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Map (8 cols) */}
        <div className="lg:col-span-8 flex flex-col rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden">
          {/* Map Top Bar with Filter Pills */}
          <div className="p-3.5 sm:p-4 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/70 dark:bg-[#151518]/70 backdrop-blur-xs">
            {/* Search order ID */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search order ID..."
                value={mapSearch}
                onChange={e => setMapSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-400"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-0.5">
              {(['All', 'Delivered', 'On the Way', 'Preparing', 'Delayed', 'Canceled'] as const).map(tab => {
                const isSelected = mapFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setMapFilter(tab)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="hidden sm:flex items-center space-x-1.5 text-neutral-500">
              <button
                onClick={() => {
                  setMapSearch('');
                  setMapFilter('All');
                }}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                title="Reset View"
              >
                <MapPin className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateToTab('tracking')}
                className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                title="Fullscreen Map Tracking"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real Interactive Leaflet Map of Dar es Salaam */}
          <div className="relative w-full h-[360px] sm:h-[400px] overflow-hidden">
            <AdminLeafletMap
              pins={filteredPins}
              selectedPin={selectedPin}
              onSelectPin={setSelectedPin}
              isDark={isDark}
              className="w-full h-full"
            />
          </div>

          {/* Under-Map Bottom Panel (Matching Screenshot: Status Bar + Recent Orders) */}
          <div className="p-4 sm:p-5 border-t border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#151518] space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Order Status Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Status
                  </span>
                  <div className="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    {(['Overview', 'Routes', 'Alerts'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveStatusTab(tab)}
                        className={`px-2 py-0.5 rounded-md transition-colors ${
                          activeStatusTab === tab
                            ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                            : 'hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-neutral-500 font-medium">Order Status</p>

                {/* Multi-segmented Progress Bar */}
                <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 flex overflow-hidden">
                  <div style={{ width: '42%' }} className="h-full bg-emerald-500" title="Delivered: 42%" />
                  <div style={{ width: '25%' }} className="h-full bg-blue-500" title="On the Way: 25%" />
                  <div style={{ width: '18%' }} className="h-full bg-cyan-400" title="Preparing: 18%" />
                  <div style={{ width: '9%' }} className="h-full bg-amber-400" title="Delayed: 9%" />
                  <div style={{ width: '6%' }} className="h-full bg-rose-500" title="Canceled: 6%" />
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Delivered (42%)</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>On the Way (25%)</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>Preparing (18%)</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Delayed (9%)</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Canceled (6%)</span>
                  </span>
                </div>
              </div>

              {/* Recent Orders List (Matching Screenshot) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Recent Orders
                  </span>
                  <button
                    onClick={() => onNavigateToTab('orders')}
                    className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                    title="View All Orders"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      name: 'Caramel Frappuccino',
                      time: 'Nov 15, 1hr ago',
                      icon: '☕',
                      status: 'Completed',
                      statusStyle: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                    },
                    {
                      name: 'Big Mac Meal',
                      time: 'Nov 14, 2hr ago',
                      icon: '🍔',
                      status: 'In Transit',
                      statusStyle: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                    },
                    {
                      name: 'Glazed Donuts',
                      time: 'Nov 14, 2hr ago',
                      icon: '🍩',
                      status: 'Cancelled',
                      statusStyle: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    }
                  ].map((order, idx) => (
                    <div
                      key={idx}
                      onClick={() => onNavigateToTab('orders')}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span className="text-base shrink-0">{order.icon}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                            {order.name}
                          </p>
                          <p className="text-[10px] text-neutral-400">{order.time}</p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.statusStyle}`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Order Volume Heatmap + Issue Management (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Daily Order Volume (Github-style Contribution Matrix) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Daily order volume
              </h3>

              <div className="flex items-center space-x-1 text-[10px] text-neutral-500">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-xs bg-neutral-100 dark:bg-neutral-800 inline-block" />
                <span className="w-2.5 h-2.5 rounded-xs bg-orange-300 inline-block" />
                <span className="w-2.5 h-2.5 rounded-xs bg-orange-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-xs bg-orange-600 inline-block" />
                <span>More</span>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="space-y-1 pt-1">
              <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1 no-scrollbar">
                {heatmapDays.map((day, idx) => {
                  const getCellColor = () => {
                    switch (day.level) {
                      case 0:
                        return 'bg-neutral-100 dark:bg-neutral-800';
                      case 1:
                        return 'bg-orange-200 dark:bg-orange-950/80';
                      case 2:
                        return 'bg-orange-400';
                      case 3:
                        return 'bg-orange-500';
                      case 4:
                        return 'bg-orange-600';
                      default:
                        return 'bg-neutral-100';
                    }
                  };

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3.5 h-3.5 rounded-xs ${getCellColor()} transition-transform hover:scale-125 cursor-pointer`}
                      title={`${day.date}: ${day.count} orders`}
                    />
                  );
                })}
              </div>

              {/* Month Labels */}
              <div className="flex justify-between text-[10px] text-neutral-400 px-1 pt-1">
                {heatmapMonths.map(m => (
                  <span key={m}>{m}</span>
                ))}
              </div>

              {hoveredDay && (
                <div className="p-2 rounded-xl bg-neutral-900 text-white text-[11px] font-medium text-center animate-fadeIn">
                  {hoveredDay.date}: <strong className="text-orange-400">{hoveredDay.count} orders delivered</strong>
                </div>
              )}
            </div>
          </div>

          {/* Issue Management List (Matching Screenshot) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Issue Management
              </h3>
              <span className="text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-500 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-2">
              {INITIAL_ISSUES.map(issue => (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className="flex items-center justify-between p-3 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 hover:border-orange-500/40 bg-neutral-50/50 dark:bg-neutral-900/50 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 text-sm">
                      {issue.type === 'wrong_order' && '📦'}
                      {issue.type === 'missing_item' && '🍱'}
                      {issue.type === 'cancelled_order' && '❌'}
                      {issue.type === 'complaint' && '📋'}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {issue.type === 'wrong_order' && 'Wrong Orders'}
                        {issue.type === 'missing_item' && 'Missing Items'}
                        {issue.type === 'cancelled_order' && 'Cancelled Orders'}
                        {issue.type === 'complaint' && 'Customer Complaints'}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate">{issue.title}</p>
                    </div>
                  </div>

                  <span className="text-xs font-black font-mono text-neutral-700 dark:text-neutral-300 ml-2">
                    {issue.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pin Detail Drawer Modal */}
      {selectedPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#18181b] rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                  {selectedPin.orderNumber}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {selectedPin.status}
                </span>
              </div>
              <button onClick={() => setSelectedPin(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 space-y-1.5">
                <p className="text-[11px] text-neutral-400 uppercase font-bold">Customer Details</p>
                <p className="font-bold text-neutral-900 dark:text-white text-sm">{selectedPin.customerName}</p>
                <p className="text-neutral-600 dark:text-neutral-300">{selectedPin.address}</p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 space-y-1.5">
                <p className="text-[11px] text-neutral-400 uppercase font-bold">Order Items</p>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedPin.itemsSummary}</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm">
                  {formatPrice(selectedPin.total, currency)}
                </p>
              </div>

              {selectedPin.riderName && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">Assigned Rider</p>
                  <p className="font-bold text-neutral-900 dark:text-white">{selectedPin.riderName}</p>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                    ETA: ~{selectedPin.etaMinutes || 10} minutes away
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  setSelectedPin(null);
                  onNavigateToTab('orders');
                }}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Open Full Order
              </button>
              <button
                onClick={() => setSelectedPin(null)}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Detail Resolution Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#18181b] rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center space-x-2">
                <span>Resolve Issue: {selectedIssue.orderNumber}</span>
              </h3>
              <button onClick={() => setSelectedIssue(null)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 space-y-1">
                <p className="font-bold text-neutral-900 dark:text-white">{selectedIssue.title}</p>
                <p className="text-neutral-500">{selectedIssue.customer}</p>
                <p className="text-neutral-700 dark:text-neutral-300 pt-1">{selectedIssue.description}</p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">Resolution Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      alert(`Refund processed for ${selectedIssue.orderNumber} via M-Pesa Till 445566!`);
                      setSelectedIssue(null);
                    }}
                    className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-center"
                  >
                    Issue M-Pesa Refund
                  </button>
                  <button
                    onClick={() => {
                      alert(`Free replacement dispatch sent to kitchen for ${selectedIssue.orderNumber}!`);
                      setSelectedIssue(null);
                    }}
                    className="p-2.5 rounded-xl border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-center"
                  >
                    Dispatch Replacement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
