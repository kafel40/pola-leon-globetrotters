// Complete world countries data with curiosities for the map fact cards
// Each country has: name, flag emoji, icon, and 3-5 child-friendly facts
// ALL CURIOSITIES ARE UNIQUE - NO DUPLICATES ACROSS COUNTRIES

export interface WorldCountryData {
  code: string;        // ISO Alpha-3 code
  name: string;        // Polish name
  nameEn: string;      // English name
  flag: string;        // Flag emoji
  icon: string;        // Representative emoji icon
  curiosities: string[]; // 3-5 child-friendly facts in Polish
}

export const worldCountriesData: Record<string, WorldCountryData> = {
  // ============ EUROPE ============
  'POL': {
    code: 'POL', name: 'Polska', nameEn: 'Poland', flag: '🇵🇱', icon: '🦬',
    curiosities: [
      'W Polsce żyje największe stado żubrów na świecie!',
      'Kopalnia soli w Wieliczce ma podziemne kaplice wyrzeźbione w soli.',
      'Pierogi to jedno z najpopularniejszych polskich dań.',
      'Smok Wawelski według legendy mieszkał w jaskini pod Wawelem.',
      'Wigilia w Polsce obejmuje tradycyjnie 12 potraw.',
    ]
  },
  'FRA': {
    code: 'FRA', name: 'Francja', nameEn: 'France', flag: '🇫🇷', icon: '🗼',
    curiosities: [
      'Wieża Eiffla rośnie o 15 cm latem z powodu rozszerzania się metalu!',
      'Francja ma kształt przypominający sześciokąt.',
      'Francuzi produkują ponad 1000 rodzajów sera.',
      'Croissant został spopularyzowany we Francji, choć pochodzi z Austrii.',
      'Luwr w Paryżu jest największym muzeum sztuki na świecie.',
    ]
  },
  'DEU': {
    code: 'DEU', name: 'Niemcy', nameEn: 'Germany', flag: '🇩🇪', icon: '🏰',
    curiosities: [
      'W Niemczech jest ponad 20 000 średniowiecznych zamków!',
      'Bracia Grimm spisali tu słynne baśnie jak Kopciuszek i Śpiąca Królewna.',
      'Niemieccy inżynierowie skonstruowali pierwsze samochody na świecie.',
      'Chleb niemiecki ma ponad 3000 różnych odmian.',
      'Oktoberfest w Monachium odwiedza rocznie 6 milionów gości.',
    ]
  },
  'GBR': {
    code: 'GBR', name: 'Wielka Brytania', nameEn: 'United Kingdom', flag: '🇬🇧', icon: '👑',
    curiosities: [
      'Big Ben to tak naprawdę nazwa 13-tonowego dzwonu, nie wieży!',
      'Monarcha brytyjski ma dwa oficjalne urodziny rocznie.',
      'Tradycyjna herbatka o 17:00 nazywa się "afternoon tea".',
      'Stonehenge ma ponad 5000 lat i nikt nie wie, kto je zbudował.',
      'J.K. Rowling napisała Harry\'ego Pottera w kawiarniach Edynburga.',
    ]
  },
  'ITA': {
    code: 'ITA', name: 'Włochy', nameEn: 'Italy', flag: '🇮🇹', icon: '🍕',
    curiosities: [
      'Włochy na mapie wyglądają jak but do konnej jazdy!',
      'Pizza margherita powstała w Neapolu na cześć królowej.',
      'Gondole w Wenecji muszą być malowane tylko na czarno.',
      'Koloseum w Rzymie mogło pomieścić 50 000 widzów.',
      'Włosi produkują ponad 300 kształtów makaronu.',
    ]
  },
  'ESP': {
    code: 'ESP', name: 'Hiszpania', nameEn: 'Spain', flag: '🇪🇸', icon: '💃',
    curiosities: [
      'La Tomatina to święto, gdzie ludzie rzucają w siebie pomidorami!',
      'Flamenco narodziło się w Andaluzji na południu Hiszpanii.',
      'Sagrada Familia Gaudiego budowana jest już ponad 140 lat.',
      'Hiszpańska sjesta to tradycyjna popołudniowa drzemka.',
      'Kolacja w Hiszpanii jada się często po godzinie 21:00.',
    ]
  },
  'GRC': {
    code: 'GRC', name: 'Grecja', nameEn: 'Greece', flag: '🇬🇷', icon: '🏛️',
    curiosities: [
      'Grecja składa się z ponad 6000 wysp, ale tylko 227 jest zamieszkanych!',
      'Starożytni Grecy wymyślili demokrację i Igrzyska Olimpijskie.',
      'Bogowie greccy według mitów mieszkali na szczycie Olimpu.',
      'Grecka feta to ser chroniony prawem - tylko tu może być produkowany.',
      'Grecki alfabet jest używany od ponad 2800 lat.',
    ]
  },
  'NOR': {
    code: 'NOR', name: 'Norwegia', nameEn: 'Norway', flag: '🇳🇴', icon: '🌌',
    curiosities: [
      'W Norwegii latem słońce nie zachodzi przez kilka tygodni!',
      'Fiordy to zatoki powstałe z lodowców tysiące lat temu.',
      'Wikingowie wypływali stąd w dalekie podróże ponad 1000 lat temu.',
      'Zorza polarna tańczy tu na niebie zimowymi nocami.',
      'Trolle to legendarne stworzenia z norweskich opowieści.',
    ]
  },
  'SWE': {
    code: 'SWE', name: 'Szwecja', nameEn: 'Sweden', flag: '🇸🇪', icon: '🦌',
    curiosities: [
      'Pippi Langstrumpf to najpopularniejsza szwedzka bohaterka dla dzieci!',
      'Fika to szwedzka tradycja picia kawy z ciastkiem w gronie przyjaciół.',
      'W Jukkasjärvi stoi hotel całkowicie zbudowany z lodu.',
      'Łosie swobodnie spacerują po szwedzkich lasach.',
      'Alfred Nobel, twórca nagrody Nobla, był Szwedem.',
    ]
  },
  'NLD': {
    code: 'NLD', name: 'Holandia', nameEn: 'Netherlands', flag: '🇳🇱', icon: '🌷',
    curiosities: [
      'Jedna czwarta Holandii leży poniżej poziomu morza!',
      'Wiosną kwitnie tu ponad 7 milionów tulipanów.',
      'Holendrzy mają więcej rowerów niż mieszkańców.',
      'Wiatraki pompowały wodę z pól, by odzyskać ziemię z morza.',
      'Amsterdam ma 1281 mostów - więcej niż Wenecja.',
    ]
  },
  'BEL': {
    code: 'BEL', name: 'Belgia', nameEn: 'Belgium', flag: '🇧🇪', icon: '🍫',
    curiosities: [
      'Belgijska czekolada uważana jest za najlepszą na świecie!',
      'Frytki belgijskie smaży się dwukrotnie dla chrupkości.',
      'W Belgii mówi się oficjalnie trzema językami.',
      'Smerfy zostały wymyślone przez belgijskiego rysownika.',
      'Bruksela jest nieformalną stolicą Unii Europejskiej.',
    ]
  },
  'CHE': {
    code: 'CHE', name: 'Szwajcaria', nameEn: 'Switzerland', flag: '🇨🇭', icon: '🏔️',
    curiosities: [
      'Szwajcarskie Alpy mają szczyty sięgające ponad 4000 metrów!',
      'Dziury w serze szwajcarskim powstają dzięki bakteriom.',
      'Zegarki szwajcarskie słyną z precyzji od 500 lat.',
      'W Szwajcarii oficjalnie używa się czterech języków.',
      'Czerwony Krzyż został założony w Genewie.',
    ]
  },
  'AUT': {
    code: 'AUT', name: 'Austria', nameEn: 'Austria', flag: '🇦🇹', icon: '🎻',
    curiosities: [
      'Wolfgang Amadeus Mozart skomponował pierwszą symfonię mając 8 lat!',
      'Tort Sachera z Wiednia to słynny czekoladowy deser.',
      'Austria leży w sercu Alp z przepięknymi dolinami.',
      'Wiedeńska Opera to jeden z najsłynniejszych teatrów świata.',
      'Habsburgowie rządzili tu przez ponad 600 lat.',
    ]
  },
  'PRT': {
    code: 'PRT', name: 'Portugalia', nameEn: 'Portugal', flag: '🇵🇹', icon: '⛵',
    curiosities: [
      'Portugalscy żeglarze jako pierwsi opłynęli Afrykę do Indii!',
      'Pastéis de nata to kremowe ciastka z XVI wieku.',
      'Portugalski to piąty najczęściej używany język świata.',
      'Żółty tramwaj 28 w Lizbonie ma ponad 100 lat.',
      'Surfowanie w Nazaré przyciąga fale wysokości budynku.',
    ]
  },
  'IRL': {
    code: 'IRL', name: 'Irlandia', nameEn: 'Ireland', flag: '🇮🇪', icon: '☘️',
    curiosities: [
      'Irlandia nazywana jest "Szmaragdową Wyspą" ze względu na zieleń!',
      'Leprechaun to legendarny irlandzki skrzat strzegący złota.',
      'Czterolistna koniczyna to symbol szczęścia.',
      '17 marca Irlandczycy świętują Dzień Świętego Patryka.',
      'Na wyspie znajduje się ponad 30 000 zamków i ruin.',
    ]
  },
  'DNK': {
    code: 'DNK', name: 'Dania', nameEn: 'Denmark', flag: '🇩🇰', icon: '🧜‍♀️',
    curiosities: [
      'Klocki LEGO wynaleziono w duńskim miasteczku Billund!',
      'Posąg Małej Syrenki w Kopenhadze ma ponad 100 lat.',
      'Hans Christian Andersen napisał tu Brzydkie Kaczątko.',
      'Dania regularnie uznawana jest za najszczęśliwszy kraj świata.',
      'Duńska flaga jest najstarszą flagą państwową w użyciu.',
    ]
  },
  'FIN': {
    code: 'FIN', name: 'Finlandia', nameEn: 'Finland', flag: '🇫🇮', icon: '🎅',
    curiosities: [
      'Wioska Świętego Mikołaja znajduje się w fińskiej Laponii!',
      'Finlandia ma 188 000 jezior - nazywana jest "Krainą Tysiąca Jezior".',
      'Sauna to fiński wynalazek - jest ich tu 3 miliony.',
      'Muminki to fińskie trolle stworzone przez Tove Jansson.',
      'Zimą w północnej Finlandii słońce nie wschodzi przez 50 dni.',
    ]
  },
  'ISL': {
    code: 'ISL', name: 'Islandia', nameEn: 'Iceland', flag: '🇮🇸', icon: '🌋',
    curiosities: [
      'Islandia ma aktywne wulkany, gejzery i lodowce jednocześnie!',
      'Islandia jest jedynym krajem NATO bez wojska.',
      'Zorza polarna widoczna jest tu od września do marca.',
      'Gorące źródła geotermalne ogrzewają domy i baseny.',
      'Islandczycy wierzą w "ukryty lud" - elfy i trolle.',
    ]
  },
  'CZE': {
    code: 'CZE', name: 'Czechy', nameEn: 'Czechia', flag: '🇨🇿', icon: '🏰',
    curiosities: [
      'Praga zwana jest "miastem stu wież" choć ma ich ponad tysiąc!',
      'Zegar astronomiczny Orloj działa od 1410 roku.',
      'Most Karola zdobi 30 barokowych posągów.',
      'Czechy słyną z kryształowego szkła od wieków.',
      'Pierniczki z Pardubic mają chronioną recepturę.',
    ]
  },
  'HUN': {
    code: 'HUN', name: 'Węgry', nameEn: 'Hungary', flag: '🇭🇺', icon: '♨️',
    curiosities: [
      'Budapeszt ma ponad 120 naturalnych gorących źródeł!',
      'Ernő Rubik wynalazł słynną kostkę Rubika.',
      'Gulasz węgierski to tak naprawdę zupa, nie potrawka.',
      'Dunaj dzieli Budapeszt na Budę i Peszt.',
      'Język węgierski nie jest podobny do żadnego sąsiedniego.',
    ]
  },
  'ROU': {
    code: 'ROU', name: 'Rumunia', nameEn: 'Romania', flag: '🇷🇴', icon: '🧛',
    curiosities: [
      'Zamek Bran inspirował historię Drakuli Brama Stokera!',
      'Rumuńskie Karpaty są domem największej populacji niedźwiedzi w Europie.',
      'Delta Dunaju to raj dla ponad 300 gatunków ptaków.',
      'Malowane klasztory Bukowiny mają 500-letnie freski.',
      'Rumunia ma jedyną wesołą nekropolię na świecie.',
    ]
  },
  'BGR': {
    code: 'BGR', name: 'Bułgaria', nameEn: 'Bulgaria', flag: '🇧🇬', icon: '🌹',
    curiosities: [
      'Bułgaria produkuje 85% światowego olejku różanego!',
      'Bułgarzy kiwają głową na "nie" i kręcią na "tak".',
      'Morze Czarne ma złote plaże w Bułgarii.',
      'Jogurt bułgarski zawiera unikalne bakterie odkryte tu w 1905 roku.',
      'Cyrylica została stworzona przez bułgarskich mnichów.',
    ]
  },
  'HRV': {
    code: 'HRV', name: 'Chorwacja', nameEn: 'Croatia', flag: '🇭🇷', icon: '🏖️',
    curiosities: [
      'Chorwacja ma ponad 1200 wysp wzdłuż Adriatyku!',
      'Krawat (cravate) pochodzi od chorwackich żołnierzy.',
      'Dubrownik był planem filmowym Królewskiej Przystani.',
      'Amfiteatr w Puli jest jednym z najlepiej zachowanych na świecie.',
      'Chorwackie morze jest tak czyste, że widać dno na 50 metrów.',
    ]
  },
  'SVN': {
    code: 'SVN', name: 'Słowenia', nameEn: 'Slovenia', flag: '🇸🇮', icon: '🐝',
    curiosities: [
      'Słoweńcy traktują pszczoły jak zwierzęta domowe i malują ule!',
      'Jaskinia Postojna ma podziemną kolejkę od 1872 roku.',
      'Słowenia ma tylko 47 km wybrzeża, ale piękne plaże.',
      'Konie lipicańskie hodowane są tu od XVI wieku.',
      'Słowenia była pierwszą słowiańską republiką w UE.',
    ]
  },
  'SVK': {
    code: 'SVK', name: 'Słowacja', nameEn: 'Slovakia', flag: '🇸🇰', icon: '⛰️',
    curiosities: [
      'Słowacja ma ponad 6000 jaskiń, z których 18 można zwiedzać!',
      'Bratysława to jedyna stolica świata granicząca z dwoma krajami.',
      'Słowackie Tatry są najmniejszymi wysokimi górami świata.',
      'Bryndza to owczy ser wpisany na listę dziedzictwa.',
      'Zamek Spiš to jeden z największych w Europie.',
    ]
  },
  'BLR': {
    code: 'BLR', name: 'Białoruś', nameEn: 'Belarus', flag: '🇧🇾', icon: '🌲',
    curiosities: [
      'Puszcza Białowieska to ostatni pierwotny las nizinny Europy!',
      'Białoruś jest domem dla największej populacji żubrów.',
      'Mińsk został całkowicie odbudowany po II wojnie światowej.',
      'Bocian biały jest symbolem narodowym Białorusi.',
      'Białoruś ma ponad 10 000 jezior i 20 000 rzek.',
    ]
  },
  'UKR': {
    code: 'UKR', name: 'Ukraina', nameEn: 'Ukraine', flag: '🇺🇦', icon: '🌻',
    curiosities: [
      'Ukraina jest największym krajem leżącym w całości w Europie!',
      'Słoneczniki na polach dały krajowi przydomek "żółto-niebieski".',
      'Sobór Mądrości Bożej w Kijowie ma 1000-letnie mozaiki.',
      'Pisanki to ukraińskie jajka zdobione woskiem i farbą.',
      'Barszcz ukraiński ma ponad 30 regionalnych wersji.',
    ]
  },
  'RUS': {
    code: 'RUS', name: 'Rosja', nameEn: 'Russia', flag: '🇷🇺', icon: '🪆',
    curiosities: [
      'Rosja rozciąga się przez 11 stref czasowych!',
      'Matrioszki to lalki chowające w środku mniejsze lalki.',
      'Cerkiew Wasyla Błogosławionego ma 9 kolorowych kopuł.',
      'Kolej Transsyberyjska to najdłuższa linia kolejowa świata.',
      'Bajkał to najgłębsze jezioro na Ziemi z 20% słodkiej wody.',
    ]
  },
  'TUR': {
    code: 'TUR', name: 'Turcja', nameEn: 'Turkey', flag: '🇹🇷', icon: '🎈',
    curiosities: [
      'Stambuł jako jedyne miasto leży na dwóch kontynentach!',
      'W Kapadocji setki balonów unoszą się każdego ranka.',
      'Hagia Sophia była kościołem, meczetem i teraz muzeum.',
      'Kebab doner został wynaleziony w Turcji w XIX wieku.',
      'Turecka kąpiel hammam to tradycja sprzed 600 lat.',
    ]
  },
  // ============ ASIA ============
  'JPN': {
    code: 'JPN', name: 'Japonia', nameEn: 'Japan', flag: '🇯🇵', icon: '🗾',
    curiosities: [
      'Japonia składa się z 6852 wysp tworzących łuk na oceanie!',
      'Sushi pierwotnie służyło do konserwacji ryb, nie jako danie.',
      'Kwitnące sakury ogląda się podczas święta Hanami.',
      'Shinkansen - pociąg dużych prędkości - nigdy się nie spóźnia.',
      'Origami to japońska sztuka składania papieru bez kleju.',
    ]
  },
  'CHN': {
    code: 'CHN', name: 'Chiny', nameEn: 'China', flag: '🇨🇳', icon: '🐉',
    curiosities: [
      'Wielki Mur widoczny jest z orbity i budowano go 2000 lat!',
      'Pandy wielkie żyją dziko tylko w chińskich górach.',
      'Chińczycy wynaleźli papier, proch, kompas i druk.',
      'Chiński Nowy Rok trwa 15 dni i kończy świętem lampionów.',
      'Pałeczkami do jedzenia posługuje się tu od 3000 lat.',
    ]
  },
  'IND': {
    code: 'IND', name: 'Indie', nameEn: 'India', flag: '🇮🇳', icon: '🐘',
    curiosities: [
      'W Indiach używa się oficjalnie 22 języków i setek dialektów!',
      'Taj Mahal budowało 20 000 robotników przez 22 lata.',
      'Słonie świętowane są podczas festiwalu Ganesh Chaturthi.',
      'Holi to święto kolorów rzucanych w powietrze.',
      'Joga powstała w Indiach ponad 5000 lat temu.',
    ]
  },
  'THA': {
    code: 'THA', name: 'Tajlandia', nameEn: 'Thailand', flag: '🇹🇭', icon: '🛕',
    curiosities: [
      'Tajlandia nazywana jest "Krajem Uśmiechu" dzięki gościnności!',
      'Świątynie buddyjskie pokryte są płatkami złota.',
      'Tajski masaż ma ponad 2500 lat tradycji.',
      'Słonie białe są symbolem królestwa od wieków.',
      'Pad Thai to danie uliczne znane na całym świecie.',
    ]
  },
  'KOR': {
    code: 'KOR', name: 'Korea Południowa', nameEn: 'South Korea', flag: '🇰🇷', icon: '🎮',
    curiosities: [
      'K-pop i koreańskie seriale podbijają świat od lat 2010!',
      'Kimchi to fermentowana kapusta jedzona do każdego posiłku.',
      'Hangul to alfabet wymyślony przez króla w XV wieku.',
      'Korea jest światową stolicą e-sportu i gier.',
      'Koreańczycy obchodzą urodziny już w dniu narodzin - mają wtedy 1 rok!',
    ]
  },
  'VNM': {
    code: 'VNM', name: 'Wietnam', nameEn: 'Vietnam', flag: '🇻🇳', icon: '🍜',
    curiosities: [
      'Zatoka Ha Long ma ponad 1600 wapiennych wysp!',
      'Pho to zupa, którą Wietnamczycy jedzą nawet na śniadanie.',
      'Stożkowe kapelusze nón lá chronią przed słońcem i deszczem.',
      'Wietnam jest drugim największym eksporterem kawy na świecie.',
      'Ryż uprawiany jest na tarasach rzeźbionych w góry od pokoleń.',
    ]
  },
  'IDN': {
    code: 'IDN', name: 'Indonezja', nameEn: 'Indonesia', flag: '🇮🇩', icon: '🦎',
    curiosities: [
      'Indonezja to ponad 17 000 wysp rozsianych na 5000 km!',
      'Smok z Komodo jest największą żyjącą jaszczurką świata.',
      'Na Bali co dzień składane są ofiary z kwiatów bogom.',
      'Indonezja ma 130 aktywnych wulkanów.',
      'Orangutany żyją tu w ostatnich tropikalnych lasach.',
    ]
  },
  'MYS': {
    code: 'MYS', name: 'Malezja', nameEn: 'Malaysia', flag: '🇲🇾', icon: '🏙️',
    curiosities: [
      'Wieże Petronas przez 6 lat były najwyższym budynkiem świata!',
      'Malezyjskie lasy deszczowe mają 130 milionów lat.',
      'Nasi lemak to kokosowy ryż - narodowe śniadanie.',
      'Motyle Rajah Brooke są największe w Azji.',
      'Malezja leży na dwóch oddzielnych lądach.',
    ]
  },
  'PHL': {
    code: 'PHL', name: 'Filipiny', nameEn: 'Philippines', flag: '🇵🇭', icon: '🏝️',
    curiosities: [
      'Filipiny składają się z 7641 wysp!',
      'Tarsjer to naczelny wielkości pięści z ogromnymi oczami.',
      'Filipińczycy świętują najdłuższe Boże Narodzenie - od września.',
      'Czekoladowe Wzgórza na Bohol mają 1200 kopców.',
      'Filipiny mają jedne z najpiękniejszych raf koralowych świata.',
    ]
  },
  'SAU': {
    code: 'SAU', name: 'Arabia Saudyjska', nameEn: 'Saudi Arabia', flag: '🇸🇦', icon: '🕌',
    curiosities: [
      'Mekka to najświętsze miasto islamu, odwiedzane przez miliony!',
      'Pustynię Rub al-Chali nazywa się "Pustą Dzielnicą".',
      'Pod piaskiem leży 25% światowych rezerw ropy naftowej.',
      'Noce na pustyni mogą być zimniejsze niż w lodówce.',
      'Kawa arabska z kardamonem to symbol gościnności.',
    ]
  },
  'ARE': {
    code: 'ARE', name: 'Zjednoczone Emiraty Arabskie', nameEn: 'United Arab Emirates', flag: '🇦🇪', icon: '🏗️',
    curiosities: [
      'Burj Khalifa ma 828 metrów - to najwyższy budynek świata!',
      'Sztuczne wyspy Palm Jumeirah widać z kosmosu.',
      'W centrum handlowym Ski Dubai pada prawdziwy śnieg.',
      'Emiraty powstały dopiero w 1971 roku z 7 szejkanatów.',
      'Tu wyścigi wielbłądów prowadzą roboty-dżokeje.',
    ]
  },
  'ISR': {
    code: 'ISR', name: 'Izrael', nameEn: 'Israel', flag: '🇮🇱', icon: '✡️',
    curiosities: [
      'Morze Martwe jest tak słone, że nie można w nim utonąć!',
      'Jerozolima to święte miasto judaizmu, chrześcijaństwa i islamu.',
      'Pustynia Negew zajmuje połowę kraju.',
      'Hummus i falafel to potrawy jedzone tu od tysięcy lat.',
      'Hebrajski to jedyny martwy język ożywiony jako narodowy.',
    ]
  },
  // ============ AFRICA ============
  'EGY': {
    code: 'EGY', name: 'Egipt', nameEn: 'Egypt', flag: '🇪🇬', icon: '🏺',
    curiosities: [
      'Wielka Piramida w Gizie była najwyższą budowlą przez 3800 lat!',
      'Sfinks ma twarz faraona i ciało lwa.',
      'Nil to jedyna rzeka Egiptu i cała cywilizacja rozwinęła się nad nią.',
      'Mumifikacja miała zapewnić życie pozagrobowe faraonów.',
      'Hieroglify odkryto dopiero dzięki Kamieniowi z Rosetty.',
    ]
  },
  'KEN': {
    code: 'KEN', name: 'Kenia', nameEn: 'Kenya', flag: '🇰🇪', icon: '🦁',
    curiosities: [
      'Wielka migracja przenosi 2 miliony zwierząt przez kenijskie równiny!',
      'Masajowie potrafią skakać pionowo bardzo wysoko w tańcu.',
      'Kenia eksportuje kawę i herbatę do całego świata.',
      'Park Narodowy Masai Mara to dom "wielkiej piątki" Afryki.',
      'Równik przecina Kenię - można stanąć na obu półkulach naraz.',
    ]
  },
  'MAR': {
    code: 'MAR', name: 'Maroko', nameEn: 'Morocco', flag: '🇲🇦', icon: '🧞',
    curiosities: [
      'Na Saharze temperatura w ciągu doby może spaść o 40 stopni!',
      'Marokańskie bazary zwane sukami są labiryntem sklepów.',
      'Tagine to danie gotowane w stożkowatym glinianym naczyniu.',
      'Herbata miętowa z dużą ilością cukru to rytuał gościnności.',
      'Chefchaouen to miasto całkowicie pomalowane na niebiesko.',
    ]
  },
  'ZAF': {
    code: 'ZAF', name: 'Republika Południowej Afryki', nameEn: 'South Africa', flag: '🇿🇦', icon: '🐧',
    curiosities: [
      'RPA ma trzy stolice - każda dla innej władzy!',
      'Pingwiny afrykańskie żyją na plażach w pobliżu Kapsztadu.',
      'Góra Stołowa jest płaska jak blat stołu.',
      'Kraj oficjalnie używa 11 języków.',
      '"Wielka piątka" safari to lew, słoń, bawół, nosorożec i lampart.',
    ]
  },
  'NGA': {
    code: 'NGA', name: 'Nigeria', nameEn: 'Nigeria', flag: '🇳🇬', icon: '🥁',
    curiosities: [
      'Nigeria to najludniejszy kraj Afryki z ponad 200 milionami mieszkańców!',
      'Nollywood produkuje więcej filmów niż Hollywood.',
      'W Nigerii mówi się ponad 500 językami.',
      'Jollof rice to danie, o które Nigeria rywalizuje z Ghaną.',
      'Lagos jest jednym z najszybciej rosnących miast świata.',
    ]
  },
  'ETH': {
    code: 'ETH', name: 'Etiopia', nameEn: 'Ethiopia', flag: '🇪🇹', icon: '☕',
    curiosities: [
      'Legenda mówi, że pasterz odkrył kawę obserwując ożywione kozy!',
      'Etiopski kalendarz ma 13 miesięcy i jest 7 lat "za nami".',
      'Lucy - szkielet przodka człowieka - ma 3,2 miliona lat.',
      'Etiopia nigdy nie była kolonią europejską.',
      'Injera to gąbczasty chleb zastępujący sztućce.',
    ]
  },
  'TZA': {
    code: 'TZA', name: 'Tanzania', nameEn: 'Tanzania', flag: '🇹🇿', icon: '🦒',
    curiosities: [
      'Kilimandżaro to najwyższa wolnostojąca góra świata - 5895 m!',
      'Serengeti dosłownie znaczy "niekończące się równiny".',
      'Zanzibar był centrum handlu przyprawami przez wieki.',
      'Jezioro Natron zabarwia flamingi na różowo.',
      'Miliony gnu i zebr wędrują tu co roku w poszukiwaniu trawy.',
    ]
  },
  'GHA': {
    code: 'GHA', name: 'Ghana', nameEn: 'Ghana', flag: '🇬🇭', icon: '🎭',
    curiosities: [
      'Ghana jest drugim największym producentem kakao po Wybrzeżu Kości Słoniowej!',
      'Kolorowe trumny w kształcie ryb czy samolotów to ghańska tradycja.',
      'Ghańczycy witają się pytaniem "Jak się masz?" - odpowiedź brzmi "Dobrze!".',
      'Zamki niewolnicze na wybrzeżu są dziedzictwem UNESCO.',
      'Kente to ręcznie tkana tkanina noszona przez króli.',
    ]
  },
  // ============ NORTH AMERICA ============
  'USA': {
    code: 'USA', name: 'Stany Zjednoczone', nameEn: 'United States', flag: '🇺🇸', icon: '🗽',
    curiosities: [
      'Każdy z 50 stanów USA jest jak mały kraj z własnymi prawami!',
      'Statua Wolności była prezentem od Francji z 1886 roku.',
      'Hollywood produkuje filmy oglądane na całym świecie.',
      'Wielki Kanion wyrzeźbiła rzeka Kolorado przez miliony lat.',
      'Hamburger według legend powstał w New Haven.',
    ]
  },
  'CAN': {
    code: 'CAN', name: 'Kanada', nameEn: 'Canada', flag: '🇨🇦', icon: '🍁',
    curiosities: [
      'Kanada ma 60% wszystkich jezior świata!',
      'Syrop klonowy zbierany jest z drzew wiosną.',
      'Niedźwiedzie polarne wędrują po zachodnim wybrzeżu Zatoki Hudsona.',
      'Hokej na lodzie to narodowa pasja Kanadyjczyków.',
      'Granica z USA jest najdłuższą niestrzeżoną granicą świata.',
    ]
  },
  'MEX': {
    code: 'MEX', name: 'Meksyk', nameEn: 'Mexico', flag: '🇲🇽', icon: '🌮',
    curiosities: [
      'Meksyk ma 35 miejsc na liście UNESCO - więcej niż Francja!',
      'Tacos i tortille to podstawa meksykańskiej kuchni od tysięcy lat.',
      'Piramida Chichén Itzá wydaje dźwięk kwiczącego węża.',
      'Día de los Muertos to radosne święto wspominania zmarłych.',
      'Kakao i wanilia pochodzą z terenów dawnych Azteków.',
    ]
  },
  'CUB': {
    code: 'CUB', name: 'Kuba', nameEn: 'Cuba', flag: '🇨🇺', icon: '🚗',
    curiosities: [
      'Na Kubie jeżdżą amerykańskie samochody z lat 50. jak z kapsuły czasu!',
      'Salsa narodziła się z mieszanki afrykańskich i hiszpańskich rytmów.',
      'Hawana ma kolonialną architekturę w pastelowych kolorach.',
      'Kuba jest największą wyspą Karaibów.',
      'Kubańskie cygara uważane są za najlepsze na świecie.',
    ]
  },
  'JAM': {
    code: 'JAM', name: 'Jamajka', nameEn: 'Jamaica', flag: '🇯🇲', icon: '🎶',
    curiosities: [
      'Bob Marley uczynił reggae znanym na całym świecie!',
      'Usain Bolt - najszybszy człowiek - pochodzi z Jamajki.',
      'Plaże Jamajki mają biały, a czasem czarny piasek.',
      'Jerk chicken to pikantne danie marynowane w ziołach.',
      'Blue Mountain Coffee rośnie na zboczach wulkanu.',
    ]
  },
  'CRI': {
    code: 'CRI', name: 'Kostaryka', nameEn: 'Costa Rica', flag: '🇨🇷', icon: '🦜',
    curiosities: [
      'Kostaryka chroni 5% bioróżnorodności całej planety!',
      '"Pura Vida" to pozdrowienie i filozofia życia Kostarykańczyków.',
      'Czerwone żaby trujące wyglądają jak malowane.',
      'Kostaryka nie ma armii od 1948 roku.',
      'Tukany z kolorowymi dziobami żyją w dżunglach.',
    ]
  },
  // ============ SOUTH AMERICA ============
  'BRA': {
    code: 'BRA', name: 'Brazylia', nameEn: 'Brazil', flag: '🇧🇷', icon: '⚽',
    curiosities: [
      'Amazonia wytwarza 20% tlenu Ziemi i jest nazywana "płucami świata"!',
      'Brazylia wygrała Mistrzostwa Świata w piłce nożnej 5 razy.',
      'Karnawał w Rio trwa 5 dni i przyciąga miliony tancerzy.',
      'Posąg Chrystusa Odkupiciela ma 30 metrów i rozpostarte ramiona.',
      'Brazylia to jedyny kraj Ameryki Południowej mówiący po portugalsku.',
    ]
  },
  'ARG': {
    code: 'ARG', name: 'Argentyna', nameEn: 'Argentina', flag: '🇦🇷', icon: '🥩',
    curiosities: [
      'Lodowiec Perito Moreno wciąż rośnie zamiast topnieć!',
      'Tango zrodziło się w portowych dzielnicach Buenos Aires.',
      'Argentyńskie asado to rytuał grillowania mięsa trwający godzinami.',
      'Patagonia ma błękitne lodowce i wietrzne stepy.',
      'Diego Maradona i Lionel Messi to argentyńscy bohaterowie futbolu.',
    ]
  },
  'PER': {
    code: 'PER', name: 'Peru', nameEn: 'Peru', flag: '🇵🇪', icon: '🦙',
    curiosities: [
      'Inkowie zbudowali Machu Picchu bez użycia koła i zaprawy!',
      'Lamy i alpaki służą tu jako transportowe zwierzęta od tysięcy lat.',
      'Peruwiańska ceviche to surowa ryba marynowana w limonce.',
      'Linie Nazca to gigantyczne rysunki widoczne tylko z powietrza.',
      'Peru ma fragment dżungli amazońskiej.',
    ]
  },
  'COL': {
    code: 'COL', name: 'Kolumbia', nameEn: 'Colombia', flag: '🇨🇴', icon: '🦋',
    curiosities: [
      'Kolumbia ma więcej gatunków ptaków niż jakikolwiek inny kraj!',
      'Szmaragdy kolumbijskie są uznawane za najczystsze na świecie.',
      'Cartagena ma 13 km murów obronnych z XVII wieku.',
      'Kawa rośnie tu na wulkanicznych zboczach w idealnym klimacie.',
      'Kolumbia jako jedyna w Ameryce Południowej ma dwa wybrzeża.',
    ]
  },
  'CHL': {
    code: 'CHL', name: 'Chile', nameEn: 'Chile', flag: '🇨🇱', icon: '🗿',
    curiosities: [
      'Chile rozciąga się na 4300 km, ale ma średnio tylko 177 km szerokości!',
      'Posągi Moai na Wyspie Wielkanocnej mają nawet 10 metrów.',
      'Pustynia Atacama jest najsuchszym miejscem na Ziemi.',
      'Andy w Chile mają szczyty ponad 6000 metrów.',
      'Chile słynie z winnic w środkowej dolinie.',
    ]
  },
  'ECU': {
    code: 'ECU', name: 'Ekwador', nameEn: 'Ecuador', flag: '🇪🇨', icon: '🐢',
    curiosities: [
      'Galapagos to wyspy gdzie Darwin rozwinął teorię ewolucji!',
      'Ekwador leży dokładnie na równiku - stąd jego nazwa.',
      'Żółwie galapagosie żyją ponad 100 lat.',
      'Ekwador eksportuje więcej bananów niż jakikolwiek kraj.',
      'Quito leży na 2850 m n.p.m. - to druga najwyższa stolica świata.',
    ]
  },
  'VEN': {
    code: 'VEN', name: 'Wenezuela', nameEn: 'Venezuela', flag: '🇻🇪', icon: '💧',
    curiosities: [
      'Salto Ángel to najwyższy wodospad świata - spada z 979 metrów!',
      'Wenezuela ma największe potwierdzone zasoby ropy naftowej.',
      'Arepa to kukurydziany chlebek jedzony na śniadanie i kolację.',
      'Wyspy Los Roques mają rafy koralowe i turkusową wodę.',
      'Papugi ara latają wolno nad wenezuelskimi lasami.',
    ]
  },
  'BOL': {
    code: 'BOL', name: 'Boliwia', nameEn: 'Bolivia', flag: '🇧🇴', icon: '🧂',
    curiosities: [
      'Salar de Uyuni to największa słona pustynia świata - 10 000 km²!',
      'La Paz leży na 3640 m n.p.m. - to najwyżej położona stolica.',
      'Jezioro Titicaca na granicy z Peru to najwyższe żeglowne jezioro.',
      'Boliwia ma 36 oficjalnie uznanych języków rdzennych.',
      'Lamy hodowane są tu od ponad 4000 lat.',
    ]
  },
  // ============ OCEANIA ============
  'AUS': {
    code: 'AUS', name: 'Australia', nameEn: 'Australia', flag: '🇦🇺', icon: '🦘',
    curiosities: [
      'Australia jest jedynym krajem będącym całym kontynentem!',
      'Kangury i koale żyją dziko tylko tutaj.',
      'Wielka Rafa Koralowa to największa żywa struktura widoczna z kosmosu.',
      'Dziobak to ssak składający jaja i mający jadowity kolec.',
      'Outback to czerwona pustynia większa od całej Europy.',
    ]
  },
  'NZL': {
    code: 'NZL', name: 'Nowa Zelandia', nameEn: 'New Zealand', flag: '🇳🇿', icon: '🥝',
    curiosities: [
      'Kiwi to jedyny ptak na świecie z nozdrzami na końcu dzioba!',
      'Owiec jest tu 5 razy więcej niż ludzi.',
      'Władca Pierścieni kręcono w nowozelandzkich krajobrazach.',
      'Gejzery Rotorua tryskają gorącą wodą kilka razy dziennie.',
      'Maorysi witają się tradycyjnym hongi - dotknięciem nosów.',
    ]
  },
  'PNG': {
    code: 'PNG', name: 'Papua-Nowa Gwinea', nameEn: 'Papua New Guinea', flag: '🇵🇬', icon: '🦅',
    curiosities: [
      'Papua-Nowa Gwinea ma ponad 840 języków - najwięcej na świecie!',
      'Rajskie ptaki mają pióra tak kolorowe, że wydają się nierealne.',
      'Tropikalne lasy pokrywają 70% kraju.',
      'Niektóre plemiona wciąż żyją tradycyjnie, bez kontaktu z cywilizacją.',
      'Góry mają szczyty ponad 4500 metrów przy równiku.',
    ]
  },
  'FJI': {
    code: 'FJI', name: 'Fidżi', nameEn: 'Fiji', flag: '🇫🇯', icon: '🐚',
    curiosities: [
      'Fidżi składa się z 333 wysp, z których tylko 110 jest zamieszkanych!',
      'Woda wokół wysp jest ciepła przez cały rok.',
      'Nurkowanie wśród kolorowych raf to atrakcja numer jeden.',
      'Fidżyjczycy witają się słowem "Bula!" z szerokim uśmiechem.',
      'Na wyspach rosną kokosowe palmy przy każdej plaży.',
    ]
  },
  // ============ ADDITIONAL ISLANDS ============
  'CPV': {
    code: 'CPV', name: 'Zielony Przylądek', nameEn: 'Cape Verde', flag: '🇨🇻', icon: '🐋',
    curiosities: [
      'Zielony Przylądek to 10 wulkanicznych wysp na Atlantyku!',
      'Kreolski język tu mówiony łączy portugalski z afrykańskimi.',
      'Morna - smutna muzyka - wpisana jest na listę UNESCO.',
      'Wulkan Fogo ostatnio wybuchł w 2014 roku.',
      'Wieloryby humbaki odwiedzają wody archipelagu każdej zimy.',
    ]
  },
};

// Helper function to get country data by code
export function getWorldCountryData(code: string): WorldCountryData | undefined {
  return worldCountriesData[code];
}

// Get all countries as array
export function getAllWorldCountries(): WorldCountryData[] {
  return Object.values(worldCountriesData);
}
