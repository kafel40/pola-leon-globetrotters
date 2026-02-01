import { useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHead } from '@/components/seo/PageHead';
import { WorldMapLeaflet } from '@/components/map/WorldMapLeaflet';
import { CountryCard } from '@/components/country/CountryCard';
import { countries } from '@/data/countries';
import { useCountryStatuses } from '@/hooks/useCountryStatuses';
import { Loader2 } from 'lucide-react';

export default function MapPage() {
  const { countryStatuses, loading } = useCountryStatuses();
  
  // Map database status to countries from countries.ts
  const countriesWithDbStatus = useMemo(() => {
    if (!countryStatuses.length) return { available: [], comingSoon: [], soon: [] };
    
    // Create a lookup for country code to status
    const codeToStatus = new Map(countryStatuses.map(cs => [cs.country_code, cs.status]));
    
    // Map slug to code
    const slugToCode: Record<string, string> = {
      'poland': 'POL', 'france': 'FRA', 'italy': 'ITA', 'spain': 'ESP',
      'germany': 'DEU', 'uk': 'GBR', 'greece': 'GRC', 'norway': 'NOR',
      'sweden': 'SWE', 'netherlands': 'NLD', 'japan': 'JPN', 'china': 'CHN',
      'india': 'IND', 'thailand': 'THA', 'egypt': 'EGY', 'kenya': 'KEN',
      'morocco': 'MAR', 'south-africa': 'ZAF', 'usa': 'USA', 'canada': 'CAN',
      'mexico': 'MEX', 'brazil': 'BRA', 'argentina': 'ARG', 'peru': 'PER',
      'australia': 'AUS', 'new-zealand': 'NZL', 'turkey': 'TUR', 'iceland': 'ISL',
      'south-korea': 'KOR', 'vietnam': 'VNM',
    };
    
    const available = countries.filter(c => {
      const code = slugToCode[c.id];
      return code && codeToStatus.get(code) === 'available';
    });
    
    const comingSoon = countries.filter(c => {
      const code = slugToCode[c.id];
      return code && codeToStatus.get(code) === 'coming_soon';
    });
    
    const soon = countries.filter(c => {
      const code = slugToCode[c.id];
      return code && codeToStatus.get(code) === 'soon';
    });
    
    return { available, comingSoon, soon };
  }, [countryStatuses]);

  return (
    <Layout>
      <PageHead 
        title="Mapa świata"
        description="Interaktywna mapa świata Poli i Leona. Odkrywaj kraje i kontynenty z bajkami edukacyjnymi dla dzieci. Kliknij na kraj, aby poznać przygodę!"
      />
      <section className="py-8 md:py-12 bg-hero">
        <div className="container">
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Magiczny Globus Poli i Leona
            </h1>
            <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
              Kliknij na kraj, aby odkryć przygodę rodzeństwa w tym magicznym miejscu!
            </p>
          </div>

          <div className="bg-card rounded-3xl shadow-card border border-border/50 p-2 md:p-4 overflow-hidden">
            <WorldMapLeaflet />
          </div>
        </div>
      </section>

      {loading ? (
        <section className="py-12 md:py-16 bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </section>
      ) : (
        <>
          {countriesWithDbStatus.available.length > 0 && (
            <section className="py-12 md:py-16 bg-background">
              <div className="container">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
                  Dostępne kraje ({countriesWithDbStatus.available.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {countriesWithDbStatus.available.map((country) => (
                    <CountryCard key={country.id} country={country} dbStatus="available" />
                  ))}
                </div>
              </div>
            </section>
          )}

          {countriesWithDbStatus.comingSoon.length > 0 && (
            <section className="py-12 md:py-16 bg-muted/30">
              <div className="container">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
                  Wkrótce ({countriesWithDbStatus.comingSoon.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {countriesWithDbStatus.comingSoon.map((country) => (
                    <CountryCard key={country.id} country={country} dbStatus="coming_soon" />
                  ))}
                </div>
              </div>
            </section>
          )}

          {(() => {
            const soonCount = countryStatuses.filter(cs => cs.status === 'soon').length;
            return soonCount > 0 && (
              <section className="py-12 md:py-16 bg-accent/20">
                <div className="container">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Niebawem ({soonCount})
                  </h2>
                  <p className="text-muted-foreground font-body">
                    Kolejne kraje do odkrycia już wkrótce w przygodach Poli i Leona!
                  </p>
                </div>
              </section>
            );
          })()}
        </>
      )}
    </Layout>
  );
}
