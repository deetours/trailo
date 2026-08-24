'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { authService } from '@/lib/api/auth/mock/mock-adapter';
import { businessService } from '@/lib/api/business/mock/mock-adapter';
import StepProgress, { REGISTER_STEPS } from '@/components/auth/register/StepProgress';
import VerificationDocumentUploader, { type PendingDocument } from '@/components/verification/VerificationDocumentUploader';
import type { BusinessEntityType } from '@/types/business';

const ENTITY_TYPES: { value: BusinessEntityType; label: string }[] = [
  { value: 'sole-proprietorship', label: 'Sole Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'llp', label: 'LLP' },
  { value: 'private-limited', label: 'Private Limited' },
];

const registerSchema = z.object({
  legalName: z.string().min(2, 'Legal business name is required'),
  displayName: z.string().min(2, 'Display name is required'),
  entityType: z.enum(['sole-proprietorship', 'partnership', 'llp', 'private-limited']),
  addressLine1: z.string().optional(),
  addressCity: z.string().optional(),
  addressState: z.string().optional(),
  addressCountry: z.string().optional(),
  addressPostalCode: z.string().optional(),
  ownerName: z.string().min(2, 'Your name is required'),
  ownerEmail: z.string().email('Enter a valid email address'),
  ownerPhone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  primaryColor: z.string(),
  secondaryColor: z.string(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const STEP_FIELDS: Record<number, (keyof RegisterFormData)[]> = {
  1: ['legalName', 'displayName', 'entityType'],
  2: ['ownerName', 'ownerEmail', 'password'],
  3: [],
  4: ['primaryColor', 'secondaryColor'],
};

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [documents, setDocuments] = useState<PendingDocument[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { primaryColor: '#000000', secondaryColor: '#ffffff' },
  });

  const entityType = watch('entityType');

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    const valid = fields.length === 0 ? true : await trigger(fields);
    if (valid) setStep(s => Math.min(s + 1, REGISTER_STEPS.length));
  };

  const goBack = () => setStep(s => Math.max(s - 1, 1));

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const session = await authService.register({
        ownerName: data.ownerName,
        ownerEmail: data.ownerEmail,
        ownerPhone: data.ownerPhone,
        password: data.password,
        legalName: data.legalName,
        displayName: data.displayName,
        entityType: data.entityType,
        address: data.addressLine1 || data.addressCity ? {
          line1: data.addressLine1,
          city: data.addressCity,
          state: data.addressState,
          country: data.addressCountry,
          postalCode: data.addressPostalCode,
        } : undefined,
      });

      if (documents.length > 0 && session.businessId) {
        await businessService.submitVerificationDocuments(session.businessId, documents);
      }
      if (data.primaryColor !== '#000000' || data.secondaryColor !== '#ffffff') {
        if (session.businessId) {
          await businessService.updateBrandKit(session.businessId, {
            primaryColor: data.primaryColor,
            secondaryColor: data.secondaryColor,
          });
        }
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error registering business:', error);
      setSubmitError('Something went wrong creating your account. Please try again.');
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
          Set up your business, verify your identity, and start publishing trips.
        </p>
      </div>

      <StepProgress current={step} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Legal Business Name</label>
              <input {...register('legalName')} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors" placeholder="Mountain Treks Private Limited" />
              {errors.legalName && <span className="text-destructive text-xs">{errors.legalName.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Display Name</label>
              <input {...register('displayName')} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors" placeholder="Mountain Treks Co" />
              {errors.displayName && <span className="text-destructive text-xs">{errors.displayName.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Entity Type</label>
              <div className="grid grid-cols-2 gap-2">
                {ENTITY_TYPES.map(opt => (
                  <label key={opt.value} className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer text-sm transition-colors ${entityType === opt.value ? 'border-accent bg-accent/5 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                    <input type="radio" value={opt.value} {...register('entityType')} className="accent-accent" />
                    {opt.label}
                  </label>
                ))}
              </div>
              {errors.entityType && <span className="text-destructive text-xs">Select an entity type</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground block">Address Line 1 <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input {...register('addressLine1')} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">City</label>
                <input {...register('addressCity')} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">State</label>
                <input {...register('addressState')} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">Country</label>
                <input {...register('addressCountry')} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">Postal Code</label>
                <input {...register('addressPostalCode')} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Your Full Name</label>
              <input {...register('ownerName')} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors" placeholder="Alex Smith" />
              {errors.ownerName && <span className="text-destructive text-xs">{errors.ownerName.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Email</label>
              <input {...register('ownerEmail')} type="email" className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors" placeholder="you@example.com" />
              {errors.ownerEmail && <span className="text-destructive text-xs">{errors.ownerEmail.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Phone <span className="text-muted-foreground font-normal">(optional)</span></label>
              <input {...register('ownerPhone')} className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Password</label>
              <input {...register('password')} type="password" className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors" placeholder="••••••••" />
              {errors.password && <span className="text-destructive text-xs">{errors.password.message}</span>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload your verification documents now, or skip and submit them later from the verification center. Automated payouts and refunds stay locked until you&apos;re verified.
            </p>
            <VerificationDocumentUploader entityType={entityType} documents={documents} onChange={setDocuments} />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Set your starting brand colors — you can refine your full brand kit later from Business Profile.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" {...register('primaryColor')} className="w-12 h-12 rounded-lg border border-border bg-card cursor-pointer" />
                  <input {...register('primaryColor')} className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors uppercase" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">Secondary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" {...register('secondaryColor')} className="w-12 h-12 rounded-lg border border-border bg-card cursor-pointer" />
                  <input {...register('secondaryColor')} className="flex-1 bg-card border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent transition-colors uppercase" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Business</span><span className="text-foreground font-medium">{watch('displayName') || '—'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Entity type</span><span className="text-foreground font-medium">{ENTITY_TYPES.find(e => e.value === entityType)?.label || '—'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Owner</span><span className="text-foreground font-medium">{watch('ownerName') || '—'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Verification documents</span><span className="text-foreground font-medium">{documents.length > 0 ? `${documents.length} uploaded` : 'Skipped — submit later'}</span></div>
            </div>
            {submitError && <p className="text-destructive text-sm">{submitError}</p>}
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          {step > 1 ? (
            <button type="button" onClick={goBack} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
              <ArrowLeft size={16} /> Back
            </button>
          ) : <span />}

          {step < REGISTER_STEPS.length ? (
            <button
              type="button"
              onClick={goNext}
              className="relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-colors rounded-full outline-none bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-colors rounded-full outline-none bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (<><Loader2 size={16} className="animate-spin" /> Creating account...</>) : 'Create account'}
            </button>
          )}
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground pt-8">
        Already have an account? <Link href="/login" className="text-foreground hover:underline">Log in</Link>
      </p>
    </>
  );
}
