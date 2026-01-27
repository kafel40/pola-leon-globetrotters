import { useState } from 'react';
import { FileText, BookOpen, Headphones, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Ebook } from '@/hooks/useCountryEbooks';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

// Configuration flag for monetization
// Set to true when you want to enable paid content
const MONETIZATION_ENABLED = false;

interface EbookCardProps {
  ebook: Ebook;
  isOwned: boolean;
  onAcquire: (ebook: Ebook) => Promise<boolean>;
}

export function EbookCard({ ebook, isOwned, onAcquire }: EbookCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [acquiring, setAcquiring] = useState(false);

  const hasPdf = !!ebook.pdf_url;
  const hasEpub = !!ebook.epub_url;
  const hasAudio = !!ebook.audio_url;
  const hasAnyFile = hasPdf || hasEpub || hasAudio;

  // Determine if content is paid
  const isPaid = MONETIZATION_ENABLED && (ebook.price || 0) > 0;
  
  // User can access if: free content, already owned, or monetization disabled
  const canAccess = !isPaid || isOwned;

  const handleDownload = async (fileType: 'pdf' | 'epub' | 'audio') => {
    if (!user) {
      toast({
        title: 'Wymagane logowanie',
        description: 'Zaloguj się, aby pobrać bajkę.',
        variant: 'destructive',
      });
      return;
    }

    // If not owned yet, acquire first (for free content)
    if (!isOwned) {
      setAcquiring(true);
      const acquired = await onAcquire(ebook);
      setAcquiring(false);
      
      if (!acquired) {
        toast({
          title: 'Błąd',
          description: 'Nie udało się dodać bajki do biblioteki.',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Dodano do biblioteki!',
        description: 'Bajka została dodana do Twojej biblioteki.',
      });
    }

    setDownloading(fileType);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('generate-download-url', {
        body: { ebookId: ebook.id, fileType },
        headers: {
          Authorization: `Bearer ${sessionData.session?.access_token}`,
        },
      });

      if (response.error || !response.data?.downloadUrl) {
        throw new Error(response.error?.message || 'Failed to get download URL');
      }

      // Open download in new tab
      window.open(response.data.downloadUrl, '_blank');
      
      toast({
        title: fileType === 'audio' ? 'Odtwarzanie rozpoczęte!' : 'Pobieranie rozpoczęte!',
        description: fileType === 'audio' 
          ? 'Audiobook został otwarty w nowej karcie.' 
          : 'Plik zostanie pobrany.',
      });
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: 'Błąd pobierania',
        description: 'Nie udało się pobrać pliku. Spróbuj ponownie.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(null);
    }
  };

  const handleBuy = () => {
    // Future: integrate with Stripe
    toast({
      title: 'Wkrótce dostępne',
      description: 'Płatności będą wkrótce dostępne.',
    });
  };

  if (!hasAnyFile) return null;

  return (
    <div className="p-6 rounded-2xl bg-card shadow-card border border-border/50">
      <div className="flex gap-4">
        {/* Cover */}
        {ebook.cover_image_url ? (
          <img
            src={ebook.cover_image_url}
            alt={ebook.title}
            className="w-24 h-32 md:w-32 md:h-40 object-cover rounded-xl shadow-md flex-shrink-0"
          />
        ) : (
          <div className="w-24 h-32 md:w-32 md:h-40 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-1">
            {ebook.title}
          </h3>
          
          {ebook.age_group && (
            <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground mb-2">
              {ebook.age_group} lat
            </span>
          )}

          {ebook.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {ebook.description}
            </p>
          )}

          {/* Price or Free badge */}
          {isPaid && !isOwned ? (
            <div className="mb-3">
              <span className="text-lg font-bold text-primary">{ebook.price} PLN</span>
            </div>
          ) : (
            <div className="mb-3">
              <span className="text-sm font-medium text-secondary-foreground bg-secondary/50 px-2 py-1 rounded-full">
                {isOwned ? '✓ W bibliotece' : 'Bezpłatnie'}
              </span>
            </div>
          )}

          {/* Action buttons */}
          {!user ? (
            <Button asChild variant="secondary" size="sm">
              <Link to="/logowanie">Zaloguj się, aby pobrać</Link>
            </Button>
          ) : canAccess ? (
            <div className="flex flex-wrap gap-2">
              {hasPdf && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload('pdf')}
                  disabled={downloading !== null || acquiring}
                >
                  {downloading === 'pdf' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="mr-2 h-4 w-4" />
                  )}
                  Pobierz PDF
                </Button>
              )}
              
              {hasEpub && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload('epub')}
                  disabled={downloading !== null || acquiring}
                >
                  {downloading === 'epub' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BookOpen className="mr-2 h-4 w-4" />
                  )}
                  Pobierz EPUB
                </Button>
              )}
              
              {hasAudio && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleDownload('audio')}
                  disabled={downloading !== null || acquiring}
                >
                  {downloading === 'audio' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Headphones className="mr-2 h-4 w-4" />
                  )}
                  Posłuchaj
                </Button>
              )}
            </div>
          ) : (
            <Button size="sm" onClick={handleBuy}>
              <Download className="mr-2 h-4 w-4" />
              Kup za {ebook.price} PLN
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
