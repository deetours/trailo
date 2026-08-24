'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, CalendarDays, Receipt, RotateCcw, XCircle, CheckCircle2 } from 'lucide-react';
import Card from '@/components/Card';
import MagneticButton from '@/components/MagneticButton';
import { useBooking } from '@/lib/api/bookings/hooks/useBooking';
import { useBookingPayments } from '@/lib/api/payments/hooks/useBookingPayments';
import { useTrip } from '@/lib/api/trips/hooks/useTrip';
import { useCustomer } from '@/lib/api/customers/hooks/useCustomer';
import { useDepartures } from '@/lib/api/departures/hooks/useDepartures';
import { useSession } from '@/lib/api/auth/hooks/useSession';
import type { BookingStatus } from '@/types/booking';
import type { Payment, PaymentType } from '@/types/payment';
import { cn } from '@/lib/cn';

function statusBadgeClass(status: BookingStatus) {
  switch (status) {
    case 'confirmed':
      return 'bg-green-500/10 text-green-500 border border-green-500/20';
    case 'completed':
      return 'bg-muted text-muted-foreground border border-border';
    case 'cancelled':
      return 'bg-destructive/10 text-destructive border border-destructive/20';
    case 'pending-payment':
      return 'bg-accent/10 text-accent border border-accent/20';
    default:
      return 'bg-muted text-muted-foreground border border-border';
  }
}

function paymentStatusBadgeClass(status: Payment['status']) {
  switch (status) {
    case 'paid':
      return 'bg-green-500/10 text-green-500 border border-green-500/20';
    case 'failed':
      return 'bg-destructive/10 text-destructive border border-destructive/20';
    case 'refunded':
    case 'partially-refunded':
      return 'bg-accent/10 text-accent border border-accent/20';
    default:
      return 'bg-muted text-muted-foreground border border-border';
  }
}

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`;
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { session } = useSession();
  const { booking, isLoading, updateStatus } = useBooking(id);
  const { payments, isLoading: paymentsLoading, createPaymentLink, markPaid, refund } = useBookingPayments(id);
  const { trip } = useTrip(booking?.tripId || '');
  const { customer } = useCustomer(booking?.customerId || '');
  const { departures } = useDepartures(booking?.tripId || '');
  const departure = departures.find(d => d.id === booking?.departureId);

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState<PaymentType>('deposit');
  const [isRequesting, setIsRequesting] = useState(false);

  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);

  const [actionError, setActionError] = useState<string | null>(null);

  if (isLoading) {
    return <div className="p-10 text-center text-muted-foreground">Loading booking...</div>;
  }

  if (!booking) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Booking not found. <Link href="/dashboard/bookings" className="text-accent hover:underline">Back to bookings</Link>
      </div>
    );
  }

  const paidProgress = booking.totalAmount > 0 ? Math.min(100, (booking.amountPaid / booking.totalAmount) * 100) : 0;

  const handleRequestPayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0 || !session?.businessId) return;
    setIsRequesting(true);
    setActionError(null);
    try {
      await createPaymentLink(session.businessId, { amount, currency: booking.currency, type: paymentType });
      setPaymentAmount('');
      setShowPaymentForm(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to request payment');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleMarkPaid = async (paymentId: string) => {
    setActionError(null);
    try {
      await markPaid(paymentId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to mark payment as paid');
    }
  };

  const handleRefund = async (paymentId: string) => {
    const amount = parseFloat(refundAmount);
    if (!amount || amount <= 0) return;
    setIsRefunding(true);
    setActionError(null);
    try {
      await refund(paymentId, amount);
      setRefundingId(null);
      setRefundAmount('');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to refund payment');
    } finally {
      setIsRefunding(false);
    }
  };

  const canCancel = booking.status !== 'cancelled' && booking.status !== 'completed';
  const canComplete = booking.status !== 'completed' && booking.status !== 'cancelled';

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/bookings" className="p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground tracking-tight">
            {trip?.basicInfo?.name || 'Booking'}
          </h1>
          <p className="text-muted-foreground text-sm">{customer?.name || 'Customer'}</p>
        </div>
        <span className={cn('px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest', statusBadgeClass(booking.status))}>
          {booking.status.replace('-', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: details + transactions */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-foreground">Trip &amp; departure</h3>
            {trip && (
              <Link href={`/dashboard/trips/${trip.id}`} className="text-accent hover:underline block">
                {trip.basicInfo.name}
              </Link>
            )}
            {departure && (
              <div className="flex items-center gap-3 text-foreground text-sm">
                <CalendarDays size={16} className="text-muted-foreground" />
                <span>
                  {new Date(departure.startDate).toLocaleDateString()} — {new Date(departure.endDate).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3 text-foreground text-sm">
              <Users size={16} className="text-muted-foreground" />
              <span>{booking.paxCount} pax</span>
            </div>
            {customer && (
              <div className="pt-2 border-t border-border">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Customer</span>
                <Link href={`/dashboard/customers/${customer.id}`} className="text-accent hover:underline">
                  {customer.name}
                </Link>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              </div>
            )}
            {booking.notes && (
              <div className="pt-2 border-t border-border">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Notes</span>
                <p className="text-sm text-foreground">{booking.notes}</p>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Receipt size={16} /> Transaction history
              </h3>
              <MagneticButton
                onClick={() => setShowPaymentForm(v => !v)}
                variant="outline"
                className="py-1.5 px-4 text-xs"
              >
                Request payment
              </MagneticButton>
            </div>

            {showPaymentForm && (
              <div className="bg-background border border-border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground block">Amount ({booking.currency})</label>
                    <input
                      type="number"
                      min={0}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground block">Type</label>
                    <select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:border-accent capitalize"
                    >
                      <option value="deposit">Deposit</option>
                      <option value="balance">Balance</option>
                      <option value="full">Full</option>
                    </select>
                  </div>
                </div>
                <MagneticButton onClick={handleRequestPayment} variant="primary" className="py-2 px-4 text-xs" disabled={isRequesting || !paymentAmount}>
                  {isRequesting ? 'Generating link...' : 'Generate payment link'}
                </MagneticButton>
              </div>
            )}

            <div className="space-y-3">
              {paymentsLoading ? (
                <p className="text-sm text-muted-foreground">Loading transactions...</p>
              ) : payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payments requested yet.</p>
              ) : (
                payments.map(payment => (
                  <div key={payment.id} className="border border-border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-foreground capitalize">{payment.type}</span>
                        <span className="text-muted-foreground text-sm ml-2">{formatMoney(payment.amount, payment.currency)}</span>
                      </div>
                      <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider', paymentStatusBadgeClass(payment.status))}>
                        {payment.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(payment.createdAt).toLocaleString()}
                      {payment.paidAt && ` · Paid ${new Date(payment.paidAt).toLocaleString()}`}
                    </p>
                    {payment.linkUrl && payment.status === 'pending' && (
                      <p className="text-xs text-muted-foreground break-all">Link: {payment.linkUrl}</p>
                    )}

                    {payment.status === 'pending' && (
                      <button
                        onClick={() => handleMarkPaid(payment.id)}
                        className="text-xs font-medium px-3 py-1.5 rounded bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500/20 transition-colors"
                      >
                        Mark as paid (demo)
                      </button>
                    )}

                    {payment.status === 'paid' && (
                      refundingId === payment.id ? (
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="number"
                            min={0}
                            max={payment.amount}
                            placeholder="Amount"
                            value={refundAmount}
                            onChange={(e) => setRefundAmount(e.target.value)}
                            className="bg-background border border-border rounded-lg px-3 py-1.5 text-foreground text-xs w-28 focus:outline-none focus:border-accent"
                          />
                          <button
                            onClick={() => handleRefund(payment.id)}
                            disabled={isRefunding || !refundAmount}
                            className="text-xs font-medium px-3 py-1.5 rounded bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
                          >
                            {isRefunding ? 'Refunding...' : 'Confirm refund'}
                          </button>
                          <button
                            onClick={() => { setRefundingId(null); setRefundAmount(''); }}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setRefundingId(payment.id); setRefundAmount(String(payment.amount)); }}
                          className="text-xs font-medium px-3 py-1.5 rounded bg-background border border-border text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                        >
                          <RotateCcw size={12} /> Refund
                        </button>
                      )
                    )}
                  </div>
                ))
              )}
            </div>

            {actionError && <p className="text-sm text-destructive">{actionError}</p>}
          </Card>
        </div>

        {/* Right column: payment progress + status controls */}
        <div className="space-y-6">
          <Card className="p-6 space-y-3">
            <h3 className="font-bold text-foreground">Payment</h3>
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-lg font-bold text-foreground">{formatMoney(booking.amountPaid, booking.currency)}</span>
                <span className="text-sm text-muted-foreground">of {formatMoney(booking.totalAmount, booking.currency)}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${paidProgress}%` }} />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="font-bold text-foreground">Status</h3>
            <p className="text-xs text-muted-foreground">
              Confirmation happens automatically once a deposit is paid. Manual controls are limited to cancelling or marking the trip completed.
            </p>
            <div className="space-y-2 pt-2">
              {canComplete && (
                <button
                  onClick={() => updateStatus('completed')}
                  className="w-full text-sm font-medium px-3 py-2 rounded-lg bg-background border border-border text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={14} /> Mark completed
                </button>
              )}
              {canCancel && (
                <button
                  onClick={() => updateStatus('cancelled')}
                  className="w-full text-sm font-medium px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle size={14} /> Cancel booking
                </button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
