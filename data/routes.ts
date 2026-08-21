/**
 * Route coordinate data for the Manali → Keylong corridor.
 * ~20 realistic waypoints along NH3 / Leh-Manali Highway.
 * Used by RouteScrub (signature interaction) and TheAssembly.
 */

export interface RouteWaypoint {
  lat: number;
  lng: number;
  name?: string;
  type?: 'start' | 'pass' | 'stop' | 'camp' | 'viewpoint' | 'end';
  elevation?: number; // meters
  note?: string;
  distanceFromStart?: number; // km
}

// Manali → Rohtang Pass → Gramphu → Keylong
// Realistic coordinates following NH3 through Lahaul
export const manaliKeylongRoute: RouteWaypoint[] = [
  { lat: 32.2396, lng: 77.1887, name: 'Manali', type: 'start', elevation: 2050, distanceFromStart: 0 },
  { lat: 32.2551, lng: 77.1793, name: 'Vashisht', elevation: 2100, distanceFromStart: 3 },
  { lat: 32.2780, lng: 77.1650, elevation: 2400, distanceFromStart: 8 },
  { lat: 32.2950, lng: 77.1520, name: 'Gulaba', elevation: 2800, distanceFromStart: 14, note: 'Last fuel before Rohtang' },
  { lat: 32.3100, lng: 77.1380, name: 'Marhi', elevation: 3100, distanceFromStart: 20, note: 'Chains may be required' },
  { lat: 32.3250, lng: 77.1250, elevation: 3400, distanceFromStart: 26 },
  { lat: 32.3523, lng: 77.1125, name: 'Rohtang Pass', type: 'pass', elevation: 3978, distanceFromStart: 32, note: 'Closes most years by late October' },
  { lat: 32.3700, lng: 77.1000, elevation: 3600, distanceFromStart: 38 },
  { lat: 32.3850, lng: 77.0850, name: 'Gramphu', type: 'stop', elevation: 3200, distanceFromStart: 44, note: 'Junction: Spiti forks east here' },
  { lat: 32.4000, lng: 77.0700, elevation: 3100, distanceFromStart: 50 },
  { lat: 32.4150, lng: 77.0550, name: 'Khoksar', type: 'stop', elevation: 3080, distanceFromStart: 56, note: 'Police checkpoint — permits checked' },
  { lat: 32.4300, lng: 77.0400, elevation: 3050, distanceFromStart: 62 },
  { lat: 32.4450, lng: 77.0280, name: 'Sissu', type: 'camp', elevation: 3100, distanceFromStart: 68 },
  { lat: 32.4600, lng: 77.0150, elevation: 3090, distanceFromStart: 74 },
  { lat: 32.4750, lng: 77.0050, name: 'Tandi', type: 'stop', elevation: 2950, distanceFromStart: 80, note: 'Confluence of Chandra & Bhaga rivers' },
  { lat: 32.4900, lng: 76.9900, elevation: 2900, distanceFromStart: 86 },
  { lat: 32.5050, lng: 76.9800, elevation: 3000, distanceFromStart: 92 },
  { lat: 32.5200, lng: 76.9700, elevation: 3050, distanceFromStart: 98 },
  { lat: 32.5350, lng: 76.9650, elevation: 3100, distanceFromStart: 104 },
  { lat: 32.5710, lng: 76.9720, name: 'Keylong', type: 'end', elevation: 3080, distanceFromStart: 115, note: 'District HQ of Lahaul' },
];

// GeoJSON LineString for Mapbox source
export const manaliKeylongGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: manaliKeylongRoute.map(wp => [wp.lng, wp.lat]),
  },
};

// Named waypoints only (for labels on the map)
export const namedWaypoints = manaliKeylongRoute.filter(wp => wp.name);

// Prep items that appear ON the route at specific waypoints
export const routePrepMarks = [
  { waypointName: 'Gulaba', label: 'fuel', icon: '⛽' },
  { waypointName: 'Marhi', label: 'chains', icon: '🔗' },
  { waypointName: 'Rohtang Pass', label: 'permit', icon: '📋' },
  { waypointName: 'Khoksar', label: 'checkpoint', icon: '🛂' },
  { waypointName: 'Sissu', label: 'camp', icon: '⛺' },
];
