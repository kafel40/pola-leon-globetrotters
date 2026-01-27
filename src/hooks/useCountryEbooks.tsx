import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Ebook {
  id: string;
  title: string;
  slug: string;
  country_slug: string;
  description: string | null;
  age_group: string | null;
  cover_image_url: string | null;
  pdf_url: string | null;
  epub_url: string | null;
  audio_url: string | null;
  price: number | null;
  is_published: boolean | null;
}

export interface OwnedEbook {
  ebook_id: string;
}

export function useCountryEbooks(countrySlug: string) {
  const { user } = useAuth();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [ownedEbookIds, setOwnedEbookIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!countrySlug) return;

    const fetchEbooks = async () => {
      setLoading(true);
      
      // Fetch published ebooks for this country
      const { data: ebooksData, error: ebooksError } = await supabase
        .from('ebooks')
        .select('*')
        .eq('country_slug', countrySlug)
        .eq('is_published', true);

      if (ebooksError) {
        console.error('Error fetching ebooks:', ebooksError);
      } else {
        setEbooks(ebooksData || []);
      }

      // If user is logged in, fetch their owned ebooks
      if (user) {
        const { data: ownedData, error: ownedError } = await supabase
          .from('owned_ebooks')
          .select('ebook_id')
          .eq('user_id', user.id);

        if (ownedError) {
          console.error('Error fetching owned ebooks:', ownedError);
        } else {
          setOwnedEbookIds(new Set(ownedData?.map(o => o.ebook_id) || []));
        }
      }

      setLoading(false);
    };

    fetchEbooks();
  }, [countrySlug, user]);

  const isOwned = (ebookId: string) => ownedEbookIds.has(ebookId);

  const acquireEbook = async (ebook: Ebook): Promise<boolean> => {
    if (!user) return false;

    // Check if already owned
    if (isOwned(ebook.id)) return true;

    // Insert ownership record
    const { error } = await supabase
      .from('owned_ebooks')
      .insert({
        user_id: user.id,
        ebook_id: ebook.id,
        country_slug: ebook.country_slug,
      });

    if (error) {
      console.error('Error acquiring ebook:', error);
      return false;
    }

    // Update local state
    setOwnedEbookIds(prev => new Set([...prev, ebook.id]));
    return true;
  };

  return {
    ebooks,
    loading,
    isOwned,
    acquireEbook,
  };
}
