'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, Clock, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';
import Card from '@/components/Card';
import MagneticButton from '@/components/MagneticButton';
import { useLead } from '@/lib/api/leads/hooks/useLead';
import { useTrip } from '@/lib/api/trips/hooks/useTrip';
import type { LeadStatus } from '@/types/lead';
import type { Customer } from '@/types/customer';
import { cn } from '@/lib/cn';

const STATUS_OPTIONS: LeadStatus[] = ['new', 'contacted', 'qualified', 'negotiating', 'converted', 'lost'];

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

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lead, isLoading, updateStatus, addNote, convert } = useLead(id);
  const { trip } = useTrip(lead?.tripId || '');

  const [noteText, setNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedCustomer, setConvertedCustomer] = useState<Customer | null>(null);
  const [convertError, setConvertError] = useState<string | null>(null);

  if (isLoading) {
    return <div className="p-10 text-center text-muted-foreground">Loading lead...</div>;
  }

  if (!lead) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Lead not found. <Link href="/dashboard/leads" className="text-accent hover:underline">Back to leads</Link>
      </div>
    );
  }

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setIsSavingNote(true);
    await addNote(noteText.trim());
    setNoteText('');
    setIsSavingNote(false);
  };

  const handleConvert = async () => {
    setIsConverting(true);
    setConvertError(null);
    try {
      const { customer } = await convert();
      setConvertedCustomer(customer);
    } catch (err) {
      setConvertError(err instanceof Error ? err.message : 'Failed to convert lead');
    } finally {
      setIsConverting(false);
    }
  };

  const sortedTimeline = [...lead.timeline].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/leads" className="p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground tracking-tight">{lead.name}</h1>
          <p className="text-muted-foreground text-sm capitalize">{lead.source.replace('-', ' ')} lead</p>
        </div>
        <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest", statusBadgeClass(lead.status))}>
          {lead.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-foreground">Contact</h3>
            <div className="flex items-center gap-3 text-foreground">
              <Phone size={16} className="text-muted-foreground" />
              <span>{lead.phone}</span>
            </div>
            {lead.email && (
              <div className="flex items-center gap-3 text-foreground">
                <Mail size={16} className="text-muted-foreground" />
                <span>{lead.email}</span>
              </div>
            )}
            {(lead.tripId || lead.departureId) && (
              <div className="pt-2 border-t border-border space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Interested in</span>
                {lead.tripId && (
                  <p className="text-foreground">{trip?.basicInfo?.name || lead.tripId}</p>
                )}
                {lead.departureId && (
                  <p className="text-sm text-muted-foreground">Departure: {lead.departureId}</p>
                )}
              </div>
            )}
            {lead.intent && (
              <div className="pt-2 border-t border-border">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Intent</span>
                <span className="text-foreground capitalize">{lead.intent.replace('-', ' ')}</span>
              </div>
            )}
            {lead.nextActionAt && (
              <div className="pt-2 border-t border-border flex items-start gap-3">
                <Clock size={16} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-foreground text-sm font-medium">{new Date(lead.nextActionAt).toLocaleString()}</p>
                  {lead.nextActionNote && <p className="text-muted-foreground text-sm">{lead.nextActionNote}</p>}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-foreground">Timeline</h3>
            <div className="space-y-4">
              {sortedTimeline.map(event => (
                <div key={event.id} className="flex gap-3">
                  <MessageSquare size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-border space-y-2">
              <label className="text-sm font-medium text-foreground block">Add note</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                placeholder="Log a call, message, or update..."
              />
              <MagneticButton onClick={handleAddNote} variant="secondary" className="py-2 px-5" disabled={isSavingNote || !noteText.trim()}>
                {isSavingNote ? 'Saving...' : 'Add note'}
              </MagneticButton>
            </div>
          </Card>
        </div>

        {/* Right column: actions */}
        <div className="space-y-6">
          <Card className="p-6 space-y-3">
            <h3 className="font-bold text-foreground">Status</h3>
            <select
              value={lead.status}
              onChange={(e) => updateStatus(e.target.value as LeadStatus)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent capitalize"
              disabled={lead.status === 'converted'}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="font-bold text-foreground">Actions</h3>
            <MagneticButton
              href={`/dashboard/bookings/new?leadId=${lead.id}`}
              variant="primary"
              className="py-2 px-5 w-full justify-center"
            >
              Start booking <ArrowRight size={14} />
            </MagneticButton>

            {lead.customerId || convertedCustomer ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-foreground font-medium">Converted to customer</p>
                  <Link
                    href={`/dashboard/customers/${convertedCustomer?.id || lead.customerId}`}
                    className="text-sm text-accent hover:underline"
                  >
                    View customer profile
                  </Link>
                </div>
              </div>
            ) : (
              <MagneticButton
                onClick={handleConvert}
                variant="outline"
                className="py-2 px-5 w-full justify-center"
                disabled={isConverting}
              >
                {isConverting ? 'Converting...' : 'Convert to customer'}
              </MagneticButton>
            )}
            {convertError && <p className="text-sm text-destructive">{convertError}</p>}
          </Card>
        </div>
      </div>
    </div>
  );
}
