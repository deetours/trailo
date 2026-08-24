import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import EnquiryForm from '@/components/EnquiryForm';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background w-full pt-20">
      <SiteHeader />
      <div className="container mx-auto px-6 py-32 max-w-3xl text-center">
        <h1 className="font-display font-bold text-5xl md:text-7xl text-foreground tracking-tighter mb-6">
          Get in touch
        </h1>
        <p className="text-muted-foreground text-xl mb-12">
          Questions, bug reports, or feature requests? We&apos;re all ears.
        </p>
        
        <div className="bg-card border border-border rounded-2xl p-8 text-left max-w-lg mx-auto">
          <EnquiryForm context="Contact Trailo" />
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
