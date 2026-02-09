import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoAvatar from '@/assets/logo-avatar.png';
import { Menu, Globe, BookOpen, Users, Map, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { continents } from '@/data/countries';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, loading } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { href: '/mapa', label: 'Mapa świata', icon: Map },
    { href: '/o-nas', label: 'O nas', icon: Users },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logoAvatar} alt="Pola i Leon" className="h-10 w-10 rounded-xl object-cover transition-transform group-hover:scale-105" />
          <span className="hidden sm:block font-display text-xl font-bold text-foreground">
            Pola i Leon
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Kontynenty Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 font-body">
                <Globe className="h-4 w-4" />
                Kontynenty
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {continents.map((continent) => (
                <DropdownMenuItem key={continent.id} asChild>
                  <Link to={`/kontynent/${continent.slug}`} className="cursor-pointer">
                    {continent.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={`font-body ${isActive(link.href) ? 'bg-accent text-accent-foreground' : ''}`}
            >
              <Link to={link.href} className="flex items-center gap-2">
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {!loading && (
            <>
              {user ? (
                <>
                  <Button asChild className="font-display">
                    <Link to="/biblioteka">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Moja biblioteka
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="font-body">
                    <Link to="/konto">
                      <Users className="h-4 w-4 mr-2" />
                      Moje konto
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={handleSignOut} className="font-body">
                    <LogOut className="h-4 w-4 mr-2" />
                    Wyloguj
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="font-body">
                    <Link to="/logowanie">Zaloguj się</Link>
                  </Button>
                  <Button asChild className="font-display">
                    <Link to="/rejestracja">Załóż konto</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px] overflow-y-auto">
            <div className="flex flex-col gap-6 mt-8 pb-8">
              <div className="flex items-center gap-2 mb-4">
                <img src={logoAvatar} alt="Pola i Leon" className="h-10 w-10 rounded-xl object-cover" />
                <span className="font-display text-xl font-bold">Pola i Leon</span>
              </div>

              <nav className="flex flex-col gap-2">
                <SheetClose asChild>
                  <Link
                    to="/"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body transition-colors ${
                      isActive('/') ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
                    }`}
                  >
                    Strona główna
                  </Link>
                </SheetClose>

                {navLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      to={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body transition-colors ${
                        isActive(link.href) ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
                      }`}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}

                <div className="h-px bg-border my-2" />

                {!loading && (
                  <>
                    {user ? (
                      <>
                        <SheetClose asChild>
                          <Link to="/biblioteka">
                            <Button className="w-full font-display">
                              <BookOpen className="h-4 w-4 mr-2" />
                              Moja biblioteka
                            </Button>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            to="/konto"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-body transition-colors hover:bg-muted mt-2"
                          >
                            <Users className="h-5 w-5" />
                            Moje konto
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button 
                            variant="ghost" 
                            onClick={handleSignOut}
                            className="w-full font-body mt-2"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Wyloguj się
                          </Button>
                        </SheetClose>
                      </>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <Link
                            to="/logowanie"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-body transition-colors hover:bg-muted"
                          >
                            Zaloguj się
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to="/rejestracja">
                            <Button className="w-full font-display mt-2">
                              Załóż konto
                            </Button>
                          </Link>
                        </SheetClose>
                      </>
                    )}
                  </>
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
