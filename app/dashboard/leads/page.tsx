'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, ArrowRight, Search, Clock, CheckSquare, Square, X } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';
import Card from '@/components/Card';
import { useLeads } from '@/lib/api/leads/hooks/useLeads';
import { useTrips } from '@/lib/api/trips/hooks/useTrips';
import { useSession } from '@/lib/api/auth/hooks/useSession';
import type { LeadStatus, LeadSource, LeadIntent } from '@/types/lead';
import type { LeadInput } from '@/lib/api/leads/service';
import { cn } from '@/lib/cn';

const STATUS_TABS: (LeadStatus | 'all')[] = ['all', 'new', 'contacted', 'qualified', 'negotiating', 'converted', 'lost'];

const SOURCE_OPTIONS: LeadSource[] = ['whatsapp', 'website', 'referral', 'walk-in', 'phone', 'other'];
const INTENT_OPTIONS: LeadIntent[] = ['browsing', 'ready-to-book', 'price-sensitive', 'group-booking'];

function statusBadgeClass(status: LeadStatus) {
  switch (status) {
    case 'converted':
      return 'bg-green-500/10 text-green-500 border border-green-500/20';
    case 'lost':
      return 'bg-destructive/10 text-destructive border border-destructive/20';
    case 'new':
      return 'bg-accent/10 text-accent border border-accent/20';
    default:
      return 'bg-muted text-muted-foreground border border-border';
  }
}

function NewLeadForm({ onCreate, onClose }: { onCreate: (input: LeadInput) => Promise<unknown>; onClose: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState<LeadSource>('whatsapp');
  const [intent, setIntent] = useState<LeadIntent | ''>('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setIsSaving(true);
    await onCreate({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      source,
      intent: intent || undefined,
    });
    setIsSaving(false);
    onClose();
  };

  return (
    <Card className="p-6" hover={false}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">New lead</h3>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
              placeholder="Full name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
              placeholder="+91 90000 00000"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Email (optional)</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as LeadSource)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent capitalize"
            >
              {SOURCE_OPTIONS.map(s => (
                <option key={s} value={s}>{s.replace('-', ' ')}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Intent (optional)</label>
            <select
              value={intent}
              onChange={(e) => setIntent(e.target.value as LeadIntent | '')}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent capitalize"
            >
              <option value="">Unspecified</option>
              {INTENT_OPTIONS.map(i => (
                <option key={i} value={i}>{i.replace('-', ' ')}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="pt-2">
          <MagneticButton type="submit" variant="primary" className="py-2 px-6" disabled={isSaving}>
            {isSaving ? 'Adding...' : 'Add lead'}
          </MagneticButton>
        </div>
      </form>
    </Card>
  );
}

function LeadsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useSession();
  const businessId = session?.businessId || '';

  const status = (searchParams.get('status') as LeadStatus | 'all') || 'all';
  const q = searchParams.get('q') || '';

  const { leads, isLoading, createLead, bulkUpdateStatus } = useLeads(businessId, { status, search: q });
  const { result: tripsResult } = useTrips(businessId, { pageSize: 1000 });
  const tripNameById = useMemo(() => {
    const map = new Map<string, string>();
    tripsResult.items.forEach(t => map.set(t.id, t.basicInfo.name));
    return map;
  }, [tripsResult.items]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchInput, setSearchInput] = useState(q);
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [bulkTargetStatus, setBulkTargetStatus] = useState<LeadStatus>('contacted');

  useEffect(() => {
    setSelectedIds(new Set());
  }, [status, q]);

  const updateFilters = (updates: { status?: string; q?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (updates.status !== undefined) params.set('status', updates.status);
    if (updates.q !== undefined) params.set('q', updates.q);
    router.replace(`/dashboard/leads?${params.toString()}`);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map(l => l.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkAction = async () => {
    if (selectedIds.size === 0) return;
    await bulkUpdateStatus(Array.from(selectedIds), bulkTargetStatus);
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-8">

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-2">
            Leads
          </h1>
          <p className="text-muted-foreground">Track inquiries and move them through your pipeline.</p>
        </div>
        <MagneticButton onClick={() => setShowNewLeadForm(v => !v)} variant="primary" className="py-2.5 px-5">
          <span className="flex items-center gap-2">
            <Plus size={16} /> New lead
          </span>
        </MagneticButton>
      </header>

      {showNewLeadForm && (
        <NewLeadForm onCreate={createLead} onClose={() => setShowNewLeadForm(false)} />
      )}

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-6 overflow-x-auto">
          {STATUS_TABS.map((t) => (
            <button
              key={t}
              onClick={() => updateFilters({ status: t })}
              className={cn(
                "pb-4 -mb-4 text-sm font-medium capitalize relative transition-colors border-b-2 whitespace-nowrap",
                status === t ? "text-foreground border-accent" : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateFilters({ q: searchInput });
            }}
            onBlur={() => updateFilters({ q: searchInput })}
            className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent w-full md:w-64"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="bg-card border border-border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4">
          <span className="text-sm font-medium text-foreground px-2">{selectedIds.size} selected</span>
          <div className="flex items-center gap-2">
            <select
              value={bulkTargetStatus}
              onChange={(e) => setBulkTargetStatus(e.target.value as LeadStatus)}
              className="text-xs font-medium px-3 py-1.5 rounded bg-background border border-border text-foreground capitalize"
            >
              {STATUS_TABS.filter(s => s !== 'all').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button onClick={handleBulkAction} className="text-xs font-medium px-3 py-1.5 rounded bg-accent text-accent-foreground hover:opacity-90 transition-opacity">
              Apply
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="pt-2">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : leads.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center flex flex-col items-center">
            <h3 className="text-lg font-bold text-foreground mb-2">No leads found</h3>
            <p className="text-muted-foreground mb-6">
              {q ? 'Try adjusting your search or filters.' : 'You have no leads in this category.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="flex items-center px-6 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <button onClick={toggleSelectAll} className="mr-6">
                {selectedIds.size === leads.length ? <CheckSquare size={16} /> : <Square size={16} />}
              </button>
              <div className="flex-1">Lead Details</div>
              <div className="w-32 text-right">Status</div>
            </div>

            {leads.map(lead => (
              <Card
                key={lead.id}
                rounded="xl"
                className={cn(
                  "p-6 flex flex-col md:flex-row md:items-center gap-6 transition-colors",
                  selectedIds.has(lead.id) ? "border-accent bg-accent/5" : ""
                )}
              >
                <button onClick={() => toggleSelect(lead.id)} className="text-muted-foreground hover:text-foreground shrink-0">
                  {selectedIds.has(lead.id) ? <CheckSquare size={18} className="text-accent" /> : <Square size={18} />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="bg-muted text-foreground px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                      {lead.source.replace('-', ' ')}
                    </span>
                    {lead.intent && (
                      <span className="bg-background border border-border text-muted-foreground px-2.5 py-1 rounded text-xs font-medium capitalize">
                        {lead.intent.replace('-', ' ')}
                      </span>
                    )}
                    {lead.tripId && (
                      <span className="text-xs text-muted-foreground">
                        {tripNameById.get(lead.tripId) || lead.tripId}
                      </span>
                    )}
                  </div>
                  <Link href={`/dashboard/leads/${lead.id}`} className="group">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{lead.name}</h3>
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <span>{lead.phone}</span>
                    {lead.nextActionAt && (
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> {new Date(lead.nextActionAt).toLocaleString()}
                        {lead.nextActionNote ? ` — ${lead.nextActionNote}` : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest", statusBadgeClass(lead.status))}>
                    {lead.status}
                  </span>
                  <Link href={`/dashboard/leads/${lead.id}`} className="text-muted-foreground hover:text-foreground text-sm font-medium flex items-center gap-1">
                    View <ArrowRight size={14} />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeadsList />
    </Suspense>
  );
}
