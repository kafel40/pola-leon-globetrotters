import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Announcement {
  id: string;
  message: string;
}

export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('announcement_dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const fetchAnnouncement = async () => {
      const { data, error } = await supabase
        .from('announcement_bar')
        .select('id, message')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setAnnouncement(data);
      }
    };

    fetchAnnouncement();
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('announcement_dismissed', 'true');
  };

  if (isDismissed || !announcement) {
    return null;
  }

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 relative">
      <div className="container flex items-center justify-center">
        <p className="text-sm font-body text-center pr-8">
          {announcement.message}
        </p>
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-primary-foreground/20 rounded-full transition-colors"
          aria-label="Zamknij komunikat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
