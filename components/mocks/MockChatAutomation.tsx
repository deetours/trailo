'use client';

import { Check, CheckCheck, Clock, User, Sparkles } from 'lucide-react';

export default function MockChatAutomation() {
  return (
    <div className="w-full max-w-md bg-[#0a0a0a] border border-[#222] rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans">
      
      {/* Header */}
      <div className="bg-[#111] border-b border-[#222] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-white">
            <User size={16} />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Alex (Lead)</div>
            <div className="text-xs text-[#666]">Everest Base Camp Enquiry</div>
          </div>
        </div>
        <div className="bg-[#1a1a1a] text-[#888] text-[10px] uppercase tracking-widest px-2 py-1 rounded font-bold">
          WhatsApp
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-4 space-y-4 bg-[#0a0a0a] relative overflow-hidden">
        
        {/* Timestamp */}
        <div className="text-center text-xs text-[#444] font-mono mb-6">Today 10:42 AM</div>

        {/* Inbound Message */}
        <div className="flex justify-start">
          <div className="bg-[#1a1a1a] border border-[#222] text-[#ddd] text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%]">
            Hi, I'm looking for availability for the Everest Base Camp trek for 2 people in October. What are the dates?
          </div>
        </div>

        {/* Automated Outbound Message */}
        <div className="flex justify-end pt-2">
          <div className="bg-white text-black text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm relative group">
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles size={14} className="text-[#888]" />
            </div>
            Hey Alex! We have 3 guaranteed departures in October: Oct 2nd, Oct 12th, and Oct 24th. 🏔️ 
            <br/><br/>
            The cost is $1,400 per person. Would you like me to hold 2 spots for you on any of these dates?
            <div className="text-right text-[10px] text-[#666] mt-1 flex items-center justify-end gap-1">
              10:42 AM <CheckCheck size={12} className="text-[#2A8AF6]" />
            </div>
          </div>
        </div>

        {/* System action toast */}
        <div className="pt-4 flex justify-center">
          <div className="bg-[#111] border border-[#222] text-[#888] text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
            <Sparkles size={12} className="text-[#2A8AF6]" />
            <span>Lead tagged as <strong>Hot</strong></span>
          </div>
        </div>
        
      </div>
    </div>
  );
}
