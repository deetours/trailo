import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background w-full pt-20">
      <SiteHeader />
      <div className="container mx-auto px-6 py-32 max-w-3xl">
        <p className="eyebrow mb-4">LEGAL</p>
        <h1 className="font-display font-bold text-5xl md:text-7xl text-foreground tracking-tighter mb-8">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground mb-12 bg-card border border-border rounded-lg px-4 py-3">
          This is placeholder terms language for the current preview phase of Trailo and will be replaced with
          reviewed legal copy before general launch.
        </p>
        <div className="prose prose-invert prose-lg text-muted-foreground space-y-6">
          <div>
            <h2 className="text-foreground text-xl font-bold mb-2">Using Trailo</h2>
            <p>
              Trailo lets registered trip operators publish branded, hosted landing pages for their trips. You are
              responsible for the accuracy of the trip content, pricing, and policies you publish.
            </p>
          </div>
          <div>
            <h2 className="text-foreground text-xl font-bold mb-2">Accounts &amp; verification</h2>
            <p>
              You can start publishing before completing identity verification, but automated payouts and refunds
              stay locked until your business is verified.
            </p>
          </div>
          <div>
            <h2 className="text-foreground text-xl font-bold mb-2">Changes</h2>
            <p>
              We may update these terms as the platform evolves during this preview phase; material changes will be
              communicated to registered operators.
            </p>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
