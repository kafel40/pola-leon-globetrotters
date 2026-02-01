import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type CountryStatusType = 'available' | 'coming_soon' | 'soon' | 'none';

export interface CountryStatus {
  id: string;
  country_code: string;
  country_name: string;
  status: CountryStatusType;
  created_at: string;
  updated_at: string;
}

export function useCountryStatuses() {
  const [countryStatuses, setCountryStatuses] = useState<CountryStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStatuses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await supabase
      .from('country_statuses')
      .select('*')
      .order('country_name', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      console.error('Error fetching country statuses:', fetchError);
    } else {
      setCountryStatuses((data as CountryStatus[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  const updateStatus = async (countryCode: string, newStatus: CountryStatusType) => {
    const { error: updateError } = await supabase
      .from('country_statuses')
      .update({ status: newStatus })
      .eq('country_code', countryCode);

    if (updateError) {
      toast({
        title: 'Błąd',
        description: `Nie udało się zaktualizować statusu: ${updateError.message}`,
        variant: 'destructive',
      });
      return false;
    }

    // Update local state
    setCountryStatuses(prev => 
      prev.map(cs => 
        cs.country_code === countryCode ? { ...cs, status: newStatus } : cs
      )
    );

    toast({
      title: 'Zaktualizowano',
      description: 'Status kraju został zmieniony.',
    });

    return true;
  };

  const getStatusByCode = useCallback((code: string): CountryStatusType => {
    const found = countryStatuses.find(cs => cs.country_code === code);
    return found?.status || 'none';
  }, [countryStatuses]);

  const getStatusByName = useCallback((name: string): CountryStatusType => {
    // Try to find by exact name or by matching
    const normalizedName = name.toLowerCase();
    const found = countryStatuses.find(cs => 
      cs.country_name.toLowerCase() === normalizedName
    );
    return found?.status || 'none';
  }, [countryStatuses]);

  const getCountriesByStatus = useCallback((status: CountryStatusType): CountryStatus[] => {
    return countryStatuses.filter(cs => cs.status === status);
  }, [countryStatuses]);

  return {
    countryStatuses,
    loading,
    error,
    updateStatus,
    getStatusByCode,
    getStatusByName,
    getCountriesByStatus,
    refetch: fetchStatuses,
  };
}
