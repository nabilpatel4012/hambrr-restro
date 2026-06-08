import React, { useState } from 'react';
import { Employee } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface EmployeesTabProps {
  employees: Employee[];
  onUpdateEmployees: (employees: Employee[]) => void;
}

export default function EmployeesTab({ employees, onUpdateEmployees }: EmployeesTabProps) {
  const [managerNote, setManagerNote] = useState('');
  const [shiftNotes, setShiftNotes] = useState<string[]>([
    '[Marcus Chen] Kitchen Stations sanitized and prepped. Double checking refrigeration temperatures.',
    '[James Sutherland] Inventory delivery of gourmet cheese and fresh vegetables acknowledged.'
  ]);

  const handleToggleShift = (id: string) => {
    const nextList = employees.map(emp => {
      if (emp.id === id) {
        const isClockingIn = emp.shiftStatus === 'clocked_out';
        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Push shift notification
        const logMsg = `[${emp.name}] clocked ${isClockingIn ? 'IN' : 'OUT'} at ${formattedTime}`;
        setShiftNotes(prev => [logMsg, ...prev]);

        return {
          ...emp,
          shiftStatus: (isClockingIn ? 'clocked_in' : 'clocked_out') as 'clocked_in' | 'clocked_out',
          clockTime: isClockingIn ? `${formattedTime} AM` : undefined
        } as Employee;
      }
      return emp;
    });
    onUpdateEmployees(nextList);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerNote.trim()) return;
    setShiftNotes(prev => [`[Manager Note] ${managerNote.trim()}`, ...prev]);
    setManagerNote('');
  };

  const activeOnShift = employees.filter(e => e.shiftStatus === 'clocked_in').length;

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Employee list container left side */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#f9f9fc] space-y-6">
        
        {/* Header toolbar */}
        <div className="flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1a1c1e] tracking-tight">Staff Logistics</h1>
            <p className="text-xs text-[#5b4039] font-mono mt-0.5">
              Monitor active shifts, track clock-in histories, and record schedule briefs.
            </p>
          </div>

          <div className="bg-[#1b6d24]/10 text-[#1b6d24] px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wider border border-[#1b6d24]/20 flex items-center gap-1.5 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#1b6d24] animate-pulse"></span>
            {activeOnShift} / {employees.length} Active Shift
          </div>
        </div>

        {/* Staff Table Grid */}
        <div className="bg-white border border-[#e4beb4]/40 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e4beb4]/10 bg-[#f9f9fc] flex justify-between items-center">
            <span className="text-xs font-bold font-mono text-[#5b4039] uppercase tracking-wider">Employee Register</span>
            <span className="text-[10px] text-[#5b4039]/60 font-mono">Dynamic clock status synced</span>
          </div>

          <div className="divide-y divide-[#e4beb4]/10">
            {employees.map(emp => (
              <div
                key={emp.id}
                className="px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[#f9f9fc] transition-all duration-150"
              >
                {/* Profile detail */}
                <div className="flex items-center gap-4">
                  <img
                    alt={emp.name}
                    referrerPolicy="no-referrer"
                    src={emp.avatar}
                    className="w-12 h-12 rounded-full object-cover border border-[#e4beb4]/30 shadow-sm"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-[#1a1c1e] tracking-tight">{emp.name}</h3>
                    <p className="text-xs font-semibold text-[#b02f00] font-mono uppercase tracking-wider">
                      {emp.role}
                    </p>
                    <p className="text-[10px] text-[#5b4039] font-mono mt-0.5">
                      CODE: {emp.assignedCode}
                    </p>
                  </div>
                </div>

                {/* Rating performance meter */}
                <div className="text-left md:text-center shrink-0">
                  <p className="text-[10px] font-mono text-[#5b4039] uppercase tracking-wider">Kitchen Performance</p>
                  <p className="text-sm font-bold text-[#1a1c1e] flex items-center gap-1 mt-0.5 justify-start md:justify-center">
                    <span className="material-symbols-outlined text-[#ffd54f] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    {emp.performance.toFixed(1)} / 5.0
                  </p>
                </div>

                {/* Clock indicator status */}
                <div className="text-left md:text-right shrink-0">
                  <p className="text-[10px] font-mono text-[#5b4039] uppercase tracking-wider">Clock History</p>
                  <p className="text-xs font-mono font-bold text-[#1a1c1e] mt-1">
                    {emp.shiftStatus === 'clocked_in' ? `In since ${emp.clockTime}` : 'Offline'}
                  </p>
                </div>

                {/* Toggles action button */}
                <button
                  onClick={() => handleToggleShift(emp.id)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-150 active:scale-95 ${
                    emp.shiftStatus === 'clocked_in'
                      ? 'bg-[#ba1a1a]/10 hover:bg-[#ba1a1a]/15 text-[#ba1a1a] border border-[#ba1a1a]/20'
                      : 'bg-[#1b6d24]/10 hover:bg-[#1b6d24]/15 text-[#1b6d24] border border-[#1b6d24]/20'
                  }`}
                >
                  {emp.shiftStatus === 'clocked_in' ? 'CLOCK OUT' : 'CLOCK IN'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* manager Notes sidebar right side */}
      <div className="w-[340px] bg-white h-full flex flex-col shrink-0 overflow-hidden border-l border-[#e4beb4]/20">
        
        {/* Top Header */}
        <div className="p-6 border-b border-[#e4beb4]/10 bg-[#f9f9fc]">
          <h2 className="text-lg font-bold font-sans text-[#1a1c1e]">Shift Manager Logs</h2>
          <p className="text-xs text-[#5b4039] font-mono mt-0.5">Broadcast custom operational notes.</p>
        </div>

        {/* Input box */}
        <form onSubmit={handleAddNote} className="p-6 border-b border-[#e4beb4]/10 space-y-3 shrink-0">
          <textarea
            value={managerNote}
            onChange={(e) => setManagerNote(e.target.value)}
            rows={3}
            placeholder="Announce schedule shifts, kitchen warnings, or table blocks..."
            className="w-full bg-[#f3f3f6] border border-[#e4beb4]/30 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-[#b02f00] outline-none resize-none font-sans"
          />
          <button
            type="submit"
            className="w-full bg-[#1a1c1e] hover:bg-black text-white py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-all duration-150 active:scale-95"
          >
            Post Notice
          </button>
        </form>

        {/* History Notifications logs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#f9f9fc]">
          <p className="text-[10px] font-mono text-[#5b4039]/60 uppercase tracking-widest font-bold">Shift Timeline Log</p>
          
          <AnimatePresence>
            {shiftNotes.map((note, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border rounded-xl p-3.5 shadow-sm space-y-1"
              >
                <div className="flex gap-2 items-start text-xs font-mono">
                  <span className="material-symbols-outlined text-[#b02f00] text-sm mt-0.5">history</span>
                  <p className="text-[11px] text-[#1a1c1e] leading-normal font-sans">
                    {note}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
