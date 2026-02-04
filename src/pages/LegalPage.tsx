import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Shield } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const LegalPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('regulamin');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'polityka' || tab === 'regulamin') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <Layout>
      <div className="container py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Informacje prawne
          </h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="regulamin" className="flex items-center gap-2 font-body">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Regulamin</span>
                <span className="sm:hidden">Regulamin</span>
              </TabsTrigger>
              <TabsTrigger value="polityka" className="flex items-center gap-2 font-body">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Polityka Prywatności</span>
                <span className="sm:hidden">Prywatność</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="regulamin" className="mt-0">
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                <article className="prose prose-sm md:prose-base max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-p:font-body prose-li:text-muted-foreground prose-li:font-body prose-strong:text-foreground">
                  <h1 className="text-2xl md:text-3xl mb-6">REGULAMIN SERWISU I SKLEPU "POLA I LEON"</h1>
                  
                  <div className="bg-muted/50 rounded-xl p-4 mb-6 not-prose">
                    <p className="font-display font-semibold text-foreground mb-2">Dane Sprzedawcy:</p>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">
                      CARSI SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ<br />
                      ul. Kwiatowa 64/3, 62-002 Suchy Las<br />
                      NIP: 1231585099, KRS: 0001186070<br />
                      E-mail: <a href="mailto:m.kachlicki@gmail.com" className="text-primary hover:underline">m.kachlicki@gmail.com</a>
                    </p>
                  </div>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">§ 1. Postanowienia ogólne</h2>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Niniejszy Regulamin określa zasady korzystania z serwisu internetowego oraz sklepu dostępnego pod adresem polaileon.pl.</li>
                    <li>Serwis ma charakter edukacyjno-rozrywkowy i jest skierowany do rodziców oraz opiekunów dzieci.</li>
                    <li>Właścicielem Serwisu jest spółka CARSI Sp. z o.o.</li>
                  </ol>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">§ 1a. Wymagania techniczne</h2>
                  <p>Do korzystania z Serwisu oraz zakupionych Produktów Cyfrowych niezbędne są:</p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Urządzenie końcowe z dostępem do sieci Internet i przeglądarką internetową.</li>
                    <li>Aktywne konto poczty elektronicznej (e-mail).</li>
                    <li>W przypadku produktów cyfrowych (e-booki, karty pracy): oprogramowanie umożliwiające odczyt plików w formacie PDF (np. Adobe Acrobat Reader).</li>
                  </ol>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">§ 2. Usługi i Płatności</h2>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Serwis oferuje darmowe treści oraz płatne Treści Cyfrowe (pliki PDF, e-booki).</li>
                    <li>Zamówienia na produkty cyfrowe realizowane są poprzez sklep internetowy.</li>
                    <li>Ceny podane w sklepie są cenami brutto (zawierają podatek VAT).</li>
                  </ol>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">§ 2a. Konto Użytkownika</h2>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>W ramach Serwisu Użytkownik ma możliwość założenia darmowego Konta Użytkownika.</li>
                    <li>Założenie Konta wymaga wypełnienia formularza rejestracyjnego oraz akceptacji Regulaminu i Polityki Prywatności.</li>
                    <li>Konto umożliwia: dostęp do historii zamówień, zarządzanie danymi, dostęp do "Mojej Biblioteki" oraz zarządzanie zgodami.</li>
                    <li>Użytkownik może w każdej chwili usunąć Konto w panelu użytkownika. Usunięcie konta nie usuwa danych transakcyjnych wymaganych do celów księgowych.</li>
                  </ol>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">§ 3. Dostawa i Prawo Odstąpienia od Umowy</h2>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Dostęp do produktów cyfrowych odbywa się poprzez Konto Użytkownika (bezpośrednie pobranie).</li>
                    <li>
                      <strong>WAŻNE:</strong> Zgodnie z art. 38 ustawy o prawach konsumenta, prawo do odstąpienia od umowy (zwrotu) <strong>nie przysługuje</strong> w odniesieniu do treści cyfrowych, jeżeli spełnianie świadczenia rozpoczęło się za wyraźną zgodą Konsumenta przed upływem terminu do odstąpienia od umowy. Pobierając plik, Klient wyraża na to zgodę.
                    </li>
                  </ol>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">§ 4. Licencja i Prawa Autorskie</h2>
                  <p>Klient otrzymuje licencję niewyłączną na korzystanie z produktu wyłącznie na użytek własny (domowy). Zabronione jest rozpowszechnianie plików i ich odsprzedaż.</p>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">§ 5. Wyłączenie odpowiedzialności i Treści AI</h2>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Materiały w Serwisie mają charakter edukacyjno-informacyjny i nie zastępują profesjonalnej porady psychologicznej ani medycznej.</li>
                    <li>Zabawy wymagają nadzoru osoby dorosłej. Sprzedawca nie ponosi odpowiedzialności za szkody powstałe podczas zabawy bez opieki.</li>
                    <li>Treści w Serwisie są tworzone przy wsparciu narzędzi Sztucznej Inteligencji (AI), jednak są weryfikowane merytorycznie przez zespół Administratora.</li>
                  </ol>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">§ 6. Pozasądowe sposoby rozpatrywania reklamacji</h2>
                  <p>Konsument ma możliwość skorzystania z platformy ODR: <a href="http://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">http://ec.europa.eu/consumers/odr</a>.</p>
                </article>
              </div>
            </TabsContent>

            <TabsContent value="polityka" className="mt-0">
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                <article className="prose prose-sm md:prose-base max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-p:font-body prose-li:text-muted-foreground prose-li:font-body prose-strong:text-foreground">
                  <h1 className="text-2xl md:text-3xl mb-6">POLITYKA PRYWATNOŚCI I COOKIES</h1>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">I. Administrator Danych</h2>
                  <p>
                    Administratorem danych jest CARSI SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ, ul. Kwiatowa 64/3, 62-002 Suchy Las, NIP: 1231585099. Kontakt: <a href="mailto:m.kachlicki@gmail.com" className="text-primary hover:underline">m.kachlicki@gmail.com</a>.
                  </p>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">II. Cele i podstawy prawne przetwarzania (RODO)</h2>
                  <p>Przetwarzamy dane w oparciu o RODO:</p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li><strong>Realizacja zamówienia i umowy sprzedaży</strong> (Art. 6 ust. 1 lit. b RODO).</li>
                    <li><strong>Obsługa Konta Użytkownika</strong> (Art. 6 ust. 1 lit. b RODO).</li>
                    <li><strong>Obowiązki księgowe</strong> (Art. 6 ust. 1 lit. c RODO).</li>
                    <li><strong>Newsletter i kontakt</strong> (Art. 6 ust. 1 lit. a RODO - zgoda).</li>
                    <li><strong>Cele analityczne i dochodzenie roszczeń</strong> (Art. 6 ust. 1 lit. f RODO - uzasadniony interes).</li>
                  </ol>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">III. Odbiorcy danych i transfer</h2>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Dane przekazujemy zaufanym partnerom: Supabase (baza danych), Resend (maile), operatorzy płatności, biuro księgowe.</li>
                    <li>Dane mogą być przekazywane poza EOG (np. do USA w ramach usług Google/Supabase) przy zachowaniu standardów bezpieczeństwa (SCC).</li>
                  </ol>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">IIIa. Okres przechowywania</h2>
                  <p>Dane transakcyjne przechowujemy przez 5 lat podatkowych. Dane konta - do momentu jego usunięcia.</p>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">IV. Twoje Prawa</h2>
                  <p>
                    Masz prawo dostępu do danych, ich usunięcia, sprostowania oraz cofnięcia zgód. Przysługuje Ci prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.
                  </p>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">V. Bezpieczeństwo i Cookies</h2>
                  <p>
                    Strona używa szyfrowania SSL oraz plików cookies (niezbędnych, analitycznych i marketingowych). Użytkownik może zarządzać zgodami cookie poprzez baner na stronie.
                  </p>
                </article>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default LegalPage;
