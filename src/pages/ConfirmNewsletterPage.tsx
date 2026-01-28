import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHead } from '@/components/seo/PageHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Mail, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function ConfirmNewsletterPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Brak tokenu potwierdzającego. Sprawdź link w emailu.');
      return;
    }

    confirmSubscription(token);
  }, [searchParams]);

  const confirmSubscription = async (token: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('confirm-newsletter', {
        body: { token },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error || 'Wystąpił błąd podczas potwierdzania subskrypcji.');
      }
    } catch (err) {
      console.error('Confirmation error:', err);
      setStatus('error');
      setMessage('Wystąpił błąd podczas potwierdzania subskrypcji. Spróbuj ponownie później.');
    }
  };

  return (
    <Layout>
      <PageHead 
        title="Potwierdzenie newslettera"
        description="Potwierdzenie subskrypcji newslettera Pola i Leon"
      />

      <section className="py-20 md:py-32 min-h-[60vh] flex items-center">
        <div className="container max-w-lg">
          <Card className="border-0 shadow-xl">
            <CardContent className="pt-10 pb-10 text-center">
              {status === 'loading' && (
                <>
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-foreground mb-3">
                    Potwierdzanie subskrypcji...
                  </h1>
                  <p className="text-muted-foreground font-body">
                    Proszę czekać, weryfikujemy Twój adres email.
                  </p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-foreground mb-3">
                    Subskrypcja potwierdzona! 🎉
                  </h1>
                  <p className="text-muted-foreground font-body mb-6">
                    {message}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                      <Link to="/">
                        <Home className="h-4 w-4 mr-2" />
                        Strona główna
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/blog">
                        Czytaj blog
                      </Link>
                    </Button>
                  </div>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                    <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h1 className="font-display text-2xl font-bold text-foreground mb-3">
                    Coś poszło nie tak
                  </h1>
                  <p className="text-muted-foreground font-body mb-6">
                    {message}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                      <Link to="/">
                        <Home className="h-4 w-4 mr-2" />
                        Strona główna
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/#newsletter">
                        <Mail className="h-4 w-4 mr-2" />
                        Zapisz się ponownie
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
