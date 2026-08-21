import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';
import type { SVGProps } from 'react';
import MagneticButton from '@/components/MagneticButton';

export default function DashboardPage() {
  // Mock data for the "next trip"
  const nextTrip = null; // Set to null to show empty state

  return (
    <div className="space-y-12">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-2">
            Welcome back, Alex
          </h1>
          <p className="text-[#888]">Here is what&apos;s happening with your journeys.</p>
        </div>
        <MagneticButton href="/dashboard/trips/new" variant="primary" className="py-2.5 px-5">
          <span className="flex items-center gap-2">
            <Plus size={16} /> Plan new trip
          </span>
        </MagneticButton>
      </header>

      <section>
        <h2 className="text-sm font-medium text-[#ccc] uppercase tracking-widest mb-6">Up Next</h2>
        
        {nextTrip ? (
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
            {/* Populate with actual trip data later */}
          </div>
        ) : (
          <div className="bg-[#111] border border-[#222] rounded-2xl p-8 md:p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#222] rounded-full flex items-center justify-center text-[#888] mb-6">
              <Compass size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No trips planned yet</h3>
            <p className="text-[#888] max-w-md mb-8">
              Your itinerary is completely open. Start planning your first road trip or trek to get the journey started.
            </p>
            <Link 
              href="/dashboard/trips/new"
              className="bg-white text-black px-6 py-3 rounded-full font-medium text-sm hover:bg-[#eaeaea] transition-colors flex items-center gap-2"
            >
              Start Planning <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

    </div>
  );
}

// Just for the empty state icon
function Compass(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}
