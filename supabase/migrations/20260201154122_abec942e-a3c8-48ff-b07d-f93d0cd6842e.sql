-- Zabezpieczenie contact_messages przed anonimowym SELECT
-- Dodanie explicit DENY policy dla anonimowych użytkowników
CREATE POLICY "Deny anonymous access to contact_messages"
ON public.contact_messages
FOR SELECT
TO anon
USING (false);

-- Zabezpieczenie page_visits - dodanie walidacji visitor_id
-- Uniemożliwia wstawianie pustych/nieprawidłowych visitor_id
CREATE OR REPLACE FUNCTION public.validate_page_visit()
RETURNS TRIGGER AS $$
BEGIN
  -- Walidacja visitor_id - musi być niepusty i mieć format v_*
  IF NEW.visitor_id IS NULL OR LENGTH(NEW.visitor_id) < 5 OR NEW.visitor_id NOT LIKE 'v_%' THEN
    RAISE EXCEPTION 'Invalid visitor_id format';
  END IF;
  
  -- Walidacja page_path - musi zaczynać się od /
  IF NEW.page_path IS NULL OR NEW.page_path NOT LIKE '/%' THEN
    RAISE EXCEPTION 'Invalid page_path format';
  END IF;
  
  -- Ograniczenie długości referrer i user_agent
  IF NEW.referrer IS NOT NULL AND LENGTH(NEW.referrer) > 2000 THEN
    NEW.referrer := LEFT(NEW.referrer, 2000);
  END IF;
  
  IF NEW.user_agent IS NOT NULL AND LENGTH(NEW.user_agent) > 500 THEN
    NEW.user_agent := LEFT(NEW.user_agent, 500);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger do walidacji page_visits
DROP TRIGGER IF EXISTS validate_page_visit_trigger ON public.page_visits;
CREATE TRIGGER validate_page_visit_trigger
BEFORE INSERT ON public.page_visits
FOR EACH ROW
EXECUTE FUNCTION public.validate_page_visit();