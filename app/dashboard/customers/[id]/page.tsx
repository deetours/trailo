'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MessageSquare, Briefcase, CreditCard } from 'lucide-react';
import Card from '@/components/Card';
import MagneticButton from '@/components/MagneticButton';
import { useCustomer } from '@/lib/api/customers/hooks/useCustomer';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { customer, isLoading, addNote, updateCustomer } = useCustomer(id);

  const [preferences, setPreferences] = useState('');
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    setPreferences(customer?.preferences || '');
  }, [customer?.preferences]);

  if (isLoading) {
    return <div className="p-10 text-center text-muted-foreground">Loading customer...</div>;
  }

  if (!customer) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Customer not found. <Link href="/dashboard/customers" className="text-accent hover:underline">Back to customers</Link>
      </div>
    );
  }

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);
    await updateCustomer({ preferences });
    setIsSavingPreferences(false);
    setPreferencesSaved(true);
    setTimeout(() => setPreferencesSaved(false), 2000);
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setIsSavingNote(true);
    await addNote(noteText.trim());
    setNoteText('');
    setIsSavingNote(false);
  };

  const sortedNotes = [...customer.notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/customers" className="p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground tracking-tight">{customer.name}</h1>
          <p className="text-muted-foreground text-sm">Customer since {new Date(customer.createdAt).toLocaleDateString()}</p>
        </div>
        {customer.leadId && (
          <Link href={`/dashboard/leads/${customer.leadId}`} className="text-sm text-accent hover:underline shrink-0">
            View original lead
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-foreground">Contact</h3>
            <div className="flex items-center gap-3 text-foreground">
              <Phone size={16} className="text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
            {customer.email && (
              <div className="flex items-center gap-3 text-foreground">
                <Mail size={16} className="text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="font-bold text-foreground">Preferences</h3>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              rows={3}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
              placeholder="Dietary needs, travel style, past trips, budget preferences..."
            />
            <div className="flex items-center gap-4">
              <MagneticButton onClick={handleSavePreferences} variant="secondary" className="py-2 px-5" disabled={isSavingPreferences}>
                {isSavingPreferences ? 'Saving...' : 'Save preferences'}
              </MagneticButton>
              {preferencesSaved && <span className="text-sm text-green-500 font-medium">Saved</span>}
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-foreground">Notes</h3>
            <div className="space-y-4">
              {sortedNotes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notes yet.</p>
              ) : (
                sortedNotes.map(note => (
                  <div key={note.id} className="flex gap-3">
                    <MessageSquare size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-foreground">{note.text}</p>
                      <p className="text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="pt-4 border-t border-border space-y-2">
              <label className="text-sm font-medium text-foreground block">Add note</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                placeholder="Log a call, preference, or follow-up..."
              />
              <MagneticButton onClick={handleAddNote} variant="secondary" className="py-2 px-5" disabled={isSavingNote || !noteText.trim()}>
                {isSavingNote ? 'Saving...' : 'Add note'}
              </MagneticButton>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase size={16} />
              <h3 className="font-bold text-foreground">Bookings</h3>
            </div>
            <p className="text-sm text-muted-foreground">No bookings yet.</p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard size={16} />
              <h3 className="font-bold text-foreground">Payments</h3>
            </div>
            <p className="text-sm text-muted-foreground">No payments yet.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
