import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const passwordSchema = z.object({
  password: z.string().min(6, { message: 'Hasło musi mieć minimum 6 znaków' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Hasła nie są identyczne',
  path: ['confirmPassword'],
});

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has a valid recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsValidSession(!!session);
    };
    checkSession();

    // Listen for auth state changes (when user clicks recovery link)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = passwordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof fieldErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast({
          title: 'Błąd',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setIsSuccess(true);
      toast({
        title: 'Hasło zmienione!',
        description: 'Możesz teraz zalogować się nowym hasłem.',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/logowanie');
      }, 2000);
    } catch (error) {
      console.error('Password update error:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się zmienić hasła. Spróbuj ponownie.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidSession === null) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isValidSession) {
    return (
      <Layout>
        <section className="py-16 md:py-24 bg-hero min-h-[calc(100vh-200px)] flex items-center">
          <div className="container">
            <div className="max-w-md mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 text-destructive mb-4">
                <Lock className="h-8 w-8" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-4">
                Link wygasł lub jest nieprawidłowy
              </h1>
              <p className="text-muted-foreground font-body mb-6">
                Link do resetowania hasła jest nieprawidłowy lub wygasł. 
                Spróbuj ponownie zresetować hasło.
              </p>
              <Button onClick={() => navigate('/logowanie')} className="font-display">
                Wróć do logowania
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (isSuccess) {
    return (
      <Layout>
        <section className="py-16 md:py-24 bg-hero min-h-[calc(100vh-200px)] flex items-center">
          <div className="container">
            <div className="max-w-md mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-4">
                Hasło zostało zmienione!
              </h1>
              <p className="text-muted-foreground font-body">
                Za chwilę zostaniesz przekierowany do strony logowania...
              </p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 md:py-24 bg-hero min-h-[calc(100vh-200px)] flex items-center">
        <div className="container">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
                <Lock className="h-8 w-8" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Ustaw nowe hasło
              </h1>
              <p className="text-muted-foreground font-body">
                Wprowadź nowe hasło do swojego konta
              </p>
            </div>

            <div className="bg-card rounded-3xl shadow-card border border-border/50 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-body">Nowe hasło</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimum 6 znaków"
                      className="pl-10 h-12 rounded-xl font-body"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="font-body">Potwierdź hasło</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Powtórz hasło"
                      className="pl-10 h-12 rounded-xl font-body"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl font-display text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Zapisywanie...
                    </>
                  ) : (
                    'Zmień hasło'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
