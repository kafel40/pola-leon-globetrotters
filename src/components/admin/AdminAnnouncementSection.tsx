import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Megaphone, Loader2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnnouncementData {
  id: string;
  message: string;
  is_active: boolean;
  bg_color: string;
}

export function AdminAnnouncementSection() {
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [bgColor, setBgColor] = useState('#7C3AED');
  const { toast } = useToast();

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const { data, error } = await supabase
        .from('announcement_bar')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAnnouncement(data);
        setMessage(data.message);
        setIsActive(data.is_active || false);
        setBgColor(data.bg_color || '#7C3AED');
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!message.trim()) {
      toast({
        title: 'Błąd',
        description: 'Treść ogłoszenia nie może być pusta.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      if (announcement) {
        // Update existing
        const { error } = await supabase
          .from('announcement_bar')
          .update({
            message: message.trim(),
            is_active: isActive,
            bg_color: bgColor,
            updated_at: new Date().toISOString(),
          })
          .eq('id', announcement.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase
          .from('announcement_bar')
          .insert({
            message: message.trim(),
            is_active: isActive,
            bg_color: bgColor,
          });

        if (error) throw error;
      }

      toast({
        title: 'Zapisano!',
        description: 'Pasek ogłoszeń został zaktualizowany.',
      });

      fetchAnnouncement();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się zapisać ogłoszenia.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Pasek ogłoszeń
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="announcement-message" className="font-body">
            Treść ogłoszenia
          </Label>
          <Input
            id="announcement-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="np. 🎉 Nowa bajka dostępna! Sprawdź przygodę w Japonii."
            className="font-body"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="bg-color" className="font-body">
              Kolor tła
            </Label>
            <div className="flex gap-2">
              <Input
                id="bg-color"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                placeholder="#7C3AED"
                className="flex-1 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="is-active" className="font-body">
              {isActive ? 'Włączony' : 'Wyłączony'}
            </Label>
          </div>
        </div>

        {/* Preview */}
        {message && (
          <div className="space-y-2">
            <Label className="font-body text-sm text-muted-foreground">Podgląd:</Label>
            <div
              className="py-2 px-4 text-center text-sm text-white rounded-lg overflow-hidden"
              style={{ backgroundColor: bgColor }}
            >
              <p className="truncate">{message}</p>
            </div>
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full font-display"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Zapisywanie...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Zapisz ogłoszenie
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
