import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PageHead } from '@/components/seo/PageHead';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { AppleSignInButton } from '@/components/auth/AppleSignInButton';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Nieprawidłowy adres email' }),
  password: z.string().min(6, { message: 'Hasło musi mieć minimum 6 znaków' }),
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      navigate('/biblioteka');
    } catch {
      // Error is handled in useAuth
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <PageHead 
        title="Logowanie"
        description="Zaloguj się do swojego konta Pola i Leon. Dostęp do bajek edukacyjnych, biblioteki i mapy odkryć."
      />
      <section className="py-16 md:py-24 bg-hero min-h-[calc(100vh-200px)] flex items-center">
        <div className="container">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground font-display text-2xl font-bold mb-4">
                PL
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Witaj z powrotem!
              </h1>
              <p className="text-muted-foreground font-body">
                Zaloguj się, aby kontynuować przygodę z Polą i Leonem
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="font-body">Hasło</Label>
                    <ForgotPasswordModal />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
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

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl font-display text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Logowanie...
                    </>
                  ) : (
                    'Zaloguj się'
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">lub</span>
                </div>
              </div>

              <div className="space-y-3">
                <GoogleSignInButton />
                <AppleSignInButton />
              </div>

              <div className="mt-6 text-center text-sm text-muted-foreground font-body">
                Nie masz jeszcze konta?{' '}
                <Link to="/rejestracja" className="text-primary hover:underline font-semibold">
                  Zarejestruj się
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
