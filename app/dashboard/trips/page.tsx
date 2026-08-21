'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, ArrowRight, MapPin, Calendar, Clock, Navigation } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';
import { mockTrips } from '@/data/fixtures';

type TabType = 'upcoming' | 'planning' | 'past';

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('planning');

  // Put all mockTrips under 'planning' tab for now
  const filteredTrips = activeTab === 'planning' ? mockTrips : [];

  return (
    <div className="space-y-8">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-2">
            My Trips
          </h1>
        </div>
        <MagneticButton href="/dashboard/trips/new" variant="primary" className="py-2.5 px-5">
          <span className="flex items-center gap-2">
            <Plus size={16} /> Plan new trip
          </span>
        </MagneticButton>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#222]">
        {(['upcoming', 'planning', 'past'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-medium capitalize relative transition-colors ${
              activeTab === tab ? 'text-white' : 'text-[#888] hover:text-[#ccc]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#2A8AF6]"></div>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="pt-4">
        {filteredTrips.length === 0 ? (
          <div className="bg-[#111] border border-[#222] rounded-xl p-12 text-center flex flex-col items-center">
            <h3 className="text-lg font-bold text-white mb-2">No {activeTab} trips found</h3>
            <p className="text-[#888] mb-6">
              {activeTab === 'upcoming' && 'You have no confirmed trips on the calendar.'}
              {activeTab === 'planning' && 'You have no trips in the planning phase.'}
              {activeTab === 'past' && 'You have no completed trips yet.'}
            </p>
            {activeTab !== 'past' && (
              <Link 
                href="/dashboard/trips/new"
                className="text-[#2A8AF6] hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
              >
                Plan your first one <ArrowRight size={16} />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTrips.map(trip => (
              <Link 
                key={trip.id} 
                href={`/dashboard/trips/${trip.id}`}
                className="bg-[#111] border border-[#222] rounded-xl p-6 hover:border-[#444] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-white/10 text-white px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                      {trip.vehicleTypes.length > 0 ? 'Road Trip' : 'Trek'}
                    </span>
                    <span className="bg-white/5 text-[#ccc] px-2.5 py-1 rounded text-xs font-medium border border-white/5">
                      {trip.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{trip.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-[#888]">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {trip.duration} days</span>
                    <span className="flex items-center gap-1.5"><Navigation size={14} /> {trip.distanceKm} km</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#2A8AF6] text-sm font-medium">
                  View Workspace <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
