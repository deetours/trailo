'use client';

import { BarChart3, Users, DollarSign, ArrowUpRight, Activity } from 'lucide-react';

export default function MockDashboardPreview() {
  return (
    <div className="w-full max-w-2xl bg-[#0a0a0a] border border-[#222] rounded-2xl p-6 shadow-2xl font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-white font-medium text-lg">Overview</h2>
          <p className="text-[#888] text-sm">Real-time metrics for all active tours.</p>
        </div>
        <div className="bg-[#111] border border-[#222] px-3 py-1.5 rounded-lg text-xs font-medium text-[#888]">
          Last 30 Days
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111] border border-[#222] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-[#888] mb-3">
            <DollarSign size={16} />
            <span className="text-xs uppercase tracking-widest font-bold">Revenue</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">$48,250</div>
          <div className="flex items-center gap-1 text-green-500 text-xs mt-2 font-medium">
            <ArrowUpRight size={14} /> 12% vs last month
          </div>
        </div>

        <div className="bg-[#111] border border-[#222] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-[#888] mb-3">
            <Users size={16} />
            <span className="text-xs uppercase tracking-widest font-bold">New Leads</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">142</div>
          <div className="flex items-center gap-1 text-green-500 text-xs mt-2 font-medium">
            <ArrowUpRight size={14} /> 24% vs last month
          </div>
        </div>

        <div className="bg-[#111] border border-[#222] p-4 rounded-xl">
          <div className="flex items-center gap-2 text-[#888] mb-3">
            <Activity size={16} />
            <span className="text-xs uppercase tracking-widest font-bold">Conversion</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">8.4%</div>
          <div className="flex items-center gap-1 text-[#888] text-xs mt-2 font-medium">
            Stable vs last month
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div>
        <div className="text-xs uppercase tracking-widest font-bold text-[#666] mb-4">Recent Automated Actions</div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#888]">
                <BarChart3 size={14} />
              </div>
              <div>
                <div className="text-sm text-white font-medium">Invoice #89 Paid</div>
                <div className="text-xs text-[#666]">Automated receipt sent to Alex.</div>
              </div>
            </div>
            <div className="text-xs text-[#444] font-mono">Just now</div>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#888]">
                <Users size={14} />
              </div>
              <div>
                <div className="text-sm text-white font-medium">New Lead Captured</div>
                <div className="text-xs text-[#666]">Sarah asked about Kilimanjaro 2027.</div>
              </div>
            </div>
            <div className="text-xs text-[#444] font-mono">12 mins ago</div>
          </div>
        </div>
      </div>

    </div>
  );
}
