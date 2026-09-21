import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, SignalHigh } from 'lucide-react';

export const AndroidStatusBar: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      className={`w-full px-5 pt-2.5 pb-1.5 flex items-center justify-between text-xs select-none transition-colors duration-200 z-30 ${
        isDark ? 'bg-[#0f0f11] text-neutral-300' : 'bg-white text-neutral-800'
      }`}
    >
      <div className="font-semibold tracking-tight text-[13px]">{time || '19:42'}</div>
      
      {/* Front camera punch hole simulation */}
      <div className="w-3.5 h-3.5 rounded-full bg-black border border-neutral-800/40 shadow-inner flex items-center justify-center">
        <div className="w-1 h-1 rounded-full bg-blue-950/80"></div>
      </div>

      <div className="flex items-center space-x-1.5 opacity-90">
        <span className="text-[10px] font-bold tracking-wider">5G</span>
        <SignalHigh className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center space-x-0.5">
          <span className="text-[10px] font-medium">92%</span>
          <BatteryMedium className="w-4 h-4 text-emerald-500" />
        </div>
      </div>
    </div>
  );
};
