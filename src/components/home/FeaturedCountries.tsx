import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAvailableCountries } from '@/data/countries';

export function FeaturedCountries() {
  const featuredCountries = getAvailableCountries().slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Odkryte kraje
            </h2>
            <p className="text-muted-foreground font-body text-lg max-w-xl">
              Wybierz kraj i wyrusz z Polą i Leonem w niezapomnianą podróż!
            </p>
          </div>
          <Button variant="outline" asChild className="font-body self-start md:self-auto">
            <Link to="/mapa" className="flex items-center gap-2">
              Zobacz wszystkie kraje
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCountries.map((country, index) => (
            <Link
              key={country.id}
              to={`/kraj/${country.slug}`}
              className="group relative p-6 rounded-2xl bg-card shadow-dreamy border border-border/50 hover:shadow-card hover:-translate-y-1 transition-all duration-300 text-center"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {country.flagEmoji}
              </div>
              <h3 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {country.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
