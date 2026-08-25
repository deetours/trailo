export type LandingPageStatus = 'not-generated' | 'generating' | 'ready' | 'published' | 'failed';

export interface LandingPageRevision {
  id: string;
  version: number;
  createdAt: string;
  snapshotOfTripUpdatedAt: string;
  publishedAt?: string;
}

export interface LandingPageTheme {
  layout: 'modern' | 'editorial' | 'bold';
  primaryColor?: string;
}

export interface LandingPage {
  id: string;
  tripId: string;
  status: LandingPageStatus;
  url?: string;
  previewToken?: string;
  currentRevisionId?: string;
  revisions: LandingPageRevision[];
  theme?: LandingPageTheme;
  createdAt: string;
  updatedAt: string;
}

export type GenerationStepId = 'structuring' | 'selecting-layout' | 'optimizing';

export interface GenerationStep {
  id: GenerationStepId;
  label: string;
  status: 'pending' | 'active' | 'done' | 'failed';
}

export interface GenerationJob {
  id: string;
  tripId: string;
  landingPageId: string;
  steps: GenerationStep[];
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  startedAt: string;
  finishedAt?: string;
  error?: string;
}
