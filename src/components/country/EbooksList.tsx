import { Loader2, BookOpen } from 'lucide-react';
import { EbookCard } from './EbookCard';
import { useCountryEbooks } from '@/hooks/useCountryEbooks';

interface EbooksListProps {
  countrySlug: string;
  countryName: string;
}

export function EbooksList({ countrySlug, countryName }: EbooksListProps) {
  const { ebooks, loading, isOwned, acquireEbook } = useCountryEbooks(countrySlug);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (ebooks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl font-bold text-foreground mb-2">
          Bajka w przygotowaniu
        </h3>
        <p className="text-muted-foreground font-body">
          Pracujemy nad bajką o przygodzie Poli i Leona w {countryName}.
          <br />Zajrzyj tu wkrótce!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
        Bajki z {countryName}
      </h2>
      
      <div className="space-y-4">
        {ebooks.map((ebook) => (
          <EbookCard
            key={ebook.id}
            ebook={ebook}
            isOwned={isOwned(ebook.id)}
            onAcquire={acquireEbook}
          />
        ))}
      </div>
    </div>
  );
}
