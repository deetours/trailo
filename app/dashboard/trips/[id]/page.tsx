'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Map, Calendar, ListChecks, Users, Navigation } from 'lucide-react';
import { useParams } from 'next/navigation';
import { mockTrips } from '@/data/fixtures';

export default function TripWorkspacePage() {
  const params = useParams();
  const tripId = params.id as string;
  
  const trip = mockTrips.find(t => t.id === tripId || t.slug === tripId);
  
  const [activeTab, setActiveTab] = useState<'itinerary' | 'route' | 'prepare' | 'group'>('itinerary');

  if (!trip) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto pb-20 pt-20 text-center">
        <h1 className="text-3xl text-white font-bold mb-4">Trip not found</h1>
        <Link href="/dashboard/trips" className="text-[#2A8AF6] hover:underline">
          Return to Trips
        </Link>
      </div>
    );
  }

  const checklistItems = trip.itinerary.flatMap(day => day.activities);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      
      {/* Header */}
      <header>
        <Link href="/dashboard/trips" className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Trips
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-white/10 text-white px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                {trip.vehicleTypes.length > 0 ? 'Road Trip' : 'Trek'}
              </span>
              <span className="text-[#888] text-sm flex items-center gap-1"><Calendar size={14} /> {trip.duration} days</span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight mb-2 capitalize">
              {trip.title}
            </h1>
          </div>
          <button className="bg-[#2A8AF6] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1a70cc] transition-colors self-start">
            Invite friends
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#222] overflow-x-auto no-scrollbar">
        {[
          { id: 'itinerary', label: 'Itinerary', icon: Calendar },
          { id: 'route', label: 'Route Map', icon: Map },
          { id: 'prepare', label: 'Prepare', icon: ListChecks },
          { id: 'group', label: 'Group', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'itinerary' | 'route' | 'prepare' | 'group')}
              className={`pb-4 text-sm font-medium relative transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === tab.id ? 'text-white' : 'text-[#888] hover:text-[#ccc]'
              }`}
            >
              <Icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#2A8AF6]"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Areas */}
      <div className="pt-2">
        
        {/* Itinerary Tab */}
        {activeTab === 'itinerary' && (
          <div className="grid gap-6">
            {trip.itinerary.map((day, idx) => (
              <div key={idx} className="bg-[#111] border border-[#222] rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                  <h3 className="text-xl font-bold text-white">Day {day.day}: {day.title}</h3>
                </div>
                {day.notes && <p className="text-[#ccc] mb-4">{day.notes}</p>}
                
                {day.activities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Activities</h4>
                    <ul className="list-disc list-inside text-sm text-[#888] space-y-1">
                      {day.activities.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <button className="text-[#2A8AF6] text-sm font-medium hover:underline flex items-center gap-1">
                  + Add activity
                </button>
              </div>
            ))}
            
            <button className="w-full border border-dashed border-[#333] rounded-2xl p-6 text-[#888] hover:text-white hover:border-[#666] transition-colors flex items-center justify-center gap-2 font-medium">
              + Add Day
            </button>
          </div>
        )}

        {/* Route Tab */}
        {activeTab === 'route' && (
          <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden h-[600px] relative flex flex-col">
            <div className="absolute inset-0 bg-[#0d0d0d] flex items-center justify-center z-0">
              <div className="text-center text-[#444]">
                <Navigation size={48} className="mx-auto mb-4 opacity-20" />
                <div className="font-mono text-sm uppercase tracking-widest mb-2">Mapbox Integration</div>
                <div className="text-xs">Distance: {trip.distanceKm} km</div>
              </div>
            </div>
            {/* Overlay UI */}
            <div className="relative z-10 p-4 w-full max-w-sm ml-4 mt-4 bg-black/80 backdrop-blur border border-[#222] rounded-xl shadow-xl">
              <h4 className="font-bold text-white text-sm mb-3">Waypoints</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-[#ccc]">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div> Start Location
                </div>
                <div className="flex items-center gap-3 text-sm text-[#ccc]">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div> End Destination
                </div>
              </div>
              <button className="mt-4 w-full bg-[#222] hover:bg-[#333] text-white text-xs py-2 rounded transition-colors">
                + Add Waypoint
              </button>
            </div>
          </div>
        )}

        {/* Prepare Tab */}
        {activeTab === 'prepare' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Activities Checklist</h3>
              <div className="space-y-3">
                {checklistItems.length > 0 ? checklistItems.map((item, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border border-[#444] group-hover:border-[#666] flex items-center justify-center transition-colors"></div>
                    <span className="text-[#ccc] text-sm group-hover:text-white transition-colors">{item}</span>
                  </label>
                )) : (
                  <div className="text-sm text-[#888]">No activities planned yet.</div>
                )}
              </div>
              <input type="text" placeholder="+ Add item..." className="mt-4 w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-[#666]" />
            </div>
          </div>
        )}

        {/* Group Tab */}
        {activeTab === 'group' && (
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Travelers (1)</h3>
                <p className="text-sm text-[#888]">Manage who has access to this trip workspace.</p>
              </div>
              <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#eaeaea] transition-colors">
                Invite
              </button>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-[#222]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-white font-bold">A</div>
                <div>
                  <div className="text-white text-sm font-medium">Alex Smith (You)</div>
                  <div className="text-[#888] text-xs">Organizer</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
