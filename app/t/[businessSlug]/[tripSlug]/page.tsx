import { notFound } from 'next/navigation';
import { landingPagesService } from '@/lib/api/landing-pages/mock/mock-adapter';
import { MapPin, Calendar, Clock, Check } from 'lucide-react';


export default async function PublicLandingPage({
  params,
}: {
  params: Promise<{ businessSlug: string; tripSlug: string }>;
}) {
  const { businessSlug, tripSlug } = await params;
  
  const pageConfig = await landingPagesService.getLandingPageBySlugs(businessSlug, tripSlug);

  if (!pageConfig) {
    notFound();
  }

  const { theme, content, trip } = pageConfig;
  const brandColor = theme.primaryColor || '#2A8AF6';

  return (
    <main className="min-h-screen bg-background font-sans text-foreground pb-20">
      
      {/* Dynamic Brand Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur z-50 border-b border-border px-6 flex items-center justify-between">
        <div className="font-bold text-lg">{pageConfig.businessName}</div>
        <a 
          href="#pricing"
          style={{ backgroundColor: brandColor }}
          className="px-4 py-2 rounded-full text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Book Now
        </a>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6 md:px-10 max-w-5xl mx-auto">
        {content.heroImage ? (
          <div className="w-full h-[40vh] md:h-[60vh] rounded-2xl overflow-hidden mb-8 relative">
            <img src={content.heroImage} alt={trip.basicInfo.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ) : (
          <div className="w-full h-32 rounded-2xl bg-muted mb-8"></div>
        )}

        <div className="max-w-3xl">
          <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight mb-4">
            {trip.basicInfo.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
            <span className="flex items-center gap-1.5"><MapPin size={16} /> {trip.basicInfo.destinationRegion}</span>
            <span className="flex items-center gap-1.5"><Clock size={16} /> {trip.basicInfo.durationDays} Days</span>
            <span className="capitalize bg-muted px-2 py-1 rounded text-xs font-bold text-foreground">
              {trip.basicInfo.difficulty}
            </span>
          </div>

          <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
            {trip.basicInfo.description || 'Join us on an unforgettable journey.'}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {trip.pricing && trip.pricing.tiers && trip.pricing.tiers.length > 0 && (
        <section id="pricing" className="py-12 px-6 md:px-10 max-w-5xl mx-auto border-t border-border mt-12">
          <h2 className="text-3xl font-bold mb-8">Pricing Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trip.pricing.tiers.map((tier: any) => (
              <div key={tier.id} className="border border-border bg-card rounded-2xl p-6 flex flex-col">
                <h3 className="font-bold text-xl mb-2">{tier.label}</h3>
                <div className="text-3xl font-bold mb-4 flex items-baseline gap-1">
                  <span className="text-lg text-muted-foreground">{trip.pricing.currency}</span>
                  {tier.price}
                </div>
                
                <div className="flex-1">
                  <ul className="space-y-3 mb-6">
                    {tier.minPax ? (
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check size={16} style={{ color: brandColor }} className="shrink-0 mt-0.5" />
                        <span>Min Pax: {tier.minPax}</span>
                      </li>
                    ) : null}
                    {tier.maxPax ? (
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check size={16} style={{ color: brandColor }} className="shrink-0 mt-0.5" />
                        <span>Max Pax: {tier.maxPax}</span>
                      </li>
                    ) : null}
                  </ul>
                </div>

                <button 
                  style={{ backgroundColor: brandColor }}
                  className="w-full py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Select Option
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
