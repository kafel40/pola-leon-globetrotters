import { useState } from 'react';
import { Link } from 'react-router-dom';
import { countries, type Country } from '@/data/countries';

interface CountryPathProps {
  country: Country;
  d: string;
  onHover: (country: Country | null) => void;
}

function CountryPath({ country, d, onHover }: CountryPathProps) {
  const isAvailable = country.status === 'available';
  
  return (
    <Link to={`/kraj/${country.slug}`}>
      <path
        d={d}
        className={`transition-all duration-200 cursor-pointer ${
          isAvailable
            ? 'fill-dreamy-mint hover:fill-dreamy-peach stroke-foreground/30'
            : 'fill-muted hover:fill-muted/80 stroke-foreground/20'
        }`}
        strokeWidth="0.5"
        strokeLinejoin="round"
        onMouseEnter={() => onHover(country)}
        onMouseLeave={() => onHover(null)}
      />
    </Link>
  );
}

// Realistic simplified SVG paths for countries (based on actual geographical shapes)
const countryPaths: Record<string, string> = {
  // EUROPE
  poland: 'M525,128 L532,125 L540,127 L545,132 L544,138 L538,143 L530,145 L522,142 L518,136 L520,130 Z',
  france: 'M470,145 L478,140 L488,142 L495,148 L493,158 L485,165 L475,168 L465,162 L462,152 L468,146 Z',
  italy: 'M498,152 L502,150 L508,155 L510,165 L506,175 L500,182 L495,178 L493,168 L496,158 Z M502,185 L508,182 L512,188 L506,194 L500,190 Z',
  spain: 'M445,155 L458,150 L472,152 L478,160 L475,172 L462,180 L448,178 L440,168 L442,158 Z',
  germany: 'M488,125 L498,122 L510,125 L515,132 L512,142 L502,148 L490,145 L484,138 L486,128 Z',
  uk: 'M458,115 L465,110 L472,112 L475,120 L472,130 L465,135 L458,132 L455,125 L457,118 Z M460,105 L468,102 L470,108 L462,110 Z',
  greece: 'M528,168 L536,165 L542,170 L540,180 L534,186 L526,183 L522,175 L525,170 Z M530,188 L538,186 L535,192 L528,190 Z',
  norway: 'M490,80 L502,75 L512,80 L518,95 L512,115 L500,120 L492,110 L488,95 L490,85 Z',
  
  // ASIA
  japan: 'M835,135 L842,132 L848,138 L846,150 L840,158 L832,155 L828,145 L830,138 Z M842,160 L848,158 L850,168 L844,172 L838,168 Z',
  china: 'M720,120 L760,115 L790,125 L810,145 L805,170 L780,185 L745,180 L715,160 L710,140 L718,125 Z',
  india: 'M680,175 L705,165 L720,180 L715,210 L700,235 L680,245 L665,230 L660,200 L670,180 Z',
  thailand: 'M738,210 L748,205 L755,215 L752,235 L745,250 L738,255 L732,245 L735,225 L740,215 Z',
  
  // AFRICA
  egypt: 'M540,190 L560,185 L575,195 L572,215 L558,225 L542,220 L535,205 L538,192 Z',
  kenya: 'M568,275 L582,270 L590,280 L588,295 L580,305 L568,302 L562,290 L565,278 Z',
  morocco: 'M440,185 L458,180 L470,188 L468,205 L455,215 L442,212 L435,200 L438,188 Z',
  'south-africa': 'M530,345 L560,340 L578,355 L575,380 L555,395 L530,390 L518,370 L522,350 Z',
  
  // NORTH AMERICA
  usa: 'M120,145 L200,135 L260,145 L280,160 L275,185 L240,195 L180,200 L130,190 L110,170 L115,150 Z M265,175 L285,170 L295,180 L290,195 L275,200 L265,190 Z',
  canada: 'M100,70 L200,60 L280,75 L310,100 L295,130 L240,140 L160,145 L100,130 L80,100 L95,75 Z',
  mexico: 'M140,200 L180,195 L210,210 L220,240 L200,265 L165,270 L140,250 L130,220 L135,205 Z',
  
  // SOUTH AMERICA  
  brazil: 'M260,275 L310,265 L345,285 L360,330 L340,375 L295,390 L260,370 L245,325 L250,285 Z',
  argentina: 'M270,385 L300,380 L315,410 L310,455 L290,480 L270,475 L260,440 L265,400 Z',
  peru: 'M230,295 L260,288 L275,310 L268,345 L245,360 L225,345 L220,315 L228,298 Z',
  
  // OCEANIA
  australia: 'M770,330 L830,320 L870,340 L880,380 L860,410 L810,420 L770,400 L755,365 L760,340 Z',
  'new-zealand': 'M895,385 L908,380 L915,395 L910,415 L898,425 L888,415 L885,400 L890,388 Z',
};

export function WorldMap() {
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);

  return (
    <div className="relative w-full">
      {/* Tooltip */}
      {hoveredCountry && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-card rounded-xl shadow-card border border-border">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{hoveredCountry.flagEmoji}</span>
            <div>
              <p className="font-display font-bold text-foreground">{hoveredCountry.name}</p>
              <p className="text-xs text-muted-foreground font-body">
                {hoveredCountry.status === 'available' ? 'Dostępne' : 'Wkrótce'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SVG Map */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-auto"
        style={{ maxHeight: '70vh' }}
      >
        {/* Background ocean */}
        <rect width="1000" height="500" className="fill-dreamy-blue/20" />
        
        {/* Ocean texture */}
        <defs>
          <pattern id="waves" patternUnits="userSpaceOnUse" width="40" height="40">
            <path
              d="M 0 20 Q 10 15, 20 20 T 40 20"
              fill="none"
              className="stroke-dreamy-blue/15"
              strokeWidth="0.5"
            />
            <path
              d="M 0 30 Q 10 25, 20 30 T 40 30"
              fill="none"
              className="stroke-dreamy-blue/10"
              strokeWidth="0.5"
            />
          </pattern>
          
          {/* Land base - continents outline */}
          <filter id="land-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.1"/>
          </filter>
        </defs>
        <rect width="1000" height="500" fill="url(#waves)" />
        
        {/* Continent base shapes (subtle land mass background) */}
        <g className="fill-muted/30" filter="url(#land-shadow)">
          {/* Europe */}
          <path d="M430,90 Q520,85 560,120 Q580,150 550,190 Q500,200 440,180 Q420,150 430,90" />
          {/* Asia */}
          <path d="M560,80 Q750,70 850,150 Q860,200 820,250 Q700,280 620,240 Q560,180 560,80" />
          {/* Africa */}
          <path d="M430,200 Q540,180 600,240 Q610,320 570,400 Q500,420 450,380 Q420,300 430,200" />
          {/* North America */}
          <path d="M60,60 Q200,40 320,100 Q340,180 280,230 Q180,250 80,200 Q40,140 60,60" />
          {/* South America */}
          <path d="M200,250 Q300,240 370,300 Q380,400 320,480 Q260,500 220,450 Q190,350 200,250" />
          {/* Australia */}
          <path d="M740,300 Q860,290 900,360 Q910,420 850,450 Q760,460 720,400 Q710,340 740,300" />
        </g>

        {/* Country paths */}
        {countries.map((country) => {
          const path = countryPaths[country.id];
          if (!path) return null;
          
          return (
            <CountryPath
              key={country.id}
              country={country}
              d={path}
              onHover={setHoveredCountry}
            />
          );
        })}

        {/* Continent labels */}
        <text x="490" y="105" className="fill-foreground/50 text-[10px] font-display font-semibold" textAnchor="middle">EUROPA</text>
        <text x="720" y="140" className="fill-foreground/50 text-[10px] font-display font-semibold" textAnchor="middle">AZJA</text>
        <text x="520" y="280" className="fill-foreground/50 text-[10px] font-display font-semibold" textAnchor="middle">AFRYKA</text>
        <text x="190" y="120" className="fill-foreground/50 text-[10px] font-display font-semibold" textAnchor="middle">AMERYKA PN.</text>
        <text x="290" y="330" className="fill-foreground/50 text-[10px] font-display font-semibold" textAnchor="middle">AMERYKA PD.</text>
        <text x="820" y="380" className="fill-foreground/50 text-[10px] font-display font-semibold" textAnchor="middle">OCEANIA</text>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-dreamy-mint border border-foreground/20" />
          <span className="text-sm font-body text-muted-foreground">Dostępne kraje</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted border border-foreground/20" />
          <span className="text-sm font-body text-muted-foreground">Wkrótce</span>
        </div>
      </div>
    </div>
  );
}
