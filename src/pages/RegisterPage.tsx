import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().trim().email({ message: 'Nieprawidłowy adres email' }),
  password: z.string().min(6, { message: 'Hasło musi mieć minimum 6 znaków' }),
  confirmPassword: z.string(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'Musisz zaakceptować regulamin' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Hasła nie są identyczne',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string; 
    confirmPassword?: string;
    termsAccepted?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse({ email, password, confirmPassword, termsAccepted });
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
      await signUp(email, password);
      
      // Update profile with consents after signup
      // This will be handled by the trigger, but we need to update consents
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({
            newsletter_consent: newsletterConsent,
            marketing_consent: marketingConsent,
            terms_accepted_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
      }
      
      navigate('/logowanie');
    } catch {
      // Error is handled in useAuth
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-16 md:py-24 bg-hero min-h-[calc(100vh-200px)] flex items-center">
        <div className="container">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground font-display text-2xl font-bold mb-4">
                PL
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Dołącz do przygody!
              </h1>
              <p className="text-muted-foreground font-body">
                Załóż konto i wyrusz z Polą i Leonem w podróż po świecie
              </p>
            </div>

            <div className="bg-card rounded-3xl shadow-card border border-border/50 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-body">Adres email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="twoj@email.pl"
                      className="pl-10 h-12 rounded-xl font-body"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-body">Hasło</Label>
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

                {/* Consents */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                      disabled={isLoading}
                      className="mt-0.5"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="terms" className="font-body text-sm leading-relaxed cursor-pointer">
                        Akceptuję{' '}
                        <Link to="/prawne?tab=regulamin" className="text-primary hover:underline" target="_blank">
                          Regulamin
                        </Link>
                        {' '}i{' '}
                        <Link to="/prawne?tab=polityka" className="text-primary hover:underline" target="_blank">
                          Politykę Prywatności
                        </Link>
                        {' '}*
                      </Label>
                      {errors.termsAccepted && (
                        <p className="text-sm text-destructive">{errors.termsAccepted}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="newsletter"
                      checked={newsletterConsent}
                      onCheckedChange={(checked) => setNewsletterConsent(checked === true)}
                      disabled={isLoading}
                      className="mt-0.5"
                    />
                    <Label htmlFor="newsletter" className="font-body text-sm leading-relaxed cursor-pointer">
                      Chcę zapisać się do newslettera i otrzymywać informacje o nowych bajkach
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="marketing"
                      checked={marketingConsent}
                      onCheckedChange={(checked) => setMarketingConsent(checked === true)}
                      disabled={isLoading}
                      className="mt-0.5"
                    />
                    <Label htmlFor="marketing" className="font-body text-sm leading-relaxed cursor-pointer">
                      Wyrażam zgodę na komunikację marketingową
                    </Label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl font-display text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Rejestracja...
                    </>
                  ) : (
                    'Zarejestruj się'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground font-body">
                Masz już konto?{' '}
                <Link to="/logowanie" className="text-primary hover:underline font-semibold">
                  Zaloguj się
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
