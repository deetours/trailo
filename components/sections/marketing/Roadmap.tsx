import Reveal from '@/components/motion/Reveal';
import RouteLine from '@/components/motion/RouteLine';
import { Mail } from 'lucide-react';

export default function Roadmap() {
  return (
    <section className="py-16 px-6 md:px-10 bg-card border-t border-dashed border-border">
      <div className="max-w-3xl mx-auto w-full">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-12">
            <div className="flex-1">
              <p className="eyebrow mb-4">WHAT&apos;S NEXT</p>
              <h2 className="text-display-md font-bold mb-4 max-w-lg">
                Promote and Manage are next. Help decide what they do.
              </h2>
              <p className="text-body text-muted-foreground max-w-md mb-6">
                Create and Publish are live. The next two stages turn pages into campaigns and leads into an inbox you can act on. We&apos;re shaping these based on conversations with early operators.
              </p>
              <a href="/contact" className="inline-flex items-center gap-2 text-sm font-bold hover:text-accent transition-colors">
                Want to shape these? Talk to us <Mail size={16} />
              </a>
            </div>

            <div className="hidden sm:flex flex-col items-center gap-3 shrink-0 w-32" aria-hidden="true">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Live today</span>
              <div className="w-0.5 h-16">
                <RouteLine mode="onEnter" className="w-full h-full" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Shaping next</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
