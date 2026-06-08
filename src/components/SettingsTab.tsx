import React, { useState } from 'react';
import { StoreSettings } from '../types';

interface SettingsProps {
  settings: StoreSettings;
  onUpdateSettings: (settings: StoreSettings) => void;
}

export default function SettingsTab({ settings, onUpdateSettings }: SettingsProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleToggleDay = (day: string) => {
    const nextHours = { ...settings.operationalHours };
    nextHours[day].active = !nextHours[day].active;
    onUpdateSettings({ ...settings, operationalHours: nextHours });
  };

  const handleHoursChange = (day: string, type: 'open' | 'close', value: string) => {
    const nextHours = { ...settings.operationalHours };
    nextHours[day][type] = value;
    onUpdateSettings({ ...settings, operationalHours: nextHours });
  };

  const handleTogglePayment = (method: 'upi' | 'card' | 'cash' | 'wallet') => {
    const nextPay = { ...settings.paymentMethods };
    nextPay[method] = !nextPay[method];
    onUpdateSettings({ ...settings, paymentMethods: nextPay });
  };

  const handleUpdateRadius = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ ...settings, deliveryRadiusKm: Number(e.target.value) || 0 });
  };

  const handleSaveConfig = () => {
    alert('[SYSTEM] Operational Hours and Service Criteria mapped to Cloud Sync. Client digital catalogs reloaded.');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f9f9fc] overflow-y-auto p-6 space-y-6">
      
      {/* Header element */}
      <header className="flex justify-between items-center bg-white border border-[#e4beb4]/30 px-6 py-4 rounded-2xl shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1a1c1e] tracking-tight">System Properties</h1>
          <p className="text-xs text-[#5b4039] font-mono mt-0.5">
            Configure delivery radiuses, tax registers, billing mechanisms, and operational briefs.
          </p>
        </div>

        <button
          onClick={handleSaveConfig}
          className="bg-[#1b6d24] hover:bg-[#1b6d24]/95 text-white px-5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-150 active:scale-95 shadow-md"
        >
          SAVE SYSTEM CONFIG
        </button>
      </header>

      {/* Configuration Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Weekly Operational Hours */}
        <div className="lg:col-span-2 bg-white border border-[#e4beb4]/40 rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-sm font-bold font-sans text-[#1a1c1e] uppercase tracking-wider">Store Operational Hours</h3>
            <p className="text-[10px] text-[#5b4039] font-mono">Control online menu visibility and ordering schedules</p>
          </div>

          <div className="space-y-3.5 pt-2">
            {days.map(day => {
              const info = settings.operationalHours[day];
              return (
                <div
                  key={day}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3.5 p-3.5 rounded-xl border border-[#e4beb4]/10 bg-[#f9f9fc]"
                >
                  <div className="flex items-center gap-3 w-36 shrink-0">
                    <button
                      onClick={() => handleToggleDay(day)}
                      className={`w-[40px] h-[22px] rounded-full p-0.5 transition-all outline-none ${
                        info.active ? 'bg-[#1b6d24]' : 'bg-[#e2e2e5]'
                      }`}
                    >
                      <div
                        className={`bg-white w-[18px] h-[18px] rounded-full shadow transform transition-all ${
                          info.active ? 'translate-x-[18px]' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-xs font-bold text-[#1a1c1e]">{day}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#5b4039] uppercase">Open Hours</span>
                    <input
                      type="time"
                      value={info.open}
                      disabled={!info.active}
                      onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                      className="bg-white border rounded px-2 py-1 text-xs text-[#1a1c1e] font-mono disabled:opacity-40"
                    />

                    <span className="text-[10px] font-mono text-[#5b4039] uppercase ml-2">Close Hours</span>
                    <input
                      type="time"
                      value={info.close}
                      disabled={!info.active}
                      onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                      className="bg-white border rounded px-2 py-1 text-xs text-[#1a1c1e] font-mono disabled:opacity-40"
                    />
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      info.active ? 'bg-[#1b6d24]/10 text-[#1b6d24]' : 'bg-[#ba1a1a]/10 text-[#ba1a1a]'
                    }`}>
                      {info.active ? 'SCHEDULING ACTIVE' : 'STORE CLOSED'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Service Logistics config */}
        <div className="space-y-6">
          
          {/* Tax Configurations */}
          <div className="bg-white border border-[#e4beb4]/40 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-bold font-mono text-[#1a1c1e] uppercase tracking-wider">GST IN/TAX PROPERTIES</h3>
              <p className="text-[10px] text-[#5b4039] font-mono">Set standard SGST/CGST rules for customer prints</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold font-mono text-[#5b4039] uppercase tracking-widest mb-1">
                  GSTIN Register ID
                </label>
                <input
                  type="text"
                  value={settings.gstNumber}
                  onChange={(e) => onUpdateSettings({ ...settings, gstNumber: e.target.value })}
                  className="w-full bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-lg px-3 py-2 text-xs font-mono uppercase"
                  placeholder="27AAACH2427P1Z5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-[#5b4039] uppercase tracking-widest mb-1 font-mono">
                    SGST (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.sgst}
                    onChange={(e) => onUpdateSettings({ ...settings, sgst: Number(e.target.value) || 0 })}
                    className="w-full bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-lg px-3 py-2 text-xs font-mono"
                    placeholder="2.5"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-mono text-[#5b4039] uppercase tracking-widest mb-1 font-mono">
                    CGST (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.cgst}
                    onChange={(e) => onUpdateSettings({ ...settings, cgst: Number(e.target.value) || 0 })}
                    className="w-full bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-lg px-3 py-2 text-xs font-mono"
                    placeholder="2.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Parameters slider layout */}
          <div className="bg-white border border-[#e4beb4]/40 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-bold font-mono text-[#1a1c1e] uppercase tracking-wider">Delivery Dispatch Criteria</h3>
              <p className="text-[10px] text-[#5b4039] font-mono">Define outer limits and base shipping tiers</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] font-bold font-mono text-[#5b4039] uppercase tracking-widest">
                    Operational Radius
                  </label>
                  <span className="text-xs font-bold text-[#b02f00] font-mono">{settings.deliveryRadiusKm.toFixed(1)} KM</span>
                </div>
                {/* Dynamic Slider implementation */}
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="0.5"
                  value={settings.deliveryRadiusKm}
                  onChange={handleUpdateRadius}
                  className="w-full h-1.5 bg-[#e2e2e5] rounded-lg appearance-none cursor-pointer accent-[#b02f00]"
                />
              </div>

              {/* Delivery Estimation preview block */}
              <div className="p-3 bg-[#e8e8ea]/40 rounded-xl space-y-1.5 text-xs text-[#5b4039]">
                <div className="flex justify-between">
                  <span>Base delivery pricing:</span>
                  <span className="font-mono font-bold text-[#1a1c1e]">₹{settings.deliveryBaseFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Free delivery threshold:</span>
                  <span className="font-mono font-bold text-[#1b6d24]">₹{settings.deliveryFreeAbove}</span>
                </div>
                <div className="flex justify-between border-t border-[#e4beb4]/20 pt-1.5">
                  <span>Calculated coverage:</span>
                  <span className="font-mono font-bold text-[#b02f00] uppercase">
                    {(settings.deliveryRadiusKm * 3.1415 * 2).toFixed(1)} km Perimeter
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods Checkers */}
          <div className="bg-white border border-[#e4beb4]/40 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-bold font-mono text-[#1a1c1e] uppercase tracking-wider">Gateway Integrations</h3>
              <p className="text-[10px] text-[#5b4039] font-mono">Select cashier settlement protocols</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleTogglePayment('upi')}
                className={`py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-150 border active:scale-95 text-center ${
                  settings.paymentMethods.upi
                    ? 'bg-[#b02f00]/10 border-[#b02f00] text-[#b02f00]'
                    : 'bg-white border-neutral-200 text-gray-400'
                }`}
              >
                Immediate UPI
              </button>

              <button
                onClick={() => handleTogglePayment('card')}
                className={`py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-150 border active:scale-95 text-center ${
                  settings.paymentMethods.card
                    ? 'bg-[#b02f00]/10 border-[#b02f00] text-[#b02f00]'
                    : 'bg-white border-neutral-200 text-gray-400'
                }`}
              >
                Card Terminal
              </button>

              <button
                onClick={() => handleTogglePayment('cash')}
                className={`py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-150 border active:scale-95 text-center ${
                  settings.paymentMethods.cash
                    ? 'bg-[#b02f00]/10 border-[#b02f00] text-[#b02f00]'
                    : 'bg-white border-neutral-200 text-gray-400'
                }`}
              >
                Cash Drawer
              </button>

              <button
                onClick={() => handleTogglePayment('wallet')}
                className={`py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-150 border active:scale-95 text-center ${
                  settings.paymentMethods.wallet
                    ? 'bg-[#b02f00]/10 border-[#b02f00] text-[#b02f00]'
                    : 'bg-white border-neutral-200 text-gray-400'
                }`}
              >
                Paytm Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
