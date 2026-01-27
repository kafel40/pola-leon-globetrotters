import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Check, Lightbulb, BookOpen } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { getCountryBySlug, getContinentById } from '@/data/countries';
import { EbooksList } from '@/components/country/EbooksList';

export default function CountryPage() {
  const { slug } = useParams<{ slug: string }>();
  const country = getCountryBySlug(slug || '');

  if (!country) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Kraj nie został znaleziony</h1>
          <Button asChild>
            <Link to="/mapa">Wróć do mapy</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const continent = getContinentById(country.continent);
  const isAvailable = country.status === 'available';

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-12 md:py-20 bg-hero overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-dreamy-peach rounded-full opacity-40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-dreamy-lavender rounded-full opacity-30 blur-3xl" />
        </div>

        <div className="container relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-8">
            <Link to="/mapa" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Mapa świata
            </Link>
            <span>/</span>
            {continent && (
              <>
                <Link to={`/kontynent/${continent.slug}`} className="hover:text-foreground transition-colors">
                  {continent.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{country.name}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Flag & Info */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-card shadow-card border border-border/50 flex items-center justify-center text-6xl md:text-7xl">
                {country.flagEmoji}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                  {country.name}
                </h1>
                {isAvailable ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-body">
                    <Check className="h-4 w-4" />
                    Bajka dostępna
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-body">
                    <Clock className="h-4 w-4" />
                    Wkrótce
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground font-body">
                <MapPin className="h-4 w-4" />
                {continent?.name}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Adventure description */}
            <div className="p-8 rounded-3xl bg-card shadow-card border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-dreamy-lavender flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-foreground/80" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Przygoda Poli i Leona
                </h2>
              </div>
              <p className="text-muted-foreground font-body leading-relaxed">
                {country.descriptionForParents}
              </p>
            </div>

            {/* Fun fact */}
            <div className="p-8 rounded-3xl bg-card shadow-card border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-dreamy-peach flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-foreground/80" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Ciekawostka geograficzna
                </h2>
              </div>
              <p className="text-muted-foreground font-body leading-relaxed">
                {country.geographyFunFact}
              </p>
            </div>
          </div>

          {/* Ebooks section */}
          <div className="max-w-4xl mx-auto mt-12">
            <EbooksList countrySlug={country.slug} countryName={country.name} />
          </div>
        </div>
      </section>
    </Layout>
  );
}
