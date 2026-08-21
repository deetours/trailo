'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mountain, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignupData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupData) => {
    setIsSubmitting(true);
    try {
      // Mock signup for now, redirect to dashboard
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing up:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col font-sans">
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

      <div className="flex-1 flex items-center justify-center p-6 pb-20">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tighter text-white mb-3">
              Create an account
            </h1>
            <p className="text-[#888]">
              Plan your next journey with Trailo.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#ccc] block">Full Name</label>
                <input 
                  {...register('name')}
                  type="text"
                  className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2A8AF6] focus:ring-1 focus:ring-[#2A8AF6] transition-colors"
                  placeholder="Alex Smith"
                />
                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#ccc] block">Email</label>
                <input 
                  {...register('email')}
                  type="email"
                  className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2A8AF6] focus:ring-1 focus:ring-[#2A8AF6] transition-colors"
                  placeholder="you@example.com"
                />
                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#ccc] block">Password</label>
                <input 
                  {...register('password')}
                  type="password"
                  className="w-full bg-[#111] border border-[#222] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2A8AF6] focus:ring-1 focus:ring-[#2A8AF6] transition-colors"
                  placeholder="••••••••"
                />
                {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full relative inline-flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors rounded-full outline-none bg-white text-black hover:bg-[#eaeaea] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Sign Up'
                    )}
                  </span>
                </button>
              </div>
            </form>
            
            <p className="text-center text-sm text-[#888] pt-4">
              Already have an account? <Link href="/login" className="text-white hover:underline">Log in</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
