import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import type { LatLngBoundsExpression, Layer, LeafletMouseEvent, Map as LeafletMap } from 'leaflet';
import type { Feature, FeatureCollection, GeoJsonObject } from 'geojson';
import { countries, type Country } from '@/data/countries';
import { useCountryStatuses, type CountryStatusType } from '@/hooks/useCountryStatuses';
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

function getCountryCode(feature: Feature): string | undefined {
  const props = feature.properties || {};
  // Natural Earth 110m uses ISO_A3 or ADM0_A3 for country codes
  return props.ISO_A3 || props.ADM0_A3 || props.ISO_A3_EH || props.SOV_A3;
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

interface CountryInfoPanelProps {
  country: Country | null;
  status: CountryStatusType | null;
  onClose: () => void;
}

function CountryInfoPanel({ country, status, onClose }: CountryInfoPanelProps) {
  if (!country) return null;
  
  const isAvailable = status === 'available';
  
  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[1000] animate-fade-in">
      <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-lg border border-border/50 p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{country.flagEmoji}</span>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">{country.name}</h3>
              <p className={`text-sm font-body ${isAvailable ? 'text-green-600' : 'text-muted-foreground'}`}>
                {isAvailable ? '✓ Dostępne' : status === 'coming_soon' ? '⏳ Wkrótce' : status === 'soon' ? '🔜 Niebawem' : ''}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Zamknij"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-sm text-muted-foreground font-body mb-3 line-clamp-2">
          {country.descriptionForParents}
        </p>
        
        <div className="bg-accent/50 rounded-xl p-3 mb-4">
          <p className="text-xs font-body text-accent-foreground">
            💡 {country.geographyFunFact}
          </p>
        </div>
        
        {isAvailable ? (
          <Link 
            to={`/kraj/${country.slug}`}
            className="block w-full text-center bg-primary text-primary-foreground font-display font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Odkryj przygodę →
          </Link>
        ) : (
          <div className="block w-full text-center bg-muted text-muted-foreground font-display py-3 rounded-xl">
            Wkrótce dostępne
          </div>
        )}
      </div>
    </div>
  );
}

function ZoomToCountry({ selectedCountry, geoData }: { selectedCountry: Country | null; geoData: FeatureCollection | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (!selectedCountry || !geoData) return;
    
    const feature = geoData.features.find((f: Feature) => {
      const code = getCountryCode(f);
      return code && findCountryByCode(code)?.id === selectedCountry.id;
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
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<LeafletMap | null>(null);
  const geoJsonRef = useRef<any>(null);
  
  const { countryStatuses, loading: statusesLoading } = useCountryStatuses();
  
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

  const handleCountrySelect = useCallback((country: Country | null) => {
    setSelectedCountry(country);
    onCountrySelect?.(country);
  }, [onCountrySelect]);

  const getCountryStyle = useCallback((feature: Feature | undefined) => {
    if (!feature) return {};
    
    const countryCode = getCountryCode(feature);
    const status = countryCode ? statusByCode.get(countryCode) : undefined;
    const country = countryCode ? findCountryByCode(countryCode) : undefined;
    
    const isHovered = hoveredCountryCode === countryCode;
    const isSelected = selectedCountry && country?.id === selectedCountry.id;
    
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
    const country = countryCode ? findCountryByCode(countryCode) : undefined;
    
    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        if (countryCode) setHoveredCountryCode(countryCode);
        e.target.setStyle({ weight: 1.5, color: colors.borderHover, fillOpacity: 0.9 });
        e.target.bringToFront();
      },
      mouseout: (e: LeafletMouseEvent) => {
        setHoveredCountryCode(null);
        geoJsonRef.current?.resetStyle(e.target);
      },
      click: () => {
        if (country) handleCountrySelect(selectedCountry?.id === country.id ? null : country);
      },
    });
    
    layer.on('touchstart', () => {
      if (countryCode) setHoveredCountryCode(countryCode);
    });
  }, [selectedCountry, handleCountrySelect]);

  const hoveredCountry = useMemo(() => {
    if (!hoveredCountryCode) return null;
    return findCountryByCode(hoveredCountryCode);
  }, [hoveredCountryCode]);

  const hoveredStatus = hoveredCountryCode ? statusByCode.get(hoveredCountryCode) : null;
  const selectedStatus = selectedCountry 
    ? statusByCode.get(Object.entries(codeToSlug).find(([, slug]) => slug === selectedCountry.id)?.[0] || '')
    : null;

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
      {hoveredCountry && !selectedCountry && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 bg-card/95 backdrop-blur-md rounded-xl shadow-lg border border-border/50 pointer-events-none animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{hoveredCountry.flagEmoji}</span>
            <div>
              <p className="font-display font-bold text-foreground">{hoveredCountry.name}</p>
              <p className={`text-xs font-body ${hoveredStatus === 'available' ? 'text-green-600' : 'text-muted-foreground'}`}>
                {hoveredStatus === 'available' ? '✓ Kliknij, aby odkryć' : hoveredStatus === 'coming_soon' ? '⏳ Wkrótce' : hoveredStatus === 'soon' ? '🔜 Niebawem' : ''}
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
          key={`map-${countryStatuses.length}`}
          data={geoData}
          style={getCountryStyle}
          onEachFeature={onEachFeature}
          ref={geoJsonRef}
        />
        <ZoomToCountry selectedCountry={selectedCountry} geoData={geoData} />
      </MapContainer>
      
      <CountryInfoPanel country={selectedCountry} status={selectedStatus} onClose={() => handleCountrySelect(null)} />
      
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
