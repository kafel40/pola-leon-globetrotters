import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Mail, 
  Bell, 
  Megaphone, 
  Loader2, 
  Save, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChangePasswordSection } from '@/components/account/ChangePasswordSection';

interface ProfileData {
  full_name: string | null;
  email: string;
  newsletter_consent: boolean;
  marketing_consent: boolean;
}

export default function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [fullName, setFullName] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/logowanie');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, email, newsletter_consent, marketing_consent')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setFullName(data.full_name || '');
        setNewsletterConsent(data.newsletter_consent || false);
        setMarketingConsent(data.marketing_consent || false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Błąd',
          description: 'Nie udało się wczytać danych profilu.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, toast]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim() || null,
          newsletter_consent: newsletterConsent,
          marketing_consent: marketingConsent,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Zapisano!',
        description: 'Twoje dane zostały zaktualizowane.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się zapisać zmian.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      // Sign out first, then the user would need to contact support for full deletion
      // Full account deletion requires admin/service role access
      await signOut();
      
      toast({
        title: 'Wylogowano',
        description: 'Aby całkowicie usunąć konto, skontaktuj się z nami na m.kachlicki@gmail.com',
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć konta. Spróbuj ponownie.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="container py-16 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <Layout>
      <section className="py-12 md:py-16 bg-hero min-h-[calc(100vh-200px)]">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
                <User className="h-8 w-8" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Moje Konto
              </h1>
              <p className="text-muted-foreground font-body">
                Zarządzaj swoimi danymi i preferencjami
              </p>
            </div>

            {/* Profile Section */}
            <div className="bg-card rounded-3xl shadow-card border border-border/50 p-6 md:p-8 mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Twoje Dane
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-body flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Adres email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="h-12 rounded-xl font-body bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Adres email nie może być zmieniony.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-body">
                    Imię i Nazwisko
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Jan Kowalski"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 rounded-xl font-body"
                  />
                </div>
              </div>
            </div>

            {/* Consents Section */}
            <div className="bg-card rounded-3xl shadow-card border border-border/50 p-6 md:p-8 mb-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Zgody
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-body font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Newsletter
                    </Label>
                    <p className="text-sm text-muted-foreground font-body">
                      Otrzymuj informacje o nowych bajkach i promocjach.
                    </p>
                  </div>
                  <Switch
                    checked={newsletterConsent}
                    onCheckedChange={setNewsletterConsent}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-body font-medium flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-muted-foreground" />
                      Komunikacja marketingowa
                    </Label>
                    <p className="text-sm text-muted-foreground font-body">
                      Zgoda na treści marketingowe i oferty specjalne.
                    </p>
                  </div>
                  <Switch
                    checked={marketingConsent}
                    onCheckedChange={setMarketingConsent}
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <ChangePasswordSection />

            {/* Save Button */}
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full h-12 rounded-xl font-display text-lg mb-6"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Zapisz zmiany
                </>
              )}
            </Button>

            {/* Danger Zone */}
            <div className="bg-destructive/5 rounded-3xl border border-destructive/20 p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold text-destructive mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Strefa zagrożenia
              </h2>
              <p className="text-sm text-muted-foreground font-body mb-4">
                Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane zostaną usunięte.
              </p>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="font-body">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Usuń konto
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display">
                      Czy na pewno chcesz usunąć konto?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="font-body">
                      Ta akcja jest nieodwracalna. Wszystkie Twoje dane, w tym historia zakupów 
                      i biblioteka, zostaną trwale usunięte.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="font-body">Anuluj</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Tak, usuń konto'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
