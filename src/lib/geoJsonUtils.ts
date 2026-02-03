import type { Feature } from 'geojson';

/**
 * Map of common English country names to ISO-3 codes.
 * Used as fallback when GeoJSON properties don't contain proper ISO codes.
 */
const nameToIsoCode: Record<string, string> = {
  'France': 'FRA', 'Norway': 'NOR', 'Belarus': 'BLR', 'Kosovo': 'XKX',
  'Northern Cyprus': 'XNC', 'Saudi Arabia': 'SAU', 'United Arab Emirates': 'ARE',
  'Somaliland': 'SOL', 'Western Sahara': 'ESH', 'South Sudan': 'SSD',
  'Taiwan': 'TWN', 'North Korea': 'PRK', 'South Korea': 'KOR',
  'United States of America': 'USA', 'United Kingdom': 'GBR',
  'Russia': 'RUS', 'South Africa': 'ZAF', 'New Zealand': 'NZL',
  'Czech Republic': 'CZE', 'Czechia': 'CZE', 'Bosnia and Herzegovina': 'BIH',
  'Bosnia and Herz.': 'BIH', 'North Macedonia': 'MKD',
  'Democratic Republic of the Congo': 'COD', 'Republic of the Congo': 'COG',
  'Central African Republic': 'CAF', 'Equatorial Guinea': 'GNQ',
  'Ivory Coast': 'CIV', "Côte d'Ivoire": 'CIV',
  'Dominican Republic': 'DOM', 'Papua New Guinea': 'PNG',
  'East Timor': 'TLS', 'Timor-Leste': 'TLS',
  'Eswatini': 'SWZ', 'Swaziland': 'SWZ',
  'Myanmar': 'MMR', 'Burma': 'MMR',
  'Brunei': 'BRN', 'Laos': 'LAO', 'Lao PDR': 'LAO',
  'Vietnam': 'VNM', 'Viet Nam': 'VNM',
  'The Gambia': 'GMB', 'Gambia': 'GMB',
  'Trinidad and Tobago': 'TTO', 'Solomon Islands': 'SLB',
  'Marshall Islands': 'MHL', 'Cape Verde': 'CPV', 'Cabo Verde': 'CPV',
  'Dem. Rep. Korea': 'PRK', 'Republic of Korea': 'KOR',
  'Guinea-Bissau': 'GNB', 'Sierra Leone': 'SLE', 'Burkina Faso': 'BFA',
  'United Republic of Tanzania': 'TZA', 'Tanzania': 'TZA',
};

/**
 * Extract ISO-3 country code from GeoJSON feature.
 * Uses multiple fields and English name fallback to ensure complete coverage.
 */
export function getCountryCode(feature: Feature): string | undefined {
  const props = feature.properties || {};
  
  // Try standard ISO-3 fields first
  const candidates = [
    props.ISO_A3,
    props.ADM0_A3, 
    props.SOV_A3,
    props.ISO3,
    props.WB_A3,
    props.GU_A3,
  ];

  for (const code of candidates) {
    if (typeof code === 'string' && code.length === 3 && code !== '-99' && !code.startsWith('-')) {
      return code.toUpperCase();
    }
  }

  // Fallback: map common English names to ISO codes
  const name = props.ADMIN || props.NAME || props.name || props.SOVEREIGNT || '';
  return nameToIsoCode[name];
}
