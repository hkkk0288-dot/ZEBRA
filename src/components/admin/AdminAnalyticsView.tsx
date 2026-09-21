import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Download,
  DollarSign,
  ShoppingBag,
  Award,
  Zap
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

interface AdminAnalyticsViewProps {
  currency: 'USD' | 'TZS';
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({ currency }) => {
  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div>
          <h2 className="text-base font-bold font-display text-neutral-900 dark:text-white flex items-center space-x-2">
            <span>Operational Analytics & Business Intelligence</span>
            <span className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold px-2.5 py-0.5 rounded-full">
              Q3 2026 Audit
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Key operational metrics, peak rush hours, category revenues, and turnaround speed
          </p>
        </div>

        <button
          onClick={() => alert('Generating full Q3 Business Intelligence PDF report...')}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PDF Audit</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <span className="text-xs text-neutral-500 block">Avg. Fulfillment Time</span>
          <h3 className="text-2xl font-black font-display text-neutral-900 dark:text-white mt-1">
            28.4 min
          </h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            ↓ 3.2 min faster than last month
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <span className="text-xs text-neutral-500 block">Customer Reorder Rate</span>
          <h3 className="text-2xl font-black font-display text-neutral-900 dark:text-white mt-1">
            68.2%
          </h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            ↑ 4.1% customer loyalty
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <span className="text-xs text-neutral-500 block">Average Basket Size</span>
          <h3 className="text-2xl font-black font-display font-mono text-neutral-900 dark:text-white mt-1">
            {formatPrice(34500, currency)}
          </h3>
          <span className="text-[11px] text-neutral-400">2.6 dishes per checkout</span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <span className="text-xs text-neutral-500 block">On-Time Delivery Success</span>
          <h3 className="text-2xl font-black font-display text-neutral-900 dark:text-white mt-1">
            94.8%
          </h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            Gold Tier SLA
          </span>
        </div>
      </div>

      {/* Hourly Demand & Category Shares */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hourly Rush Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white">
            Hourly Order Distribution (Dar es Salaam Time)
          </h3>

          <div className="flex items-end justify-between h-48 pt-4 px-2">
            {[
              { hour: '10am', count: 12 },
              { hour: '11am', count: 28 },
              { hour: '12pm', count: 85 }, // Lunch Peak
              { hour: '1pm', count: 94 },  // Lunch Peak
              { hour: '2pm', count: 42 },
              { hour: '3pm', count: 20 },
              { hour: '4pm', count: 24 },
              { hour: '5pm', count: 38 },
              { hour: '6pm', count: 65 },
              { hour: '7pm', count: 110 }, // Dinner Peak
              { hour: '8pm', count: 124 }, // Dinner Peak
              { hour: '9pm', count: 78 }
            ].map(col => {
              const heightPct = Math.round((col.count / 130) * 100);
              const isPeak = col.count > 80;

              return (
                <div key={col.hour} className="flex flex-col items-center space-y-1.5 flex-1 mx-0.5">
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-t-lg flex flex-col justify-end overflow-hidden h-36">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-lg transition-all ${
                        isPeak ? 'bg-orange-600' : 'bg-orange-400/80'
                      }`}
                      title={`${col.hour}: ${col.count} orders`}
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 font-medium">{col.hour}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-neutral-500 text-center">
            Peak dining hours: Lunch (12:00 - 13:30) & Dinner Rush (19:00 - 21:00)
          </p>
        </div>

        {/* Top Dish Categories Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white">
            Category Share (% of Sales)
          </h3>

          <div className="space-y-3 pt-1">
            {[
              { category: 'Woodfired Pizzas', share: 38, amount: 48800000, color: 'bg-orange-600' },
              { category: 'Gourmet Burgers', share: 26, amount: 33400000, color: 'bg-amber-500' },
              { category: 'Swahili & Coast BBQ', share: 22, amount: 28200000, color: 'bg-emerald-500' },
              { category: 'Cold Beverages & Smoothies', share: 14, amount: 18050000, color: 'bg-blue-500' }
            ].map(cat => (
              <div key={cat.category} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold text-neutral-900 dark:text-white">{cat.category}</span>
                  <span className="font-mono text-neutral-500">{cat.share}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div style={{ width: `${cat.share}%` }} className={`h-full ${cat.color}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
