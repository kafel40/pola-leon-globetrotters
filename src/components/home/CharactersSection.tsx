import { Star, Heart, Lightbulb, Zap } from 'lucide-react';
import polaImage from '@/assets/characters/pola.png';
import leonImage from '@/assets/characters/leon.png';

export function CharactersSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Poznaj głównych bohaterów
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Pola i Leon to rodzeństwo, które razem odkrywa świat. Każda bajka to ich wspólna przygoda!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Pola */}
          <div className="group relative">
            <div className="absolute inset-0 bg-dreamy-lavender rounded-3xl transform rotate-2 group-hover:rotate-1 transition-transform" />
            <div className="relative bg-card rounded-3xl p-8 shadow-card border border-border/50">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden bg-dreamy-lavender ring-4 ring-dreamy-lavender/50">
                  <img 
                    src={polaImage} 
                    alt="Pola - 4-letnia bohaterka bajek" 
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-1">Pola</h3>
                  <p className="text-sm text-accent-foreground font-body mb-3">4 lata</p>
                  <p className="text-muted-foreground font-body leading-relaxed">
                    Starsza, spokojna i bardzo ciekawa świata. Pola uwielbia zadawać pytania i pełni rolę przewodniczki dla Leona. Zawsze chętnie tłumaczy bratu nowe rzeczy.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-dreamy-lavender text-sm font-body">
                  <Star className="h-3 w-3" /> Ciekawska
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-dreamy-lavender text-sm font-body">
                  <Lightbulb className="h-3 w-3" /> Mądra
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-dreamy-lavender text-sm font-body">
                  <Heart className="h-3 w-3" /> Opiekuńcza
                </span>
              </div>
            </div>
          </div>

          {/* Leon */}
          <div className="group relative">
            <div className="absolute inset-0 bg-dreamy-mint rounded-3xl transform -rotate-2 group-hover:-rotate-1 transition-transform" />
            <div className="relative bg-card rounded-3xl p-8 shadow-card border border-border/50">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden bg-dreamy-mint ring-4 ring-dreamy-mint/50">
                  <img 
                    src={leonImage} 
                    alt="Leon - 2-letni bohater bajek" 
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-1">Leon</h3>
                  <p className="text-sm text-secondary-foreground font-body mb-3">2 lata</p>
                  <p className="text-muted-foreground font-body leading-relaxed">
                    Młodszy, żywiołowy i pełen emocji. Leon uczy się świata przez doświadczenie i zabawę. Wszędzie widzi przygodę i radość!
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-dreamy-mint text-sm font-body">
                  <Zap className="h-3 w-3" /> Żywiołowy
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-dreamy-mint text-sm font-body">
                  <Heart className="h-3 w-3" /> Radosny
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-dreamy-mint text-sm font-body">
                  <Star className="h-3 w-3" /> Odważny
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
