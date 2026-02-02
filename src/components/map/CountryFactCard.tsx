import { Link } from 'react-router-dom';
import { X, Sparkles, MapPin } from 'lucide-react';
import { getWorldCountryData, type WorldCountryData } from './worldCountriesData';
import { countries } from '@/data/countries';
import { getPolishName } from '@/lib/countryNames';
import type { CountryStatusType } from '@/hooks/useCountryStatuses';

// ISO code to slug mapping
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

interface CountryFactCardProps {
  countryCode: string;
  countryName: string;
  status: CountryStatusType | null;
  onClose: () => void;
}

export function CountryFactCard({ countryCode, countryName, status, onClose }: CountryFactCardProps) {
  // Get world country data (with curiosities)
  const worldData = getWorldCountryData(countryCode);
  
  // Get country from countries.ts if available (for slug/link)
  const slug = codeToSlug[countryCode];
  const countryDetails = slug ? countries.find(c => c.id === slug) : undefined;
  
  const isAvailable = status === 'available';
  
  // Use Polish name from our utility (always Polish!)
  const polishName = getPolishName(countryCode);
  const displayName = polishName !== countryCode ? polishName : (worldData?.name || countryName);
  
  const flag = worldData?.flag || '🌍';
  const icon = worldData?.icon || '🗺️';
  const curiosities = worldData?.curiosities || [
    `${displayName} to ciekawy kraj na naszej planecie!`,
    'Każdy kraj ma swoją unikalną kulturę i tradycje.',
    'Wkrótce dowiesz się więcej o tym miejscu!',
  ];
  
  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[1000] animate-fade-in">
      <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-lg border border-border/50 overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-primary/20 to-accent/20 p-4 pb-6">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-background/50"
            aria-label="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-card shadow-md text-4xl">
              {flag}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{icon}</span>
                <h3 className="font-display font-bold text-xl text-foreground">{displayName}</h3>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className={`text-sm font-body ${isAvailable ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {isAvailable ? '✓ Dostępne w przygodach' : status === 'coming_soon' ? '⏳ Wkrótce' : status === 'soon' ? '🔜 Niebawem' : 'Poznaj ciekawostki'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Curiosities */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent-foreground" />
            <span className="text-sm font-display font-semibold text-foreground">Ciekawostki dla dzieci</span>
          </div>
          
          <ul className="space-y-2">
            {curiosities.slice(0, 4).map((fact, index) => (
              <li 
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground font-body"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/30 flex items-center justify-center text-xs font-semibold text-accent-foreground">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{fact}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Action button */}
        <div className="p-4 pt-0">
          {isAvailable && countryDetails ? (
            <Link 
              to={`/kraj/${countryDetails.slug}`}
              className="block w-full text-center bg-primary text-primary-foreground font-display font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Odkryj przygodę →
            </Link>
          ) : (
            <div className="block w-full text-center bg-muted text-muted-foreground font-display py-3 rounded-xl">
              {status === 'coming_soon' || status === 'soon' ? 'Przygoda już wkrótce!' : 'Poznawaj świat z Polą i Leonem'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
