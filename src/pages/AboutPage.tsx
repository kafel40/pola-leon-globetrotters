import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Star, Zap, Lightbulb, Globe, Book, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-hero overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-dreamy-lavender rounded-full opacity-40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-dreamy-mint rounded-full opacity-30 blur-3xl" />
        </div>

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Poznaj <span className="text-gradient">Polę i Leona</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed">
              Dwójka rodzeństwa, która razem odkrywa świat. 
              Każda ich przygoda to nowa lekcja, nowe emocje i mnóstwo radości!
            </p>
          </div>
        </div>
      </section>

      {/* Characters detail */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Pola */}
            <div className="relative">
              <div className="absolute -inset-4 bg-dreamy-lavender rounded-[2.5rem] transform rotate-2 opacity-50" />
              <div className="relative bg-card rounded-3xl p-8 md:p-10 shadow-card border border-border/50">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-dreamy-lavender flex items-center justify-center">
                    <span className="text-5xl">👧</span>
                  </div>
                  <div>
                    <h2 className="font-display text-3xl font-bold text-foreground">Pola</h2>
                    <p className="text-lg text-accent-foreground font-body">4 lata</p>
                  </div>
                </div>

                <p className="text-muted-foreground font-body leading-relaxed mb-6">
                  Pola jest starszą siostrą Leona. To spokojna, mądra dziewczynka, która uwielbia 
                  zadawać pytania i dowiadywać się nowych rzeczy o świecie. Często pełni rolę 
                  przewodnika dla swojego młodszego brata, cierpliwie tłumacząc mu, co widzą 
                  i czego się uczą podczas swoich przygód.
                </p>

                <div className="space-y-4">
                  <h3 className="font-display font-bold text-foreground">Cechy Poli:</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dreamy-lavender font-body">
                      <Star className="h-4 w-4" /> Ciekawska
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dreamy-lavender font-body">
                      <Lightbulb className="h-4 w-4" /> Mądra
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dreamy-lavender font-body">
                      <Heart className="h-4 w-4" /> Opiekuńcza
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dreamy-lavender font-body">
                      <Book className="h-4 w-4" /> Cierpliwa
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Leon */}
            <div className="relative lg:mt-12">
              <div className="absolute -inset-4 bg-dreamy-mint rounded-[2.5rem] transform -rotate-2 opacity-50" />
              <div className="relative bg-card rounded-3xl p-8 md:p-10 shadow-card border border-border/50">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-dreamy-mint flex items-center justify-center">
                    <span className="text-5xl">👦</span>
                  </div>
                  <div>
                    <h2 className="font-display text-3xl font-bold text-foreground">Leon</h2>
                    <p className="text-lg text-secondary-foreground font-body">2 lata</p>
                  </div>
                </div>

                <p className="text-muted-foreground font-body leading-relaxed mb-6">
                  Leon jest młodszym bratem Poli. To żywiołowy, pełen energii maluch, który 
                  poznaje świat przez doświadczenie. Wszystko go ciekawi, wszystkiego chce 
                  dotknąć i spróbować. Jego spontaniczność często prowadzi do zabawnych 
                  sytuacji i nieoczekiwanych odkryć.
                </p>

                <div className="space-y-4">
                  <h3 className="font-display font-bold text-foreground">Cechy Leona:</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dreamy-mint font-body">
                      <Zap className="h-4 w-4" /> Żywiołowy
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dreamy-mint font-body">
                      <Heart className="h-4 w-4" /> Radosny
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dreamy-mint font-body">
                      <Star className="h-4 w-4" /> Odważny
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dreamy-mint font-body">
                      <Globe className="h-4 w-4" /> Ciekawy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Their journey */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Ich podróż po świecie
            </h2>
            <p className="text-lg text-muted-foreground font-body leading-relaxed">
              Pola i Leon razem odwiedzają różne zakątki świata. W każdym kraju czeka ich 
              nowa przygoda – poznają lokalną kulturę, przyrodę, tradycje i ciekawostki 
              geograficzne. Przez ich oczy dzieci uczą się o świecie w bezpieczny, 
              przyjazny i angażujący sposób.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 pt-8">
              <div className="p-6 rounded-2xl bg-card shadow-dreamy border border-border/50">
                <div className="w-12 h-12 rounded-xl bg-dreamy-blue flex items-center justify-center mb-4 mx-auto">
                  <Globe className="h-6 w-6 text-foreground/80" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">35 krajów</h3>
                <p className="text-sm text-muted-foreground font-body">
                  Dostępnych już teraz do odkrycia
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card shadow-dreamy border border-border/50">
                <div className="w-12 h-12 rounded-xl bg-dreamy-peach flex items-center justify-center mb-4 mx-auto">
                  <Book className="h-6 w-6 text-foreground/80" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">195 krajów</h3>
                <p className="text-sm text-muted-foreground font-body">
                  Docelowo w całej kolekcji
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card shadow-dreamy border border-border/50">
                <div className="w-12 h-12 rounded-xl bg-dreamy-lavender flex items-center justify-center mb-4 mx-auto">
                  <Heart className="h-6 w-6 text-foreground/80" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">2-6 lat</h3>
                <p className="text-sm text-muted-foreground font-body">
                  Wiek docelowy czytelników
                </p>
              </div>
            </div>

            <Button size="lg" asChild className="font-display mt-8">
              <Link to="/mapa">
                Rozpocznij podróż
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
