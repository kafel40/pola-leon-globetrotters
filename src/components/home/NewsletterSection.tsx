import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Loader2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().trim().email({ message: 'Nieprawidłowy adres email' });

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    try {
      // Call Edge Function for newsletter subscription (handles MailerLite sync)
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/subscribe-newsletter`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Błąd zapisywania');
      }

      setIsSuccess(true);
      setEmail('');
      toast({
        title: 'Zapisano!',
        description: 'Dziękujemy za zapisanie się do newslettera.',
      });
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      toast({
        title: 'Błąd',
        description: 'Nie udało się zapisać do newslettera. Spróbuj ponownie.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-muted/50">
      <div className="container">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
            <Mail className="h-7 w-7 text-primary" />
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Zapisz się do newslettera
          </h2>

          <p className="text-muted-foreground font-body">
            Bądź na bieżąco z nowymi przygodami Poli i Leona! 
            Otrzymuj informacje o nowych bajkach i promocjach.
          </p>

          {isSuccess ? (
            <div className="flex items-center justify-center gap-2 text-primary font-body">
              <Check className="h-5 w-5" />
              <span>Dziękujemy za zapisanie się!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Twój adres email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-12 rounded-xl font-body"
                />
                {error && (
                  <p className="text-sm text-destructive mt-1 text-left">{error}</p>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="h-12 px-6 rounded-xl font-display"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Zapisz się'
                )}
              </Button>
            </form>
          )}

          <p className="text-xs text-muted-foreground font-body">
            Możesz zrezygnować w każdej chwili. Szanujemy Twoją prywatność.
          </p>
        </div>
      </div>
    </section>
  );
}
