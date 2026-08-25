'use client';

import { Globe, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import MagneticButton from '@/components/MagneticButton';

interface PublishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  tripName: string;
}

export default function PublishDialog({ isOpen, onClose, onConfirm, tripName }: PublishDialogProps) {
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setIsPublishing(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Failed to publish:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="p-6 pb-0">
          <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
            <Globe size={24} />
          </div>
          <h2 className="text-xl font-bold mb-2">Publish Landing Page</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Are you sure you want to publish the landing page for <strong>{tripName}</strong>? It will immediately become visible to the public.
          </p>
        </div>
        
        <div className="p-6 flex items-center gap-3 justify-end mt-4">
          <MagneticButton 
            variant="outline" 
            onClick={onClose}
            disabled={isPublishing}
          >
            Cancel
          </MagneticButton>
          <MagneticButton 
            variant="primary" 
            onClick={handleConfirm}
            disabled={isPublishing}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-green-600"
          >
            {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
            Publish Now
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
