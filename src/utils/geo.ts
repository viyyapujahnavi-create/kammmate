/**
 * Geolocation and Haversine distance calculation utilities for KaamMate
 */

// Earth radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Calculates Haversine distance between two coordinates in kilometers.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const toRad = (degree: number) => (degree * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Format distance in a human-friendly format
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Converts delta kilometers into simulated latitude and longitude coordinates
 * relative to a center point.
 * 1 degree latitude is approx 111 km.
 * 1 degree longitude at 12.97°N is approx 111 * cos(12.97°) ≈ 108 km.
 */
export function offsetCoordinates(
  centerLat: number,
  centerLon: number,
  dxKm: number,
  dyKm: number
): { latitude: number; longitude: number } {
  const dLat = dyKm / 111;
  const dLon = dxKm / (111 * Math.cos((centerLat * Math.PI) / 180));
  return {
    latitude: Math.round((centerLat + dLat) * 10000) / 10000,
    longitude: Math.round((centerLon + dLon) * 10000) / 10000,
  };
}
