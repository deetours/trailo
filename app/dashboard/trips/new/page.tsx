'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Loader2, MapPin, Calendar, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

const newTripSchema = z.object({
  name: z.string().min(2, 'Give your trip a name'),
  type: z.enum(['road', 'trek'], { message: 'Select a trip type' }),
  destination: z.string().min(2, 'Where are you going?'),
  startDate: z.string().optional(),
});

type NewTripData = z.infer<typeof newTripSchema>;

export default function NewTripPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewTripData>({
    resolver: zodResolver(newTripSchema),
    defaultValues: {
      type: 'road'
    }
  });

  const tripType = watch('type');

  const onSubmit = async (data: NewTripData) => {
    setIsSubmitting(true);
    try {
      // Mock creation — no backend yet, so return to the trips list rather than
      // a workspace URL that can't resolve to a real trip.
      await new Promise(resolve => setTimeout(resolve, 800));
      router.push('/dashboard/trips');
    } catch (error) {
      console.error('Error creating trip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <Link href="/dashboard/trips" className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Trips
        </Link>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight">
          Plan a new journey
        </h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Name */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[#ccc] block">What are we calling this trip?</label>
          <input 
            {...register('name')}
            className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2A8AF6] transition-colors text-lg"
            placeholder="e.g. Pacific Coast Highway"
            autoFocus
          />
          {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
        </div>

        {/* Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[#ccc] block">Mode of travel</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setValue('type', 'road')}
              className={`p-4 rounded-xl border text-left transition-all ${
                tripType === 'road' 
                  ? 'bg-[#2A8AF6]/10 border-[#2A8AF6] ring-1 ring-[#2A8AF6]' 
                  : 'bg-[#111] border-[#222] hover:border-[#444]'
              }`}
            >
              <div className="font-bold text-white mb-1">Road Trip</div>
              <div className="text-xs text-[#888]">Drive, ride, convoy</div>
            </button>
            <button
              type="button"
              onClick={() => setValue('type', 'trek')}
              className={`p-4 rounded-xl border text-left transition-all ${
                tripType === 'trek' 
                  ? 'bg-[#2A8AF6]/10 border-[#2A8AF6] ring-1 ring-[#2A8AF6]' 
                  : 'bg-[#111] border-[#222] hover:border-[#444]'
              }`}
            >
              <div className="font-bold text-white mb-1">Trek</div>
              <div className="text-xs text-[#888]">Hike, climb, camp</div>
            </button>
          </div>
          {errors.type && <span className="text-red-500 text-xs">{errors.type.message}</span>}
        </div>

        {/* Destination */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[#ccc] block">Primary destination or region</label>
          <div className="relative">
            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" />
            <input 
              {...register('destination')}
              className="w-full bg-[#111] border border-[#222] rounded-lg pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#2A8AF6] transition-colors"
              placeholder="e.g. California, USA"
            />
          </div>
          {errors.destination && <span className="text-red-500 text-xs">{errors.destination.message}</span>}
        </div>

        {/* Dates */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#ccc] block">When are you going?</label>
            <span className="text-xs text-[#666]">Optional for now</span>
          </div>
          <div className="relative">
            <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" />
            <input 
              {...register('startDate')}
              type="date"
              className="w-full bg-[#111] border border-[#222] rounded-lg pl-11 pr-4 py-3 text-[#888] focus:outline-none focus:border-[#2A8AF6] transition-colors"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-[#222] flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="relative inline-flex items-center justify-center px-8 py-3 text-sm font-medium transition-colors rounded-full outline-none bg-white text-black hover:bg-[#eaeaea] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Trip Workspace'
              )}
            </span>
          </button>
        </div>

      </form>
    </div>
  );
}
