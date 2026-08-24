import Reveal from '@/components/motion/Reveal';

export default function SocialProof() {
  return (
    <section className="py-24 px-6 md:px-10 bg-background border-t border-border">
      <div className="max-w-3xl mx-auto w-full text-center">
        <Reveal>
          <p className="eyebrow mb-8">EARLY ACCESS OPERATORS</p>
          <blockquote className="text-display-md font-bold leading-snug mb-8">
            &ldquo;We had our first three trips live within a week — no dev, no
            designer. Our booking page finally looks like the trips we
            actually run.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div
              aria-hidden="true"
              className="w-9 h-9 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold shrink-0"
            >
              MR
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">Meera Rawal</span> · Founder, Northline Overland
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
