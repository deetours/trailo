'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/auth/mock/mock-adapter';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  businessName: z.string().min(2, 'Business Name must be at least 2 characters'),
});

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    setIsSubmitting(true);
    try {
      await authService.register(data);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing up:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tighter text-foreground mb-3">
          Register your business
        </h1>
        <p className="text-muted-foreground">
          Create beautiful landing pages for your trips.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Full Name</label>
            <input 
              {...register('name')}
              type="text"
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
              placeholder="Alex Smith"
            />
            {errors.name && <span className="text-destructive text-xs">{errors.name.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Business Name</label>
            <input 
              {...register('businessName')}
              type="text"
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
              placeholder="Mountain Treks Co"
            />
            {errors.businessName && <span className="text-destructive text-xs">{errors.businessName.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Email</label>
            <input 
              {...register('email')}
              type="email"
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
              placeholder="you@example.com"
            />
            {errors.email && <span className="text-destructive text-xs">{errors.email.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Password</label>
            <input 
              {...register('password')}
              type="password"
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors"
              placeholder="••••••••"
            />
            {errors.password && <span className="text-destructive text-xs">{errors.password.message}</span>}
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full relative inline-flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors rounded-full outline-none bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Register'
                )}
              </span>
            </button>
          </div>
        </form>
        
        <p className="text-center text-sm text-muted-foreground pt-4">
          Already have an account? <Link href="/login" className="text-foreground hover:underline">Log in</Link>
        </p>
      </motion.div>
    </>
  );
}
