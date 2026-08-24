import Image from 'next/image';
import ProductFrame from '@/components/visuals/ProductFrame';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';

export default function BrandedPages() {
  const brands = [
    {
      name: 'Apex Expeditions',
      color: 'var(--accent)',
      trip: 'Everest Base Camp Trek',
      duration: '14 Days',
      price: '$1,850',
      photo: 'https://images.unsplash.com/photo-1520696773539-71285223c683?auto=format&fit=crop&q=80',
    },
    {
      name: 'Northline Overland',
      color: '#2A9D8F',
      trip: 'Spiti Valley Circuit',
      duration: '8 Days',
      price: '$800',
      photo: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80',
    },
    {
      name: 'Sundown Safaris',
      color: '#C1446E',
      trip: 'Hampta Pass Trek',
      duration: '5 Days',
      price: '$450',
      photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-24 px-6 md:px-10 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto w-full">
        <Reveal>
          <p className="eyebrow mb-4 text-center">BRAND KIT → EVERY PAGE</p>
          <h2 className="text-display-lg font-bold text-center mb-6 max-w-3xl mx-auto">
            Set your brand once. It shows up on every trip you publish.
          </h2>
          <p className="text-body-lg text-muted-foreground text-center max-w-2xl mx-auto mb-20">
            Logo, colors, and voice carry across your entire catalog automatically — from your first trip page to your fiftieth.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {brands.map((brand, i) => (
            <Reveal key={brand.name} delay={0.1 * i} className="w-full">
              <TiltCard className="w-full">
                <ProductFrame url={`t/${brand.name.toLowerCase().split(' ')[0]}/trip`} className="w-full shadow-2xl">
                  <div className="w-full h-96 flex flex-col items-center">
                    {/* Fake Header */}
                    <div className="w-full h-12 border-b border-border flex items-center justify-between px-4 shrink-0">
                      <div className="font-bold text-xs">{brand.name}</div>
                      <div className="px-3 py-1.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: brand.color }}>
                        Book Now
                      </div>
                    </div>
                    {/* Trip hero photo */}
                    <div className="w-full h-40 mb-6 relative">
                      <Image
                        src={brand.photo}
                        alt={`${brand.trip}, published as a ${brand.name} branded trip page`}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
                    </div>
                    {/* Trip content */}
                    <div className="w-full px-6 flex flex-col items-center text-center">
                      <h3 className="text-lg font-bold mb-3">{brand.trip}</h3>
                      <div className="flex gap-2 mb-6 justify-center">
                        <span className="h-6 px-3 rounded-full bg-muted text-[11px] font-medium flex items-center text-muted-foreground">{brand.duration}</span>
                        <span className="h-6 px-3 rounded-full bg-muted text-[11px] font-medium flex items-center text-muted-foreground">{brand.price}</span>
                      </div>
                      <div className="w-full h-10 rounded-lg text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: brand.color }}>
                        Select Option
                      </div>
                    </div>
                  </div>
                </ProductFrame>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
