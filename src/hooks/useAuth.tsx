import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to translate Supabase auth errors to Polish
function translateAuthError(error: AuthError): string {
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'Błędne hasło lub adres e-mail. Spróbuj ponownie.',
    'Email not confirmed': 'Adres e-mail nie został potwierdzony. Sprawdź swoją skrzynkę.',
    'User already registered': 'Użytkownik o tym adresie e-mail już istnieje.',
    'Password should be at least 6 characters': 'Hasło musi mieć minimum 6 znaków.',
    'Signup requires a valid password': 'Podaj prawidłowe hasło.',
    'Unable to validate email address: invalid format': 'Nieprawidłowy format adresu e-mail.',
    'User not found': 'Użytkownik nie został znaleziony.',
    'Email rate limit exceeded': 'Zbyt wiele prób. Spróbuj ponownie za chwilę.',
    'For security purposes, you can only request this once every 60 seconds': 'Ze względów bezpieczeństwa możesz wysłać żądanie raz na 60 sekund.',
    'New password should be different from the old password': 'Nowe hasło musi być inne niż poprzednie.',
    'Auth session missing!': 'Sesja wygasła. Zaloguj się ponownie.',
    'JWT expired': 'Sesja wygasła. Zaloguj się ponownie.',
  };

  // Check for partial matches
  const errorMessage = error.message;
  for (const [key, value] of Object.entries(errorMessages)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Default fallback for unknown errors
  return 'Wystąpił błąd. Spróbuj ponownie później.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: 'Błąd rejestracji',
        description: translateAuthError(error),
        variant: 'destructive',
      });
      throw error;
    }

    toast({
      title: 'Konto utworzone!',
      description: 'Sprawdź swoją skrzynkę e-mail, aby potwierdzić rejestrację.',
    });
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: 'Błąd logowania',
        description: translateAuthError(error),
        variant: 'destructive',
      });
      throw error;
    }

    toast({
      title: 'Zalogowano!',
      description: 'Witaj z powrotem w świecie Poli i Leona.',
    });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: 'Błąd wylogowania',
        description: translateAuthError(error),
        variant: 'destructive',
      });
      throw error;
    }

    toast({
      title: 'Wylogowano',
      description: 'Do zobaczenia!',
    });
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
