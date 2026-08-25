import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background w-full pt-20">
      <SiteHeader />
      <div className="container mx-auto px-6 py-32 max-w-3xl">
        <p className="eyebrow mb-4">LEGAL</p>
        <h1 className="font-display font-bold text-5xl md:text-7xl text-foreground tracking-tighter mb-8">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-12 bg-card border border-border rounded-lg px-4 py-3">
          This is placeholder policy language for the current preview phase of Trailo and will be replaced with
          reviewed legal copy before general launch.
        </p>
        <div className="prose prose-invert prose-lg text-muted-foreground space-y-6">
          <div>
            <h2 className="text-foreground text-xl font-bold mb-2">What we collect</h2>
            <p>
              When you register a business on Trailo, we collect your business details, owner contact information,
              and — if you choose to verify your account — identity and entity-registration documents (such as PAN,
              Aadhaar, or entity registration certificates).
            </p>
          </div>
          <div>
            <h2 className="text-foreground text-xl font-bold mb-2">How we use it</h2>
            <p>
              Verification documents are used only to confirm your business identity and unlock automated payouts
              and refunds. They are stored encrypted and are never shown on your public trip pages or shared with
              other operators.
            </p>
          </div>
          <div>
            <h2 className="text-foreground text-xl font-bold mb-2">Your control</h2>
            <p>
              You can skip document verification at signup and complete it later from your dashboard. You can
              request deletion of your account and associated documents at any time by contacting us.
            </p>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
