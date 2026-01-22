import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CountryCard } from '@/components/country/CountryCard';
import { continents, getCountriesByContinent } from '@/data/countries';

export default function ContinentPage() {
  const { slug } = useParams<{ slug: string }>();
  const continent = continents.find(c => c.slug === slug);

  if (!continent) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Kontynent nie został znaleziony</h1>
          <Button asChild>
            <Link to="/mapa">Wróć do mapy</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const countriesOnContinent = getCountriesByContinent(continent.id);
  const availableCountries = countriesOnContinent.filter(c => c.status === 'available');
  const comingSoonCountries = countriesOnContinent.filter(c => c.status === 'coming_soon');

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 md:py-16 bg-hero">
        <div className="container">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-8">
            <Link to="/mapa" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Mapa świata
            </Link>
            <span>/</span>
            <span className="text-foreground">{continent.name}</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {continent.name}
              </h1>
              <p className="text-muted-foreground font-body">
                {countriesOnContinent.length} krajów · {availableCountries.length} dostępnych
              </p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground font-body max-w-2xl">
            {continent.description}
          </p>
        </div>
      </section>

      {/* Available countries */}
      {availableCountries.length > 0 && (
        <section className="py-12 md:py-16 bg-background">
          <div className="container">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
              Dostępne bajki ({availableCountries.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCountries.map((country) => (
                <CountryCard key={country.id} country={country} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Coming soon */}
      {comingSoonCountries.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8">
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
