import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Globe, ArrowRight, Lock, Loader2, FileText, Headphones } from 'lucide-react';
import { useLibrary } from '@/hooks/useLibrary';
import { useAuth } from '@/hooks/useAuth';
import { countries } from '@/data/countries';

export default function LibraryPage() {
  const { user, loading: authLoading } = useAuth();
  const { ownedEbooks, discoveredCountries, loading } = useLibrary();

  // Show loading while checking auth
  if (authLoading) {
    return (
      <Layout>
        <section className="py-16 md:py-24 bg-hero min-h-[calc(100vh-200px)] flex items-center">
          <div className="container">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <section className="py-16 md:py-24 bg-hero min-h-[calc(100vh-200px)] flex items-center">
          <div className="container">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                <Lock className="h-10 w-10 text-muted-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Moja biblioteka
              </h1>
              <p className="text-muted-foreground font-body mb-8">
                Zaloguj się, aby zobaczyć swoje zakupione bajki i odkryte kraje.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild className="font-display">
                  <Link to="/logowanie">Zaloguj się</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="font-body">
                  <Link to="/rejestracja">Załóż konto</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Get country data for discovered countries
  const discoveredCountryData = countries.filter(c => discoveredCountries.includes(c.slug));

  return (
    <Layout>
      <section className="py-12 md:py-16 bg-hero">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Moja biblioteka
          </h1>
          <p className="text-muted-foreground font-body">
            Twoje zakupione bajki i odkryte kraje
          </p>
        </div>
      </section>

      {loading ? (
        <section className="py-12 md:py-16 bg-background">
          <div className="container">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Discovered countries */}
          <section className="py-12 md:py-16 bg-background">
            <div className="container">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-dreamy-mint flex items-center justify-center">
                  <Globe className="h-6 w-6 text-foreground/80" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Odkryte kraje
                  </h2>
                  <p className="text-sm text-muted-foreground font-body">
                    {discoveredCountries.length} {discoveredCountries.length === 1 ? 'kraj' : 'krajów'}
                  </p>
                </div>
              </div>

              {discoveredCountries.length === 0 ? (
                <div className="p-8 rounded-3xl bg-muted/50 text-center">
                  <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    Jeszcze nie odkryłeś żadnego kraju
                  </h3>
                  <p className="text-muted-foreground font-body mb-6">
                    Dodaj swoją pierwszą bajkę do biblioteki i rozpocznij przygodę!
                  </p>
                  <Button asChild className="font-display">
                    <Link to="/mapa">
                      Przeglądaj kraje
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-6">
                    {discoveredCountryData.map((country) => (
                      <Link
                        key={country.slug}
                        to={`/kraj/${country.slug}`}
                        className="group flex flex-col items-center p-3 rounded-xl bg-card hover:bg-accent transition-colors"
                      >
                        <span className="text-4xl mb-2">{country.flagEmoji}</span>
                        <span className="text-xs text-center font-medium text-foreground group-hover:text-accent-foreground">
                          {country.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="p-6 rounded-2xl bg-dreamy-mint/30 border border-dreamy-mint text-center">
                    <p className="text-foreground/80 font-body mb-4">
                      🌍 Świetnie! Odkryłeś już {discoveredCountries.length} {discoveredCountries.length === 1 ? 'kraj' : 'krajów'}! Poznaj kolejne kultury i tradycje.
                    </p>
                    <Button asChild variant="outline" className="font-display">
                      <Link to="/mapa">
                        Odkryj więcej krajów
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Ebooks */}
          <section className="py-12 md:py-16 bg-muted/30">
            <div className="container">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-dreamy-peach flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-foreground/80" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Moje bajki
                  </h2>
                  <p className="text-sm text-muted-foreground font-body">
                    {ownedEbooks.length} {ownedEbooks.length === 1 ? 'ebook' : 'ebooków'}
                  </p>
                </div>
              </div>

              {ownedEbooks.length === 0 ? (
                <div className="p-8 rounded-3xl bg-card shadow-dreamy border border-border/50 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    Twoja biblioteka jest pusta
                  </h3>
                  <p className="text-muted-foreground font-body mb-6">
                    Odkryj świat z Polą i Leonem – dodaj swoją pierwszą bajkę!
                  </p>
                  <Button asChild className="font-display">
                    <Link to="/mapa">
                      Przeglądaj bajki
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ownedEbooks.map((owned) => (
                    <LibraryEbookCard key={owned.id} owned={owned} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </Layout>
  );
}

// Separate component for library ebook card
function LibraryEbookCard({ owned }: { owned: any }) {
  const ebook = owned.ebook;
  
  if (!ebook) return null;

  const hasPdf = !!ebook.pdf_url;
  const hasEpub = !!ebook.epub_url;
  const hasAudio = !!ebook.audio_url;
  const country = countries.find(c => c.slug === ebook.country_slug);

  return (
    <div className="p-4 rounded-2xl bg-card shadow-card border border-border/50">
      <div className="flex gap-4">
        {/* Cover */}
        {ebook.cover_image_url ? (
          <img
            src={ebook.cover_image_url}
            alt={ebook.title}
            className="w-20 h-28 object-cover rounded-xl shadow-md flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-28 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base font-bold text-foreground mb-1 truncate">
            {ebook.title}
          </h3>
          
          {country && (
            <p className="text-xs text-muted-foreground mb-2">
              {country.flagEmoji} {country.name}
            </p>
          )}

          {/* Format icons */}
          <div className="flex gap-2 mt-3">
            {hasPdf && (
              <span className="inline-flex items-center text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5 mr-1" />
                PDF
              </span>
            )}
            {hasEpub && (
              <span className="inline-flex items-center text-xs text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5 mr-1" />
                EPUB
              </span>
            )}
            {hasAudio && (
              <span className="inline-flex items-center text-xs text-muted-foreground">
                <Headphones className="h-3.5 w-3.5 mr-1" />
                Audio
              </span>
            )}
          </div>

          {/* View button */}
          <Button asChild size="sm" variant="outline" className="mt-3">
            <Link to={`/kraj/${ebook.country_slug}`}>
              Zobacz bajkę
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
