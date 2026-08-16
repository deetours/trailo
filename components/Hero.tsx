import Link from 'next/link';

interface HeroProps {
  headline: string;
  subcopy?: string;
  ctaText?: string;
  ctaHref?: string;
  mediaUrl: string;
  isVideo?: boolean;
}

export default function Hero({ headline, subcopy, ctaText = 'Explore Trailo', ctaHref = '/explore', mediaUrl, isVideo = false }: HeroProps) {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        {isVideo ? (
          <video 
            src={mediaUrl} 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={mediaUrl} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto mt-20">
        <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tighter text-white mb-6 uppercase">
          {headline}
        </h1>
        {subcopy && (
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
            {subcopy}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={ctaHref} className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-colors">
            {ctaText}
          </Link>
          <Link href="/trips/build" className="border border-white text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors">
            Plan a Trip
          </Link>
        </div>
      </div>
    </div>
  );
}
