import React from 'react';
import {
  HelpCircle,
  MessageCircle,
  FileText,
  Phone,
  CheckCircle2,
  ExternalLink,
  Shield,
  LifeBuoy
} from 'lucide-react';

export const AdminHelpView: React.FC = () => {
  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <h2 className="text-base font-bold font-display text-neutral-900 dark:text-white flex items-center space-x-2">
          <span>Operations Documentation & Support</span>
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Guides for Kitchen staff, dispatch protocols, and live engineer hotline
        </p>
      </div>

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Live Developer WhatsApp Hotline</h3>
          <p className="text-xs text-neutral-500">
            Direct chat with system engineers for instant bug fixes or webhook audits.
          </p>
          <a
            href="https://wa.me/255744883291?text=Hello%20Zebra%20Admin%20Support"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <span>Open WhatsApp Chat (+255 744 883 291)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Dar es Salaam Dispatch Center</h3>
          <p className="text-xs text-neutral-500">
            For urgent delayed orders, courier roadside assistance, or customer escalations.
          </p>
          <a
            href="tel:+255712345678"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs shadow-sm transition-colors"
          >
            <span>Call +255 712 345 678</span>
          </a>
        </div>
      </div>

      {/* System Health Check Status */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white">
          System Infrastructure Health
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            { service: 'USSD Webhook Gateway (Till 445566)', status: 'Operational', ping: '24ms' },
            { service: 'Leaflet GPS Telemetry Server', status: 'Operational', ping: '18ms' },
            { service: 'Cloudinary CDN Image Optimizer', status: 'Operational', ping: '42ms' },
            { service: 'Firebase & Local Storage Cache', status: 'Operational', ping: '12ms' }
          ].map(srv => (
            <div key={srv.service} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{srv.service}</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">{srv.ping}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
