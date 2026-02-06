import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VoucherResult {
  valid: boolean;
  error?: string;
  voucher_id?: string;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  discount_applied?: number;
  original_price?: number;
  final_price?: number;
}

export function useVoucher() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VoucherResult | null>(null);

  const validateVoucher = async (code: string, ebookId: string): Promise<VoucherResult> => {
    if (!code.trim()) {
      const res: VoucherResult = { valid: false, error: 'Wpisz kod zniżkowy' };
      setResult(res);
      return res;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('validate_voucher', {
        _code: code.trim(),
        _ebook_id: ebookId,
      });

      if (error) {
        const res: VoucherResult = { valid: false, error: 'Nie udało się zweryfikować kodu' };
        setResult(res);
        return res;
      }

      const parsed = data as unknown as VoucherResult;
      setResult(parsed);
      return parsed;
    } catch {
      const res: VoucherResult = { valid: false, error: 'Błąd weryfikacji kodu' };
      setResult(res);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const clearVoucher = () => {
    setResult(null);
  };

  return {
    validateVoucher,
    clearVoucher,
    loading,
    result,
  };
}
