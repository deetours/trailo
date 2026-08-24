'use client';

import { useSession } from '@/lib/api/auth/hooks/useSession';
import { useBusinessProfile } from '@/lib/api/business/hooks/useBusinessProfile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import MagneticButton from '@/components/MagneticButton';
import Card from '@/components/Card';
import BrandKitEditor from '@/components/dashboard/BrandKitEditor';
import { useEffect, useState } from 'react';

const businessSchema = z.object({
  legalName: z.string().min(2, 'Legal Name is required'),
  displayName: z.string().min(2, 'Display Name is required'),
  description: z.string().optional(),
  contactEmail: z.string().email('Valid email required'),
  contactPhone: z.string().optional(),
  website: z.string().optional(),
  taxId: z.string().optional(),
});

type BusinessFormData = z.infer<typeof businessSchema>;

export default function BusinessProfilePage() {
  const { session } = useSession();
  const { profile, isLoading, updateProfile, updateBrandKit } = useBusinessProfile(session?.businessId);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        legalName: profile.legalName,
        displayName: profile.displayName,
        description: profile.description || '',
        contactEmail: profile.contactEmail,
        contactPhone: profile.contactPhone || '',
        website: profile.website || '',
        taxId: profile.taxId || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: BusinessFormData) => {
    setIsSaving(true);
    await updateProfile(data);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (isLoading || !profile) return <div>Loading...</div>;

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mb-2">
          Business Profile
        </h1>
        <p className="text-muted-foreground">Manage your company details and brand identity.</p>
      </header>

      <Card className="space-y-6">
        <h2 className="text-xl font-bold text-foreground border-b border-border pb-4">General Information</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Display Name</label>
              <input {...register('displayName')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
              {errors.displayName && <span className="text-destructive text-xs">{errors.displayName.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Legal Name</label>
              <input {...register('legalName')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Description</label>
            <textarea {...register('description')} rows={3} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Contact Email</label>
              <input {...register('contactEmail')} type="email" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Contact Phone</label>
              <input {...register('contactPhone')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Website</label>
              <input {...register('website')} type="url" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" placeholder="https://" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Tax ID / GSTIN</label>
              <input {...register('taxId')} className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-accent" />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center gap-4">
            <MagneticButton type="submit" variant="primary" className="py-2 px-6" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </MagneticButton>
            {isSaved && <span className="text-sm text-green-500 font-medium">Saved successfully!</span>}
          </div>
        </form>
      </Card>

      <Card className="space-y-6">
        <h2 className="text-xl font-bold text-foreground border-b border-border pb-4">Brand Kit</h2>
        <BrandKitEditor initialData={profile.brandKit} onSave={updateBrandKit} />
      </Card>
    </div>
  );
}
