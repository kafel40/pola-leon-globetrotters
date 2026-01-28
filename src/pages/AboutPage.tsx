import { Layout } from '@/components/layout/Layout';
import { PageHead } from '@/components/seo/PageHead';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Lightbulb, GraduationCap, BookOpen, ArrowRight } from 'lucide-react';

const teamMembers = [
  {
    name: 'Olga',
    role: 'Wizjonerka i Autorka',
    description: 'Inicjatorka całego przedsięwzięcia i Content Creator. Macierzyństwo stało się dla niej najsilniejszym impulsem do działania - z miłości do dzieci i chęci wspierania ich wyobraźni zaczęła pisać autorskie bajki, które możecie kupić na naszej stronie. Olga łączy w zespole rolę kreatywnej autorki z wizją nowoczesnego biznesu, który mówi do rodziców ich własnym językiem.',
    icon: Sparkles,
    color: 'dreamy-lavender',
    emoji: '✨',
  },
  {
    name: 'Natalia',
    role: 'Pedagog, Terapeuta, Innowatorka',
    description: 'Nauczycielka z powołania i terapeutka. Natalia nie tylko naucza i prowadzi terapię, ale projektuje autorskie programy rozwojowe, które zdobyły uznanie w mediach i były wielokrotnie prezentowane w telewizji. Specjalizuje się w nowoczesnych metodach pracy z dziećmi, kładąc nacisk na budowanie ich pewności siebie i odkrywanie indywidualnych talentów. W zespole jest głosem innowacji i praktycznej wiedzy terapeutycznej.',
    icon: Lightbulb,
    color: 'dreamy-mint',
    emoji: '💡',
  },
  {
    name: 'Iza',
    role: 'Mentor i Fundament Wiedzy',
    description: 'Pedagog z 35-letnim doświadczeniem, nauczyciel akademicki i ekspertka Ośrodka Doskonalenia Nauczycieli (ODN) w Poznaniu. Jako była Prezeska Sucholeskiego Stowarzyszenia Pomocy Dzieciom oraz Wolontariusz Roku, wnosi do zespołu bezcenne doświadczenie w pracy systemowej i społecznej. Jest autorką licznych tekstów pedagogicznych, a jej wiedza stanowi merytoryczny fundament wszystkich naszych działań.',
    icon: GraduationCap,
    color: 'dreamy-blue',
    emoji: '🎓',
  },
];

export default function AboutPage() {
  return (
    <Layout>
      <PageHead 
        title="O nas"
        description="Poznaj zespół Pola i Leon - trzy kobiety połączone pasją do rozwoju dziecka. Olga, Natalia i Iza tworzą bajki edukacyjne z sercem i profesjonalizmem."
      />
      {/* Hero */}
      <section className="relative py-16 md:py-24 bg-hero overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-dreamy-lavender rounded-full opacity-40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-dreamy-mint rounded-full opacity-30 blur-3xl" />
        </div>

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Poznaj zespół{' '}
              <span className="text-gradient">połączony pasją do rozwoju dziecka</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed">
              Trzy kobiety, trzy różne perspektywy, jeden wspólny cel — 
              wspierać rozwój dzieci z sercem i profesjonalizmem.
            </p>
          </div>
        </div>
      </section>

      {/* Team Cards */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => {
              const Icon = member.icon;
              return (
                <div
                  key={member.name}
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div 
                    className={`absolute -inset-3 bg-${member.color} rounded-[2rem] transform opacity-40 transition-transform duration-300 group-hover:rotate-2`} 
                  />
                  <div className="relative bg-card rounded-3xl p-8 shadow-dreamy border border-border/50 h-full flex flex-col transition-shadow duration-300 group-hover:shadow-lg">
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-6">
                      <div 
                        className={`w-20 h-20 rounded-full bg-${member.color} flex items-center justify-center mb-4 shadow-md`}
                      >
                        <span className="text-4xl">{member.emoji}</span>
                      </div>
                      <h2 className="font-display text-2xl font-bold text-foreground">
                        {member.name}
                      </h2>
                      <p className="font-display text-sm text-primary font-medium text-center mt-1">
                        {member.role}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground font-body leading-relaxed text-center flex-grow">
                      {member.description}
                    </p>

                    {/* Icon badge */}
                    <div className="flex justify-center mt-6">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${member.color}/50`}>
                        <Icon className="h-4 w-4 text-foreground/80" />
                        <span className="text-sm font-body text-foreground/80">
                          {member.role.split(',')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Olga's Fairy Tales Highlight */}
      <section className="py-12 md:py-16 bg-dreamy-lavender/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-dreamy-lavender shadow-md mb-4">
              <BookOpen className="h-8 w-8 text-foreground/80" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Bajki autorstwa Olgi
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              Odkryj kolekcję bajek o Poli i Leonie — rodzeństwie, które razem poznaje świat. 
              Każda opowieść to nowa przygoda w innym zakątku globu, pełna wiedzy, 
              ciepła i wartości, które wspierają rozwój Twojego dziecka.
            </p>
            <Button size="lg" asChild className="font-display">
              <Link to="/biblioteka">
                Zobacz bajki
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Summary Statement */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <blockquote className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-dreamy-lavender via-dreamy-mint to-dreamy-blue rounded-full" />
              <p className="text-lg md:text-xl text-foreground font-body leading-relaxed italic pl-8">
                "Łączymy trzy różne perspektywy: wieloletnie doświadczenie akademickie Izy, 
                terapeutyczną innowacyjność Natalii oraz kreatywną wizję Olgi. 
                Wszystko po to, by wspierać rozwój dzieci na każdym etapie."
              </p>
            </blockquote>

            <div className="flex justify-center gap-4 mt-12">
              <div className="w-12 h-12 rounded-full bg-dreamy-lavender flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-foreground/70" />
              </div>
              <div className="w-12 h-12 rounded-full bg-dreamy-mint flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-foreground/70" />
              </div>
              <div className="w-12 h-12 rounded-full bg-dreamy-blue flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-foreground/70" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
