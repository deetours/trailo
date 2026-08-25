'use client';

import { use, useState } from 'react';
import { useTrip } from '@/lib/api/trips/hooks/useTrip';
import { useLandingPage } from '@/lib/api/landing-pages/hooks/useLandingPage';
import { useSession } from '@/lib/api/auth/hooks/useSession';
import { useBusinessProfile } from '@/lib/api/business/hooks/useBusinessProfile';
import Card from '@/components/Card';
import MagneticButton from '@/components/MagneticButton';
import PageStatus from '@/components/trip-editor/PageStatus';
import GeneratePageButton from '@/components/trip-editor/GeneratePageButton';
import PreviewModal from '@/components/trip-editor/PreviewModal';
import PublishDialog from '@/components/trip-editor/PublishDialog';
import PrePublishChecklist from '@/components/trip-editor/PrePublishChecklist';
import ThemeSelector from '@/components/trip-editor/ThemeSelector';
import { getTripCompleteness } from '@/lib/trip-completeness';
import { Zap, ExternalLink } from 'lucide-react';

export default function TripPageEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { trip, isLoading: tripLoading } = useTrip(id);
  const { landingPage, isLoading: pageLoading, generate, publish, unpublish, regenerate, updateTheme } = useLandingPage(id);
  const [activeJobId, setActiveJobId] = useState<string | undefined>();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  
  const { session } = useSession();
  const { profile } = useBusinessProfile(session?.businessId);

  if (tripLoading || pageLoading || !trip) return null;

  const generatedUrl = profile ? `/t/${profile.slug}/${trip.slug}?preview=true` : '#';

  const pageStatus = landingPage?.status || 'not-generated';
  const isPublished = pageStatus === 'published';
  const isReady = pageStatus === 'ready';
  const isGenerating = pageStatus === 'generating';
  const isNotGenerated = pageStatus === 'not-generated';

  const completeness = getTripCompleteness(trip);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap size={24} className="text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Landing Page</h2>
        </div>
        <p className="text-muted-foreground">
          Generate and publish your trip's public landing page. This is where customers discover and book your trip.
        </p>
      </div>

      {!completeness.isReadyForGeneration && (
        <PrePublishChecklist completeness={completeness} tripId={id} />
      )}

      <Card className="p-6">
        <div className="space-y-6">
          
          {/* Status Display */}
          <PageStatus 
            pageStatus={pageStatus}
            landingPage={landingPage}
            trip={trip}
            activeJobId={activeJobId}
            generatedUrl={generatedUrl}
          />

          {/* Action Buttons */}
          <div className="border-t border-border pt-6 flex flex-wrap items-center gap-3">
            {isNotGenerated && (
              <GeneratePageButton 
                onGenerate={() => generate(id)}
                onJobCreated={setActiveJobId}
                isStale={false}
                disabled={!completeness.isReadyForGeneration}
              />
            )}

            {isReady && (
              <>
                <MagneticButton 
                  variant="primary" 
                  onClick={() => setIsPublishOpen(true)}
                  className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white border-green-600"
                >
                  Publish Page
                </MagneticButton>
                <MagneticButton 
                  variant="outline"
                  className="py-2 px-6"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  Preview
                </MagneticButton>
              </>
            )}

            {isPublished && landingPage && (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-sm font-medium text-green-600">
                  <span>Published</span>
                </div>
                <MagneticButton 
                  variant="outline"
                  onClick={() => unpublish(landingPage.id)}
                  className="py-2 px-6"
                >
                  Unpublish
                </MagneticButton>
                <MagneticButton 
                  variant="outline"
                  onClick={() => setIsPreviewOpen(true)}
                  className="py-2 px-6"
                >
                  Preview
                </MagneticButton>
                <GeneratePageButton 
                  onGenerate={() => regenerate(id)}
                  onJobCreated={setActiveJobId}
                  isStale={true}
                />
              </>
            )}
          </div>
        </div>
      </Card>
      
      {landingPage && (
        <ThemeSelector 
          landingPage={landingPage} 
          onUpdate={(theme) => updateTheme(landingPage.id, theme)} 
          disabled={isGenerating}
        />
      )}

      <PreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        url={generatedUrl} 
      />
      <PublishDialog
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        onConfirm={async () => {
          await publish(landingPage!.id);
        }}
        tripName={trip.basicInfo.name}
      />
    </div>
  );
}
