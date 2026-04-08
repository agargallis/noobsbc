export function resolveLocationUrl(mapUrl, venue) {
  if (mapUrl?.trim()) {
    return mapUrl.trim();
  }

  if (!venue?.trim()) {
    return '';
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.trim())}`;
}
