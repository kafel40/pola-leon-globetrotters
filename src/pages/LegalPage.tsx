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
                    <li>Serwis ma charakter edukacyjny i jest skierowany do rodziców, opiekunów dzieci oraz placówek edukacyjnych.</li>
                    <li>Właścicielem Serwisu jest spółka CARSI Sp. z o.o.</li>
                  </ol>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">§ 2. Usługi i Płatności</h2>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Serwis oferuje darmowe treści edukacyjne (blog, bajki online) oraz płatne Treści Cyfrowe (pliki PDF, e-booki).</li>
                    <li>Zamówienia na produkty cyfrowe realizowane są poprzez sklep internetowy.</li>
                    <li>Ceny podane w sklepie są cenami brutto (zawierają podatek VAT).</li>
                  </ol>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">§ 3. Dostawa i Prawo Odstąpienia od Umowy</h2>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Produkt cyfrowy wysyłany jest automatycznie na adres e-mail podany w zamówieniu lub pobierany automatycznie ze strony internetowej.</li>
                    <li>
                      <strong>Ważne:</strong> Zgodnie z art. 38 ustawy o prawach konsumenta, prawo do odstąpienia od umowy (zwrotu) nie przysługuje w odniesieniu do treści cyfrowych niedostarczanych na nośniku materialnym, jeżeli spełnianie świadczenia rozpoczęło się za wyraźną zgodą Konsumenta przed upływem terminu do odstąpienia od umowy.
                    </li>
                    <li>Kupując plik i pobierając go, Klient wyraża zgodę na utratę prawa do odstąpienia od umowy.</li>
                  </ol>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">§ 4. Licencja i Prawa Autorskie</h2>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Klient otrzymuje licencję niewyłączną na korzystanie z produktu wyłącznie na użytek własny (domowy).</li>
                    <li>Zabronione jest rozpowszechnianie plików, ich odsprzedaż, modyfikowanie oraz udostępnianie osobom trzecim (np. na grupach w social mediach) bez zgody właściciela tj. spółki Carsi Sp z o.o.</li>
                  </ol>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">§ 5. Wyłączenie odpowiedzialności (Klauzula Bezpieczeństwa)</h2>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      <strong>Charakter treści:</strong> Wszelkie materiały w Serwisie mają charakter wyłącznie edukacyjny i rozrywkowy. Nie zastępują porady psychologicznej, pedagogicznej ani medycznej.
                    </li>
                    <li>
                      <strong>Odpowiedzialność Rodzica:</strong> Zabawy proponowane przez Polę i Leona wymagają nadzoru osoby dorosłej. Sprzedawca nie ponosi odpowiedzialności za szkody powstałe w wyniku zabawy dzieci.
                    </li>
                    <li>
                      <strong>Kwestie techniczne:</strong> Sprzedawca nie odpowiada za blokowanie wiadomości e-mail przez filtry antyspamowe Klienta ani za brak odpowiedniego oprogramowania do odczytu plików (PDF) na urządzeniu Klienta.
                    </li>
                  </ol>
                </article>
              </div>
            </TabsContent>

            <TabsContent value="polityka" className="mt-0">
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                <article className="prose prose-sm md:prose-base max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-p:font-body prose-li:text-muted-foreground prose-li:font-body prose-strong:text-foreground">
                  <h1 className="text-2xl md:text-3xl mb-6">POLITYKA PRYWATNOŚCI I COOKIES</h1>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">I. Administrator Danych</h2>
                  <p>
                    Administratorem Twoich danych osobowych jest CARSI SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ z siedzibą w Suchym Lesie (62-002), ul. Kwiatowa 64/3, NIP: 1231585099. Kontakt: <a href="mailto:m.kachlicki@gmail.com" className="text-primary hover:underline">m.kachlicki@gmail.com</a>.
                  </p>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">II. Cel i zakres przetwarzania</h2>
                  <p>Przetwarzamy Twoje dane wyłącznie w celu:</p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Realizacji zamówienia i dostarczenia produktu cyfrowego (podstawa: wykonanie umowy).</li>
                    <li>Kontaktu mailowego w sprawie Twoich zapytań (podstawa: uzasadniony interes).</li>
                    <li>Wysyłki Newslettera - tylko jeśli wyraziłeś na to dobrowolną zgodę.</li>
                  </ol>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">III. Odbiorcy danych</h2>
                  <p>
                    Twoje dane mogą być przekazywane zaufanym partnerom technologicznym: operatorom płatności (w celu opłacenia zamówienia), firmie hostingowej oraz biuru księgowemu. Nie sprzedajemy Twoich danych nikomu.
                  </p>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">IV. Twoje Prawa</h2>
                  <p>
                    Przysługuje Ci prawo dostępu do swoich danych, ich sprostowania, usunięcia ("prawo do bycia zapomnianym") oraz ograniczenia przetwarzania.
                  </p>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">V. Bezpieczeństwo</h2>
                  <p>
                    Strona używa szyfrowania SSL. Administrator nie ponosi jednak odpowiedzialności za skutki kradzieży danych wynikające z zaniedbań Użytkownika (np. udostępnienie hasła osobom trzecim).
                  </p>

                  <h2 className="text-xl md:text-2xl mt-8 mb-4">VI. Pliki Cookies</h2>
                  <p>
                    Strona korzysta z plików cookies niezbędnych do działania sklepu (koszyk) oraz w celach statystycznych (analiza ruchu na stronie). Możesz zarządzać ustawieniami cookies w swojej przeglądarce internetowej.
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
