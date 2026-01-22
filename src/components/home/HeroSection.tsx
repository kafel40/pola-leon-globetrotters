import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero py-16 md:py-24 lg:py-32">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-dreamy-peach rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-dreamy-lavender rounded-full opacity-30 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-dreamy-mint rounded-full opacity-30 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-dreamy border border-border/50">
            <Sparkles className="h-4 w-4 text-accent-foreground" />
            <span className="text-sm font-body font-medium text-muted-foreground">
              Bajki dla dzieci 2-6 lat
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground animate-fade-in-up">
            Odkrywaj świat razem z{' '}
            <span className="text-gradient">Polą i Leonem</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Poznaj bajki edukacyjne z różnych zakątków świata. Każda historia to nowa przygoda, 
            która uczy geografii, kultury i emocji w bezpieczny, radosny sposób.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Button size="lg" asChild className="font-display text-lg px-8 py-6 rounded-2xl shadow-card hover:shadow-glow transition-all">
              <Link to="/mapa">
                <Compass className="h-5 w-5 mr-2" />
                Wyrusz w podróż po świecie
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="font-body px-8 py-6 rounded-2xl">
              <Link to="/o-nas">
                Poznaj Polę i Leona
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="p-4 rounded-2xl bg-card/50 backdrop-blur shadow-dreamy">
              <div className="font-display text-2xl md:text-3xl font-bold text-primary">35</div>
              <div className="text-sm text-muted-foreground font-body">krajów</div>
            </div>
            <div className="p-4 rounded-2xl bg-card/50 backdrop-blur shadow-dreamy">
              <div className="font-display text-2xl md:text-3xl font-bold text-primary">6</div>
              <div className="text-sm text-muted-foreground font-body">kontynentów</div>
            </div>
            <div className="p-4 rounded-2xl bg-card/50 backdrop-blur shadow-dreamy">
              <div className="font-display text-2xl md:text-3xl font-bold text-primary">2-6</div>
              <div className="text-sm text-muted-foreground font-body">lat</div>
            </div>
            <div className="p-4 rounded-2xl bg-card/50 backdrop-blur shadow-dreamy">
              <div className="font-display text-2xl md:text-3xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground font-body">przygód</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
