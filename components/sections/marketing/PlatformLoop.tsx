import Card from '@/components/Card';
import RouteLine from '@/components/motion/RouteLine';
import Reveal from '@/components/motion/Reveal';

export default function PlatformLoop() {
  const steps = [
    {
      label: 'CREATE',
      status: 'Live',
      title: 'Build your trip once',
      description: 'Story, itinerary, pricing, policies — in a structured editor built for operators, not designers.'
    },
    {
      label: 'PUBLISH',
      status: 'Live',
      title: 'Every trip becomes its own branded page',
      description: 'Generated automatically, hosted, and ready to share. No code required.'
    },
    {
      label: 'PROMOTE',
      status: 'Coming soon',
      title: 'Turn published pages into campaigns',
      description: 'Trackable links and social kits across the Girivah ecosystem.'
    },
    {
      label: 'MANAGE',
      status: 'Coming soon',
      title: 'Leads and booking signals in one inbox',
      description: 'With analytics on what\'s actually converting.'
    }
  ];

  return (
    <section id="platform" className="py-24 px-6 md:px-10 bg-background relative border-t border-border">
      <div className="max-w-7xl mx-auto w-full">
        <Reveal variant="clip">
          <p className="eyebrow mb-4 text-center">THE TRAILO LOOP</p>
          <h2 className="text-display-lg font-bold text-center mb-6 max-w-3xl mx-auto">
            One system, from first draft to full season.
          </h2>
          <p className="text-body-lg text-muted-foreground text-center max-w-2xl mx-auto mb-20">
            Replace the scattered tools with one place for the whole trip — editor and hosted page, live today. Promotion and lead management are next.
          </p>
        </Reveal>

        <div className="relative pl-6 lg:pl-0">
          {/* Mobile Connector Line */}
          <div className="absolute left-0 top-2 bottom-2 w-[2px] lg:hidden z-0" aria-hidden="true">
            <RouteLine mode="scrub" className="w-full h-full" />
          </div>

          {/* Background Connector Line */}
          <div className="absolute top-6 left-[12.5%] right-[12.5%] h-px hidden lg:block z-0">
            <RouteLine mode="scrub" className="h-[2px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.15fr_1.15fr_0.85fr_0.85fr] gap-8 relative z-10">
            {steps.map((step, i) => {
              const isLive = step.status === 'Live';
              return (
                <Reveal key={step.label} delay={0.12 * i}>
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6 relative">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${isLive ? 'bg-accent' : 'bg-transparent border border-muted-foreground'}`} />
                      <span className="eyebrow tracking-widest">{step.label}</span>
                    </div>

                    <Card className={isLive ? 'p-7 flex-1 flex flex-col' : 'p-5 flex-1 flex flex-col bg-transparent border-dashed'}>
                      <div className={`mb-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block w-fit ${isLive ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>
                        {step.status}
                      </div>
                      <h3 className={isLive ? 'text-xl font-bold mb-3' : 'text-base font-bold mb-3 text-muted-foreground'}>{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </Card>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
