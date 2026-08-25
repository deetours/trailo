import Image from 'next/image';
import Reveal from '@/components/motion/Reveal';
import TiltCard from '@/components/motion/TiltCard';

const chipClass = 'h-6 px-3 rounded-full bg-muted text-[11px] font-medium flex items-center text-muted-foreground';

type PhotoBrand = {
  name: string;
  color: string;
  trip: string;
  duration: string;
  price: string;
  layout: 'photo';
  photo: string;
};

type ItineraryBrand = {
  name: string;
  color: string;
  trip: string;
  duration: string;
  price: string;
  layout: 'itinerary';
  days: { day: number; label: string }[];
};

type TiersBrand = {
  name: string;
  color: string;
  trip: string;
  duration: string;
  price: string;
  layout: 'tiers';
  tiers: { name: string; price: string }[];
};

type Brand = PhotoBrand | ItineraryBrand | TiersBrand;

const brands: Brand[] = [
  {
    name: 'Apex Expeditions',
    color: 'var(--accent)',
    trip: 'Everest Base Camp Trek',
    duration: '14 Days',
    price: '$1,850',
    layout: 'photo',
    photo: 'https://images.unsplash.com/photo-1520696773539-71285223c683?auto=format&fit=crop&q=80',
  },
  {
    name: 'Ridgeline Expeditions',
    color: '#2A9D8F',
    trip: 'Spiti Valley Circuit',
    duration: '8 Days',
    price: '$800',
    layout: 'itinerary',
    days: [
      { day: 1, label: 'Manali to Chandratal' },
      { day: 2, label: 'Chandratal to Kaza' },
      { day: 3, label: 'Kaza to Key Monastery' },
    ],
  },
  {
    name: 'Sundown Safaris',
    color: '#C1446E',
    trip: 'Hampta Pass Trek',
    duration: '5 Days',
    price: '$450',
    layout: 'tiers',
    tiers: [
      { name: 'Basic', price: '$450' },
      { name: 'Standard', price: '$620' },
      { name: 'Premium', price: '$890' },
    ],
  },
];

function BrandCardBody({ brand }: { brand: Brand }) {
  if (brand.layout === 'photo') {
    return (
      <>
        <div className="relative h-56 w-full shrink-0">
          <Image
            src={brand.photo}
            alt={`${brand.trip}, published as a ${brand.name} branded trip page`}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent" />
          <h3 className="absolute bottom-4 left-5 right-5 text-lg font-bold text-white drop-shadow-sm">{brand.trip}</h3>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex gap-2">
            <span className={chipClass}>{brand.duration}</span>
            <span className={chipClass}>{brand.price}</span>
          </div>
          <button
            type="button"
            className="w-full h-10 rounded-lg text-white text-xs font-bold flex items-center justify-center"
            style={{ backgroundColor: brand.color }}
          >
            View trip
          </button>
        </div>
      </>
    );
  }

  if (brand.layout === 'itinerary') {
    return (
      <div className="p-5 flex flex-col gap-4">
        <h3 className="text-lg font-bold">{brand.trip}</h3>
        <div className="flex flex-col gap-2">
          {brand.days.map((d) => (
            <div key={d.day} className="flex items-center gap-3 bg-muted/50 rounded-lg px-3 py-2">
              <span className="text-[10px] font-bold text-muted-foreground w-12 shrink-0">DAY {d.day}</span>
              <span className="text-xs font-medium">{d.label}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <span className={chipClass}>{brand.duration}</span>
          <span className={chipClass}>{brand.price}</span>
        </div>
        <button
          type="button"
          className="w-full h-10 rounded-lg text-white text-xs font-bold flex items-center justify-center"
          style={{ backgroundColor: brand.color }}
        >
          View itinerary
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-4">
      <h3 className="text-lg font-bold">{brand.trip}</h3>
      <span className={`${chipClass} w-fit`}>{brand.duration}</span>
      <div className="flex gap-2">
        {brand.tiers.map((tier, i) => (
          <div
            key={tier.name}
            className="flex-1 rounded-xl border p-3 flex flex-col items-center"
            style={{ borderColor: i === 1 ? brand.color : 'var(--border)', borderWidth: i === 1 ? 2 : 1 }}
          >
            <span className="text-[10px] text-muted-foreground mb-1">{tier.name}</span>
            <span className="text-sm font-bold">{tier.price}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="w-full h-10 rounded-lg text-white text-xs font-bold flex items-center justify-center"
        style={{ backgroundColor: brand.color }}
      >
        Compare tiers
      </button>
    </div>
  );
}

export default function BrandedPages() {
  return (
    <section className="py-24 px-6 md:px-10 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto w-full">
        <Reveal variant="clip">
          <p className="eyebrow mb-4 text-center">BRAND KIT → EVERY PAGE</p>
          <h2 className="text-display-lg font-bold text-center mb-6 max-w-3xl mx-auto">
            Set your brand once. It shows up on every trip you publish.
          </h2>
          <p className="text-body-lg text-muted-foreground text-center max-w-2xl mx-auto mb-20">
            Logo, colors, and voice carry across your entire catalog automatically, from your first trip page to your fiftieth.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {brands.map((brand, i) => (
            <Reveal key={brand.name} delay={0.1 * i} className="w-full" variant="scale">
              <TiltCard className="w-full">
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xl flex flex-col w-full">
                  <div className="h-1 w-full shrink-0" style={{ backgroundColor: brand.color }} />
                  <div className="flex items-center gap-2 px-5 pt-4 pb-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brand.color }} />
                    <span className="text-xs font-bold text-muted-foreground">{brand.name}</span>
                  </div>
                  <BrandCardBody brand={brand} />
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
