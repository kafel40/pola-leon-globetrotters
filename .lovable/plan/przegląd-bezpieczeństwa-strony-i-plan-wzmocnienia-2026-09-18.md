# Przegląd bezpieczeństwa strony i plan wzmocnienia

Sprawdziłem bazę danych, uprawnienia i biblioteki, z których korzysta strona. Ogólnie jest dobrze: wszystkie tabele mają włączoną ochronę dostępu (RLS) i reguły dostępu, a skaner bezpieczeństwa nie zgłasza żadnych błędów. Znalazłem jednak trzy obszary do poprawy.

## Co jest w porządku

- Każda z 14 tabel ma włączoną ochronę wierszy i zdefiniowane reguły dostępu.
- Dane wrażliwe (profile, zamówienia, wiadomości kontaktowe, tokeny newslettera) nie są czytelne dla niezalogowanych.
- Funkcje na serwerze sprawdzają uprawnienia administratora zamiast ufać przeglądarce.
- Skanery bezpieczeństwa: 0 zgłoszeń.

## Co wymaga poprawy

### 1. Funkcje administracyjne dostępne do wywołania przez każdego

Funkcje `admin_soft_delete_user` i `admin_restore_user` mogą być wywołane przez dowolną osobę (także niezalogowaną). Same w sobie sprawdzają, czy wywołujący jest administratorem, więc nie da się nimi usunąć konta — ale nie powinny być w ogóle publicznie wywoływalne.

Plan: odebrać prawo wywołania tych funkcji rolom `anon` i `authenticated` (pozostawić tylko dla wewnętrznego użytku serwera). Podobnie dla `handle_new_user` i `is_admin`, które są funkcjami pomocniczymi i nie muszą być wywoływalne z przeglądarki. Funkcje `validate_voucher` i `confirm_newsletter_subscription` zostają dostępne — są potrzebne w działaniu strony.

### 2. Przestarzałe biblioteki z znanymi lukami

Skan zależności wykrył podatności w bibliotekach:

- `dompurify` (oczyszczanie treści HTML) — kilkanaście zgłoszeń, w tym obejścia zabezpieczeń przed atakami XSS. To najważniejsza pozycja, bo biblioteka służy właśnie do ochrony przed wstrzykiwaniem kodu w treściach bloga.
- `react-router-dom` (nawigacja) — otwarte przekierowania, czyli możliwość podrzucenia użytkownikowi linku, który przenosi go na obcą stronę.
- `recharts` (wykresy w panelu admina) — podatna wersja biblioteki lodash.
- `@supabase/supabase-js` — podatna wersja biblioteki `ws` (dotyczy tylko serwera, nie przeglądarki, ryzyko niskie).

Plan: zaktualizować te biblioteki do bezpiecznych wersji i sprawdzić, czy strona nadal działa poprawnie (blog, wykresy, nawigacja, logowanie).

### 3. Ochrona przed wyciekniętymi hasłami wyłączona

Przy rejestracji nie jest sprawdzane, czy podane hasło nie wyciekło w znanych wyciekach danych.

Plan: włączyć tę ochronę w ustawieniach logowania.

## Szczegóły techniczne

1. Migracja SQL: `REVOKE EXECUTE ... FROM anon, authenticated` dla `admin_soft_delete_user`, `admin_restore_user`, `handle_new_user`, `is_admin`. Weryfikacja, że panel admina nadal działa (używa `is_admin` przez hook — jeśli wywoływany jest RPC z klienta, zostaje zastąpiony odczytem z `user_roles`, który ma już własne reguły RLS).
2. Sprawdzenie widoku `public_blog_posts` pod kątem `security_invoker` — widok bez tej opcji omija reguły dostępu tabeli źródłowej.
3. Aktualizacja zależności: `dompurify`, `react-router-dom`, `recharts`, `@supabase/supabase-js`; ponowny skan zależności po aktualizacji.
4. `configure_auth` z `password_hibp_enabled: true`.
5. Ponowne uruchomienie skanera bezpieczeństwa i lintera bazy na koniec.

## Czego ten przegląd nie obejmuje

To analiza konfiguracji i kodu — nie zastępuje testów penetracyjnych. Nie sprawdzałem odporności na ataki wolumenowe (DDoS) ani prób masowego wysyłania formularzy.
