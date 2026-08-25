import Reveal from '@/components/motion/Reveal';

export default function SocialProof() {
  return (
    <section className="py-40 px-6 md:px-10 bg-background border-t border-border">
      <div className="max-w-3xl mx-auto w-full text-center">
        <Reveal>
          <div className="w-8 h-0.5 bg-accent mx-auto mb-8" aria-hidden="true" />
          <p className="eyebrow mb-8">EARLY ACCESS OPERATORS</p>
          <blockquote className="text-display-lg font-bold mb-10 max-w-2xl mx-auto">
            &ldquo;We had our first three trips live within a week. No dev, no
            designer. Our booking page finally looks like the trips we
            actually run.&rdquo;
          </blockquote>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Meera Rawal</span> · Founder, Northline Overland
          </p>
        </Reveal>
      </div>
    </section>
  );
}
