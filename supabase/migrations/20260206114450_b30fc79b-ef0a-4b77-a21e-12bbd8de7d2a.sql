
-- 1. Create discount type enum
CREATE TYPE public.discount_type AS ENUM ('percentage', 'fixed');

-- 2. Create vouchers table
CREATE TABLE public.vouchers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  discount_type public.discount_type NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC NOT NULL DEFAULT 0,
  min_price NUMERIC NOT NULL DEFAULT 0,
  max_uses INTEGER,
  max_uses_per_user INTEGER NOT NULL DEFAULT 1,
  used_count INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  ebook_id UUID REFERENCES public.ebooks(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Unique constraint on code (case-insensitive)
CREATE UNIQUE INDEX idx_vouchers_code_unique ON public.vouchers (UPPER(code));

-- 3. Create voucher_uses table
CREATE TABLE public.voucher_uses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  voucher_id UUID NOT NULL REFERENCES public.vouchers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  ebook_id UUID NOT NULL REFERENCES public.ebooks(id) ON DELETE CASCADE,
  discount_applied NUMERIC NOT NULL DEFAULT 0,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_voucher_uses_voucher_user ON public.voucher_uses (voucher_id, user_id);
CREATE INDEX idx_voucher_uses_user ON public.voucher_uses (user_id);

-- 4. Enable RLS
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voucher_uses ENABLE ROW LEVEL SECURITY;

-- 5. RLS policies for vouchers
CREATE POLICY "Anyone can view active vouchers"
  ON public.vouchers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all vouchers"
  ON public.vouchers FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert vouchers"
  ON public.vouchers FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update vouchers"
  ON public.vouchers FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete vouchers"
  ON public.vouchers FOR DELETE
  USING (public.is_admin(auth.uid()));

-- 6. RLS policies for voucher_uses
CREATE POLICY "Users can view their own voucher uses"
  ON public.voucher_uses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all voucher uses"
  ON public.voucher_uses FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can insert voucher uses"
  ON public.voucher_uses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 7. Trigger for updated_at on vouchers
CREATE TRIGGER update_vouchers_updated_at
  BEFORE UPDATE ON public.vouchers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Server-side voucher validation function
CREATE OR REPLACE FUNCTION public.validate_voucher(
  _code TEXT,
  _ebook_id UUID,
  _user_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _voucher RECORD;
  _ebook_price NUMERIC;
  _user_uses INTEGER;
  _discount NUMERIC;
  _final_price NUMERIC;
  _check_user UUID;
BEGIN
  _check_user := COALESCE(_user_id, auth.uid());
  
  IF _check_user IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Wymagane logowanie');
  END IF;

  -- Find voucher by code (case-insensitive)
  SELECT * INTO _voucher
  FROM public.vouchers
  WHERE UPPER(code) = UPPER(_code)
    AND is_active = true;

  IF _voucher IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Nieprawidłowy kod zniżkowy');
  END IF;

  -- Check validity dates
  IF _voucher.valid_from > now() THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Kod zniżkowy nie jest jeszcze aktywny');
  END IF;

  IF _voucher.valid_until IS NOT NULL AND _voucher.valid_until < now() THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Kod zniżkowy wygasł');
  END IF;

  -- Check max uses
  IF _voucher.max_uses IS NOT NULL AND _voucher.used_count >= _voucher.max_uses THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Kod zniżkowy został już wykorzystany maksymalną liczbę razy');
  END IF;

  -- Check per-user usage limit
  SELECT COUNT(*) INTO _user_uses
  FROM public.voucher_uses
  WHERE voucher_id = _voucher.id
    AND user_id = _check_user;

  IF _user_uses >= _voucher.max_uses_per_user THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Już wykorzystałeś ten kod zniżkowy');
  END IF;

  -- Check ebook-specific voucher
  IF _voucher.ebook_id IS NOT NULL AND _voucher.ebook_id != _ebook_id THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Ten kod nie dotyczy tej bajki');
  END IF;

  -- Get ebook price
  SELECT price INTO _ebook_price
  FROM public.ebooks
  WHERE id = _ebook_id AND is_published = true;

  IF _ebook_price IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Bajka nie została znaleziona');
  END IF;

  -- Check minimum price
  IF _ebook_price < _voucher.min_price THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Cena bajki jest zbyt niska dla tego kodu');
  END IF;

  -- Calculate discount
  IF _voucher.discount_type = 'percentage' THEN
    _discount := ROUND((_ebook_price * _voucher.discount_value / 100), 2);
  ELSE
    _discount := _voucher.discount_value;
  END IF;

  -- Ensure discount doesn't exceed price
  IF _discount > _ebook_price THEN
    _discount := _ebook_price;
  END IF;

  _final_price := _ebook_price - _discount;

  RETURN jsonb_build_object(
    'valid', true,
    'voucher_id', _voucher.id,
    'discount_type', _voucher.discount_type::text,
    'discount_value', _voucher.discount_value,
    'discount_applied', _discount,
    'original_price', _ebook_price,
    'final_price', _final_price
  );
END;
$$;
