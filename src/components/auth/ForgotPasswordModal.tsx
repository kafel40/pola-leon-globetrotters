import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().trim().email({ message: 'Nieprawidłowy adres email' });

interface ForgotPasswordModalProps {
  trigger?: React.ReactNode;
}

export function ForgotPasswordModal({ trigger }: ForgotPasswordModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (resetError) {
        toast({
          title: 'Błąd',
          description: resetError.message,
          variant: 'destructive',
        });
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Password reset error:', err);
      toast({
        title: 'Błąd',
        description: 'Nie udało się wysłać emaila. Spróbuj ponownie.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when closing
      setEmail('');
      setError(null);
      setIsSuccess(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="text-sm text-primary hover:underline font-body">
            Zapomniałem hasła
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isSuccess ? 'Email wysłany!' : 'Resetowanie hasła'}
          </DialogTitle>
          <DialogDescription className="font-body">
            {isSuccess 
              ? 'Sprawdź swoją skrzynkę mailową.' 
              : 'Podaj adres email powiązany z Twoim kontem.'
            }
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
              <CheckCircle className="h-7 w-7" />
            </div>
            <p className="text-muted-foreground font-body text-sm">
              Wysłaliśmy link do resetowania hasła na adres <strong>{email}</strong>. 
              Kliknij w link w wiadomości, aby ustawić nowe hasło.
            </p>
            <Button 
              onClick={() => handleOpenChange(false)} 
              className="mt-6 font-display"
            >
              Zamknij
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="font-body">Adres email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="twoj@email.pl"
                  className="pl-10 h-12 rounded-xl font-body"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl font-display"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Wysyłanie...
                </>
              ) : (
                'Wyślij link resetujący'
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
