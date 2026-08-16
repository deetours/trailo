'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mountain, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  organization: z.string().min(2, 'Organization name is required'),
  phone: z.string().optional(),
  volume: z.string().min(1, 'Please select your rough trip volume'),
  manualProcesses: z.string().min(10, 'Please describe what you manage manually today (min 10 characters)'),
});

type FormData = z.infer<typeof formSchema>;

export default function DemoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        console.error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col font-sans">
      
      {/* Header */}
      <header className="p-6 md:p-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-white text-black p-1.5 rounded flex items-center justify-center group-hover:bg-[#ccc] transition-colors">
            <Mountain size={20} strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">Trailo</span>
        </Link>

        <Link href="/" className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to site
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 pb-20">
        <div className="w-full max-w-xl">
          
          <div className="mb-12 text-center md:text-left">
            <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tighter text-white mb-4">
              See Trailo in Action
            </h1>
            <p className="text-[#888] text-lg">
              Tell us a bit about your operation. We'll show you exactly how Trailo can automate your specific workflow.
            </p>
          </div>

          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#111] border border-[#222] p-8 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Request Received</h2>
              <p className="text-[#888] mb-8">
                Thanks for reaching out! We'll review your details and get back to you within 24 hours to schedule your personalized demo.
              </p>
              <MagneticButton href="/" variant="secondary" className="w-full">
                Return to Homepage
              </MagneticButton>
            </motion.div>
          ) : (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-6"
            >
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ccc] block">Full Name *</label>
                  <input 
                    {...register('name')}
                    className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2A8AF6] focus:ring-1 focus:ring-[#2A8AF6] transition-colors"
                    placeholder="Alex Smith"
                  />
                  {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ccc] block">Work Email *</label>
                  <input 
                    {...register('email')}
                    type="email"
                    className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2A8AF6] focus:ring-1 focus:ring-[#2A8AF6] transition-colors"
                    placeholder="alex@example.com"
                  />
                  {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ccc] block">Organization *</label>
                  <input 
                    {...register('organization')}
                    className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2A8AF6] focus:ring-1 focus:ring-[#2A8AF6] transition-colors"
                    placeholder="Trek Co."
                  />
                  {errors.organization && <span className="text-red-500 text-xs">{errors.organization.message}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#ccc] block">Phone (Optional)</label>
                  <input 
                    {...register('phone')}
                    className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2A8AF6] focus:ring-1 focus:ring-[#2A8AF6] transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#ccc] block">Trip Volume / Team Size *</label>
                <select 
                  {...register('volume')}
                  className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2A8AF6] focus:ring-1 focus:ring-[#2A8AF6] transition-colors appearance-none"
                >
                  <option value="">Select an option...</option>
                  <option value="1-5">1-5 trips/month (Just starting out)</option>
                  <option value="6-20">6-20 trips/month (Growing fast)</option>
                  <option value="21-50">21-50 trips/month (Established)</option>
                  <option value="50+">50+ trips/month (Enterprise)</option>
                </select>
                {errors.volume && <span className="text-red-500 text-xs">{errors.volume.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#ccc] block">What are you managing manually today? *</label>
                <textarea 
                  {...register('manualProcesses')}
                  className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2A8AF6] focus:ring-1 focus:ring-[#2A8AF6] transition-colors min-h-[120px] resize-y"
                  placeholder="e.g. We spend hours tracking payments in spreadsheets and replying to the same WhatsApp questions..."
                ></textarea>
                {errors.manualProcesses && <span className="text-red-500 text-xs">{errors.manualProcesses.message}</span>}
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full relative inline-flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors rounded-full outline-none group overflow-hidden bg-white text-black hover:bg-[#eaeaea] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Request Demo'
                    )}
                  </span>
                </button>
              </div>

            </motion.form>
          )}

        </div>
      </div>
    </main>
  );
}
