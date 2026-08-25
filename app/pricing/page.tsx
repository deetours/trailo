import Link from 'next/link';
import { Check } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Reveal from '@/components/motion/Reveal';
import ContourField from '@/components/visuals/ContourField';
import MagneticButton from '@/components/MagneticButton';

const tiers = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    description: 'For operators publishing their first branded trip pages.',
    features: [
      'Up to 3 published trip pages',
      '1 team seat',
      'Community support',
      'Trailo branding on pages',
    ],
    cta: 'Register your business',
    featured: false,
  },
  {
    name: 'Growth',
    price: '$49',
    period: '/month',
    description: 'For operators publishing a full catalog across a season.',
    features: [
      'Unlimited trip pages',
      'Custom domain',
      'Full brand kit',
      'Up to 10 team seats',
      'Priority email support',
    ],
    cta: 'Register your business',
    featured: true,
    badge: 'Most operators choose this',
  },
  {
    name: 'Scale',
    price: '$149',
    period: '/month',
    description: 'For multi-brand operators and larger teams.',
    features: [
      'Everything in Growth',
      'Multi-brand support',
      'API access',
      'Dedicated onboarding',
      'Unlimited team seats',
    ],
    cta: 'Register your business',
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background w-full pt-20">
      <SiteHeader />

      <section className="relative py-24 md:py-32 px-6 md:px-10 border-b border-border overflow-hidden">
        <ContourField tone="accent" className="opacity-90" />
        <div className="max-w-3xl mx-auto w-full text-center relative z-10">
          <Reveal variant="clip">
            <p className="eyebrow mb-4">PRICING</p>
            <h1 className="text-display-lg font-bold tracking-tight mb-6">
              Simple pricing, built for operators who publish often.
            </h1>
            <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
              Start free while you set up your first pages, upgrade when you&apos;re publishing a full catalog.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-24 px-6 md:px-10">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, i) => (
              <Reveal key={tier.name} delay={0.1 * i} variant="scale">
                <div
                  className={`h-full rounded-2xl border p-8 flex flex-col ${
                    tier.featured ? 'border-accent bg-card shadow-2xl shadow-accent/10' : 'border-border bg-card'
                  }`}
                >
                  {tier.badge && (
                    <span className="mb-4 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent">
                      {tier.badge}
                    </span>
                  )}
                  <h2 className="text-xl font-bold mb-2">{tier.name}</h2>
                  <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && <span className="text-muted-foreground text-sm">{tier.period}</span>}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check size={16} className="shrink-0 mt-0.5 text-accent" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <MagneticButton
                    href="/register"
                    variant={tier.featured ? 'accent' : 'outline'}
                    className="w-full justify-center"
                  >
                    {tier.cta}
                  </MagneticButton>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-16 text-center space-y-2">
              <p className="text-sm text-muted-foreground">2 months free when billed annually on Growth and Scale.</p>
              <p className="text-xs text-muted-foreground/70 bg-card border border-border rounded-lg px-4 py-3 max-w-xl mx-auto">
                Pricing is introductory and subject to change while Trailo is in preview. Have questions about what
                fits your business? <Link href="/contact" className="text-accent hover:underline">Talk to us</Link>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
