import { Link } from 'react-router-dom';
import { Clock, Check } from 'lucide-react';
import { type Country } from '@/data/countries';

interface CountryCardProps {
  country: Country;
}

export function CountryCard({ country }: CountryCardProps) {
  const isAvailable = country.status === 'available';

  return (
    <Link
      to={`/kraj/${country.slug}`}
      className={`group block p-6 rounded-2xl border transition-all duration-300 ${
        isAvailable
          ? 'bg-card shadow-dreamy border-border/50 hover:shadow-card hover:-translate-y-1'
          : 'bg-muted/50 border-border/30 opacity-75 hover:opacity-90'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${
          isAvailable ? 'bg-dreamy-peach' : 'bg-muted'
        } group-hover:scale-105 transition-transform`}>
          {country.flagEmoji}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {country.name}
            </h3>
            {isAvailable ? (
              <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-body">
                <Check className="h-3 w-3" />
                Dostępne
              </span>
            ) : (
              <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-body">
                <Clock className="h-3 w-3" />
                Wkrótce
              </span>
            )}
          </div>
          
          <p className="mt-2 text-sm text-muted-foreground font-body line-clamp-2">
            {country.descriptionForParents}
          </p>
        </div>
      </div>
    </Link>
  );
}
