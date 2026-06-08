import React from 'react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  liveStatus: boolean;
  onToggleLiveStatus?: () => void;
}

export default function Sidebar({ activeTab, onTabChange, liveStatus, onToggleLiveStatus }: SidebarProps) {
  const menuItems = [
    { id: 'orders' as TabType, label: 'Orders', icon: 'receipt_long' },
    { id: 'menu' as TabType, label: 'Menu', icon: 'restaurant_menu' },
    { id: 'qr' as TabType, label: 'QR Designer', icon: 'qr_code_2' },
    { id: 'reports' as TabType, label: 'Reports', icon: 'analytics' },
    { id: 'employees' as TabType, label: 'Employees', icon: 'badge' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen flex flex-col bg-[#2f3133] w-[260px] z-50 text-[#eeeef0]">
      {/* Brand Header */}
      <div className="px-6 py-8">
        <h1 className="text-3xl font-extrabold text-[#b02f00] tracking-tight hover:brightness-110 cursor-pointer" onClick={() => onTabChange('orders')}>
          Hambrr
        </h1>
        <p className="text-[11px] font-mono text-[#eeeef0]/50 uppercase tracking-widest mt-1">
          Kitchen Suite
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-4 py-3 gap-4 duration-200 ease-in-out font-medium text-sm rounded ${
                isActive
                  ? 'text-[#ffdbd1] border-l-4 border-[#b02f00] bg-[#e2e2e5]/10 font-bold'
                  : 'text-[#e2e2e5]/70 hover:text-[#eeeef0] hover:bg-[#e2e2e5]/10'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Area */}
      <div className="px-4 py-6 mb-4 space-y-2">
        {/* Status Indicator */}
        <div 
          onClick={onToggleLiveStatus} 
          className={`px-4 py-2 mb-4 rounded-lg cursor-pointer transition-all duration-200 border ${
            liveStatus 
              ? 'bg-[#1b6d24]/10 border-[#1b6d24]/20 text-[#a0f399]' 
              : 'bg-[#ba1a1a]/10 border-[#ba1a1a]/20 text-[#ff544e]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${liveStatus ? 'bg-[#1b6d24] animate-pulse' : 'bg-[#ba1a1a]'}`}></span>
            <span className="text-xs font-bold uppercase tracking-wider font-mono">
              Live Status: {liveStatus ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        {/* Settings button */}
        <button
          onClick={() => onTabChange('settings')}
          className={`w-full flex items-center px-4 py-2 gap-4 duration-200 ease-in-out text-sm rounded ${
            activeTab === 'settings'
              ? 'text-[#ffdbd1] border-l-4 border-[#b02f00] bg-[#e2e2e5]/10 font-bold'
              : 'text-[#e2e2e5]/70 hover:text-[#eeeef0] hover:bg-[#e2e2e5]/10'
          }`}
        >
          <span className="material-symbols-outlined text-xl">settings</span>
          <span>Settings</span>
        </button>

        {/* Support Link */}
        <a
          href="mailto:support@hambrr.com"
          className="flex items-center px-4 py-2 gap-4 text-[#e2e2e5]/70 hover:text-[#eeeef0] hover:bg-[#e2e2e5]/10 duration-200 text-sm rounded cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">help</span>
          <span>Support</span>
        </a>
      </div>
    </aside>
  );
}
