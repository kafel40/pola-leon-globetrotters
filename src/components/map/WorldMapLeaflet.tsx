import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import type { LatLngBoundsExpression, Layer, LeafletMouseEvent, Map as LeafletMap } from 'leaflet';
import type { Feature, GeoJsonObject } from 'geojson';
import { countries, type Country } from '@/data/countries';
import { countriesGeoData } from './countriesGeoData';
import 'leaflet/dist/leaflet.css';

// Map country slugs to GeoJSON country names/codes
const countryMapping: Record<string, string[]> = {
  'poland': ['Poland', 'POL'],
  'france': ['France', 'FRA'],
  'italy': ['Italy', 'ITA'],
  'spain': ['Spain', 'ESP'],
  'germany': ['Germany', 'DEU'],
  'uk': ['United Kingdom', 'GBR', 'Great Britain'],
  'greece': ['Greece', 'GRC'],
  'norway': ['Norway', 'NOR'],
  'sweden': ['Sweden', 'SWE'],
  'netherlands': ['Netherlands', 'NLD', 'Holland'],
  'japan': ['Japan', 'JPN'],
  'china': ['China', 'CHN'],
  'india': ['India', 'IND'],
  'thailand': ['Thailand', 'THA'],
  'egypt': ['Egypt', 'EGY'],
  'kenya': ['Kenya', 'KEN'],
  'morocco': ['Morocco', 'MAR'],
  'south-africa': ['South Africa', 'ZAF'],
  'usa': ['United States of America', 'USA', 'United States'],
  'canada': ['Canada', 'CAN'],
  'mexico': ['Mexico', 'MEX'],
  'brazil': ['Brazil', 'BRA'],
  'argentina': ['Argentina', 'ARG'],
  'peru': ['Peru', 'PER'],
  'australia': ['Australia', 'AUS'],
  'new-zealand': ['New Zealand', 'NZL'],
  'turkey': ['Turkey', 'TUR'],
  'iceland': ['Iceland', 'ISL'],
  'south-korea': ['South Korea', 'KOR', 'Korea'],
  'vietnam': ['Vietnam', 'VNM', 'Viet Nam'],
};

function findCountryByGeoName(geoName: string): Country | undefined {
  for (const country of countries) {
    const mappings = countryMapping[country.id];
    if (mappings && mappings.some(m => 
      m.toLowerCase() === geoName.toLowerCase() ||
      geoName.toLowerCase().includes(m.toLowerCase())
    )) {
      return country;
    }
  }
  return undefined;
}

// Color palette - calm, educational, book-like
const colors = {
  ocean: 'hsl(200, 30%, 92%)',
  landDefault: 'hsl(45, 25%, 88%)',
  landHover: 'hsl(45, 35%, 82%)',
  available: 'hsl(160, 30%, 80%)',
  availableHover: 'hsl(160, 45%, 70%)',
  comingSoon: 'hsl(210, 20%, 85%)',
  comingSoonHover: 'hsl(210, 30%, 78%)',
  selected: 'hsl(25, 70%, 82%)',
  border: 'hsl(220, 15%, 70%)',
  borderHover: 'hsl(220, 25%, 55%)',
};

// Map bounds to prevent scrolling into empty space
const maxBounds: LatLngBoundsExpression = [
  [-85, -180],
  [85, 180]
];

interface CountryInfoPanelProps {
  country: Country | null;
  onClose: () => void;
}

function CountryInfoPanel({ country, onClose }: CountryInfoPanelProps) {
  if (!country) return null;
  
  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[1000] animate-fade-in">
      <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-lg border border-border/50 p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{country.flagEmoji}</span>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">{country.name}</h3>
              <p className={`text-sm font-body ${country.status === 'available' ? 'text-green-600' : 'text-muted-foreground'}`}>
                {country.status === 'available' ? '✓ Dostępne' : '⏳ Wkrótce'}
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
        
        {country.status === 'available' ? (
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

interface ZoomToCountryProps {
  selectedCountry: Country | null;
  geoData: GeoJsonObject;
}

function ZoomToCountry({ selectedCountry, geoData }: ZoomToCountryProps) {
  const map = useMap();
  
  useEffect(() => {
    if (!selectedCountry) return;
    
    const features = (geoData as any).features || [];
    const feature = features.find((f: Feature) => {
      const name = f.properties?.name || f.properties?.NAME || f.properties?.ADMIN || '';
      return findCountryByGeoName(name)?.id === selectedCountry.id;
    });
    
    if (feature) {
      const L = (window as any).L;
      if (L) {
        const geoJsonLayer = L.geoJSON(feature);
        const bounds = geoJsonLayer.getBounds();
        map.flyToBounds(bounds, { 
          padding: [50, 50], 
          duration: 1,
          maxZoom: 5 
        });
      }
    }
  }, [selectedCountry, geoData, map]);
  
  return null;
}

interface WorldMapLeafletProps {
  onCountrySelect?: (country: Country | null) => void;
}

export function WorldMapLeaflet({ onCountrySelect }: WorldMapLeafletProps) {
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const geoJsonRef = useRef<any>(null);

  const handleCountrySelect = useCallback((country: Country | null) => {
    setSelectedCountry(country);
    onCountrySelect?.(country);
  }, [onCountrySelect]);

  const getCountryStyle = useCallback((feature: Feature | undefined) => {
    if (!feature) return {};
    
    const name = feature.properties?.name || feature.properties?.NAME || feature.properties?.ADMIN || '';
    const country = findCountryByGeoName(name);
    
    const isHovered = hoveredCountry?.id === country?.id;
    const isSelected = selectedCountry?.id === country?.id;
    
    let fillColor = colors.landDefault;
    let fillOpacity = 0.7;
    let weight = 0.5;
    let color = colors.border;
    
    if (country) {
      if (country.status === 'available') {
        fillColor = isHovered || isSelected ? colors.availableHover : colors.available;
        fillOpacity = isHovered || isSelected ? 0.9 : 0.75;
      } else {
        fillColor = isHovered ? colors.comingSoonHover : colors.comingSoon;
        fillOpacity = isHovered ? 0.85 : 0.7;
      }
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
    
    return {
      fillColor,
      fillOpacity,
      weight,
      color,
      opacity: 1,
    };
  }, [hoveredCountry, selectedCountry]);

  const onEachFeature = useCallback((feature: Feature, layer: Layer) => {
    const name = feature.properties?.name || feature.properties?.NAME || feature.properties?.ADMIN || '';
    const country = findCountryByGeoName(name);
    
    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const targetLayer = e.target;
        if (country) {
          setHoveredCountry(country);
        }
        targetLayer.setStyle({
          weight: 1.5,
          color: colors.borderHover,
          fillOpacity: 0.9,
        });
        targetLayer.bringToFront();
      },
      mouseout: (e: LeafletMouseEvent) => {
        setHoveredCountry(null);
        if (geoJsonRef.current) {
          geoJsonRef.current.resetStyle(e.target);
        }
      },
      click: () => {
        if (country) {
          handleCountrySelect(selectedCountry?.id === country.id ? null : country);
        }
      },
    });
    
    // Add touch support
    layer.on('touchstart', () => {
      if (country) {
        setHoveredCountry(country);
      }
    });
  }, [selectedCountry, handleCountrySelect]);

  const geoData = useMemo(() => countriesGeoData, []);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] rounded-2xl overflow-hidden">
      {/* Tooltip for hovered country */}
      {hoveredCountry && !selectedCountry && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 bg-card/95 backdrop-blur-md rounded-xl shadow-lg border border-border/50 pointer-events-none animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{hoveredCountry.flagEmoji}</span>
            <div>
              <p className="font-display font-bold text-foreground">{hoveredCountry.name}</p>
              <p className={`text-xs font-body ${hoveredCountry.status === 'available' ? 'text-green-600' : 'text-muted-foreground'}`}>
                {hoveredCountry.status === 'available' ? '✓ Kliknij, aby odkryć' : '⏳ Wkrótce'}
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
        style={{ 
          height: '100%', 
          width: '100%', 
          background: colors.ocean,
          borderRadius: '1rem'
        }}
        ref={mapRef}
      >
        <GeoJSON
          data={geoData}
          style={getCountryStyle}
          onEachFeature={onEachFeature}
          ref={geoJsonRef}
        />
        <ZoomToCountry selectedCountry={selectedCountry} geoData={geoData} />
      </MapContainer>
      
      {/* Country info panel */}
      <CountryInfoPanel 
        country={selectedCountry} 
        onClose={() => handleCountrySelect(null)} 
      />
      
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
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.selected }} />
          <span className="text-xs font-body text-muted-foreground">Wybrane</span>
        </div>
      </div>
    </div>
  );
}
