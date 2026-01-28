import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Announcement {
  id: string;
  message: string;
  bg_color: string | null;
}

export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [needsMarquee, setNeedsMarquee] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('announcement_dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const fetchAnnouncement = async () => {
      const { data, error } = await supabase
        .from('announcement_bar')
        .select('id, message, bg_color')
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

  // Check if text overflows and needs marquee
  useEffect(() => {
    if (textRef.current && containerRef.current) {
      const textWidth = textRef.current.scrollWidth;
      const containerWidth = containerRef.current.offsetWidth - 80; // Account for close button
      setNeedsMarquee(textWidth > containerWidth);
    }
  }, [announcement]);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('announcement_dismissed', 'true');
  };

  if (isDismissed || !announcement) {
    return null;
  }

  const bgColor = announcement.bg_color || 'hsl(var(--primary))';

  return (
    <div 
      className="py-2 px-4 relative text-white"
      style={{ backgroundColor: bgColor, minHeight: '36px' }}
    >
      <div 
        ref={containerRef}
        className="container flex items-center justify-center overflow-hidden"
      >
        <div className={`${needsMarquee ? 'animate-marquee whitespace-nowrap' : ''}`}>
          <p 
            ref={textRef}
            className="text-sm font-body text-center pr-8"
          >
            {announcement.message}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Zamknij komunikat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
