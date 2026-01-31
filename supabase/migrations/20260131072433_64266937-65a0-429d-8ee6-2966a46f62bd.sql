-- Dodanie kolumny link_url do announcement_bar dla linków w bannerze
ALTER TABLE public.announcement_bar 
ADD COLUMN IF NOT EXISTS link_url TEXT DEFAULT NULL;

-- Dodanie kolumny price_at_purchase do owned_ebooks dla zapisania ceny w momencie zakupu
ALTER TABLE public.owned_ebooks 
ADD COLUMN IF NOT EXISTS price_at_purchase NUMERIC DEFAULT 0;

-- Aktualizacja istniejących rekordów - ustawienie ceny 0 dla starych wpisów
UPDATE public.owned_ebooks 
SET price_at_purchase = 0 
WHERE price_at_purchase IS NULL;