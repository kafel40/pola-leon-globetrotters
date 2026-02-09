import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import logoAvatar from '@/assets/logo-avatar.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoAvatar} alt="Pola i Leon" className="h-10 w-10 rounded-xl object-cover" />
              <span className="font-display text-xl font-bold">Pola i Leon</span>
            </Link>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Bajki edukacyjne dla dzieci 2-6 lat. Odkrywaj świat razem z Polą i Leonem!
            </p>
          </div>

          {/* Kontynenty */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-foreground">Kontynenty</h4>
            <nav className="flex flex-col gap-2 text-sm font-body">
              <Link to="/kontynent/europa" className="text-muted-foreground hover:text-foreground transition-colors">
                Europa
              </Link>
              <Link to="/kontynent/azja" className="text-muted-foreground hover:text-foreground transition-colors">
                Azja
              </Link>
              <Link to="/kontynent/afryka" className="text-muted-foreground hover:text-foreground transition-colors">
                Afryka
              </Link>
              <Link to="/kontynent/ameryka-polnocna" className="text-muted-foreground hover:text-foreground transition-colors">
                Ameryka Północna
              </Link>
              <Link to="/kontynent/ameryka-poludniowa" className="text-muted-foreground hover:text-foreground transition-colors">
                Ameryka Południowa
              </Link>
              <Link to="/kontynent/oceania" className="text-muted-foreground hover:text-foreground transition-colors">
                Oceania
              </Link>
            </nav>
          </div>

          {/* Odkrywaj */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-foreground">Odkrywaj</h4>
            <nav className="flex flex-col gap-2 text-sm font-body">
              <Link to="/mapa" className="text-muted-foreground hover:text-foreground transition-colors">
                Mapa świata
              </Link>
              <Link to="/o-nas" className="text-muted-foreground hover:text-foreground transition-colors">
                O Poli i Leonie
              </Link>
              <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog rodzinny
              </Link>
              <Link to="/biblioteka" className="text-muted-foreground hover:text-foreground transition-colors">
                Moja biblioteka
              </Link>
            </nav>
          </div>

          {/* Konto i Prawne */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-foreground">Konto</h4>
            <nav className="flex flex-col gap-2 text-sm font-body">
              <Link to="/logowanie" className="text-muted-foreground hover:text-foreground transition-colors">
                Zaloguj się
              </Link>
              <Link to="/rejestracja" className="text-muted-foreground hover:text-foreground transition-colors">
                Zarejestruj się
              </Link>
            </nav>
            
            <h4 className="font-display font-bold text-foreground pt-4">Stacja informacja</h4>
            <nav className="flex flex-col gap-2 text-sm font-body">
              <Link to="/kontakt" className="text-muted-foreground hover:text-foreground transition-colors">
                Kontakt
              </Link>
              <Link to="/prawne?tab=regulamin" className="text-muted-foreground hover:text-foreground transition-colors">
                Regulamin
              </Link>
              <Link to="/prawne?tab=polityka" className="text-muted-foreground hover:text-foreground transition-colors">
                Polityka Prywatności
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-body">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="flex items-center gap-1">
              © {currentYear} Pola i Leon. Tworzone z <Heart className="h-4 w-4 text-accent-foreground fill-accent" /> dla dzieci.
            </p>
            <span className="hidden sm:inline">•</span>
            <p>Właściciel: CARSI Sp. z o.o.</p>
          </div>
          <p>Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}
