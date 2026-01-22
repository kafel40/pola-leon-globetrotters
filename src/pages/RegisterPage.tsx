import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User } from 'lucide-react';

export default function RegisterPage() {
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
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-body">Imię</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Twoje imię"
                      className="pl-10 h-12 rounded-xl font-body"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-body">Adres email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="twoj@email.pl"
                      className="pl-10 h-12 rounded-xl font-body"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-body">Hasło</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimum 8 znaków"
                      className="pl-10 h-12 rounded-xl font-body"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl font-display text-lg">
                  Zarejestruj się
                </Button>
              </form>

              <p className="mt-4 text-xs text-center text-muted-foreground font-body">
                Rejestrując się, akceptujesz nasz{' '}
                <Link to="/regulamin" className="text-primary hover:underline">regulamin</Link>
                {' '}i{' '}
                <Link to="/polityka-prywatnosci" className="text-primary hover:underline">politykę prywatności</Link>.
              </p>

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
