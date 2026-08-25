import { notFound } from 'next/navigation';
import { landingPagesService } from '@/lib/api/landing-pages/mock/mock-adapter';
import { MapPin, Calendar, Clock, Check } from 'lucide-react';


export default async function PublicLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ businessSlug: string; tripSlug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { businessSlug, tripSlug } = await params;
  const { preview } = await searchParams;
  
  const pageConfig = await landingPagesService.getLandingPageBySlugs(businessSlug, tripSlug, preview === 'true');

  if (!pageConfig) {
    notFound();
  }

  const { theme, content, trip } = pageConfig;
  const brandColor = theme.primaryColor || '#2A8AF6';

  const isEditorial = theme.layout === 'editorial';
  const isBold = theme.layout === 'bold';

  const containerClass = `min-h-screen bg-background text-foreground pb-20 ${isEditorial ? 'font-serif' : 'font-sans'}`;
  
  const headerFont = isBold ? 'font-display uppercase tracking-wider' : isEditorial ? 'font-serif font-normal' : 'font-display font-bold';

  return (
    <main className={containerClass}>
      
      {/* Dynamic Brand Header */}
      <header className={`fixed top-0 left-0 right-0 h-16 ${isBold ? 'bg-black/90' : 'bg-background/80'} backdrop-blur z-50 border-b border-border px-6 flex items-center justify-between`}>
        <div className={`font-bold text-lg ${headerFont}`}>{pageConfig.businessName}</div>
        <a 
          href="#pricing"
          style={{ backgroundColor: brandColor }}
          className={`px-4 py-2 rounded-full text-white font-medium text-sm hover:opacity-90 transition-opacity ${isBold ? 'uppercase tracking-widest text-xs rounded-md' : ''}`}
        >
          Book Now
        </a>
      </header>

      {/* Hero Section */}
      <section className={`pt-24 pb-12 px-6 md:px-10 max-w-5xl mx-auto ${isEditorial ? 'text-center' : ''}`}>
        {content.heroImage ? (
          <div className={`w-full ${isEditorial ? 'h-[60vh] md:h-[80vh] rounded-sm' : isBold ? 'h-[50vh] rounded-none' : 'h-[40vh] md:h-[60vh] rounded-2xl'} overflow-hidden mb-8 relative`}>
            <img src={content.heroImage} alt={trip.basicInfo.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ) : (
          <div className={`w-full h-32 bg-muted mb-8 ${isBold ? 'rounded-none' : 'rounded-2xl'}`}></div>
        )}

        <div className={isEditorial ? 'max-w-4xl mx-auto' : 'max-w-3xl'}>
          <h1 className={`text-4xl md:text-6xl tracking-tight mb-4 ${headerFont}`}>
            {trip.basicInfo.name}
          </h1>
          
          <div className={`flex flex-wrap items-center gap-4 text-muted-foreground mb-8 ${isEditorial ? 'justify-center' : ''}`}>
            <span className="flex items-center gap-1.5"><MapPin size={16} style={{ color: brandColor }} /> {trip.basicInfo.destinationRegion}</span>
            <span className="flex items-center gap-1.5"><Clock size={16} style={{ color: brandColor }} /> {trip.basicInfo.durationDays} Days</span>
            <span className={`capitalize px-2 py-1 text-xs font-bold ${isBold ? 'bg-white text-black rounded-none' : 'bg-muted rounded text-foreground'}`}>
              {trip.basicInfo.difficulty}
            </span>
          </div>

          <div className={`prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap ${isEditorial ? 'mx-auto text-lg leading-relaxed' : ''}`}>
            {trip.basicInfo.description || trip.story?.overview || 'Join us on an unforgettable journey.'}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {trip.pricing && trip.pricing.tiers && trip.pricing.tiers.length > 0 && (
        <section id="pricing" className={`py-12 px-6 md:px-10 max-w-5xl mx-auto border-t border-border mt-12 ${isEditorial ? 'text-center' : ''}`}>
          <h2 className={`text-3xl mb-8 ${headerFont}`}>Pricing Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trip.pricing.tiers.map((tier: any) => (
              <div key={tier.id} className={`border border-border bg-card p-6 flex flex-col ${isBold ? 'rounded-none border-2' : isEditorial ? 'rounded-sm' : 'rounded-2xl'}`}>
                <h3 className={`text-xl mb-2 ${isBold ? 'font-bold uppercase tracking-wider' : 'font-bold'}`}>{tier.label}</h3>
                <div className={`text-3xl mb-4 flex items-baseline gap-1 ${isEditorial ? 'justify-center font-serif' : 'font-bold'}`}>
                  <span className="text-lg text-muted-foreground">{trip.pricing.currency}</span>
                  {tier.price}
                </div>
                
                <div className="flex-1">
                  <ul className={`space-y-3 mb-6 ${isEditorial ? 'inline-block text-left' : ''}`}>
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
                  className={`w-full py-3 text-white font-medium hover:opacity-90 transition-opacity ${isBold ? 'rounded-none uppercase tracking-widest text-xs' : 'rounded-lg'}`}
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
