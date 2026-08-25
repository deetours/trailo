'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import PagePreview from './PagePreview';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export default function PreviewModal({ isOpen, onClose, url }: PreviewModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-10">
      <div 
        className="bg-background w-full max-w-6xl h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="h-14 border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 bg-card">
          <h2 className="font-bold text-lg">Page Preview</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <PagePreview url={url} />
        </div>
      </div>
    </div>
  );
}
