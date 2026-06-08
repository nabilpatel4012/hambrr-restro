import React, { useState } from 'react';
import { QRConfig, Table } from '../types';
import { motion } from 'motion/react';

interface QRDesignerProps {
  qrConfig: QRConfig;
  tables: Table[];
  onUpdateQRConfig: (config: QRConfig) => void;
  onUpdateTables: (tables: Table[]) => void;
}

export default function QRDesignerTab({ qrConfig, tables, onUpdateQRConfig, onUpdateTables }: QRDesignerProps) {
  const [activePreviewTab, setActivePreviewTab] = useState('Starters');
  
  const presets = [
    { name: 'Zesty Orange', hex: '#b02f00' },
    { name: 'Emerald Sage', hex: '#1b6d24' },
    { name: 'Royal Plum', hex: '#5c2d91' },
    { name: 'Berry Rouge', hex: '#ba1a1a' },
    { name: 'Classic Charcoal', hex: '#1a1c1e' }
  ];

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateQRConfig({ ...qrConfig, subdomain: e.target.value });
  };

  const handleCustomDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateQRConfig({ ...qrConfig, customDomain: e.target.value });
  };

  const handleAccentChange = (hex: string) => {
    onUpdateQRConfig({ ...qrConfig, accentColor: hex });
  };

  const handleToggleDigitalOrder = (tableId: string) => {
    const nextTables = tables.map(t => {
      if (t.id === tableId) {
        return { ...t, digitalOrderingActive: !t.digitalOrderingActive };
      }
      return t;
    });
    onUpdateTables(nextTables);
  };

  const handleDownloadQR = (id: string) => {
    alert(`[SYSTEM] QR Code for Dining Table ${id} compiled successfully! Downloaded high-resolution printable PDF asset.`);
  };

  const handleDownloadAllQR = () => {
    alert('[SYSTEM] Compiling PDF containing high-resolution custom-branded standee plates for all tables. Initiating batch download.');
  };

  // Mock items shown in the smartphone simulator
  const simItems = [
    { name: 'Classic Truffle Arancini', desc: 'Risotto balls, truffle glaze, parmesan snow.', price: 290, tags: ['veg'] },
    { name: 'Crispy Peri-Peri Chicken Wings', desc: '6x seasoned chicken wings with spicy peri sauce.', price: 259, tags: ['non-veg'] },
    { name: 'Signature Burrata Salad', desc: 'Tuscany tomatoes, balsamic reduction, basil oil, sourdough.', price: 380, tags: ['veg'] }
  ];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Design Controls panel left side */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f9f9fc]">
        
        {/* Header section */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#1a1c1e] tracking-tight">QR Menu Designer</h1>
          <p className="text-xs text-[#5b4039] font-mono">
            Customize the digital ordering interface and generate table-specific QR standing plates.
          </p>
        </div>

        {/* 1. Address Configurations */}
        <div className="bg-white border border-[#e4beb4]/40 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold font-mono text-[#1a1c1e] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#b02f00]">language</span>
            1. Digital Address Setup
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold font-mono text-[#5b4039] uppercase tracking-widest mb-1">
                Your Free Subdomain URL
              </label>
              <div className="flex rounded-lg overflow-hidden border border-[#e4beb4]/30 bg-[#f3f3f6]">
                <input
                  type="text"
                  value={qrConfig.subdomain.split('.')[0]}
                  onChange={(e) => {
                    const customPart = e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
                    onUpdateQRConfig({ ...qrConfig, subdomain: `${customPart}.hambrr.in` });
                  }}
                  className="flex-1 bg-transparent px-3 py-2 text-xs outline-none text-[#1a1c1e] font-sans"
                  placeholder="the-bistro"
                />
                <span className="bg-[#e8e8ea] px-3 py-2 text-[10px] text-[#5b4039] font-mono flex items-center border-l">
                  .hambrr.in
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold font-mono text-[#5b4039] uppercase tracking-widest mb-1">
                Custom Personal Domain
              </label>
              <input
                type="text"
                value={qrConfig.customDomain}
                onChange={handleCustomDomainChange}
                className="w-full bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#b02f00]"
                placeholder="e.g. menu.thebistro.com"
              />
            </div>
          </div>
        </div>

        {/* 2. Visual branding and colors */}
        <div className="bg-white border border-[#e4beb4]/40 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold font-mono text-[#1a1c1e] uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#b02f00]">palette</span>
            2. Visual Branding & Theme
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold font-mono text-[#5b4039] uppercase tracking-widest mb-2">
                Brand Accent Color
              </label>
              <div className="flex flex-wrap gap-2.5 items-center">
                {presets.map(preset => {
                  const isSelected = qrConfig.accentColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.name}
                      onClick={() => handleAccentChange(preset.hex)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all active:scale-95 bg-[#f9f9fc]"
                      style={{ borderColor: isSelected ? preset.hex : '#e4beb455' }}
                    >
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.hex }}></span>
                      <span className="text-[11px] font-bold" style={{ color: isSelected ? preset.hex : '#5b4039' }}>
                        {preset.name}
                      </span>
                    </button>
                  );
                })}

                {/* Custom input */}
                <div className="flex items-center gap-1.5 border border-[#e4beb4]/30 rounded-lg bg-[#f3f3f6] px-2.5 py-1 text-xs">
                  <span className="font-mono text-[#5b4039]/60">HEX</span>
                  <input
                    type="text"
                    value={qrConfig.accentColor}
                    onChange={(e) => handleAccentChange(e.target.value)}
                    className="w-16 bg-transparent border-none outline-none font-mono text-[11px] font-bold text-[#1a1c1e]"
                  />
                  <input
                    type="color"
                    value={qrConfig.accentColor.startsWith('#') && qrConfig.accentColor.length === 7 ? qrConfig.accentColor : '#b02f00'}
                    onChange={(e) => handleAccentChange(e.target.value)}
                    className="w-4 h-4 cursor-pointer p-0 border-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold font-mono text-[#5b4039] uppercase tracking-widest mb-1">
                  Logo Symbol Character
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={qrConfig.brandLogoUrl}
                  onChange={(e) => onUpdateQRConfig({ ...qrConfig, brandLogoUrl: e.target.value })}
                  className="w-full bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#b02f00]"
                  placeholder="e.g. H"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-[#5b4039] uppercase tracking-widest mb-1">
                  Custom Banner Hero Overlay Image (Hotlink URL)
                </label>
                <input
                  type="text"
                  value={qrConfig.heroBannerUrl}
                  onChange={(e) => onUpdateQRConfig({ ...qrConfig, heroBannerUrl: e.target.value })}
                  className="w-full bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#b02f00]"
                  placeholder="Hotlink image url"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Tables QR Codes Manager */}
        <div className="bg-white border border-[#e4beb4]/40 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold font-mono text-[#1a1c1e] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#b02f00]">qr_code_2</span>
              3. Table QR Placard Generator ({tables.length} Active Tables)
            </h3>
            <button
              onClick={handleDownloadAllQR}
              className="bg-[#b02f00]/10 hover:bg-[#b02f00]/15 text-[#b02f00] px-4 py-1.5 rounded-lg font-bold text-xs font-mono tracking-wider flex items-center gap-1 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">download</span> Batch PDF
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tables.map(table => (
              <div
                key={table.id}
                className="border border-[#e4beb4]/30 rounded-xl p-3 flex flex-col justify-between bg-[#f9f9fc]"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-extrabold text-xs text-[#1a1c1e]">Table {table.id}</span>
                  <button
                    onClick={() => handleToggleDigitalOrder(table.id)}
                    className={`w-10 h-5 rounded-full p-0.5 duration-200 outline-none ${
                      table.digitalOrderingActive ? 'bg-[#1b6d24]' : 'bg-[#e2e2e5]'
                    }`}
                    title={table.digitalOrderingActive ? 'Scan to pay & order active' : 'Ordering locked'}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-all ${
                        table.digitalOrderingActive ? 'translate-x-[20px]' : 'translate-x-[2px]'
                      }`}
                    />
                  </button>
                </div>

                {/* Dummy QR Symbol drawing */}
                <div className="aspect-square bg-white border border-[#e4beb4]/25 flex flex-col items-center justify-center p-2 rounded-lg my-2 select-none relative group cursor-pointer" onClick={() => handleDownloadQR(table.id)}>
                  <div className="w-12 h-12 border-2 border-black p-1 flex flex-col gap-1 rounded bg-[#fafafa]">
                    <div className="flex justify-between gap-1 flex-1">
                      <div className="w-4 h-4 bg-black rounded-sm"></div>
                      <div className="w-4 h-4 bg-black rounded-sm"></div>
                    </div>
                    <div className="flex justify-between gap-1 flex-1">
                      <div className="w-4 h-4 bg-black rounded-sm"></div>
                      <div className="w-2.5 h-2.5 bg-green-800 self-end rounded-sm"></div>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono font-bold mt-1.5 text-royal shadow-sm">SCAN KEY: {table.id}</span>
                  <div className="absolute inset-0 bg-[#b02f00]/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <span className="material-symbols-outlined text-white bg-[#b02f00] p-1.5 rounded-full shadow text-sm">print</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadQR(table.id)}
                  className="w-full text-center bg-white hover:bg-neutral-100 border text-[9px] font-mono font-bold py-1 rounded text-[#5b4039] uppercase tracking-wide transition-all active:scale-95"
                >
                  Download Plate
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Mobile Menu Customer Preview Card right side */}
      <div className="w-[360px] border-l border-[#e4beb4]/20 bg-white h-full shrink-0 flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
        
        {/* Background ambient accents */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#f3f3f6]" />
        
        {/* Mock Smartphone enclosure */}
        <div className="w-[280px] h-[550px] border-[6px] border-[#1a1c1e] bg-[#f9f9fc] rounded-[32px] overflow-hidden shadow-2xl flex flex-col relative">
          
          {/* Smartphone Speaker notch */}
          <div className="absolute top-0 inset-x-0 h-4 bg-[#1a1c1e] z-40 flex items-center justify-center">
            <div className="w-16 h-1.5 bg-[#5b4039] rounded-full"></div>
          </div>

          <div className="flex-1 mt-4 flex flex-col overflow-hidden text-left relative">
            {/* Header branding on mobile view */}
            <div className="h-[120px] relative overflow-hidden shrink-0">
              <img
                src={qrConfig.heroBannerUrl}
                alt="Digital Banner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Brand logo overlay */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-md" style={{ backgroundColor: qrConfig.accentColor }}>
                  {qrConfig.brandLogoUrl}
                </div>
                <div>
                  <h4 className="text-white text-[11px] font-black leading-tight">The Bistro Menu</h4>
                  <p className="text-white/70 text-[8px] font-mono">{qrConfig.subdomain}</p>
                </div>
              </div>
            </div>

            {/* Mobile Categories simulation */}
            <div className="bg-white border-b border-[#e4beb4]/25 py-2 px-3 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {['Starters', 'Mains', 'Desserts'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActivePreviewTab(cat)}
                  className="px-2.5 py-1 rounded-full text-[9px] font-bold font-mono tracking-wider transition-all"
                  style={{
                    backgroundColor: activePreviewTab === cat ? `${qrConfig.accentColor}11` : 'transparent',
                    color: activePreviewTab === cat ? qrConfig.accentColor : '#5b403980',
                    border: `1px solid ${activePreviewTab === cat ? qrConfig.accentColor : '#e4beb422'}`
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mock mobile item list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#f3f3f6]/50">
              <p className="text-[8px] font-black font-sans tracking-wide text-gray-400 uppercase">Interactive Preview Area</p>
              
              {simItems.map((item, idx) => (
                <div key={idx} className="bg-white border p-2.5 rounded-xl shadow-sm space-y-1 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-[12px] h-[12px] border rounded flex items-center justify-center p-0.5 ${
                        item.tags.includes('veg') ? 'border-[#1b6d24]' : 'border-[#ba1a1a]'
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${
                          item.tags.includes('veg') ? 'bg-[#1b6d24]' : 'bg-[#ba1a1a]'
                        }`}></div>
                      </div>
                      <h5 className="text-[10px] font-black leading-tight text-[#1a1c1e]">{item.name}</h5>
                    </div>
                  </div>

                  <p className="text-[8px] text-[#5b4039] line-clamp-2 leading-snug">
                    {item.desc}
                  </p>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] font-mono font-extrabold text-[#1a1c1e]">₹{item.price}</span>
                    <button
                      className="px-2.5 py-0.5 rounded text-[8px] font-bold text-white shadow-sm hover:brightness-110"
                      style={{ backgroundColor: qrConfig.accentColor }}
                    >
                      ADD +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Footer action bar simulation */}
            <div className="bg-white border-t border-[#e4beb4]/10 p-2 text-center shrink-0">
              <p className="text-[8px] font-mono text-[#5b4039]/60">Select items to preview customer cart</p>
            </div>
          </div>
        </div>

        <p className="text-[10px] font-mono text-[#5b4039] uppercase tracking-wider font-bold mt-4">
          Real-time Customer View Simulator
        </p>
      </div>
    </div>
  );
}
