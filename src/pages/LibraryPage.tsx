import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Globe, Download, ArrowRight, Lock } from 'lucide-react';

export default function LibraryPage() {
  // Mock - user not logged in
  const isLoggedIn = false;
  const ownedEbooks: any[] = [];
  const discoveredCountries: string[] = [];

  if (!isLoggedIn) {
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
                {discoveredCountries.length} krajów
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
                Kup swoją pierwszą bajkę i rozpocznij przygodę!
              </p>
              <Button asChild className="font-display">
                <Link to="/mapa">
                  Przeglądaj kraje
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {/* Countries grid would go here */}
            </div>
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
                {ownedEbooks.length} ebooków
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
                Odkryj świat z Polą i Leonem – kup swoją pierwszą bajkę!
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
              {/* Ebooks grid would go here */}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
