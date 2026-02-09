import { ReactNode, lazy, Suspense } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AnnouncementBar } from './AnnouncementBar';

// Lazy load CookieConsent - not critical for initial render
const CookieConsent = lazy(() => import('./CookieConsent').then(m => ({ default: m.CookieConsent })));

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Suspense fallback={null}>
        <CookieConsent />
      </Suspense>
    </div>
  );
}
