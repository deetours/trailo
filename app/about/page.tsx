import Image from 'next/image';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Reveal from '@/components/motion/Reveal';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background w-full pt-20">
      <SiteHeader />

      <section className="py-24 md:py-32 px-6 md:px-10 border-b border-border">
        <div className="max-w-4xl mx-auto w-full">
          <Reveal variant="clip">
            <p className="eyebrow mb-4">WHY WE BUILT THIS</p>
            <h1 className="text-display-lg font-bold tracking-tight mb-6">
              We saw trip operators wasting hours on website builders instead of designing incredible journeys.
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="py-24 px-6 md:px-10">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <Reveal className="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80"
              alt="Mountain range at sunset, the kind of trip operators publish through Trailo"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal className="space-y-6">
            <p className="text-body-lg text-muted-foreground">
              Your trips shouldn&apos;t live in a messy Google Doc, and you shouldn&apos;t need to hire a developer
              just to list a new itinerary. We wanted one place that lets you define the entire arc of your
              trip — the story, the day-by-day, the pricing, and the policies — and instantly generates a
              beautiful, branded landing page ready to share with clients.
            </p>
            <p className="text-body-lg text-muted-foreground">
              We&apos;re building this in the open, in stages: publishing works today, and the tools around
              leads, campaigns, and bookings are coming next.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 px-6 md:px-10 border-t border-border">
        <div className="max-w-5xl mx-auto w-full">
          <Reveal>
            <p className="text-body text-muted-foreground">
              We&apos;re part of the{' '}
              <Link
                href="https://girivah.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-medium hover:text-accent transition-colors underline underline-offset-4"
              >
                Girivah ecosystem
              </Link>
              , dedicated to building software that helps travel businesses thrive.
            </p>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
