import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cookie, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie_consent';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    } else {
      try {
        const savedPrefs = JSON.parse(consent);
        setPreferences(savedPrefs);
        applyConsent(savedPrefs);
      } catch {
        setIsVisible(true);
      }
    }
  }, []);

  const applyConsent = (prefs: CookiePreferences) => {
    // Here you would enable/disable tracking scripts based on consent
    // For now, we just store the preferences
    if (prefs.analytics) {
      // Enable analytics scripts
      console.log('Analytics enabled');
    }
    if (prefs.marketing) {
      // Enable marketing scripts
      console.log('Marketing enabled');
    }
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    applyConsent(prefs);
    setIsVisible(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const saveSelected = () => {
    savePreferences(preferences);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t border-border shadow-lg">
      <div className="container max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-semibold text-foreground mb-1">
                Ta strona używa plików cookies
              </h3>
              <p className="text-sm text-muted-foreground font-body">
                Używamy plików cookies, aby zapewnić prawidłowe działanie strony oraz w celach analitycznych i marketingowych. 
                Możesz zarządzać swoimi preferencjami.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" className="font-body">
                  <Settings className="h-4 w-4 mr-2" />
                  Ustawienia
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display">Ustawienia plików cookies</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-body font-medium">Niezbędne</Label>
                      <p className="text-sm text-muted-foreground font-body">
                        Kluczowe dla działania strony. Nie można ich wyłączyć.
                      </p>
                    </div>
                    <Switch checked={true} disabled />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-body font-medium">Analityczne</Label>
                      <p className="text-sm text-muted-foreground font-body">
                        Pomagają nam zrozumieć, jak korzystasz ze strony.
                      </p>
                    </div>
                    <Switch
                      checked={preferences.analytics}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({ ...prev, analytics: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="font-body font-medium">Marketingowe</Label>
                      <p className="text-sm text-muted-foreground font-body">
                        Pozwalają na dopasowanie treści do Twoich zainteresowań.
                      </p>
                    </div>
                    <Switch
                      checked={preferences.marketing}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({ ...prev, marketing: checked }))
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={saveSelected} className="flex-1 font-body">
                    Zapisz wybrane
                  </Button>
                  <Button onClick={acceptAll} className="flex-1 font-display">
                    Akceptuję wszystkie
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={acceptAll} className="font-display">
              Akceptuję wszystkie
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
