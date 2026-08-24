import Reveal from '@/components/motion/Reveal';
import RouteLine from '@/components/motion/RouteLine';
import { Mail } from 'lucide-react';

export default function Roadmap() {
  return (
    <section className="py-24 px-6 md:px-10 bg-card border-t border-dashed border-border text-center">
      <div className="max-w-3xl mx-auto w-full">
        <Reveal>
          <p className="eyebrow mb-4">WHAT'S NEXT</p>
          <h2 className="text-display-lg font-bold mb-6">
            The next layers of the operating system.
          </h2>
          <p className="text-body-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Publishing is live today. We're actively building the tools to turn those pages into businesses — a unified lead inbox, booking signals, and campaign tracking, all running from the same core system.
          </p>
          
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <div className="absolute top-1/2 left-[35%] right-[35%] h-[2px] hidden sm:block -z-10" aria-hidden="true">
              <RouteLine mode="onEnter" className="h-[2px]" />
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-card pr-4">
              <div className="w-2 h-2 rounded-full border border-muted-foreground bg-card" /> Promote
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-card pl-4">
              <div className="w-2 h-2 rounded-full border border-muted-foreground bg-card" /> Manage
            </div>
          </div>
          
          <a href="/contact" className="inline-flex items-center gap-2 text-sm font-bold hover:text-accent transition-colors">
            Want to shape these? Talk to us <Mail size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
