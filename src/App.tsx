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
import { PageTracker } from "@/components/analytics/PageTracker";
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import CountryPage from "./pages/CountryPage";
import ContinentPage from "./pages/ContinentPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LibraryPage from "./pages/LibraryPage";
import AdminPage from "./pages/AdminPage";
import LegalPage from "./pages/LegalPage";
import AccountPage from "./pages/AccountPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import NotFound from "./pages/NotFound";

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
              <PageTracker />
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
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
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
