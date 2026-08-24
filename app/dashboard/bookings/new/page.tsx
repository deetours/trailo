'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, CheckCircle2 } from 'lucide-react';
import Card from '@/components/Card';
import MagneticButton from '@/components/MagneticButton';
import { useSession } from '@/lib/api/auth/hooks/useSession';
import { useLead } from '@/lib/api/leads/hooks/useLead';
import { useTrip } from '@/lib/api/trips/hooks/useTrip';
import { useTrips } from '@/lib/api/trips/hooks/useTrips';
import { useDepartures } from '@/lib/api/departures/hooks/useDepartures';
import { useCustomers } from '@/lib/api/customers/hooks/useCustomers';
import { customersService } from '@/lib/api/customers/mock/mock-adapter';
import { bookingsService } from '@/lib/api/bookings/mock/mock-adapter';
import { cn } from '@/lib/cn';

function NewBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useSession();
  const businessId = session?.businessId || '';

  const leadId = searchParams.get('leadId') || '';
  const { lead, isLoading: leadLoading } = useLead(leadId);

  const leadHasTrip = !!lead?.tripId;
  const leadHasDeparture = !!lead?.departureId;
  const leadHasCustomer = !!lead?.customerId;

  const [tripId, setTripId] = useState('');
  const [departureId, setDepartureId] = useState('');

  // Once the lead loads, lock the trip/departure it already points at.
  useEffect(() => {
    if (lead?.tripId) setTripId(lead.tripId);
    if (lead?.departureId) setDepartureId(lead.departureId);
  }, [lead?.tripId, lead?.departureId]);

  const { result: tripsResult } = useTrips(businessId, { pageSize: 200 });
  const { trip: lockedTrip } = useTrip(tripId || '');
  const { departures } = useDepartures(tripId || '');

  const selectedDeparture = departures.find(d => d.id === departureId);

  // Customer step
  const { customers } = useCustomers(businessId);
  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('existing');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase();
    return customers.filter(c => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q));
  }, [customers, customerSearch]);

  // Booking details
  const [paxCount, setPaxCount] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAmountTouched, setTotalAmountTouched] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currency = lockedTrip?.pricing?.currency || 'INR';

  // Suggest a sensible default total amount from the departure override or
  // the trip's base price, unless the user has already typed their own value.
  useEffect(() => {
    if (totalAmountTouched) return;
    const unitPrice = selectedDeparture?.priceOverride ?? lockedTrip?.pricing?.basePrice ?? 0;
    setTotalAmount(unitPrice * paxCount);
  }, [selectedDeparture, lockedTrip, paxCount, totalAmountTouched]);

  if (leadId && leadLoading) {
    return <div className="p-10 text-center text-muted-foreground">Loading lead...</div>;
  }

  const customerReady = leadHasCustomer || (customerMode === 'existing' ? !!selectedCustomerId : newCustomerName.trim() && newCustomerPhone.trim());
  const canSubmit = !!tripId && !!departureId && !!customerReady && paxCount > 0 && totalAmount >= 0 && !isSubmitting;

  const handleSubmit = async () => {
    if (!businessId || !tripId || !departureId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      let customerId = lead?.customerId;

      if (!customerId) {
        if (customerMode === 'existing') {
          customerId = selectedCustomerId;
        } else {
          const customer = await customersService.findOrCreateByPhone(
            businessId,
            { name: newCustomerName.trim(), phone: newCustomerPhone.trim(), email: newCustomerEmail.trim() || undefined },
            lead?.id
          );
          customerId = customer.id;
        }
      }

      if (!customerId) {
        setError('Select or create a customer first.');
        setIsSubmitting(false);
        return;
      }

      const booking = await bookingsService.createBooking(businessId, {
        tripId,
        departureId,
        customerId,
        leadId: lead?.id,
        paxCount,
        totalAmount,
        currency,
        notes: notes.trim() || undefined,
      });

      router.push(`/dashboard/bookings/${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <Link href={leadId ? `/dashboard/leads/${leadId}` : '/dashboard/bookings'} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight">
          New booking
        </h1>
        {lead && <p className="text-muted-foreground mt-2">For lead: {lead.name} ({lead.phone})</p>}
      </header>

      {/* Trip */}
      <Card className="p-6 space-y-4">
        <h3 className="font-bold text-foreground">Trip</h3>
        {leadHasTrip ? (
          <p className="text-foreground">{lockedTrip?.basicInfo?.name || tripId}</p>
        ) : (
          <select
            value={tripId}
            onChange={(e) => { setTripId(e.target.value); setDepartureId(''); }}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
          >
            <option value="">Select a trip...</option>
            {tripsResult.items.map(t => (
              <option key={t.id} value={t.id}>{t.basicInfo.name}</option>
            ))}
          </select>
        )}
      </Card>

      {/* Departure */}
      {tripId && (
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-foreground">Departure</h3>
          {leadHasDeparture ? (
            <p className="text-foreground">
              {selectedDeparture ? `${new Date(selectedDeparture.startDate).toLocaleDateString()} — ${new Date(selectedDeparture.endDate).toLocaleDateString()}` : departureId}
            </p>
          ) : (
            <select
              value={departureId}
              onChange={(e) => { setDepartureId(e.target.value); setTotalAmountTouched(false); }}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
            >
              <option value="">Select a departure...</option>
              {departures.map(d => (
                <option key={d.id} value={d.id}>
                  {new Date(d.startDate).toLocaleDateString()} — {d.booked}/{d.capacity} booked
                </option>
              ))}
            </select>
          )}
        </Card>
      )}

      {/* Customer */}
      <Card className="p-6 space-y-4">
        <h3 className="font-bold text-foreground">Customer</h3>
        {leadHasCustomer ? (
          <div className="flex items-center gap-2 text-foreground">
            <CheckCircle2 size={16} className="text-green-500" />
            <span>Using customer already linked to this lead.</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCustomerMode('existing')}
                className={cn('flex-1 py-2 rounded-lg border text-sm font-medium transition-colors', customerMode === 'existing' ? 'bg-accent/10 border-accent text-accent' : 'bg-background border-border text-muted-foreground hover:text-foreground')}
              >
                Existing customer
              </button>
              <button
                type="button"
                onClick={() => setCustomerMode('new')}
                className={cn('flex-1 py-2 rounded-lg border text-sm font-medium transition-colors', customerMode === 'new' ? 'bg-accent/10 border-accent text-accent' : 'bg-background border-border text-muted-foreground hover:text-foreground')}
              >
                New customer
              </button>
            </div>

            {customerMode === 'existing' ? (
              <div className="space-y-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-accent w-full"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredCustomers.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCustomerId(c.id)}
                      className={cn(
                        'w-full text-left px-4 py-2 rounded-lg border text-sm transition-colors',
                        selectedCustomerId === c.id ? 'bg-accent/10 border-accent text-foreground' : 'bg-background border-border text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <span className="font-medium text-foreground">{c.name}</span>
                      <span className="text-muted-foreground"> — {c.phone}</span>
                    </button>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <p className="text-sm text-muted-foreground px-2 py-1">No customers found.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full name"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={newCustomerEmail}
                  onChange={(e) => setNewCustomerEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Booking details */}
      <Card className="p-6 space-y-4">
        <h3 className="font-bold text-foreground">Booking details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Pax count</label>
            <input
              type="number"
              min={1}
              value={paxCount}
              onChange={(e) => { setPaxCount(Math.max(1, parseInt(e.target.value, 10) || 1)); setTotalAmountTouched(false); }}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Total amount ({currency})</label>
            <input
              type="number"
              min={0}
              value={totalAmount}
              onChange={(e) => { setTotalAmount(parseFloat(e.target.value) || 0); setTotalAmountTouched(true); }}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent"
          />
        </div>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="pt-2 flex justify-end">
        <MagneticButton onClick={handleSubmit} variant="primary" className="py-3 px-8" disabled={!canSubmit}>
          {isSubmitting ? 'Creating...' : 'Create booking'}
        </MagneticButton>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewBookingForm />
    </Suspense>
  );
}
