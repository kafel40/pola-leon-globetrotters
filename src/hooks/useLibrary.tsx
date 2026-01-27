import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface OwnedEbook {
  id: string;
  ebook_id: string;
  country_slug: string;
  purchased_at: string;
  ebook?: {
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
  };
}

export function useLibrary() {
  const { user } = useAuth();
  const [ownedEbooks, setOwnedEbooks] = useState<OwnedEbook[]>([]);
  const [discoveredCountries, setDiscoveredCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOwnedEbooks([]);
      setDiscoveredCountries([]);
      setLoading(false);
      return;
    }

    const fetchLibrary = async () => {
      setLoading(true);

      // Fetch owned ebooks with ebook details
      const { data: ownedData, error: ownedError } = await supabase
        .from('owned_ebooks')
        .select('*')
        .eq('user_id', user.id);

      if (ownedError) {
        console.error('Error fetching owned ebooks:', ownedError);
      } else if (ownedData && ownedData.length > 0) {
        // Fetch ebook details for owned ebooks
        const ebookIds = ownedData.map(o => o.ebook_id);
        const { data: ebooksData, error: ebooksError } = await supabase
          .from('ebooks')
          .select('id, title, slug, country_slug, description, age_group, cover_image_url, pdf_url, epub_url, audio_url')
          .in('id', ebookIds);

        if (ebooksError) {
          console.error('Error fetching ebook details:', ebooksError);
        } else {
          // Combine owned_ebooks with ebook details
          const enrichedOwnedEbooks = ownedData.map(owned => ({
            ...owned,
            ebook: ebooksData?.find(e => e.id === owned.ebook_id),
          }));
          setOwnedEbooks(enrichedOwnedEbooks);
        }

        // Extract unique countries
        const uniqueCountries = [...new Set(ownedData.map(o => o.country_slug))];
        setDiscoveredCountries(uniqueCountries);
      }

      // Also fetch discovered countries
      const { data: discoveredData, error: discoveredError } = await supabase
        .from('discovered_countries')
        .select('country_slug')
        .eq('user_id', user.id);

      if (discoveredError) {
        console.error('Error fetching discovered countries:', discoveredError);
      } else if (discoveredData) {
        const allCountries = [
          ...discoveredCountries,
          ...discoveredData.map(d => d.country_slug),
        ];
        setDiscoveredCountries([...new Set(allCountries)]);
      }

      setLoading(false);
    };

    fetchLibrary();
  }, [user]);

  return {
    ownedEbooks,
    discoveredCountries,
    loading,
    isLoggedIn: !!user,
  };
}
