import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import type { LatLngBoundsExpression, Layer, LeafletMouseEvent, Map as LeafletMap } from 'leaflet';
import type { Feature, GeoJsonObject } from 'geojson';
import { countries, type Country } from '@/data/countries';
import { countriesGeoData } from './countriesGeoData';
import { useCountryStatuses, type CountryStatusType } from '@/hooks/useCountryStatuses';
import 'leaflet/dist/leaflet.css';

// Map country slugs to GeoJSON country names/codes
const countryCodeToGeoNames: Record<string, string[]> = {
  'POL': ['Poland', 'POL'],
  'FRA': ['France', 'FRA'],
  'ITA': ['Italy', 'ITA'],
  'ESP': ['Spain', 'ESP'],
  'DEU': ['Germany', 'DEU'],
  'GBR': ['United Kingdom', 'GBR', 'Great Britain'],
  'GRC': ['Greece', 'GRC'],
  'NOR': ['Norway', 'NOR'],
  'SWE': ['Sweden', 'SWE'],
  'NLD': ['Netherlands', 'NLD', 'Holland'],
  'JPN': ['Japan', 'JPN'],
  'CHN': ['China', 'CHN'],
  'IND': ['India', 'IND'],
  'THA': ['Thailand', 'THA'],
  'EGY': ['Egypt', 'EGY'],
  'KEN': ['Kenya', 'KEN'],
  'MAR': ['Morocco', 'MAR'],
  'ZAF': ['South Africa', 'ZAF'],
  'USA': ['United States of America', 'USA', 'United States'],
  'CAN': ['Canada', 'CAN'],
  'MEX': ['Mexico', 'MEX'],
  'BRA': ['Brazil', 'BRA'],
  'ARG': ['Argentina', 'ARG'],
  'PER': ['Peru', 'PER'],
  'AUS': ['Australia', 'AUS'],
  'NZL': ['New Zealand', 'NZL'],
  'TUR': ['Turkey', 'TUR'],
  'ISL': ['Iceland', 'ISL'],
  'KOR': ['South Korea', 'KOR', 'Korea'],
  'VNM': ['Vietnam', 'VNM', 'Viet Nam'],
  'RUS': ['Russia', 'RUS'],
  'AFG': ['Afghanistan', 'AFG'],
  'ALB': ['Albania', 'ALB'],
  'DZA': ['Algeria', 'DZA'],
  'AGO': ['Angola', 'AGO'],
  'AUT': ['Austria', 'AUT'],
  'BEL': ['Belgium', 'BEL'],
  'BOL': ['Bolivia', 'BOL'],
  'BIH': ['Bosnia and Herzegovina', 'BIH'],
  'BWA': ['Botswana', 'BWA'],
  'BGR': ['Bulgaria', 'BGR'],
  'CHL': ['Chile', 'CHL'],
  'COL': ['Colombia', 'COL'],
  'COD': ['Democratic Republic of the Congo', 'COD', 'Dem. Rep. Congo'],
  'COG': ['Republic of the Congo', 'COG', 'Congo'],
  'HRV': ['Croatia', 'HRV'],
  'CUB': ['Cuba', 'CUB'],
  'CZE': ['Czech Republic', 'CZE', 'Czechia'],
  'DNK': ['Denmark', 'DNK'],
  'ECU': ['Ecuador', 'ECU'],
  'ETH': ['Ethiopia', 'ETH'],
  'FIN': ['Finland', 'FIN'],
  'GEO': ['Georgia', 'GEO'],
  'GHA': ['Ghana', 'GHA'],
  'HTI': ['Haiti', 'HTI'],
  'HUN': ['Hungary', 'HUN'],
  'IDN': ['Indonesia', 'IDN'],
  'IRN': ['Iran', 'IRN'],
  'IRQ': ['Iraq', 'IRQ'],
  'IRL': ['Ireland', 'IRL'],
  'ISR': ['Israel', 'ISR'],
  'JAM': ['Jamaica', 'JAM'],
  'JOR': ['Jordan', 'JOR'],
  'KAZ': ['Kazakhstan', 'KAZ'],
  'PRK': ['North Korea', 'PRK'],
  'KWT': ['Kuwait', 'KWT'],
  'LBN': ['Lebanon', 'LBN'],
  'LBY': ['Libya', 'LBY'],
  'LTU': ['Lithuania', 'LTU'],
  'LVA': ['Latvia', 'LVA'],
  'MYS': ['Malaysia', 'MYS'],
  'MLI': ['Mali', 'MLI'],
  'MNG': ['Mongolia', 'MNG'],
  'MOZ': ['Mozambique', 'MOZ'],
  'MMR': ['Myanmar', 'MMR'],
  'NAM': ['Namibia', 'NAM'],
  'NPL': ['Nepal', 'NPL'],
  'NGA': ['Nigeria', 'NGA'],
  'NER': ['Niger', 'NER'],
  'OMN': ['Oman', 'OMN'],
  'PAK': ['Pakistan', 'PAK'],
  'PAN': ['Panama', 'PAN'],
  'PNG': ['Papua New Guinea', 'PNG'],
  'PRY': ['Paraguay', 'PRY'],
  'PHL': ['Philippines', 'PHL'],
  'PRT': ['Portugal', 'PRT'],
  'QAT': ['Qatar', 'QAT'],
  'ROU': ['Romania', 'ROU'],
  'SAU': ['Saudi Arabia', 'SAU'],
  'SEN': ['Senegal', 'SEN'],
  'SRB': ['Serbia', 'SRB'],
  'SVK': ['Slovakia', 'SVK'],
  'SVN': ['Slovenia', 'SVN'],
  'SOM': ['Somalia', 'SOM'],
  'LKA': ['Sri Lanka', 'LKA'],
  'SDN': ['Sudan', 'SDN'],
  'SSD': ['South Sudan', 'SSD'],
  'SYR': ['Syria', 'SYR'],
  'TWN': ['Taiwan', 'TWN'],
  'TZA': ['Tanzania', 'TZA'],
  'TUN': ['Tunisia', 'TUN'],
  'UKR': ['Ukraine', 'UKR'],
  'ARE': ['United Arab Emirates', 'ARE'],
  'URY': ['Uruguay', 'URY'],
  'UZB': ['Uzbekistan', 'UZB'],
  'VEN': ['Venezuela', 'VEN'],
  'YEM': ['Yemen', 'YEM'],
  'ZMB': ['Zambia', 'ZMB'],
  'ZWE': ['Zimbabwe', 'ZWE'],
  'CHE': ['Switzerland', 'CHE'],
  'MNE': ['Montenegro', 'MNE'],
  'MKD': ['North Macedonia', 'MKD', 'Macedonia'],
  'MDA': ['Moldova', 'MDA'],
  'TJK': ['Tajikistan', 'TJK'],
  'TKM': ['Turkmenistan', 'TKM'],
  'KGZ': ['Kyrgyzstan', 'KGZ'],
  'ARM': ['Armenia', 'ARM'],
  'AZE': ['Azerbaijan', 'AZE'],
  'EST': ['Estonia', 'EST'],
  'CMR': ['Cameroon', 'CMR'],
  'CAF': ['Central African Republic', 'CAF'],
  'TCD': ['Chad', 'TCD'],
  'CIV': ['Ivory Coast', 'CIV', "Côte d'Ivoire"],
  'GIN': ['Guinea', 'GIN'],
  'BEN': ['Benin', 'BEN'],
  'BFA': ['Burkina Faso', 'BFA'],
  'BDI': ['Burundi', 'BDI'],
  'ERI': ['Eritrea', 'ERI'],
  'GAB': ['Gabon', 'GAB'],
  'GMB': ['Gambia', 'GMB'],
  'GNB': ['Guinea-Bissau', 'GNB'],
  'LBR': ['Liberia', 'LBR'],
  'MDG': ['Madagascar', 'MDG'],
  'MWI': ['Malawi', 'MWI'],
  'MRT': ['Mauritania', 'MRT'],
  'RWA': ['Rwanda', 'RWA'],
  'SLE': ['Sierra Leone', 'SLE'],
  'SWZ': ['Eswatini', 'SWZ', 'Swaziland'],
  'TGO': ['Togo', 'TGO'],
  'UGA': ['Uganda', 'UGA'],
  'BGD': ['Bangladesh', 'BGD'],
  'BTN': ['Bhutan', 'BTN'],
  'BRN': ['Brunei', 'BRN'],
  'KHM': ['Cambodia', 'KHM'],
  'LAO': ['Laos', 'LAO'],
  'CRI': ['Costa Rica', 'CRI'],
  'DOM': ['Dominican Republic', 'DOM'],
  'SLV': ['El Salvador', 'SLV'],
  'GTM': ['Guatemala', 'GTM'],
  'HND': ['Honduras', 'HND'],
  'NIC': ['Nicaragua', 'NIC'],
  'SUR': ['Suriname', 'SUR'],
  'GUY': ['Guyana', 'GUY'],
  'GNQ': ['Equatorial Guinea', 'GNQ'],
  'DJI': ['Djibouti', 'DJI'],
  'LSO': ['Lesotho', 'LSO'],
  'AND': ['Andorra', 'AND'],
  'CYP': ['Cyprus', 'CYP'],
  'LUX': ['Luxembourg', 'LUX'],
  'MLT': ['Malta', 'MLT'],
};

function findCountryCodeByGeoName(geoName: string): string | undefined {
  const normalizedGeoName = geoName.toLowerCase();
  for (const [code, names] of Object.entries(countryCodeToGeoNames)) {
    if (names.some(n => 
      n.toLowerCase() === normalizedGeoName ||
      normalizedGeoName.includes(n.toLowerCase())
    )) {
      return code;
    }
  }
  return undefined;
}

// Find Country from countries.ts by GeoJSON name (for country details display)
function findCountryByGeoName(geoName: string): Country | undefined {
  const code = findCountryCodeByGeoName(geoName);
  if (!code) return undefined;
  
  // Map code to slug in countries.ts
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
  
  const slug = codeToSlug[code];
  if (!slug) return undefined;
  
  return countries.find(c => c.id === slug);
}

// Color palette - calm, educational, book-like
const colors = {
  ocean: 'hsl(200, 30%, 92%)',
  landDefault: 'hsl(220, 10%, 82%)',        // Gray for other countries (none)
  landHover: 'hsl(220, 12%, 76%)',          // Slightly darker gray on hover
  available: 'hsl(160, 35%, 75%)',          // Green for available
  availableHover: 'hsl(160, 45%, 65%)',     // Darker green on hover
  comingSoon: 'hsl(45, 55%, 80%)',          // Pastel gold for coming soon (wkrótce)
  comingSoonHover: 'hsl(45, 60%, 72%)',     // Darker gold on hover
  soon: 'hsl(30, 60%, 78%)',                // Orange for soon (niebawem)
  soonHover: 'hsl(30, 65%, 68%)',           // Darker orange on hover
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
  const [hoveredCountryCode, setHoveredCountryCode] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const geoJsonRef = useRef<any>(null);
  
  // Fetch country statuses from database
  const { countryStatuses, loading: statusesLoading } = useCountryStatuses();
  
  // Create a lookup map for quick status access
  const statusByCode = useMemo(() => {
    const map = new Map<string, CountryStatusType>();
    countryStatuses.forEach(cs => {
      map.set(cs.country_code, cs.status);
    });
    return map;
  }, [countryStatuses]);

  const handleCountrySelect = useCallback((country: Country | null) => {
    setSelectedCountry(country);
    onCountrySelect?.(country);
  }, [onCountrySelect]);

  const getCountryStyle = useCallback((feature: Feature | undefined) => {
    if (!feature) return {};
    
    const name = feature.properties?.name || feature.properties?.NAME || feature.properties?.ADMIN || '';
    const countryCode = findCountryCodeByGeoName(name);
    const status = countryCode ? statusByCode.get(countryCode) : undefined;
    const country = findCountryByGeoName(name);
    
    const isHovered = hoveredCountryCode === countryCode;
    const isSelected = selectedCountry && country?.id === selectedCountry.id;
    
    let fillColor = colors.landDefault;
    let fillOpacity = 0.7;
    let weight = 0.5;
    let color = colors.border;
    
    // Apply colors based on status from database
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
      // 'none' or unknown - gray
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
  }, [hoveredCountryCode, selectedCountry, statusByCode]);

  const onEachFeature = useCallback((feature: Feature, layer: Layer) => {
    const name = feature.properties?.name || feature.properties?.NAME || feature.properties?.ADMIN || '';
    const countryCode = findCountryCodeByGeoName(name);
    const country = findCountryByGeoName(name);
    
    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const targetLayer = e.target;
        if (countryCode) {
          setHoveredCountryCode(countryCode);
        }
        targetLayer.setStyle({
          weight: 1.5,
          color: colors.borderHover,
          fillOpacity: 0.9,
        });
        targetLayer.bringToFront();
      },
      mouseout: (e: LeafletMouseEvent) => {
        setHoveredCountryCode(null);
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
      if (countryCode) {
        setHoveredCountryCode(countryCode);
      }
    });
  }, [selectedCountry, handleCountrySelect]);

  // Get hovered country details for tooltip
  const hoveredCountry = useMemo(() => {
    if (!hoveredCountryCode) return null;
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
    const slug = codeToSlug[hoveredCountryCode];
    return slug ? countries.find(c => c.id === slug) : null;
  }, [hoveredCountryCode]);

  const hoveredStatus = hoveredCountryCode ? statusByCode.get(hoveredCountryCode) : null;

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
