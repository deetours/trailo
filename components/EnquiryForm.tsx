'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm as useRHForm } from 'react-hook-form';

const enquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Please provide more details'),
  referenceId: z.string().optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

interface EnquiryFormProps {
  referenceId?: string;
  context?: string;
}

export default function EnquiryForm({ referenceId, context = 'General Enquiry' }: EnquiryFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = useRHForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { referenceId }
  });

  const onSubmit = async (data: EnquiryFormData) => {
    // Phase 1: Mock submission (would go to WhatsApp/Email API later)
    console.log('Form submitted:', data, 'Context:', context);
    await new Promise(r => setTimeout(r, 1000)); 
  };

  if (isSubmitSuccessful) {
    return (
      <div className="bg-card border border-success/30 p-8 rounded-2xl text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">Message sent</h3>
        <p className="text-muted-foreground">Thanks — we usually reply within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card border border-border p-6 rounded-2xl">
      <div>
        <h3 className="font-display font-bold text-2xl text-foreground mb-2">{context}</h3>
        <p className="text-muted-foreground text-sm">Tell us about your business and what you need — we&apos;ll get back to you with next steps.</p>
      </div>

      <div className="space-y-4">
        <div>
          <input
            {...register('name')}
            placeholder="Your Name"
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
          />
          {errors.name && <span className="text-destructive text-xs mt-1">{errors.name.message}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              {...register('email')}
              placeholder="Email Address"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
            />
            {errors.email && <span className="text-destructive text-xs mt-1">{errors.email.message}</span>}
          </div>
          <div>
            <input
              {...register('phone')}
              placeholder="Phone Number (Optional)"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        <div>
          <textarea
            {...register('message')}
            placeholder="Tell us about your business and what you're looking to do on Trailo..."
            rows={4}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors resize-none"
          />
          {errors.message && <span className="text-destructive text-xs mt-1">{errors.message.message}</span>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm py-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Send Enquiry'}
        <Send size={16} />
      </button>
    </form>
  );
}
