import React, { useState } from 'react';
import { motion } from 'motion/react';

interface MetricDetail {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

export default function ReportsTab() {
  const [activeRange, setActiveRange] = useState<'today' | 'weekly' | 'months'>('today');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: string; key: string } | null>(null);

  const metrics: MetricDetail[] = [
    { title: 'Gross Revenue', value: '₹48,920.00', change: '+14.2% from ystday', isPositive: true, icon: 'payments' },
    { title: 'Dispatched Tickets', value: '184 Orders', change: '+8% vs average', isPositive: true, icon: 'receipt_long' },
    { title: 'Avg Fulfillment Period', value: '11.4 Mins', change: '-2.1 mins saved', isPositive: true, icon: 'timer' },
    { title: 'Dine-in Ticket Size', value: '₹844.00', change: '-1.5% decrease', isPositive: false, icon: 'calculate' }
  ];

  // Hourly order volume trend data (SVG drawing coordinates)
  const hourlyData = [
    { hour: '09:00', orders: 12, revenue: 2400 },
    { hour: '11:00', orders: 28, revenue: 5600 },
    { hour: '13:00', orders: 64, revenue: 14800 },
    { hour: '15:00', orders: 35, revenue: 7800 },
    { hour: '17:00', orders: 48, revenue: 10400 },
    { hour: '19:00', orders: 92, revenue: 22400 },
    { hour: '21:00', orders: 55, revenue: 12100 }
  ];

  // Channel distribution donut metrics
  const channels = [
    { name: 'Table Ordering (QR)', value: 45, color: '#b02f00', count: '82 orders' },
    { name: 'Direct Delivery Desk', value: 30, color: '#1b6d24', count: '55 orders' },
    { name: 'External Portals (Zomato)', value: 25, color: '#ffd54f', count: '47 orders' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f9f9fc] overflow-y-auto p-6 space-y-6">
      
      {/* Header section with range controls */}
      <header className="flex justify-between items-center bg-white border border-[#e4beb4]/30 px-6 py-4 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1a1c1e] tracking-tight">Executive Live Analytics</h1>
          <p className="text-xs text-[#5b4039] font-mono mt-0.5">
            Monitor transaction volumes, store operations, and dispatch performance.
          </p>
        </div>

        {/* Filter Slider tabs */}
        <div className="flex bg-[#e8e8ea] p-1 rounded-lg shadow-inner">
          {(['today', 'weekly', 'months'] as const).map(range => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-4 py-1.5 rounded-md text-xs font-mono tracking-wider font-bold capitalize transition-all ${
                activeRange === range
                  ? 'bg-white shadow-sm text-[#b02f00]'
                  : 'text-[#5b4039]/85 hover:text-[#b02f00]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </header>

      {/* Metrics Banner Row */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#e4beb4]/40 p-5 rounded-xl shadow-sm flex items-center justify-between hover:shadow transition-all"
          >
            <div className="space-y-1">
              <p className="font-mono text-[10px] text-[#5b4039] uppercase tracking-wider font-bold">{metric.title}</p>
              <h3 className="text-xl font-bold font-sans text-[#1a1c1e]">{metric.value}</h3>
              <p className={`text-[10px] font-mono font-bold flex items-center gap-1 ${
                metric.isPositive ? 'text-[#1b6d24]' : 'text-[#ba1a1a]'
              }`}>
                <span className="material-symbols-outlined text-xs">
                  {metric.isPositive ? 'trending_up' : 'trending_down'}
                </span>
                {metric.change}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#b02f00]/5 text-[#b02f00] rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">{metric.icon}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Analytics chart and channel distribution bento boxes */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Line chart of order volumes */}
        <div className="lg:col-span-2 bg-white border border-[#e4beb4]/40 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold font-sans text-[#1a1c1e] uppercase tracking-wider">Hourly Order & Revenue Trends</h3>
              <p className="text-[10px] text-[#5b4039] font-mono">Busiest kitchen windows during peak dining channels</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#b02f00] rounded-full inline-block"></span>
                <span className="text-[10px] font-mono font-bold text-[#5b4039]">Orders (Units)</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Line Plot */}
          <div className="relative h-64 w-full flex items-end">
            <svg viewBox="0 0 700 240" className="w-full h-full text-[#5b4039]/10">
              
              {/* Horizontal Help lines */}
              <line x1="50" y1="40" x2="680" y2="40" stroke="currentColor" strokeDasharray="3,3" />
              <line x1="50" y1="90" x2="680" y2="90" stroke="currentColor" strokeDasharray="3,3" />
              <line x1="50" y1="140" x2="680" y2="140" stroke="currentColor" strokeDasharray="3,3" />
              <line x1="50" y1="190" x2="680" y2="190" stroke="currentColor" strokeDasharray="3,3" />
              <line x1="50" y1="230" x2="680" y2="230" stroke="currentColor" strokeWidth="1.5" />

              {/* Y Axis labels */}
              <text x="15" y="45" className="text-[10px] font-mono fill-[#5b4039]/60">100</text>
              <text x="15" y="95" className="text-[10px] font-mono fill-[#5b4039]/60">75</text>
              <text x="15" y="145" className="text-[10px] font-mono fill-[#5b4039]/60">50</text>
              <text x="15" y="195" className="text-[10px] font-mono fill-[#5b4039]/60">25</text>
              <text x="15" y="234" className="text-[10px] font-mono fill-[#5b4039]/60">0</text>

              {/* Draw Filled area gradient */}
              <path
                d="M 50 230 L 50 190 L 155 170 L 260 130 L 365 160 L 470 140 L 575 80 L 680 140 L 680 230 Z"
                fill="url(#orders-gradient)"
                opacity="0.3"
              />

              {/* Draw Plot Line */}
              <path
                d="M 50 190 L 155 170 L 260 130 L 365 160 L 470 140 L 575 80 L 680 140"
                fill="none"
                stroke="#b02f00"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Hourly ticks X axis */}
              {hourlyData.map((d, index) => {
                const x = 50 + index * 105;
                const ordersY = 230 - d.orders * 1.5;
                return (
                  <g key={index}>
                    <text x={x} y="252" className="text-[10px] font-mono font-bold fill-[#5b4039] text-center" textAnchor="middle">
                      {d.hour}
                    </text>
                    {/* Circle Node points */}
                    <circle
                      cx={x}
                      cy={ordersY}
                      r="6"
                      fill="#b02f00"
                      stroke="#fff"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-8 duration-100 transition-all"
                      onMouseEnter={(e) => {
                        setHoveredPoint({ x, y: ordersY, val: `${d.orders} Orders (₹${d.revenue})`, key: d.hour });
                      }}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                );
              })}

              <defs>
                <linearGradient id="orders-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b02f00" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>

            {/* Hovered coordinates display tooltip inside graph */}
            {hoveredPoint && (
              <div
                className="absolute bg-neutral-900 text-white rounded px-2.5 py-1.5 text-[10px] font-mono z-20 shadow pointer-events-none transform -translate-x-1/2 -translate-y-8"
                style={{ left: `${(hoveredPoint.x / 700) * 100}%`, top: `${(hoveredPoint.y / 240) * 100}%` }}
              >
                <p className="font-bold uppercase tracking-wider text-[#ffd54f]">{hoveredPoint.key}</p>
                <p className="mt-0.5">{hoveredPoint.val}</p>
              </div>
            )}
          </div>
        </div>

        {/* Channels partition donut box */}
        <div className="bg-white border border-[#e4beb4]/40 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold font-sans text-[#1a1c1e] uppercase tracking-wider">Channel Partition</h3>
            <p className="text-[10px] text-[#5b4039] font-mono">Receipt source volume share breakdown</p>
          </div>

          {/* Simple Radial Arc indicators */}
          <div className="my-6 flex justify-center py-4">
            <div className="w-36 h-36 rounded-full border-8 border-neutral-100 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-[#b02f00] border-l-[#1b6d24] transform rotate-45" />
              <div className="text-center">
                <p className="text-[9px] font-mono uppercase tracking-wider text-[#5b4039]/60">Total volume</p>
                <p className="text-xl font-extrabold text-[#1a1c1e]">184</p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {channels.map((chan, idx) => (
              <div key={idx} className="flex justify-between items-center bg-[#f9f9fc] p-2.5 rounded-lg border border-[#e4beb4]/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: chan.color }} />
                  <span className="text-xs font-semibold text-[#1a1c1e]">{chan.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-[#b02f00]">{chan.value}%</p>
                  <p className="text-[9px] font-mono text-[#5b4039]/60">{chan.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hourly kitchen audit summary logs */}
      <section className="bg-white border border-[#e4beb4]/40 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold font-sans text-[#1a1c1e] uppercase tracking-wider mb-4">Hour-by-Hour Kitchen Audit</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e4beb4]/20 uppercase text-[9px] font-mono tracking-wider text-[#5b4039]">
                <th className="py-2.5">Hour Window</th>
                <th className="py-2.5">Orders Cleared</th>
                <th className="py-2.5">KOT Direct Prints</th>
                <th className="py-2.5">Average Cooking Time</th>
                <th className="py-2.5 text-right">Fulfillment Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4beb4]/10 text-[#1a1c1e]">
              <tr>
                <td className="py-3 font-semibold">12:00 PM - 01:00 PM</td>
                <td className="py-3">18 Orders</td>
                <td className="py-3 font-mono text-[#5b4039]">32 elements</td>
                <td className="py-3 font-mono text-[#1b6d24]">08:12 mins</td>
                <td className="py-3 text-right text-[#1b6d24] font-bold">99.4% Exceptional</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold">01:00 PM - 02:00 PM</td>
                <td className="py-3">45 Orders</td>
                <td className="py-3 font-mono text-[#5b4039]">72 elements</td>
                <td className="py-3 font-mono text-[#5b4039]">12:45 mins</td>
                <td className="py-3 text-right text-[#1b6d24] font-bold">98.1% Normal</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold">08:00 PM - 09:00 PM</td>
                <td className="py-3">64 Orders</td>
                <td className="py-3 font-mono text-[#5b4039]">112 elements</td>
                <td className="py-3 font-mono text-[#ba1a1a]">16:32 mins</td>
                <td className="py-3 text-right text-[#ff5722] font-bold">94.8% Slowed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
