import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { CharactersSection } from '@/components/home/CharactersSection';
import { ValuesSection } from '@/components/home/ValuesSection';
import { FeaturedCountries } from '@/components/home/FeaturedCountries';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CharactersSection />
      <ValuesSection />
      <FeaturedCountries />
      <CTASection />
    </Layout>
  );
};

export default Index;
