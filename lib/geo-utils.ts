/**
 * Haversine distance between two [lng, lat] points, in miles.
 */
export function haversineDistance(
  a: [number, number],
  b: [number, number]
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const aCalc =
    sinLat * sinLat +
    Math.cos((a[1] * Math.PI) / 180) *
      Math.cos((b[1] * Math.PI) / 180) *
      sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(aCalc), Math.sqrt(1 - aCalc));
}

/**
 * Format a distance in miles with commas: 1847 -> "1,847"
 */
export function formatMiles(miles: number): string {
  return Math.round(miles).toLocaleString('en-US');
}
