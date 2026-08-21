'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Map, { Source, Layer, Marker, MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

import { mockTrips } from '@/data/fixtures';
import { manaliKeylongGeoJSON, namedWaypoints } from '@/data/routes';

gsap.registerPlugin(ScrollTrigger);

export default function RouteScrub() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapRef>(null);
  
  const [progress, setProgress] = useState(0);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  const trip = mockTrips[0];
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);

          if (mapRef.current && isMapLoaded) {
            const map = mapRef.current.getMap();
            const coordinates = manaliKeylongGeoJSON.geometry.coordinates;
            const sliceIndex = Math.max(1, Math.floor(p * coordinates.length));
            const slicedCoords = coordinates.slice(0, sliceIndex);
            
            const source = map.getSource('route');
            if (source && source.type === 'geojson') {
              source.setData({
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: slicedCoords,
                }
              });
            }
          }
        }
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      setProgress(1);
      if (mapRef.current && isMapLoaded) {
        const map = mapRef.current.getMap();
        const source = map.getSource('route');
        if (source && source.type === 'geojson') {
          source.setData(manaliKeylongGeoJSON);
        }
      }
    });

    return () => mm.revert();
  }, { scope: containerRef, dependencies: [isMapLoaded] });

  // Update line on map load if reduced motion is already set to 1 before map loads
  useEffect(() => {
    if (isMapLoaded && progress === 1 && mapRef.current) {
        const map = mapRef.current.getMap();
        const source = map.getSource('route');
        if (source && source.type === 'geojson') {
          source.setData(manaliKeylongGeoJSON);
        }
    }
  }, [isMapLoaded, progress]);

  if (!mapboxToken) {
    return (
      <section className="h-[100svh] w-full flex items-center justify-center bg-[#0A0A0A]">
        <p className="text-[#888] font-mono text-sm border border-[#222] px-4 py-2 rounded">
          Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local to see the route
        </p>
      </section>
    );
  }

  // Calculate which itinerary entry to show
  // Guard against empty itinerary
  const itineraryLength = trip.itinerary?.length || 1;
  const activeItineraryIndex = Math.min(
    itineraryLength - 1,
    Math.floor(progress * itineraryLength)
  );

  const initialGeoJSON: any = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: []
    }
  };

  return (
    <section ref={containerRef} className="relative h-[400vh] w-full bg-[#0A0A0A]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#050505]">
        
        {/* Mapbox Map */}
        <Map
          ref={mapRef}
          initialViewState={{
            latitude: 32.40,
            longitude: 77.08,
            zoom: 9
          }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={mapboxToken}
          interactive={false}
          attributionControl={false}
          onLoad={() => setIsMapLoaded(true)}
          style={{ width: '100%', height: '100%' }}
        >
          <Source id="route" type="geojson" data={initialGeoJSON}>
            <Layer 
              id="route-line" 
              type="line" 
              paint={{
                'line-color': '#2A8AF6',
                'line-width': 3
              }}
              layout={{
                'line-cap': 'round',
                'line-join': 'round'
              }}
            />
          </Source>

          {/* Waypoint Markers */}
          {namedWaypoints.map((wp, idx) => {
             const coords = manaliKeylongGeoJSON.geometry.coordinates;
             const wpIndex = coords.findIndex(c => c[0] === wp.lng && c[1] === wp.lat);
             const currentIndex = progress * coords.length;
             const isVisible = progress === 1 || (wpIndex !== -1 && wpIndex <= currentIndex);

             return (
               <Marker key={idx} latitude={wp.lat} longitude={wp.lng}>
                 <div className={`transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                   <div className="bg-[#0A0A0A]/90 border border-[#222] px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
                     <span className="text-white font-medium">{wp.name}</span>
                     {wp.elevation && <span className="text-[#888] ml-2">{wp.elevation}m</span>}
                     {wp.distanceFromStart !== undefined && (
                       <span className="text-[#2A8AF6] ml-2">{wp.distanceFromStart}km</span>
                     )}
                   </div>
                 </div>
               </Marker>
             )
          })}
        </Map>

        {/* Text Overlay */}
        <div className="absolute inset-0 pointer-events-none z-20 flex">
          <div className="w-full md:w-2/5 h-full bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md">
              <h2 className="text-3xl font-display text-white mb-12">{trip.title}</h2>
              
              <div className="relative h-64">
                {trip.itinerary?.map((day, idx) => {
                  const isActive = idx === activeItineraryIndex;
                  return (
                    <div 
                      key={idx}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                      <h3 className="text-[#2A8AF6] font-mono text-sm tracking-widest mb-3 uppercase">Day {day.day}</h3>
                      <h4 className="text-2xl text-white font-medium mb-4">{day.title}</h4>
                      <p className="text-[#ccc] text-lg mb-2">{day.route}</p>
                      {day.notes && <p className="text-[#888] text-sm mt-4 italic">{day.notes}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
