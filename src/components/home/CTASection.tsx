import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Rocket, BookOpen } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/20 mb-4">
            <Rocket className="h-8 w-8" />
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">
            Gotowi na przygodę?
          </h2>

          <p className="text-lg md:text-xl opacity-90 font-body leading-relaxed">
            Dołącz do Poli i Leona w ich podróży dookoła świata. 
            Każda bajka to nowa historia, nowy kraj i nowe odkrycia!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="font-display text-lg px-8 py-6 rounded-2xl w-full sm:w-64"
            >
              <Link to="/mapa">
                <BookOpen className="h-5 w-5 mr-2" />
                Przeglądaj bajki
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="font-display text-lg px-8 py-6 rounded-2xl w-full sm:w-64"
            >
              <Link to="/rejestracja">
                Załóż konto za darmo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
