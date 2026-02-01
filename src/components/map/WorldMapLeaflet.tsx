import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import type { LatLngBoundsExpression, Layer, LeafletMouseEvent, Map as LeafletMap } from 'leaflet';
import type { Feature, FeatureCollection } from 'geojson';
import { countries, type Country } from '@/data/countries';
import { useCountryStatuses, type CountryStatusType } from '@/hooks/useCountryStatuses';
import { CountryFactCard } from './CountryFactCard';
import { SmallIslandsOverlay } from './SmallIslandsOverlay';
import { Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// ISO code to slug mapping for countries.ts
const codeToSlug: Record<string, string> = {
  'POL': 'poland', 'FRA': 'france', 'ITA': 'italy', 'ESP': 'spain',
  'DEU': 'germany', 'GBR': 'uk', 'GRC': 'greece', 'NOR': 'norway',
  'SWE': 'sweden', 'NLD': 'netherlands', 'JPN': 'japan', 'CHN': 'china',
  'IND': 'india', 'THA': 'thailand', 'EGY': 'egypt', 'KEN': 'kenya',
  'MAR': 'morocco', 'ZAF': 'south-africa', 'USA': 'usa', 'CAN': 'canada',
  'MEX': 'mexico', 'BRA': 'brazil', 'ARG': 'argentina', 'PER': 'peru',
  'AUS': 'australia', 'NZL': 'new-zealand', 'TUR': 'turkey', 'ISL': 'iceland',
  'KOR': 'south-korea', 'VNM': 'vietnam',
};

// Map of country admin names to ISO codes (for countries where ISO_A3 is -99)
const adminNameToCode: Record<string, string> = {
  'France': 'FRA',
  'Norway': 'NOR',
  'Belarus': 'BLR',
  'Saudi Arabia': 'SAU',
  'United Arab Emirates': 'ARE',
  'Oman': 'OMN',
  'Cabo Verde': 'CPV',
  'Cape Verde': 'CPV',
  'Kosovo': 'XKX',
  'Northern Cyprus': 'XNC',
  'Somaliland': 'SOL',
};

function getCountryCode(feature: Feature): string | undefined {
  const props = feature.properties || {};

  // NaturalEarth/other GeoJSON exports use different fields depending on source.
  // Try a set of common ISO3-like properties (and normalize to upper-case).
  const candidates = [
    props.ADM0_A3,
    props.ISO_A3,
    props.SOV_A3,
    props.A3,
    props.ISO3,
    props.WB_A3,
  ];

  for (const raw of candidates) {
    if (typeof raw === 'string' && raw && raw !== '-99') return raw.toUpperCase();
  }

  // Fallback by ADMIN name (for entries where codes are missing/-99)
  const adminName = props.ADMIN || props.NAME;
  if (typeof adminName === 'string' && adminNameToCode[adminName]) {
    return adminNameToCode[adminName];
  }

  return undefined;
}

function getCountryName(feature: Feature): string {
  const props = feature.properties || {};
  return props.ADMIN || props.NAME || props.name || 'Unknown';
}

function findCountryByCode(code: string): Country | undefined {
  const slug = codeToSlug[code];
  return slug ? countries.find(c => c.id === slug) : undefined;
}

// Color palette
const colors = {
  ocean: 'hsl(200, 30%, 92%)',
  landDefault: 'hsl(220, 10%, 82%)',
  landHover: 'hsl(220, 12%, 76%)',
  available: 'hsl(160, 35%, 75%)',
  availableHover: 'hsl(160, 45%, 65%)',
  comingSoon: 'hsl(45, 55%, 80%)',
  comingSoonHover: 'hsl(45, 60%, 72%)',
  soon: 'hsl(30, 60%, 78%)',
  soonHover: 'hsl(30, 65%, 68%)',
  selected: 'hsl(25, 70%, 82%)',
  border: 'hsl(220, 15%, 70%)',
  borderHover: 'hsl(220, 25%, 55%)',
};

const maxBounds: LatLngBoundsExpression = [[-85, -180], [85, 180]];

interface SelectedCountryInfo {
  code: string;
  name: string;
}

function ZoomToCountry({ selectedCountry, geoData }: { selectedCountry: SelectedCountryInfo | null; geoData: FeatureCollection | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (!selectedCountry || !geoData) return;
    
    const feature = geoData.features.find((f: Feature) => {
      const code = getCountryCode(f);
      return code === selectedCountry.code;
    });
    
    if (feature) {
      const L = (window as any).L;
      if (L) {
        const geoJsonLayer = L.geoJSON(feature);
        const bounds = geoJsonLayer.getBounds();
        map.flyToBounds(bounds, { padding: [50, 50], duration: 1, maxZoom: 5 });
      }
    }
  }, [selectedCountry, geoData, map]);
  
  return null;
}

interface WorldMapLeafletProps {
  onCountrySelect?: (country: Country | null) => void;
}

export function WorldMapLeaflet({ onCountrySelect }: WorldMapLeafletProps) {
  const [hoveredCountryCode, setHoveredCountryCode] = useState<string | null>(null);
  const [hoveredCountryName, setHoveredCountryName] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<SelectedCountryInfo | null>(null);
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<LeafletMap | null>(null);
  const geoJsonRef = useRef<any>(null);
  
  const { countryStatuses, loading: statusesLoading } = useCountryStatuses();

  // IMPORTANT: react-leaflet GeoJSON doesn't always restyle features when only the style function
  // dependencies change. A stable key based on statuses ensures colors refresh after admin changes.
  const statusesKey = useMemo(() => {
    if (!countryStatuses.length) return 'no-statuses';
    return countryStatuses
      .map((cs) => `${cs.country_code}:${cs.status}`)
      .join('|');
  }, [countryStatuses]);
  
  // Load GeoJSON from public folder
  useEffect(() => {
    fetch('/world-110m.geojson')
      .then(res => res.json())
      .then((data: FeatureCollection) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load map data:', err);
        setLoading(false);
      });
  }, []);
  
  const statusByCode = useMemo(() => {
    const map = new Map<string, CountryStatusType>();
    countryStatuses.forEach(cs => map.set(cs.country_code, cs.status));
    return map;
  }, [countryStatuses]);

  const handleCountrySelect = useCallback((code: string | null, name: string | null) => {
    if (code && name) {
      setSelectedCountry({ code, name });
      const country = findCountryByCode(code);
      onCountrySelect?.(country || null);
    } else {
      setSelectedCountry(null);
      onCountrySelect?.(null);
    }
  }, [onCountrySelect]);

  const getCountryStyle = useCallback((feature: Feature | undefined) => {
    if (!feature) return {};
    
    const countryCode = getCountryCode(feature);
    const status = countryCode ? statusByCode.get(countryCode) : undefined;
    
    const isHovered = hoveredCountryCode === countryCode;
    const isSelected = selectedCountry?.code === countryCode;
    
    let fillColor = colors.landDefault;
    let fillOpacity = 0.7;
    let weight = 0.5;
    let color = colors.border;
    
    if (status === 'available') {
      fillColor = isHovered || isSelected ? colors.availableHover : colors.available;
      fillOpacity = isHovered || isSelected ? 0.9 : 0.75;
    } else if (status === 'coming_soon') {
      fillColor = isHovered ? colors.comingSoonHover : colors.comingSoon;
      fillOpacity = isHovered ? 0.85 : 0.7;
    } else if (status === 'soon') {
      fillColor = isHovered ? colors.soonHover : colors.soon;
      fillOpacity = isHovered ? 0.85 : 0.7;
    } else {
      fillColor = isHovered ? colors.landHover : colors.landDefault;
    }
    
    if (isSelected) {
      fillColor = colors.selected;
      fillOpacity = 0.95;
      weight = 2;
      color = colors.borderHover;
    } else if (isHovered) {
      weight = 1.5;
      color = colors.borderHover;
    }
    
    return { fillColor, fillOpacity, weight, color, opacity: 1 };
  }, [hoveredCountryCode, selectedCountry, statusByCode]);

  const onEachFeature = useCallback((feature: Feature, layer: Layer) => {
    const countryCode = getCountryCode(feature);
    const countryName = getCountryName(feature);
    
    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        if (countryCode) {
          setHoveredCountryCode(countryCode);
          setHoveredCountryName(countryName);
        }
        e.target.setStyle({ weight: 1.5, color: colors.borderHover, fillOpacity: 0.9 });
        e.target.bringToFront();
      },
      mouseout: (e: LeafletMouseEvent) => {
        setHoveredCountryCode(null);
        setHoveredCountryName(null);
        geoJsonRef.current?.resetStyle(e.target);
      },
      click: () => {
        if (countryCode) {
          // Toggle selection
          if (selectedCountry?.code === countryCode) {
            handleCountrySelect(null, null);
          } else {
            handleCountrySelect(countryCode, countryName);
          }
        }
      },
    });
    
    layer.on('touchstart', () => {
      if (countryCode) {
        setHoveredCountryCode(countryCode);
        setHoveredCountryName(countryName);
      }
    });
  }, [selectedCountry, handleCountrySelect]);

  // Get hovered country details for tooltip
  const hoveredCountryData = useMemo(() => {
    if (!hoveredCountryCode) return null;
    const country = findCountryByCode(hoveredCountryCode);
    return {
      code: hoveredCountryCode,
      name: hoveredCountryName || 'Unknown',
      flag: country?.flagEmoji || '🌍',
      countryDetails: country,
    };
  }, [hoveredCountryCode, hoveredCountryName]);

  const hoveredStatus = hoveredCountryCode ? statusByCode.get(hoveredCountryCode) : null;
  const selectedStatus = selectedCountry?.code ? statusByCode.get(selectedCountry.code) : null;

  const isLoading = loading || statusesLoading;

  if (isLoading) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] rounded-2xl overflow-hidden flex items-center justify-center" style={{ background: colors.ocean }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground font-body">Ładowanie mapy...</span>
        </div>
      </div>
    );
  }

  if (!geoData) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] rounded-2xl overflow-hidden flex items-center justify-center bg-muted">
        <span className="text-muted-foreground font-body">Nie udało się załadować mapy</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] rounded-2xl overflow-hidden">
      {/* Hover tooltip */}
      {hoveredCountryData && !selectedCountry && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 bg-card/95 backdrop-blur-md rounded-xl shadow-lg border border-border/50 pointer-events-none animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{hoveredCountryData.flag}</span>
            <div>
              <p className="font-display font-bold text-foreground">
                {hoveredCountryData.countryDetails?.name || hoveredCountryData.name}
              </p>
              <p className={`text-xs font-body ${hoveredStatus === 'available' ? 'text-green-600' : 'text-muted-foreground'}`}>
                {hoveredStatus === 'available' ? '✓ Kliknij, aby odkryć' : hoveredStatus === 'coming_soon' ? '⏳ Wkrótce' : hoveredStatus === 'soon' ? '🔜 Niebawem' : 'Kliknij po ciekawostki'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={6}
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        dragging={true}
        zoomControl={true}
        attributionControl={false}
        preferCanvas={true}
        style={{ height: '100%', width: '100%', background: colors.ocean, borderRadius: '1rem' }}
        ref={mapRef}
      >
        <GeoJSON
          key={`map-${statusesKey}`}
          data={geoData}
          style={getCountryStyle}
          onEachFeature={onEachFeature}
          ref={geoJsonRef}
        />

        <SmallIslandsOverlay
          geoData={geoData}
          getCountryCode={getCountryCode}
          statusByCode={statusByCode}
          colors={colors}
          hoveredCountryCode={hoveredCountryCode}
          selectedCountryCode={selectedCountry?.code ?? null}
          onHover={(code, name) => {
            setHoveredCountryCode(code);
            setHoveredCountryName(name);
          }}
          onHoverEnd={() => {
            setHoveredCountryCode(null);
            setHoveredCountryName(null);
          }}
          onSelect={(code, name) => {
            if (selectedCountry?.code === code) {
              handleCountrySelect(null, null);
            } else {
              handleCountrySelect(code, name);
            }
          }}
        />
        <ZoomToCountry selectedCountry={selectedCountry} geoData={geoData} />
      </MapContainer>
      
      {/* Country Fact Card - shows for ANY clicked country */}
      {selectedCountry && (
        <CountryFactCard
          countryCode={selectedCountry.code}
          countryName={selectedCountry.name}
          status={selectedStatus || null}
          onClose={() => handleCountrySelect(null, null)}
        />
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] hidden md:flex flex-col gap-2 bg-card/90 backdrop-blur-md rounded-xl p-3 shadow-md border border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.available }} />
          <span className="text-xs font-body text-muted-foreground">Dostępne</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.comingSoon }} />
          <span className="text-xs font-body text-muted-foreground">Wkrótce</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.soon }} />
          <span className="text-xs font-body text-muted-foreground">Niebawem</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.landDefault }} />
          <span className="text-xs font-body text-muted-foreground">Pozostałe</span>
        </div>
      </div>
    </div>
  );
}
