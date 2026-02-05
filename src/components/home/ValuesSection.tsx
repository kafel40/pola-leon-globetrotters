import { BookOpen, Globe, Heart, Shield } from 'lucide-react';
const values = [{
  icon: BookOpen,
  title: 'Edukacja przez zabawę',
  description: 'Każda bajka to nauka w przystępnej formie. Dzieci poznają świat bawiąc się z Polą i Leonem.',
  color: 'bg-dreamy-peach'
}, {
  icon: Globe,
  title: 'Odkrywanie geografii',
  description: 'Poznawaj kraje, kontynenty i kultury świata. Ciekawostki geograficzne na każdym kroku.',
  color: 'bg-dreamy-blue'
}, {
  icon: Heart,
  title: 'Rozwój emocjonalny',
  description: 'Historie o przyjaźni, empatii i radzeniu sobie z emocjami. Wartości, które zostają na zawsze.',
  color: 'bg-dreamy-lavender'
}, {
  icon: Shield,
  title: 'Bezpieczne treści',
  description: 'Każda bajka tworzona z myślą o najmłodszych. Pozytywne przesłanie i spokojny ton opowieści.',
  color: 'bg-dreamy-mint'
}];
export function ValuesSection() {
  return <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Dlaczego rodzice wybierają nasze bajki?
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">Tworzymy treści, które rozwijają, bawią i uczą - wszystko w jednym miejscu.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => <div key={value.title} className="group p-6 rounded-3xl bg-card shadow-dreamy border border-border/50 hover:shadow-card transition-all duration-300 text-center" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <div className={`w-14 h-14 rounded-2xl ${value.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform mx-auto`}>
                <value.icon className="h-7 w-7 text-foreground/80" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {value.title}
              </h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {value.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
}