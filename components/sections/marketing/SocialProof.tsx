import Reveal from '@/components/motion/Reveal';

const testimonials = [
  {
    quote:
      '“We had our first three trips live within a week. No dev, no designer. Our booking page finally looks like the trips we actually run.”',
    name: 'Meera Rawal',
    role: 'Founder, Northline Overland',
  },
  {
    quote:
      '“Switching from a shared spreadsheet to branded pages took us an afternoon. Customers stopped asking if we were a real company.”',
    name: 'Devraj Thapa',
    role: 'Co-founder, Kaza Trail Co.',
  },
];

export default function SocialProof() {
  const [primary, secondary] = testimonials;

  return (
    <section className="py-40 px-6 md:px-10 bg-background border-t border-border overflow-hidden">
      <div className="max-w-5xl mx-auto w-full">
        <Reveal>
          <span
            className="block font-display text-[7rem] md:text-[10rem] leading-none text-accent/15 select-none -mb-14 md:-mb-20 text-center"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <blockquote className="relative text-display-lg font-bold text-center max-w-3xl mx-auto">
            {primary.quote}
          </blockquote>
          <p className="text-sm text-muted-foreground text-center mt-10">
            <span className="text-foreground font-medium">{primary.name}</span> · {primary.role}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-24 pt-10 border-t border-border max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-1 h-10 bg-accent shrink-0 hidden sm:block" aria-hidden="true" />
            <p className="text-body text-muted-foreground">
              {secondary.quote}
              <span className="block mt-2 text-sm">
                <span className="text-foreground font-medium">{secondary.name}</span> · {secondary.role}
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
