import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const VISITOR_ID_KEY = 'pola_leon_visitor_id';

function getOrCreateVisitorId(): string {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

export function usePageTracking() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const trackPageVisit = async () => {
      try {
        const visitorId = getOrCreateVisitorId();

        await supabase.from('page_visits').insert({
          visitor_id: visitorId,
          page_path: location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          user_id: user?.id || null,
        });
      } catch (error) {
        // Silent fail - don't disrupt user experience
        console.debug('Page tracking failed:', error);
      }
    };

    trackPageVisit();
  }, [location.pathname, user?.id]);
}
