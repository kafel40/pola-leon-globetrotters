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
        
        // Use secure RPC function instead of direct INSERT
        // This validates and sanitizes inputs server-side
        await (supabase.rpc as any)('log_page_visit', {
          _visitor_id: visitorId,
          _page_path: location.pathname,
          _user_agent: navigator.userAgent?.substring(0, 512) || null,
          _referrer: document.referrer?.substring(0, 512) || null,
          _user_id: user?.id || null,
        });
      } catch (error) {
        // Silent fail - don't disrupt user experience
        console.debug('Page tracking failed:', error);
      }
    };

    trackPageVisit();
  }, [location.pathname, user?.id]);
}
