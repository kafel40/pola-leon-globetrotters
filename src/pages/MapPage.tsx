import { Layout } from '@/components/layout/Layout';
import { PageHead } from '@/components/seo/PageHead';
import { WorldMapLeaflet } from '@/components/map/WorldMapLeaflet';
import { CountryCard } from '@/components/country/CountryCard';
import { countries } from '@/data/countries';

export default function MapPage() {
  const availableCountries = countries.filter(c => c.status === 'available');
  const comingSoonCountries = countries.filter(c => c.status === 'coming_soon');

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

      <section className="py-12 md:py-16 bg-background">
        <div className="container">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
            Dostępne kraje ({availableCountries.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableCountries.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </div>
        </div>
      </section>

      {comingSoonCountries.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
              Wkrótce ({comingSoonCountries.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comingSoonCountries.map((country) => (
                <CountryCard key={country.id} country={country} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
