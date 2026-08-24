'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, XCircle, ShieldAlert, ShieldQuestion } from 'lucide-react';
import { useSession } from '@/lib/api/auth/hooks/useSession';
import { useBusinessProfile } from '@/lib/api/business/hooks/useBusinessProfile';
import { businessService } from '@/lib/api/business/mock/mock-adapter';
import Card from '@/components/Card';
import MagneticButton from '@/components/MagneticButton';
import VerificationDocumentUploader, { type PendingDocument } from '@/components/verification/VerificationDocumentUploader';
import { cn } from '@/lib/cn';
import type { VerificationStatus } from '@/types/business';

const STATUS_LADDER: VerificationStatus[] = ['unverified', 'submitted', 'under-review', 'verified'];

const STATUS_META: Record<VerificationStatus, { label: string; icon: typeof ShieldQuestion; className: string }> = {
  unverified: { label: 'Unverified', icon: ShieldQuestion, className: 'text-muted-foreground border-border bg-muted' },
  submitted: { label: 'Submitted', icon: Clock, className: 'text-accent border-accent/20 bg-accent/10' },
  'under-review': { label: 'Under review', icon: Clock, className: 'text-accent border-accent/20 bg-accent/10' },
  verified: { label: 'Verified', icon: CheckCircle2, className: 'text-green-500 border-green-500/20 bg-green-500/10' },
  rejected: { label: 'Rejected', icon: XCircle, className: 'text-destructive border-destructive/20 bg-destructive/10' },
  suspended: { label: 'Suspended', icon: ShieldAlert, className: 'text-destructive border-destructive/20 bg-destructive/10' },
};

export default function VerificationCenterPage() {
  const { session } = useSession();
  const { profile, isLoading } = useBusinessProfile(session?.businessId);
  const [documents, setDocuments] = useState<PendingDocument[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const status = profile?.verification?.status || 'unverified';
  const meta = STATUS_META[status];
  const isTerminalHold = status === 'rejected' || status === 'suspended';
  const canSubmit = status === 'unverified' || isTerminalHold;

  const handleSubmit = async () => {
    if (!session?.businessId || documents.length === 0) return;
    setIsSubmitting(true);
    await businessService.submitVerificationDocuments(session.businessId, documents);
    setIsSubmitting(false);
    setIsSubmitted(true);
    setDocuments([]);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  if (isLoading || !profile) {
    return <div className="py-20 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-bold text-3xl text-foreground tracking-tight mb-2">Verification center</h1>
        <p className="text-muted-foreground">Verify {profile.legalName} to unlock payment links, refunds, and automated payouts.</p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <span className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border', meta.className)}>
            <meta.icon size={16} /> {meta.label}
          </span>
          {!isTerminalHold && (
            <div className="flex items-center gap-2">
              {STATUS_LADDER.map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  <span className={cn('w-2.5 h-2.5 rounded-full', STATUS_LADDER.indexOf(status) >= i ? 'bg-accent' : 'bg-border')} />
                  {i < STATUS_LADDER.length - 1 && <span className={cn('w-6 h-px', STATUS_LADDER.indexOf(status) > i ? 'bg-accent' : 'bg-border')} />}
                </span>
              ))}
            </div>
          )}
        </div>

        {status === 'rejected' && profile.verification?.rejectionReason && (
          <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            {profile.verification.rejectionReason}
          </p>
        )}
        {status === 'suspended' && (
          <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            Verification has been suspended. Contact support to resolve this before resubmitting.
          </p>
        )}
        {(status === 'submitted' || status === 'under-review') && (
          <p className="text-sm text-muted-foreground">Your documents are being reviewed. This usually takes 1-2 business days.</p>
        )}
        {status === 'verified' && (
          <p className="text-sm text-muted-foreground">This business is verified. Automated payments and refunds are unlocked.</p>
        )}

        {profile.verification && profile.verification.documents.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-sm font-medium text-foreground">Submitted documents</p>
            <ul className="space-y-1">
              {profile.verification.documents.map(doc => (
                <li key={doc.id} className="text-sm text-muted-foreground flex justify-between">
                  <span>{doc.fileName}</span>
                  <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {canSubmit && status !== 'suspended' && (
        <Card className="p-6 space-y-4">
          <h2 className="font-bold text-foreground text-lg">
            {status === 'rejected' ? 'Resubmit documents' : 'Submit verification documents'}
          </h2>
          <VerificationDocumentUploader entityType={profile.entityType} documents={documents} onChange={setDocuments} />
          <div className="flex items-center gap-4 pt-2">
            <MagneticButton variant="primary" className="py-2 px-6" onClick={handleSubmit} disabled={documents.length === 0 || isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit for review'}
            </MagneticButton>
            {isSubmitted && <span className="text-sm text-green-500 font-medium">Submitted successfully!</span>}
          </div>
        </Card>
      )}
    </div>
  );
}
