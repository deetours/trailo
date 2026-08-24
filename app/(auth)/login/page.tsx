'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/api/auth/mock/mock-adapter';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginData = z.infer<typeof loginSchema>;

function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setIsSubmitting(true);
    try {
      await authService.login(data);
      const next = searchParams.get('next') || '/dashboard';
      router.push(next);
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tighter text-foreground mb-3">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Sign in to manage your trips.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <button 
          disabled
          className="w-full relative inline-flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors rounded-lg outline-none bg-card border border-border text-muted-foreground cursor-not-allowed"
          title="Coming soon"
        >
          Continue with Girivah (Coming Soon)
        </button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase tracking-widest">Or</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground block">Password</label>
              <a href="#" className="text-xs text-accent hover:underline">Forgot?</a>
            </div>
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
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </span>
            </button>
          </div>
        </form>
        
        <p className="text-center text-sm text-muted-foreground pt-4">
          Don&apos;t have an account? <Link href="/register" className="text-foreground hover:underline">Register your business</Link>
        </p>
      </motion.div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
