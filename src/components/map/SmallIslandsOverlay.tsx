import { CircleMarker, Tooltip } from 'react-leaflet';
import type { Feature, FeatureCollection } from 'geojson';
import type { CountryStatusType } from '@/hooks/useCountryStatuses';
import { getPolishName } from '@/lib/countryNames';

type Colors = {
  landDefault: string;
  landHover: string;
  available: string;
  availableHover: string;
  comingSoon: string;
  comingSoonHover: string;
  soon: string;
  soonHover: string;
  selected: string;
  border: string;
  borderHover: string;
};

// Small island nations that may be missing from simplified GeoJSON
// All names will be resolved from our Polish names utility
const SMALL_ISLANDS = [
  { code: 'CPV', lat: 15.12, lng: -23.60 },  // Republika Zielonego Przylądka
  { code: 'MLT', lat: 35.90, lng: 14.50 },   // Malta
  { code: 'SGP', lat: 1.35, lng: 103.82 },   // Singapur
  { code: 'BHR', lat: 26.07, lng: 50.55 },   // Bahrajn
  { code: 'MUS', lat: -20.35, lng: 57.55 },  // Mauritius
  { code: 'SYC', lat: -4.68, lng: 55.49 },   // Seszele
  { code: 'MDV', lat: 3.20, lng: 73.22 },    // Malediwy
  { code: 'COM', lat: -11.88, lng: 43.87 },  // Komory
  { code: 'STP', lat: 0.19, lng: 6.61 },     // Wyspy Św. Tomasza i Książęca
] as const;

interface SmallIslandsOverlayProps {
  geoData: FeatureCollection;
  getCountryCode: (feature: Feature) => string | undefined;
  statusByCode: Map<string, CountryStatusType>;
  colors: Colors;
  hoveredCountryCode: string | null;
  selectedCountryCode: string | null;
  onHover: (code: string, name: string) => void;
  onHoverEnd: () => void;
  onSelect: (code: string, name: string) => void;
}

export function SmallIslandsOverlay({
  geoData,
  getCountryCode,
  statusByCode,
  colors,
  hoveredCountryCode,
  selectedCountryCode,
  onHover,
  onHoverEnd,
  onSelect,
}: SmallIslandsOverlayProps) {
  const existingCodes = new Set(
    geoData.features
      .map((f) => getCountryCode(f))
      .filter((c): c is string => Boolean(c))
  );

  const missingIslands = SMALL_ISLANDS.filter((i) => !existingCodes.has(i.code));
  if (missingIslands.length === 0) return null;

  return (
    <>
      {missingIslands.map((island) => {
        const status = statusByCode.get(island.code);
        const isHovered = hoveredCountryCode === island.code;
        const isSelected = selectedCountryCode === island.code;
        const polishName = getPolishName(island.code);

        let fillColor = colors.landDefault;
        let fillOpacity = 0.75;
        let weight = 1;
        let color = colors.border;

        if (status === 'available') {
          fillColor = isHovered || isSelected ? colors.availableHover : colors.available;
        } else if (status === 'coming_soon') {
          fillColor = isHovered ? colors.comingSoonHover : colors.comingSoon;
        } else if (status === 'soon') {
          fillColor = isHovered ? colors.soonHover : colors.soon;
        } else {
          fillColor = isHovered ? colors.landHover : colors.landDefault;
        }

        if (isSelected) {
          fillColor = colors.selected;
          fillOpacity = 0.95;
          weight = 2;
          color = colors.borderHover;
        } else if (isHovered) {
          fillOpacity = 0.9;
          weight = 1.5;
          color = colors.borderHover;
        }

        return (
          <CircleMarker
            key={island.code}
            center={[island.lat, island.lng]}
            radius={6}
            pathOptions={{ fillColor, fillOpacity, weight, color, opacity: 1 }}
            eventHandlers={{
              mouseover: () => onHover(island.code, polishName),
              mouseout: () => onHoverEnd(),
              click: () => onSelect(island.code, polishName),
            }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={0.9}>
              {polishName}
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}
