import React, { useState } from 'react';
import { Order, OrderStatus, Table } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface OrdersTabProps {
  orders: Order[];
  tables: Table[];
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateTables: (tables: Table[]) => void;
}

export default function OrdersTab({ orders, tables, onUpdateOrders, onUpdateTables }: OrdersTabProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'tables'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');

  // Counters
  const newOrdersCount = orders.filter(o => o.status === 'inbound').length;
  const preparingCount = orders.filter(o => o.status === 'preparing' || o.status === 'queued').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;

  // Search Filter
  const filteredOrders = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.channelLabel.toLowerCase().includes(q) ||
      o.items.some(item => item.name.toLowerCase().includes(q))
    );
  });

  // Flow handlers
  const handleAccept = (orderId: string) => {
    const nextOrders = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'queued' as OrderStatus, time: '00:00', elapsedMinutes: 0 };
      }
      return o;
    });
    onUpdateOrders(nextOrders);

    // Update corresponding Table state to 'ordering'
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder?.tableId) {
      const nextTables = tables.map(t => {
        if (t.id === targetOrder.tableId) {
          return { ...t, status: 'ordering' as any, orderId, itemsCount: targetOrder.items.length };
        }
        return t;
      });
      onUpdateTables(nextTables);
    }
  };

  const handleReject = (orderId: string) => {
    const nextOrders = orders.filter(o => o.id !== orderId);
    onUpdateOrders(nextOrders);

    // Clear corresponding table if any
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder?.tableId) {
      const nextTables = tables.map(t => {
        if (t.id === targetOrder.tableId) {
          return { ...t, status: 'empty' as any, orderId: undefined, itemsCount: undefined };
        }
        return t;
      });
      onUpdateTables(nextTables);
    }
  };

  const handleMarkReady = (orderId: string) => {
    const nextOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'ready' as OrderStatus,
          riderName: 'Sameer Khan',
          riderStatus: 'Arriving in 1 min',
          riderAvatar: 'https://lh3.googleusercontent.com/aida/AP1WRLvE2yyEZyf3J2cpiIVMKjyFwjurnSJh712Xjrn3GirTAW9jSAimfE__Rov9ytrOmAawO1lIi7TpmmbSADUSCWxtVhxt02PezwO7mY9SGuuhDIPjRypmAut20NI8nkjjgmB4nkdfzvIEdJgdLZW_OQNPRjIcixN0q4A_l9K-fZb96Wh6DrkdIXpJil5Tro_aatfqXVKX1YuFW-A2SeCjXcTaT3UYcN8QzWTzy-GdAHkWqFbWS6Ek5BJ40RAM'
        };
      }
      return o;
    });
    onUpdateOrders(nextOrders);

    // Update corresponding Table state as 'ready'
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder?.tableId) {
      const nextTables = tables.map(t => {
        if (t.id === targetOrder.tableId) {
          return { ...t, status: 'ready' as any };
        }
        return t;
      });
      onUpdateTables(nextTables);
    }
  };

  const handleHandOff = (orderId: string) => {
    const nextOrders = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'completed' as OrderStatus,
          completedTimeAgo: 'Just now',
          serverName: 'Rajesh M.'
        };
      }
      return o;
    });
    onUpdateOrders(nextOrders);

    // Free corresponding Table
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder?.tableId) {
      const nextTables = tables.map(t => {
        if (t.id === targetOrder.tableId) {
          return { ...t, status: 'empty' as any, orderId: undefined, itemsCount: undefined };
        }
        return t;
      });
      onUpdateTables(nextTables);
    }
  };

  const handleServeNow = (tableId: string) => {
    // Find the order that belongs to this table and mark as completed
    const table = tables.find(t => t.id === tableId);
    if (table?.orderId) {
      handleHandOff(table.orderId);
    } else {
      // Clear empty table indicator safely
      const nextTables = tables.map(t => {
        if (t.id === tableId) {
          return { ...t, status: 'empty' as any, orderId: undefined, itemsCount: undefined };
        }
        return t;
      });
      onUpdateTables(nextTables);
    }
  };

  // Mock KOT printing confirmation dialogue
  const handlePrintKOT = (id: string) => {
    const printWindow = window.open ? null : window; // avoid iframe window.open restrictions
    alert(`[KOT PRINTER] Print Ticket sent to Kitchen Station for Order: ${id}`);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Header Controls */}
      <header className="flex justify-between items-center px-6 h-16 bg-white border-b border-[#e4beb4]/40 shrink-0">
        <div className="flex items-center gap-6 flex-1">
          <div className="relative w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5b4039]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f3f3f6] border-none rounded-full pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-[#ff5722] transition-all"
              placeholder="Search orders, tables, or items..."
            />
          </div>

          {/* Toggle Button layout */}
          <div className="flex bg-[#e8e8ea] p-1 rounded-lg ml-4 shadow-inner">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-1.5 rounded-md text-xs font-mono tracking-wider font-bold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white shadow-sm text-[#b02f00]'
                  : 'text-[#5b4039] hover:text-[#b02f00]'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('tables')}
              className={`px-4 py-1.5 rounded-md text-xs font-mono tracking-wider font-bold transition-all ${
                viewMode === 'tables'
                  ? 'bg-white shadow-sm text-[#b02f00]'
                  : 'text-[#5b4039] hover:text-[#b02f00]'
              }`}
            >
              Table Layout
            </button>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1b6d24]/10 text-[#1b6d24] rounded-full border border-[#1b6d24]/20 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#1b6d24] animate-pulse"></span>
            <span className="text-xs font-mono tracking-wider font-semibold">Connected</span>
          </div>
          <button className="w-10 h-10 flex items-center justify-center text-[#5b4039] hover:text-[#b02f00] hover:bg-[#eeeef0] rounded-full transition-all active:scale-95">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-[#5b4039] hover:text-[#b02f00] hover:bg-[#eeeef0] rounded-full transition-all active:scale-95">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Scroll Area */}
      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto bg-[#f9f9fc]">
        
        {/* Summary Banner Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
          <div className="bg-white border border-[#e4beb4]/50 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="font-mono text-[11px] text-[#5b4039] uppercase tracking-wider">New Orders</p>
              <p className="text-2xl font-bold font-sans text-[#1a1c1e]">{newOrdersCount}</p>
            </div>
            <div className="w-11 h-11 bg-[#b02f00]/10 rounded-full flex items-center justify-center text-[#b02f00]">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
          </div>

          <div className="bg-white border border-[#e4beb4]/50 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="font-mono text-[11px] text-[#5b4039] uppercase tracking-wider">Preparing</p>
              <p className="text-2xl font-bold font-sans text-[#1a1c1e]">{preparingCount}</p>
            </div>
            <div className="w-11 h-11 bg-[#ff544e]/10 rounded-full flex items-center justify-center text-[#ff544e]">
              <span className="material-symbols-outlined">skillet</span>
            </div>
          </div>

          <div className="bg-white border border-[#e4beb4]/50 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="font-mono text-[11px] text-[#5b4039] uppercase tracking-wider">Ready for Pickup</p>
              <p className="text-2xl font-bold font-sans text-[#1a1c1e]">{readyCount}</p>
            </div>
            <div className="w-11 h-11 bg-[#1b6d24]/10 rounded-full flex items-center justify-center text-[#1b6d24]">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
          </div>

          {/* POS integration active pill */}
          <div className="bg-[#a3f69c]/20 border border-[#1b6d24]/30 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-[#1b6d24] rounded-full p-2 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-sm">sync</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#1b6d24] font-mono tracking-wider">Petpooja POS Sync</p>
              <p className="text-[10px] text-[#005312] font-semibold tracking-widest font-mono">CONNECTED</p>
            </div>
          </div>
        </section>

        {/* View Switch Container */}
        <AnimatePresence mode="wait">
          {viewMode === 'kanban' ? (
            <motion.section
              key="kanban-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[450px]"
            >
              {/* COLUMN 1: Inbound requests */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2 shrink-0">
                  <h2 className="text-sm font-semibold tracking-wider uppercase font-sans text-[#1a1c1e] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#b02f00]"></span>
                    Inbound Requests
                  </h2>
                  <span className="bg-[#e2e2e5] px-2.5 py-0.5 rounded-full text-[10px] font-mono text-[#5b4039] font-bold">
                    {newOrdersCount} New
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {filteredOrders.filter(o => o.status === 'inbound').length === 0 ? (
                    <div className="h-40 border-2 border-dashed border-[#e4beb4]/40 rounded-xl flex flex-col items-center justify-center text-[#5b4039]/50">
                      <span className="material-symbols-outlined text-3xl mb-1">receipt_long</span>
                      <p className="text-[11px] font-mono tracking-wide">No inbound orders</p>
                    </div>
                  ) : (
                    filteredOrders
                      .filter(o => o.status === 'inbound')
                      .map(order => (
                        <div
                          key={order.id}
                          className="bg-white border border-[#e4beb4]/60 p-4 rounded-xl hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span className="bg-[#b02f00]/10 text-[#b02f00] px-2 py-0.5 rounded text-[11px] font-bold font-sans">
                              {order.channelLabel}
                            </span>
                            <span className="text-[11px] font-mono text-[#ba1a1a] font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">schedule</span> {order.time}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-[#1a1c1e] mb-2">{order.id}</h3>
                          
                          <ul className="space-y-1 mb-4 border-b border-[#e4beb4]/10 pb-3">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="flex justify-between text-xs text-[#1a1c1e]">
                                <span>{item.name}</span>
                                <span className="text-[#5b4039] font-mono">Qty {item.qty}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="flex justify-between items-center mb-4">
                            <span className="text-[11px] font-mono text-[#5b4039] uppercase">Total Bill</span>
                            <span className="text-base font-bold text-[#b02f00]">₹{order.totalBill.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleAccept(order.id)}
                              className="bg-[#b02f00] hover:bg-[#b02f00]/95 text-white py-2 rounded-lg text-xs font-bold active:scale-95 transition-all shadow-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(order.id)}
                              className="bg-[#f3f3f6] hover:bg-[#e8e8ea] text-[#5b4039] py-2 rounded-lg text-xs font-bold active:scale-95 transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* COLUMN 2: Kitchen Preparing State */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2 shrink-0">
                  <h2 className="text-sm font-semibold tracking-wider uppercase font-sans text-[#1a1c1e] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff544e]"></span>
                    Preparing
                  </h2>
                  <span className="bg-[#e2e2e5] px-2.5 py-0.5 rounded-full text-[10px] font-mono text-[#5b4039] font-bold">
                    {preparingCount} Active
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {filteredOrders.filter(o => o.status === 'preparing' || o.status === 'queued').length === 0 ? (
                    <div className="h-40 border-2 border-dashed border-[#e4beb4]/40 rounded-xl flex flex-col items-center justify-center text-[#5b4039]/50">
                      <span className="material-symbols-outlined text-3xl mb-1">skillet</span>
                      <p className="text-[11px] font-mono tracking-wide">No active cooking ticket</p>
                    </div>
                  ) : (
                    filteredOrders
                      .filter(o => o.status === 'preparing' || o.status === 'queued')
                      .map(order => (
                        <div
                          key={order.id}
                          className="bg-white border-l-4 border-l-[#ff544e] border-y border-r border-[#e4beb4]/60 p-4 rounded-xl shadow-sm hover:shadow transition-all duration-200"
                        >
                          <div className="flex justify-between items-start mb-3 border-b border-[#e4beb4]/10 pb-3">
                            <div>
                              <h3 className="text-base font-bold text-[#1a1c1e] leading-tight">{order.id}</h3>
                              <p className="text-[10px] font-mono text-[#5b4039] mt-0.5">
                                {order.channelLabel.toUpperCase()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[11px] font-bold text-[#ff544e] uppercase font-mono tracking-wider">
                                {order.status.toUpperCase()}
                              </p>
                              <p className="text-[10px] text-[#5b4039] font-mono mt-0.5">
                                {order.elapsedMinutes ? `${order.elapsedMinutes}m elapsed` : 'queued'}
                              </p>
                            </div>
                          </div>

                          <div className="bg-[#f3f3f6] p-3 rounded-lg mb-4 space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-3 items-center">
                                <span className="bg-[#1a1c1e] text-white w-5 h-5 flex items-center justify-center rounded text-[11px] font-bold font-mono">
                                  {item.qty}
                                </span>
                                <span className="text-xs font-semibold text-[#1a1c1e]">{item.name}</span>
                              </div>
                            ))}
                            {/* Dummy preloaded items from image layout for high-fidelity compliance */}
                            {order.id === '#ORD-8812' && (
                              <div className="flex gap-3 items-center opacity-40">
                                <span className="bg-[#1b6d24] text-white w-5 h-5 flex items-center justify-center rounded text-[11px]">
                                  <span className="material-symbols-outlined text-[10px]">done</span>
                                </span>
                                <span className="text-xs text-[#1a1c1e] line-through">4x Sweet Tea</span>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handlePrintKOT(order.id)}
                              className="border border-[#b02f00] text-[#b02f00] hover:bg-[#b02f00]/5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">print</span>
                              KOT
                            </button>
                            <button
                              onClick={() => handleMarkReady(order.id)}
                              className="bg-[#b02f00] hover:bg-[#b02f00]/95 text-white py-2 rounded-lg text-xs font-bold active:scale-95 transition-all shadow-sm"
                            >
                              Mark Ready
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* COLUMN 3: Ready / Dispatched */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2 shrink-0">
                  <h2 className="text-sm font-semibold tracking-wider uppercase font-sans text-[#1a1c1e] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1b6d24]"></span>
                    Ready / Dispatched
                  </h2>
                  <span className="bg-[#e2e2e5] px-2.5 py-0.5 rounded-full text-[10px] font-mono text-[#5b4039] font-bold font-mono">
                    {readyCount} Done
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {/* Ready Orders */}
                  {filteredOrders.filter(o => o.status === 'ready').length === 0 ? (
                    <div className="h-40 border-2 border-dashed border-[#e4beb4]/40 rounded-xl flex flex-col items-center justify-center text-[#5b4039]/50">
                      <span className="material-symbols-outlined text-3xl mb-1">check_circle</span>
                      <p className="text-[11px] font-mono tracking-wide font-mono">No packages ready for dispatch</p>
                    </div>
                  ) : (
                    filteredOrders
                      .filter(o => o.status === 'ready')
                      .map(order => (
                        <div
                          key={order.id}
                          className="bg-white border border-[#e4beb4]/60 p-4 rounded-xl relative overflow-hidden shadow-sm hover:shadow"
                        >
                          <div className="absolute top-0 right-0 bg-[#1b6d24] text-white px-3 py-1 font-mono text-[9px] font-bold rounded-bl-xl tracking-wider">
                            PICKUP READY
                          </div>

                          <div className="mb-4">
                            <h3 className="text-base font-bold text-[#1a1c1e]">{order.id}</h3>
                            <p className="text-[11px] text-[#5b4039]">{order.channelLabel}</p>
                          </div>

                          {order.riderName ? (
                            <div className="flex items-center gap-3 p-3 bg-[#f3f3f6] border border-[#e4beb4]/20 rounded-lg mb-4">
                              <img
                                alt="Rider Portrait"
                                referrerPolicy="no-referrer"
                                className="w-11 h-11 rounded-full object-cover shadow-sm"
                                src={order.riderAvatar}
                              />
                              <div className="flex-1">
                                <p className="text-xs font-bold text-[#1a1c1e]">{order.riderName}</p>
                                <p className="text-[10px] text-[#5b4039] font-mono">{order.riderStatus}</p>
                              </div>
                              <a
                                href={`tel:+919876543210`}
                                className="w-8 h-8 bg-[#1b6d24]/10 text-[#1b6d24] rounded-full flex items-center justify-center active:scale-95 transition-all text-xs"
                              >
                                <span className="material-symbols-outlined text-sm">call</span>
                              </a>
                            </div>
                          ) : (
                            <div className="p-3 bg-[#f3f3f6] text-center rounded-lg text-xs text-[#5b4039] mb-4 font-mono">
                              No driver assigned yet...
                            </div>
                          )}

                          <button
                            onClick={() => handleHandOff(order.id)}
                            className="w-full bg-[#1b6d24] hover:bg-[#1b6d24]/95 text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-[#1b6d24]/10"
                          >
                            <span className="material-symbols-outlined text-sm">package_2</span>
                            Hand-off Order
                          </button>
                        </div>
                      ))
                  )}

                  {/* Completed Orders List (Shows completed for reference as fallback reference) */}
                  <div className="mt-8 border-t border-[#e4beb4]/20 pt-4">
                    <p className="text-[10px] font-mono text-[#5b4039]/60 uppercase tracking-widest mb-3">Recently Completed</p>
                    {filteredOrders
                      .filter(o => o.status === 'completed')
                      .slice(0, 3)
                      .map(completedOrder => (
                        <div
                          key={completedOrder.id}
                          className="bg-white border border-[#e4beb4]/40 p-4 rounded-xl relative overflow-hidden grayscale opacity-70 mb-3"
                        >
                          <div className="absolute top-0 right-0 bg-[#5b4039] text-white px-2 py-0.5 font-mono text-[8px] rounded-bl-lg">
                            COMPLETED
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-[#1a1c1e]">{completedOrder.id}</h3>
                            <p className="text-[10px] text-[#5b4039]">{completedOrder.channelLabel}</p>
                          </div>
                          <div className="flex justify-between items-center text-[#5b4039] mt-3 pt-2 border-t border-[#e4beb4]/15">
                            <span className="text-[10px] font-mono">Server: {completedOrder.serverName || 'Express Dispatch'}</span>
                            <span className="material-symbols-outlined text-xs text-[#1b6d24]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              verified
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="tables-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex-1 bg-[#f3f3f6]/40 border border-[#e4beb4]/50 rounded-2xl p-8 overflow-y-auto"
            >
              <div className="max-w-5xl mx-auto">
                {/* Tables title and indicators */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e4beb4]/10">
                  <div>
                    <h2 className="text-xl font-bold font-sans text-[#1a1c1e]">Main Dining Floor</h2>
                    <p className="text-xs text-[#5b4039] font-mono mt-0.5">
                      {tables.length} Tables • {tables.filter(t => t.status !== 'empty').length} Occupied
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#ff5722]"></span>
                      <span className="text-xs font-mono text-[#5b4039]">Ordering</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#1b6d24]"></span>
                      <span className="text-xs font-mono text-[#5b4039]">Ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#e2e2e5]"></span>
                      <span className="text-xs font-mono text-[#5b4039]">Empty</span>
                    </div>
                  </div>
                </div>

                {/* Dinning Grid layout */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {tables.map(table => {
                    const hasActiveOrder = table.status !== 'empty';
                    const activeOrder = orders.find(o => o.id === table.orderId);

                    return (
                      <div
                        key={table.id}
                        className={`aspect-square rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 relative ${
                          table.status === 'ordering'
                            ? 'bg-white border-2 border-[#ff5722] shadow-sm hover:shadow-md'
                            : table.status === 'ready'
                            ? 'bg-white border-2 border-[#1b6d24] shadow-sm hover:shadow-md'
                            : 'bg-[#e2e2e5]/20 border-2 border-dashed border-[#e4beb4]/50 hover:bg-white'
                        }`}
                      >
                        {/* Header card area */}
                        <div className="flex justify-between items-start">
                          <span
                            className={`font-black text-sm ${
                              table.status === 'ordering'
                                ? 'text-[#ff5722]'
                                : table.status === 'ready'
                                ? 'text-[#1b6d24]'
                                : 'text-[#5b4039]/60'
                            }`}
                          >
                            {table.id}
                          </span>
                          
                          {table.status === 'ordering' && (
                            <span className="bg-[#ff5722]/10 text-[#ff5722] text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                              {table.elapsedMinutes ? `${table.elapsedMinutes}m` : '02m'}
                            </span>
                          )}

                          {table.status === 'ready' && (
                            <span className="material-symbols-outlined text-[#1b6d24] text-sm font-bold">
                              check_circle
                            </span>
                          )}
                        </div>

                        {/* Mid content body */}
                        <div className="text-center my-auto">
                          {hasActiveOrder ? (
                            <>
                              <p className="text-xs font-bold text-[#1a1c1e] font-mono uppercase tracking-wider">
                                {table.orderId}
                              </p>
                              <p className="text-[10px] text-[#5b4039] font-mono mt-0.5">
                                {table.itemsCount || 3} items
                              </p>
                            </>
                          ) : (
                            <p className="text-xs font-mono text-[#5b4039]/50 tracking-widest font-bold">EMPTY</p>
                          )}
                        </div>

                        {/* Bottom action bar */}
                        <div className="w-full">
                          {table.status === 'ready' ? (
                            <button
                              onClick={() => handleServeNow(table.id)}
                              className="w-full bg-[#1b6d24] hover:bg-[#1b6d24]/90 text-white text-[9px] py-1 rounded font-mono font-bold tracking-wider hover:brightness-105 active:scale-95 transition-all text-center uppercase"
                            >
                              Serve Now
                            </button>
                          ) : table.status === 'ordering' ? (
                            <div className="h-1 bg-[#ff5722]/20 rounded-full overflow-hidden w-full">
                              <div className="h-full bg-[#ff5722] w-2/3 animate-pulse"></div>
                            </div>
                          ) : (
                            <div className="h-1 border-b border-dashed border-[#e4beb4]/40 w-full"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
