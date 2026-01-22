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
            ? 'fill-dreamy-mint hover:fill-dreamy-peach stroke-foreground/20'
            : 'fill-muted hover:fill-muted/80 stroke-foreground/10'
        }`}
        strokeWidth="0.5"
        onMouseEnter={() => onHover(country)}
        onMouseLeave={() => onHover(null)}
      />
    </Link>
  );
}

// Simplified SVG paths for countries (representative shapes)
const countryPaths: Record<string, string> = {
  poland: 'M 520 145 L 540 140 L 555 150 L 550 165 L 530 170 L 515 160 Z',
  france: 'M 470 155 L 490 145 L 510 155 L 505 175 L 480 185 L 465 170 Z',
  italy: 'M 505 175 L 515 170 L 525 195 L 510 220 L 500 210 L 505 185 Z',
  spain: 'M 450 175 L 475 170 L 480 185 L 470 200 L 445 195 L 440 180 Z',
  germany: 'M 495 140 L 520 135 L 525 155 L 510 160 L 490 155 Z',
  uk: 'M 460 125 L 475 120 L 480 140 L 465 145 L 455 135 Z',
  greece: 'M 535 190 L 550 185 L 555 200 L 545 210 L 530 205 Z',
  norway: 'M 500 90 L 520 85 L 530 110 L 510 130 L 495 115 Z',
  japan: 'M 830 160 L 845 155 L 850 175 L 840 190 L 825 180 Z',
  china: 'M 720 145 L 780 140 L 800 175 L 760 200 L 710 180 Z',
  india: 'M 680 200 L 710 190 L 720 230 L 690 260 L 665 240 Z',
  thailand: 'M 740 230 L 755 225 L 760 255 L 745 270 L 735 250 Z',
  egypt: 'M 545 220 L 570 215 L 575 245 L 555 260 L 540 245 Z',
  kenya: 'M 575 290 L 590 285 L 595 310 L 580 320 L 570 305 Z',
  morocco: 'M 445 205 L 470 200 L 475 225 L 455 235 L 440 220 Z',
  'south-africa': 'M 540 360 L 570 355 L 580 385 L 555 395 L 535 380 Z',
  usa: 'M 180 150 L 280 145 L 290 190 L 200 200 L 170 175 Z',
  canada: 'M 160 80 L 300 75 L 310 130 L 180 140 L 150 110 Z',
  mexico: 'M 170 210 L 210 205 L 220 245 L 185 260 L 160 240 Z',
  brazil: 'M 280 280 L 340 275 L 360 340 L 300 370 L 260 330 Z',
  argentina: 'M 280 370 L 310 365 L 320 430 L 290 450 L 270 410 Z',
  peru: 'M 245 300 L 275 295 L 280 340 L 255 355 L 240 325 Z',
  australia: 'M 780 340 L 860 335 L 870 390 L 800 400 L 770 370 Z',
  'new-zealand': 'M 895 390 L 910 385 L 915 410 L 900 420 L 890 405 Z',
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
        {/* Background */}
        <rect width="1000" height="500" className="fill-dreamy-blue/30" />
        
        {/* Ocean texture */}
        <defs>
          <pattern id="waves" patternUnits="userSpaceOnUse" width="20" height="20">
            <path
              d="M 0 10 Q 5 5, 10 10 T 20 10"
              fill="none"
              className="stroke-dreamy-blue/20"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="1000" height="500" fill="url(#waves)" />

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
        <text x="480" y="130" className="fill-foreground/40 text-[8px] font-display" textAnchor="middle">EUROPA</text>
        <text x="700" y="180" className="fill-foreground/40 text-[8px] font-display" textAnchor="middle">AZJA</text>
        <text x="540" y="300" className="fill-foreground/40 text-[8px] font-display" textAnchor="middle">AFRYKA</text>
        <text x="220" y="160" className="fill-foreground/40 text-[8px] font-display" textAnchor="middle">AMERYKA PN.</text>
        <text x="290" y="340" className="fill-foreground/40 text-[8px] font-display" textAnchor="middle">AMERYKA PD.</text>
        <text x="820" y="370" className="fill-foreground/40 text-[8px] font-display" textAnchor="middle">OCEANIA</text>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-dreamy-mint border border-foreground/10" />
          <span className="text-sm font-body text-muted-foreground">Dostępne kraje</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted border border-foreground/10" />
          <span className="text-sm font-body text-muted-foreground">Wkrótce</span>
        </div>
      </div>
    </div>
  );
}
