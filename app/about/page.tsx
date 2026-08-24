import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background w-full pt-20">
      <SiteHeader />
      <div className="container mx-auto px-6 py-32 max-w-3xl">
        <h1 className="font-display font-bold text-5xl md:text-7xl text-foreground tracking-tighter mb-8">
          About Trailo
        </h1>
        <div className="prose prose-invert prose-lg text-muted-foreground">
          <p>
            Trailo was built because we saw trip organizers wasting hours wrestling with website builders instead of designing incredible journeys.
          </p>
          <p>
            Your trips shouldn&apos;t live in a messy Google Doc, and you shouldn&apos;t need to hire a developer just to list a new itinerary. 
            We wanted one place that lets you define the entire arc of your trip—the story, the day-by-day, the pricing, and the policies—and instantly generates a beautiful, branded landing page ready to share with clients.
          </p>
          <p>
            We are part of the Girivah ecosystem, dedicated to building software that helps travel businesses thrive.
          </p>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
