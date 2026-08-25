'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Send } from 'lucide-react';

const enquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(5, 'Add a note about your dates or group size'),
});

type EnquiryData = z.infer<typeof enquirySchema>;

interface TripEnquiryActionProps {
  tripName: string;
  businessName: string;
  tierLabel?: string;
  brandColor: string;
  label: string;
  className?: string;
}

export default function TripEnquiryAction({ tripName, businessName, tierLabel, brandColor, label, className }: TripEnquiryActionProps) {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<EnquiryData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { message: tierLabel ? `I'd like to book the ${tierLabel} option.` : '' },
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const onSubmit = async (data: EnquiryData) => {
    // Mock submission — no booking backend yet, mirrors EnquiryForm's pattern.
    console.log('Trip booking enquiry submitted:', { ...data, tripName, businessName, tierLabel });
    await new Promise((r) => setTimeout(r, 1000));
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} style={{ backgroundColor: brandColor }} className={className}>
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
          <div role="dialog" aria-modal="true" className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {isSubmitSuccessful ? (
              <div className="text-center py-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Request sent</h3>
                <p className="text-muted-foreground text-sm">
                  {businessName} will get back to you shortly about {tripName}
                  {tierLabel ? ` — ${tierLabel}` : ''}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-1">Request to book</h3>
                  <p className="text-sm text-muted-foreground">
                    {tripName}
                    {tierLabel ? ` — ${tierLabel}` : ''}
                  </p>
                </div>

                <div>
                  <input
                    {...register('name')}
                    placeholder="Your name"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                  />
                  {errors.name && <span className="text-destructive text-xs mt-1">{errors.name.message}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      {...register('email')}
                      placeholder="Email"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                    />
                    {errors.email && <span className="text-destructive text-xs mt-1">{errors.email.message}</span>}
                  </div>
                  <div>
                    <input
                      {...register('phone')}
                      placeholder="Phone (optional)"
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    {...register('message')}
                    rows={3}
                    placeholder="Dates, group size, anything else..."
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                  {errors.message && <span className="text-destructive text-xs mt-1">{errors.message.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: brandColor }}
                  className="w-full text-white font-medium py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send request'}
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
