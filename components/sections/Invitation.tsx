import MagneticButton from '../MagneticButton';

export default function Invitation() {
  return (
    <section className="relative py-40 overflow-hidden bg-[#0A0A0A] border-t border-[#111]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#0A0A0A] to-[#0A0A0A] opacity-50"></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="font-display font-bold text-5xl md:text-7xl text-white tracking-tighter mb-12 max-w-3xl mx-auto leading-[1.1]">
          Where are you going next?
        </h2>
        
        <div className="flex justify-center">
          <MagneticButton href="/signup" variant="primary" className="px-10 py-5 text-lg shadow-[0_0_40px_rgba(42,138,246,0.3)]">
            Create your free account
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
