'use client';

import { type LandingPage } from '@/types/landing-page';
import { type Trip } from '@/types/trip';
import { AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { isLandingPageStale } from '@/lib/api/landing-pages/staleness';
import GenerationProgress from './GenerationProgress';

interface PageStatusProps {
  pageStatus: string;
  landingPage: LandingPage | null;
  trip: Trip;
  activeJobId?: string;
  generatedUrl?: string;
}

export default function PageStatus({ pageStatus, landingPage, trip, activeJobId, generatedUrl }: PageStatusProps) {
  const isStale = landingPage && isLandingPageStale(trip, landingPage);
  
  const statusConfig = {
    'not-generated': {
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      label: 'Not Generated',
      description: 'Create a landing page to go live',
    },
    'generating': {
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      label: 'Generating',
      description: 'Creating your landing page...',
    },
    'ready': {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      label: 'Ready',
      description: 'Page is ready to publish',
    },
    'published': {
      icon: Zap,
      color: 'text-green-600',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      label: 'Published',
      description: 'Your landing page is live',
    },
    'failed': {
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      label: 'Failed',
      description: 'Generation failed. Try again.',
    },
  } as const;

  const config = statusConfig[pageStatus as keyof typeof statusConfig] || statusConfig['not-generated'];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-4 space-y-2`}>
      <div className="flex items-center gap-2">
        <Icon size={18} className={config.color} />
        <span className={`font-bold text-sm ${config.color}`}>{config.label}</span>
        {isStale && (
          <span className="text-xs font-medium bg-amber-500/20 text-amber-700 px-2 py-1 rounded ml-auto">
            Outdated
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{config.description}</p>
      
      {pageStatus === 'generating' && activeJobId && (
        <div className="pt-4">
          <GenerationProgress jobId={activeJobId} />
        </div>
      )}
      
      {pageStatus === 'published' && landingPage && generatedUrl && (
        <div className="pt-3 border-t border-current/10 mt-3 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5 overflow-hidden">
            <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Live URL</span>
            <a 
              href={generatedUrl} 
              target="_blank" 
              className="text-sm font-mono text-green-600 hover:underline truncate"
            >
              {typeof window !== 'undefined' ? window.location.origin : ''}{generatedUrl.replace('?preview=true', '')}
            </a>
          </div>
          <a
            href={generatedUrl.replace('?preview=true', '')}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-bold transition-colors shrink-0"
          >
            Visit Site
          </a>
        </div>
      )}
    </div>
  );
}
