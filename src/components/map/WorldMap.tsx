import { useState } from 'react';
import { Link } from 'react-router-dom';
import { countries, type Country } from '@/data/countries';

interface CountryPathProps {
  country: Country;
  d: string;
  onHover: (country: Country | null) => void;
  isHovered: boolean;
}

function CountryPath({ country, d, onHover, isHovered }: CountryPathProps) {
  const isAvailable = country.status === 'available';
  
  return (
    <Link to={`/kraj/${country.slug}`}>
      <path
        d={d}
        className={`transition-all duration-300 cursor-pointer ${
          isAvailable
            ? isHovered
              ? 'fill-dreamy-peach stroke-primary'
              : 'fill-dreamy-mint stroke-foreground/30'
            : isHovered
              ? 'fill-muted/90 stroke-foreground/40'
              : 'fill-muted stroke-foreground/20'
        }`}
        strokeWidth={isHovered ? '1.5' : '0.8'}
        strokeLinejoin="round"
        strokeLinecap="round"
        onMouseEnter={() => onHover(country)}
        onMouseLeave={() => onHover(null)}
        style={{
          filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' : 'none',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          transformOrigin: 'center',
          transformBox: 'fill-box',
        }}
      />
    </Link>
  );
}

// More detailed and realistic SVG paths for countries
const countryPaths: Record<string, string> = {
  // EUROPE - more detailed shapes
  poland: 'M520,125 L528,122 L536,123 L542,126 L546,130 L548,136 L546,142 L540,147 L532,150 L524,148 L518,144 L514,138 L514,132 L517,127 Z',
  france: 'M465,140 L472,136 L482,137 L492,140 L500,145 L502,154 L498,164 L490,172 L478,176 L466,173 L458,165 L456,155 L460,145 Z',
  italy: 'M500,148 L506,145 L512,148 L516,156 L514,166 L510,176 L504,186 L498,192 L492,188 L490,176 L492,164 L496,154 Z M504,195 L512,192 L518,198 L514,206 L506,204 L502,198 Z',
  spain: 'M438,152 L452,147 L468,148 L480,154 L484,164 L480,176 L468,186 L452,188 L438,184 L430,172 L432,160 Z M486,180 L492,178 L496,184 L490,188 Z',
  germany: 'M484,118 L496,115 L508,118 L518,124 L520,134 L516,144 L504,150 L490,148 L480,140 L478,130 L482,122 Z',
  uk: 'M454,108 L462,104 L472,106 L478,114 L476,126 L470,136 L460,140 L452,136 L448,126 L450,116 Z M456,98 L466,94 L470,100 L464,106 L456,104 Z',
  greece: 'M524,165 L534,161 L544,166 L546,176 L540,186 L530,190 L522,186 L518,176 L520,168 Z M528,193 L538,190 L540,198 L532,202 L526,196 Z',
  norway: 'M488,70 L502,64 L516,72 L524,88 L520,110 L508,122 L496,118 L488,104 L484,88 L486,76 Z',
  
  // ASIA - more detailed
  japan: 'M832,128 L842,124 L852,130 L854,142 L848,156 L838,164 L828,160 L822,148 L824,136 Z M838,166 L848,162 L854,172 L848,182 L840,178 L836,170 Z',
  china: 'M710,110 L755,105 L795,118 L820,140 L815,170 L790,190 L750,188 L715,168 L700,145 L705,125 Z',
  india: 'M670,168 L700,158 L722,175 L718,210 L702,240 L680,252 L660,238 L652,205 L662,178 Z',
  thailand: 'M732,205 L744,198 L754,210 L752,234 L746,252 L736,260 L726,250 L728,228 L734,212 Z',
  
  // AFRICA - more detailed
  egypt: 'M535,186 L558,180 L578,192 L576,216 L560,230 L540,225 L528,208 L532,190 Z',
  kenya: 'M562,272 L580,266 L594,278 L592,298 L582,312 L566,308 L556,294 L560,278 Z',
  morocco: 'M434,182 L456,176 L470,186 L468,206 L454,220 L436,216 L426,202 L430,186 Z',
  'south-africa': 'M525,340 L560,334 L582,352 L580,382 L558,400 L528,396 L512,374 L518,352 Z',
  
  // NORTH AMERICA - more detailed
  usa: 'M115,138 L195,125 L260,138 L285,158 L282,188 L248,202 L185,210 L130,200 L105,175 L108,150 Z M268,175 L292,168 L305,182 L298,200 L278,208 L265,195 Z',
  canada: 'M95,60 L195,48 L285,65 L320,95 L305,130 L248,145 L165,152 L100,138 L72,105 L88,68 Z',
  mexico: 'M135,198 L175,190 L210,208 L225,242 L205,272 L165,280 L135,260 L122,225 L128,205 Z',
  
  // SOUTH AMERICA - more detailed
  brazil: 'M255,272 L310,260 L350,282 L368,332 L348,382 L298,400 L258,378 L240,328 L248,285 Z',
  argentina: 'M265,390 L302,382 L320,418 L316,465 L294,495 L268,490 L255,452 L260,410 Z',
  peru: 'M225,292 L258,284 L278,310 L272,350 L246,368 L222,352 L214,318 L222,296 Z',
  
  // OCEANIA - more detailed
  australia: 'M762,325 L828,312 L875,335 L890,380 L872,418 L818,432 L768,412 L748,368 L752,340 Z',
  'new-zealand': 'M892,382 L908,375 L918,394 L914,418 L900,432 L886,422 L880,402 L886,386 Z',
};

export function WorldMap() {
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);

  return (
    <div className="relative w-full">
      {/* Tooltip */}
      {hoveredCountry && (
        <div 
          className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-5 py-3 bg-card rounded-2xl shadow-lg border border-border/50 animate-fade-in-up"
          style={{ animationDuration: '0.2s' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{hoveredCountry.flagEmoji}</span>
            <div>
              <p className="font-display font-bold text-foreground text-lg">{hoveredCountry.name}</p>
              <p className={`text-sm font-body ${hoveredCountry.status === 'available' ? 'text-dreamy-mint' : 'text-muted-foreground'}`}>
                {hoveredCountry.status === 'available' ? '✓ Dostępne' : '⏳ Wkrótce'}
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
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background ocean with gradient */}
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(210 40% 92%)" />
            <stop offset="50%" stopColor="hsl(200 35% 88%)" />
            <stop offset="100%" stopColor="hsl(210 45% 85%)" />
          </linearGradient>
          
          {/* Wave pattern */}
          <pattern id="waves" patternUnits="userSpaceOnUse" width="60" height="30" patternTransform="rotate(5)">
            <path
              d="M 0 15 Q 15 10, 30 15 T 60 15"
              fill="none"
              stroke="hsl(200 30% 85%)"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </pattern>
          
          {/* Shadow filter for continents */}
          <filter id="landShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="2" dy="2" stdDeviation="4" floodColor="hsl(220 25% 20%)" floodOpacity="0.08"/>
          </filter>

          {/* Glow effect for hovered countries */}
          <filter id="hoverGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Ocean background */}
        <rect width="1000" height="500" fill="url(#oceanGradient)" />
        <rect width="1000" height="500" fill="url(#waves)" />
        
        {/* Continent base shapes with smooth edges */}
        <g filter="url(#landShadow)">
          {/* Europe */}
          <path 
            d="M425,85 Q470,75 520,80 Q565,90 580,130 Q590,165 560,200 Q520,210 470,195 Q430,175 420,140 Q415,105 425,85" 
            className="fill-muted/40"
            strokeLinejoin="round"
          />
          {/* Asia */}
          <path 
            d="M555,70 Q700,55 840,100 Q880,150 870,220 Q850,270 780,290 Q680,300 600,260 Q540,200 545,130 Q550,90 555,70" 
            className="fill-muted/40"
            strokeLinejoin="round"
          />
          {/* Africa */}
          <path 
            d="M420,195 Q500,175 580,200 Q620,250 610,330 Q590,400 540,420 Q470,430 430,390 Q395,330 405,260 Q415,215 420,195" 
            className="fill-muted/40"
            strokeLinejoin="round"
          />
          {/* North America */}
          <path 
            d="M55,50 Q180,30 320,65 Q360,110 350,170 Q330,230 260,260 Q160,280 80,240 Q35,180 40,110 Q50,65 55,50" 
            className="fill-muted/40"
            strokeLinejoin="round"
          />
          {/* South America */}
          <path 
            d="M195,245 Q290,230 370,280 Q395,350 380,430 Q350,500 280,520 Q210,510 180,450 Q160,380 170,310 Q185,260 195,245" 
            className="fill-muted/40"
            strokeLinejoin="round"
          />
          {/* Oceania */}
          <path 
            d="M730,295 Q850,280 910,340 Q930,400 900,450 Q840,480 760,470 Q700,440 690,380 Q695,320 730,295" 
            className="fill-muted/40"
            strokeLinejoin="round"
          />
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
              isHovered={hoveredCountry?.id === country.id}
            />
          );
        })}

        {/* Continent labels with better styling */}
        <g className="pointer-events-none">
          <text x="490" y="100" className="fill-foreground/60 text-[11px] font-display font-bold" textAnchor="middle" letterSpacing="0.05em">EUROPA</text>
          <text x="720" y="135" className="fill-foreground/60 text-[11px] font-display font-bold" textAnchor="middle" letterSpacing="0.05em">AZJA</text>
          <text x="520" y="285" className="fill-foreground/60 text-[11px] font-display font-bold" textAnchor="middle" letterSpacing="0.05em">AFRYKA</text>
          <text x="190" y="115" className="fill-foreground/60 text-[11px] font-display font-bold" textAnchor="middle" letterSpacing="0.05em">AMERYKA PN.</text>
          <text x="295" y="335" className="fill-foreground/60 text-[11px] font-display font-bold" textAnchor="middle" letterSpacing="0.05em">AMERYKA PD.</text>
          <text x="820" y="385" className="fill-foreground/60 text-[11px] font-display font-bold" textAnchor="middle" letterSpacing="0.05em">OCEANIA</text>
        </g>

        {/* Decorative elements - compass rose */}
        <g transform="translate(920, 450)" className="opacity-40">
          <circle cx="0" cy="0" r="20" fill="none" className="stroke-foreground/20" strokeWidth="1"/>
          <line x1="0" y1="-18" x2="0" y2="18" className="stroke-foreground/30" strokeWidth="1"/>
          <line x1="-18" y1="0" x2="18" y2="0" className="stroke-foreground/30" strokeWidth="1"/>
          <text x="0" y="-22" className="fill-foreground/40 text-[8px] font-display" textAnchor="middle">N</text>
        </g>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-6 px-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-dreamy-mint border-2 border-foreground/20 shadow-sm" />
          <span className="text-sm font-body text-muted-foreground">Dostępne kraje</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-muted border-2 border-foreground/15 shadow-sm" />
          <span className="text-sm font-body text-muted-foreground">Wkrótce</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-dreamy-peach border-2 border-primary/30 shadow-sm" />
          <span className="text-sm font-body text-muted-foreground">Wybrane</span>
        </div>
      </div>
    </div>
  );
}
