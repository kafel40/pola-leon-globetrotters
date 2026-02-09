import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AudioPlayerProvider } from "@/components/audio/AudioPlayerContext";
import { AudioPlayerWidget } from "@/components/audio/AudioPlayerWidget";
import { PdfViewerProvider } from "@/components/pdf/PdfViewerContext";
import { PdfViewerModal } from "@/components/pdf/PdfViewerModal";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { PageTracker } from "@/components/analytics/PageTracker";
import { RouteLoadingFallback } from "@/components/layout/RouteLoadingFallback";

// Eager load: home page (critical path)
import Index from "./pages/Index";

// Lazy load: all other pages
const MapPage = lazy(() => import("./pages/MapPage"));
const CountryPage = lazy(() => import("./pages/CountryPage"));
const ContinentPage = lazy(() => import("./pages/ContinentPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const UpdatePasswordPage = lazy(() => import("./pages/UpdatePasswordPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const ConfirmNewsletterPage = lazy(() => import("./pages/ConfirmNewsletterPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AudioPlayerProvider>
        <PdfViewerProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <PageTracker />
              <Suspense fallback={<RouteLoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/mapa" element={<MapPage />} />
                  <Route path="/kraj/:slug" element={<CountryPage />} />
                  <Route path="/kontynent/:slug" element={<ContinentPage />} />
                  <Route path="/o-nas" element={<AboutPage />} />
                  <Route path="/logowanie" element={<LoginPage />} />
                  <Route path="/rejestracja" element={<RegisterPage />} />
                  <Route path="/biblioteka" element={<LibraryPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/prawne" element={<LegalPage />} />
                  <Route path="/konto" element={<AccountPage />} />
                  <Route path="/update-password" element={<UpdatePasswordPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/potwierdz-newsletter" element={<ConfirmNewsletterPage />} />
                  <Route path="/kontakt" element={<ContactPage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              {/* Global audio player widget */}
              <AudioPlayerWidget />
              {/* Global PDF viewer modal */}
              <PdfViewerModal />
            </BrowserRouter>
          </TooltipProvider>
        </PdfViewerProvider>
      </AudioPlayerProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
