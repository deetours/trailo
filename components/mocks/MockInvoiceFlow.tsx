'use client';

import { FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function MockInvoiceFlow() {
  return (
    <div className="w-full max-w-lg bg-[#050505] border border-[#222] rounded-2xl p-6 shadow-2xl font-sans relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#2A8AF6]/5 blur-[64px] pointer-events-none"></div>

      <div className="flex items-start justify-between mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-[#888] mb-1">
            <FileText size={16} />
            <span className="text-xs uppercase tracking-widest font-bold">Invoice #INV-2026-89</span>
          </div>
          <h3 className="text-white text-lg font-medium">Everest Base Camp - 2 Pax</h3>
        </div>
        <div className="bg-[#111] border border-[#333] px-3 py-1 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs font-bold text-white tracking-widest uppercase">Paid</span>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-center py-3 border-b border-[#222]">
          <span className="text-[#888] text-sm">Deposit (30%)</span>
          <span className="text-white font-mono">$840.00</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-[#222]">
          <span className="text-[#888] text-sm">Balance</span>
          <span className="text-white font-mono">$1,960.00</span>
        </div>
        <div className="flex justify-between items-center py-4">
          <span className="text-white font-bold">Total Received</span>
          <span className="text-[#2A8AF6] font-mono font-bold text-xl">$2,800.00</span>
        </div>
      </div>

      <div className="mt-6 bg-[#0a0a0a] border border-[#222] rounded-xl p-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-green-500/10 text-green-500 p-2 rounded-full">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Payment Confirmed</div>
            <div className="text-xs text-[#888]">Automated receipt sent to client.</div>
          </div>
        </div>
      </div>

    </div>
  );
}
