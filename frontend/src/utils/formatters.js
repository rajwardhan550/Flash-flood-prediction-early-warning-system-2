/**
 * Formats a standard ISO date string into a localized readable format.
 */
export const formatDate = (isoString, locale = 'en-US') => {
  if (!isoString) return '--';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Formats numerical telemetry data with appropriate metric units.
 */
export const formatTelemetry = (value, type) => {
  if (value === null || value === undefined) return '--';
  
  switch (type) {
    case 'water_level':
      return `${value.toFixed(2)} m`;
    case 'rainfall':
      return `${value.toFixed(1)} mm`;
    case 'soil_moisture':
      return `${value.toFixed(1)}%`;
    default:
      return value.toString();
  }
};