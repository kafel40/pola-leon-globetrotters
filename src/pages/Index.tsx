import { Layout } from '@/components/layout/Layout';
import { PageHead } from '@/components/seo/PageHead';
import { HeroSection } from '@/components/home/HeroSection';
import { CharactersSection } from '@/components/home/CharactersSection';
import { ValuesSection } from '@/components/home/ValuesSection';
import { FeaturedCountries } from '@/components/home/FeaturedCountries';
import { CTASection } from '@/components/home/CTASection';
import { NewsletterSection } from '@/components/home/NewsletterSection';

const Index = () => {
  return (
    <Layout>
      <PageHead 
        title="Pola i Leon. Twoje bajki i przygody dla dzieci - Odkrywaj świat z nami"
        description="Bajki edukacyjne dla dzieci 2-6 lat. Poznaj świat z Polą i Leonem - przygody, geografia, kultura i emocje w każdej historii. Odkrywaj nowe kraje!"
      />
      <HeroSection />
      <CharactersSection />
      <ValuesSection />
      <FeaturedCountries />
      <CTASection />
      <NewsletterSection />
    </Layout>
  );
};

export default Index;
