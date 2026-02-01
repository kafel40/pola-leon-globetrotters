// Complete world countries data with curiosities for the map fact cards
// Each country has: name, flag emoji, icon, and 3-5 child-friendly facts

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
      'Polska ma piękne góry Tatry i Morze Bałtyckie.',
      'Pierogi to jedno z najpopularniejszych polskich dań.',
      'W Krakowie można zobaczyć legendarnego smoka wawelskiego!',
      'Polacy świętują Boże Narodzenie z 12 potrawami wigilijnymi.',
    ]
  },
  'FRA': {
    code: 'FRA', name: 'Francja', nameEn: 'France', flag: '🇫🇷', icon: '🗼',
    curiosities: [
      'Wieża Eiffla ma ponad 130 lat i waży 10 000 ton!',
      'Francja ma kształt przypominający sześciokąt.',
      'Francuzi jedzą ponad 400 rodzajów sera!',
      'Croissanty i bagietki to francuskie specjały.',
      'W Paryżu znajduje się słynne muzeum Luwr.',
    ]
  },
  'DEU': {
    code: 'DEU', name: 'Niemcy', nameEn: 'Germany', flag: '🇩🇪', icon: '🏰',
    curiosities: [
      'W Niemczech jest ponad 20 000 zamków!',
      'Niemcy są ojczyzną wielu bajek braci Grimm.',
      'Berlin ma słynne zoo z pandami.',
      'Niemieccy wynalazcy stworzyli pierwsze samochody.',
      'Oktoberfest to największe święto ludowe na świecie.',
    ]
  },
  'GBR': {
    code: 'GBR', name: 'Wielka Brytania', nameEn: 'United Kingdom', flag: '🇬🇧', icon: '👑',
    curiosities: [
      'Big Ben to tak naprawdę nazwa dzwonu, nie wieży!',
      'Królowa angielska ma dwa urodziny rocznie.',
      'Brytyjczycy piją herbatę o 17:00.',
      'W Londynie jest słynne muzeum figur woskowych.',
      'Harry Potter został wymyślony w Szkocji.',
    ]
  },
  'ITA': {
    code: 'ITA', name: 'Włochy', nameEn: 'Italy', flag: '🇮🇹', icon: '🍕',
    curiosities: [
      'Włochy mają kształt buta!',
      'Pizza została wynaleziona we Włoszech.',
      'W Wenecji zamiast ulic są kanały.',
      'Koloseum w Rzymie ma prawie 2000 lat.',
      'Włochy mają ponad 1500 różnych rodzajów makaronu.',
    ]
  },
  'ESP': {
    code: 'ESP', name: 'Hiszpania', nameEn: 'Spain', flag: '🇪🇸', icon: '💃',
    curiosities: [
      'W Hiszpanii jest ponad 8000 kilometrów plaż!',
      'Flamenco to słynny hiszpański taniec.',
      'Churros z czekoladą to hiszpański przysmak.',
      'Gaudi stworzył niesamowite budynki w Barcelonie.',
      'Hiszpanie jedzą obiad około 14:00 i kolację o 21:00!',
    ]
  },
  'GRC': {
    code: 'GRC', name: 'Grecja', nameEn: 'Greece', flag: '🇬🇷', icon: '🏛️',
    curiosities: [
      'Grecja ma ponad 6000 wysp!',
      'Starożytni Grecy wymyślili Igrzyska Olimpijskie.',
      'Greckie mity opowiadają o bogach z Góry Olimp.',
      'Feta to słynny grecki ser.',
      'W Grecji słońce świeci prawie 300 dni w roku.',
    ]
  },
  'NOR': {
    code: 'NOR', name: 'Norwegia', nameEn: 'Norway', flag: '🇳🇴', icon: '🌌',
    curiosities: [
      'W Norwegii latem słońce nie zachodzi przez całe tygodnie!',
      'Norwegia ma piękne fiordy - zatoki między górami.',
      'Wikingowie pochodzili z Norwegii.',
      'Można tu zobaczyć magiczną zorzę polarną.',
      'Trolle to legendarne stworzenia z norweskich baśni.',
    ]
  },
  'SWE': {
    code: 'SWE', name: 'Szwecja', nameEn: 'Sweden', flag: '🇸🇪', icon: '🦌',
    curiosities: [
      'Szwecja jest ojczyzną IKEA i klocków LEGO!',
      'Pippi Langstrumpf pochodzi ze Szwecji.',
      'Szwedzi mają specjalną przerwę na kawę - fika.',
      'W Szwecji jest lodowy hotel!',
      'Łosie swobodnie chodzą po szwedzkich lasach.',
    ]
  },
  'NLD': {
    code: 'NLD', name: 'Holandia', nameEn: 'Netherlands', flag: '🇳🇱', icon: '🌷',
    curiosities: [
      'Holandia leży częściowo poniżej poziomu morza!',
      'Tulipany są symbolem Holandii.',
      'Holenderzy jeżdżą wszędzie na rowerach.',
      'Słynne wiatraki pompują wodę z pól.',
      'Amsterdam ma ponad 1200 mostów.',
    ]
  },
  'BEL': {
    code: 'BEL', name: 'Belgia', nameEn: 'Belgium', flag: '🇧🇪', icon: '🍫',
    curiosities: [
      'Belgia jest słynna z najlepszej czekolady!',
      'Frytki belgijskie są prawdziwym przysmakiem.',
      'W Belgii mówi się po francusku, holendersku i niemiecku.',
      'Smerfy zostały wymyślone w Belgii!',
      'Bruksela jest stolicą Unii Europejskiej.',
    ]
  },
  'CHE': {
    code: 'CHE', name: 'Szwajcaria', nameEn: 'Switzerland', flag: '🇨🇭', icon: '🏔️',
    curiosities: [
      'Szwajcaria ma najpiękniejsze góry Alpy!',
      'Słynny szwajcarski ser ma duże dziury.',
      'Szwajcarska czekolada jest pyszna.',
      'Zegarki szwajcarskie są najdokładniejsze na świecie.',
      'W Szwajcarii mówi się czterema językami.',
    ]
  },
  'AUT': {
    code: 'AUT', name: 'Austria', nameEn: 'Austria', flag: '🇦🇹', icon: '🎻',
    curiosities: [
      'Mozart, słynny kompozytor, urodził się w Austrii.',
      'Wiedeń słynie z pysznych tortów.',
      'Austria ma piękne góry i jeziora.',
      'W Wiedniu jest słynna opera.',
      'Austryackie zamki wyglądają jak z bajki.',
    ]
  },
  'PRT': {
    code: 'PRT', name: 'Portugalia', nameEn: 'Portugal', flag: '🇵🇹', icon: '⛵',
    curiosities: [
      'Portugalia odkryła morskie szlaki do Indii i Brazylii!',
      'Pastéis de nata to pyszne portugalskie ciastka.',
      'Portugalski to piąty najczęściej używany język świata.',
      'W Lizbonie jeździ słynny żółty tramwaj.',
      'Portugalia ma piękne plaże nad Atlantykiem.',
    ]
  },
  'IRL': {
    code: 'IRL', name: 'Irlandia', nameEn: 'Ireland', flag: '🇮🇪', icon: '☘️',
    curiosities: [
      'Irlandia nazywana jest Zieloną Wyspą.',
      'Leprechaun to magiczny irlandzki skrzat.',
      'Koniczynka to symbol szczęścia w Irlandii.',
      'Dzień Świętego Patryka świętowany jest na zielono.',
      'W Irlandii są setki starożytnych zamków.',
    ]
  },
  'DNK': {
    code: 'DNK', name: 'Dania', nameEn: 'Denmark', flag: '🇩🇰', icon: '🧜‍♀️',
    curiosities: [
      'Klocki LEGO zostały wynalezione w Danii!',
      'Mała Syrenka to słynny posąg w Kopenhadze.',
      'Hans Christian Andersen pisał baśnie w Danii.',
      'Dania jest jednym z najszczęśliwszych krajów świata.',
      'Duńczycy jeżdżą wszędzie na rowerach.',
    ]
  },
  'FIN': {
    code: 'FIN', name: 'Finlandia', nameEn: 'Finland', flag: '🇫🇮', icon: '🎅',
    curiosities: [
      'Święty Mikołaj mieszka w fińskiej Laponii!',
      'W Finlandii jest ponad 180 000 jezior.',
      'Finowie uwielbiają sauny.',
      'Finlandia to ojczyzna Muminków.',
      'Zimą w Finlandii jest bardzo mało światła.',
    ]
  },
  'ISL': {
    code: 'ISL', name: 'Islandia', nameEn: 'Iceland', flag: '🇮🇸', icon: '🌋',
    curiosities: [
      'Islandia ma wulkany, gejzery i lodowce!',
      'Islandia nie ma armii.',
      'Można tu zobaczyć zorzę polarną.',
      'Gorące źródła ogrzewają domy.',
      'Islandczycy wierzą w elfy i trolle.',
    ]
  },
  'CZE': {
    code: 'CZE', name: 'Czechy', nameEn: 'Czechia', flag: '🇨🇿', icon: '🏰',
    curiosities: [
      'Praga ma ponad 1000 wież i wieżyczek!',
      'Czechy słyną z pięknych zamków.',
      'Most Karola w Pradze ma ponad 600 lat.',
      'Czechy są ojczyzną klocków Merkur.',
      'Czeskie pierniczki są pyszne.',
    ]
  },
  'HUN': {
    code: 'HUN', name: 'Węgry', nameEn: 'Hungary', flag: '🇭🇺', icon: '♨️',
    curiosities: [
      'Budapeszt ma słynne ciepłe kąpieliska!',
      'Kostka Rubika została wynaleziona na Węgrzech.',
      'Gulasz to tradycyjna węgierska zupa.',
      'Dunaj przepływa przez stolicę Węgier.',
      'Węgrzy mają unikatowy język.',
    ]
  },
  'ROU': {
    code: 'ROU', name: 'Rumunia', nameEn: 'Romania', flag: '🇷🇴', icon: '🧛',
    curiosities: [
      'Dracula podobno mieszkał w rumuńskim zamku!',
      'Rumunia ma piękne góry Karpaty.',
      'W Rumunii żyją niedźwiedzie brunatne.',
      'Delta Dunaju jest domem dla wielu ptaków.',
      'Rumuńskie klasztory są ozdobione malowidłami.',
    ]
  },
  'BGR': {
    code: 'BGR', name: 'Bułgaria', nameEn: 'Bulgaria', flag: '🇧🇬', icon: '🌹',
    curiosities: [
      'Bułgaria jest słynna z róż i olejku różanego.',
      'Bułgarzy kiwają głową na "nie", a kręcą na "tak"!',
      'Morze Czarne ma piękne plaże w Bułgarii.',
      'Jogurt bułgarski jest znany na całym świecie.',
      'W Bułgarii są stare miasta z kamiennymi uliczkami.',
    ]
  },
  'HRV': {
    code: 'HRV', name: 'Chorwacja', nameEn: 'Croatia', flag: '🇭🇷', icon: '🏖️',
    curiosities: [
      'Chorwacja ma ponad 1200 wysp!',
      'Morze Adriatyckie jest kryształowo czyste.',
      'Krawat został wynaleziony w Chorwacji.',
      'Dubrownik to miasto ze słynnego serialu.',
      'Chorwackie plaże są kamieniste, ale piękne.',
    ]
  },
  'SVN': {
    code: 'SVN', name: 'Słowenia', nameEn: 'Slovenia', flag: '🇸🇮', icon: '🐝',
    curiosities: [
      'Słowenia to mały kraj z górami, morzem i lasami.',
      'Słoweńcy bardzo dbają o pszczoły.',
      'Jama Postojna to ogromna jaskinia.',
      'Słowenia ma tylko 47 kilometrów wybrzeża.',
      'Lipicany to słynne białe konie ze Słowenii.',
    ]
  },
  'SVK': {
    code: 'SVK', name: 'Słowacja', nameEn: 'Slovakia', flag: '🇸🇰', icon: '🏔️',
    curiosities: [
      'Słowacja ma piękne Tatry!',
      'Bratysława to jedyna stolica granicząca z dwoma krajami.',
      'W Słowacji jest ponad 6000 jaskiń.',
      'Bryndza to słynny słowacki ser.',
      'Słowackie zamki są malownicze.',
    ]
  },
  'BLR': {
    code: 'BLR', name: 'Białoruś', nameEn: 'Belarus', flag: '🇧🇾', icon: '🦬',
    curiosities: [
      'Białoruś ma jeden z ostatnich pierwotnych lasów Europy!',
      'Puszcza Białowieska jest domem żubrów.',
      'Mińsk to stolica z szerokimi ulicami.',
      'Białoruś ma wiele jezior i rzek.',
      'Bocian biały jest symbolem Białorusi.',
    ]
  },
  'UKR': {
    code: 'UKR', name: 'Ukraina', nameEn: 'Ukraine', flag: '🇺🇦', icon: '🌻',
    curiosities: [
      'Ukraina jest największym krajem w Europie!',
      'Słoneczniki rosną wszędzie na Ukrainie.',
      'Kijów ma złote kopuły cerkwi.',
      'Pisanki to pięknie zdobione jajka.',
      'Barszcz ukraiński jest smaczny i czerwony.',
    ]
  },
  'RUS': {
    code: 'RUS', name: 'Rosja', nameEn: 'Russia', flag: '🇷🇺', icon: '🪆',
    curiosities: [
      'Rosja to największy kraj na świecie!',
      'Matrioszki to słynne drewniane lalki.',
      'Moskwa ma kolorowe cerkwie z cebulastymi kopułami.',
      'Pociąg transsyberyjski jedzie przez całą Rosję.',
      'W Rosji zimą jest bardzo zimno i dużo śniegu.',
    ]
  },
  'TUR': {
    code: 'TUR', name: 'Turcja', nameEn: 'Turkey', flag: '🇹🇷', icon: '🎈',
    curiosities: [
      'Stambuł leży na dwóch kontynentach!',
      'W Kapadocji można latać balonami.',
      'Turecka kawa jest gęsta i słodka.',
      'Kebab pochodzi z Turcji.',
      'Turcja ma piękne meczety z minaretami.',
    ]
  },
  // ============ ASIA ============
  'JPN': {
    code: 'JPN', name: 'Japonia', nameEn: 'Japan', flag: '🇯🇵', icon: '🗾',
    curiosities: [
      'W Japonii jest ponad 6800 wysp!',
      'Japończycy jedzą ryż prawie codziennie.',
      'Sakury to piękne kwitnące wiśnie.',
      'W Japonii są pociągi szybsze od samolotów.',
      'Origami to japońska sztuka składania papieru.',
    ]
  },
  'CHN': {
    code: 'CHN', name: 'Chiny', nameEn: 'China', flag: '🇨🇳', icon: '🐉',
    curiosities: [
      'Wielki Mur Chiński ma ponad 21 000 kilometrów!',
      'Pandy żyją tylko w Chinach.',
      'Chińczycy wynaleźli papier i fajerwerki.',
      'Chiński Nowy Rok świętowany jest z czerwonymi lampionami.',
      'Pałeczki służą do jedzenia w Chinach.',
    ]
  },
  'IND': {
    code: 'IND', name: 'Indie', nameEn: 'India', flag: '🇮🇳', icon: '🐘',
    curiosities: [
      'W Indiach jest ponad 22 oficjalnych języków!',
      'Taj Mahal to jeden z cudów świata.',
      'Słonie są świętymi zwierzętami w Indiach.',
      'Holi to kolorowe święto w Indiach.',
      'Indie są ojczyzną jogi i curry.',
    ]
  },
  'THA': {
    code: 'THA', name: 'Tajlandia', nameEn: 'Thailand', flag: '🇹🇭', icon: '🐘',
    curiosities: [
      'Tajlandia nazywana jest "Krajem Uśmiechu"!',
      'W Tajlandii są piękne złote świątynie.',
      'Tajski masaż jest znany na całym świecie.',
      'Słonie pomagają w leśnych pracach.',
      'Pad Thai to popularne tajskie danie.',
    ]
  },
  'KOR': {
    code: 'KOR', name: 'Korea Południowa', nameEn: 'South Korea', flag: '🇰🇷', icon: '🎮',
    curiosities: [
      'K-pop to popularna koreańska muzyka!',
      'Kimchi to fermentowana kapusta.',
      'Koreańczycy mają specjalny alfabet - hangul.',
      'Samsung i LG pochodzą z Korei.',
      'W Korei wiek liczy się od poczęcia!',
    ]
  },
  'VNM': {
    code: 'VNM', name: 'Wietnam', nameEn: 'Vietnam', flag: '🇻🇳', icon: '🍜',
    curiosities: [
      'Wietnam ma piękne skalne wyspy na morzu.',
      'Pho to popularna wietnamska zupa.',
      'Wietnamczycy noszą słynne stożkowe kapelusze.',
      'Kawa wietnamska jest bardzo mocna.',
      'Wietnam uprawia dużo ryżu na polach tarasowych.',
    ]
  },
  'IDN': {
    code: 'IDN', name: 'Indonezja', nameEn: 'Indonesia', flag: '🇮🇩', icon: '🦎',
    curiosities: [
      'Indonezja ma ponad 17 000 wysp!',
      'Smoki z Komodo żyją tylko tutaj.',
      'Bali to rajska wyspa w Indonezji.',
      'Indonezja ma wiele wulkanów.',
      'Orangutany żyją w lasach Indonezji.',
    ]
  },
  'MYS': {
    code: 'MYS', name: 'Malezja', nameEn: 'Malaysia', flag: '🇲🇾', icon: '🏙️',
    curiosities: [
      'Wieże Petronas były najwyższymi na świecie!',
      'W Malezji żyją tygrysy i słonie.',
      'Malezyjskie jedzenie jest pikantne i smaczne.',
      'W Malezji są stare lasy deszczowe.',
      'Motyle w Malezji są bardzo kolorowe.',
    ]
  },
  'PHL': {
    code: 'PHL', name: 'Filipiny', nameEn: 'Philippines', flag: '🇵🇭', icon: '🏝️',
    curiosities: [
      'Filipiny mają ponad 7600 wysp!',
      'Można tu zobaczyć najmniejsze małpy - tarsjerze.',
      'Filipińczycy uwielbiają karaoke.',
      'Czekoladowe Wzgórza to słynne pagórki.',
      'Filipiny mają piękne rafy koralowe.',
    ]
  },
  'SAU': {
    code: 'SAU', name: 'Arabia Saudyjska', nameEn: 'Saudi Arabia', flag: '🇸🇦', icon: '🕌',
    curiosities: [
      'Mekka to najświętsze miasto islamu.',
      'W Arabii jest dużo pustyni i wielbłądów.',
      'Ropa naftowa pochodzi spod ziemi Arabii.',
      'Noce w pustyni są bardzo zimne.',
      'Arabska kawa podawana jest z daktylami.',
    ]
  },
  'ARE': {
    code: 'ARE', name: 'Zjednoczone Emiraty Arabskie', nameEn: 'United Arab Emirates', flag: '🇦🇪', icon: '🏗️',
    curiosities: [
      'Burj Khalifa to najwyższy budynek świata!',
      'Dubaj ma sztuczne wyspy w kształcie palm.',
      'W Dubaju jest kryty stok narciarski.',
      'Emiraty mają luksusowe hotele.',
      'Tu można zobaczyć wielbłądy i nowoczesne samochody.',
    ]
  },
  'ISR': {
    code: 'ISR', name: 'Izrael', nameEn: 'Israel', flag: '🇮🇱', icon: '✡️',
    curiosities: [
      'Morze Martwe jest tak słone, że można na nim leżeć!',
      'Jerozolima to święte miasto trzech religii.',
      'Izrael ma pustynię i piękne plaże.',
      'Hummus i falafel to pyszne izraelskie potrawy.',
      'Hebrajski to starożytny język ożywiony na nowo.',
    ]
  },
  // ============ AFRICA ============
  'EGY': {
    code: 'EGY', name: 'Egipt', nameEn: 'Egypt', flag: '🇪🇬', icon: '🏺',
    curiosities: [
      'Wielka Piramida w Gizie ma ponad 4500 lat!',
      'Sfinks strzeże piramid od tysięcy lat.',
      'Nil to najdłuższa rzeka Afryki.',
      'Faraonowie byli mumifikowani po śmierci.',
      'Hieroglify to starożytne egipskie pismo.',
    ]
  },
  'KEN': {
    code: 'KEN', name: 'Kenia', nameEn: 'Kenya', flag: '🇰🇪', icon: '🦁',
    curiosities: [
      'W Kenii odbywa się wielka migracja zwierząt!',
      'Można tu zobaczyć lwy, słonie i żyrafy.',
      'Masajowie to słynny lud kenijski.',
      'Kenia ma piękne parki narodowe.',
      'Kenijska kawa jest znana na świecie.',
    ]
  },
  'MAR': {
    code: 'MAR', name: 'Maroko', nameEn: 'Morocco', flag: '🇲🇦', icon: '🧞',
    curiosities: [
      'Na Saharze może być zimniej niż w lodówce!',
      'Marokańskie bazary są pełne kolorów i zapachów.',
      'Tagine to tradycyjne marokańskie danie.',
      'Marokańska herbata miętowa jest bardzo słodka.',
      'W Maroku są piękne niebieskie miasta.',
    ]
  },
  'ZAF': {
    code: 'ZAF', name: 'Republika Południowej Afryki', nameEn: 'South Africa', flag: '🇿🇦', icon: '🐧',
    curiosities: [
      'RPA ma trzy stolice!',
      'Na plażach RPA żyją pingwiny.',
      'Góra Stołowa to płaski szczyt w Kapsztadzie.',
      'RPA ma 11 oficjalnych języków.',
      'Tu żyje słynna wielka piątka zwierząt.',
    ]
  },
  'NGA': {
    code: 'NGA', name: 'Nigeria', nameEn: 'Nigeria', flag: '🇳🇬', icon: '🥁',
    curiosities: [
      'Nigeria to najbardziej ludny kraj Afryki!',
      'Nollywood produkuje mnóstwo filmów.',
      'Nigeria ma ponad 500 różnych języków.',
      'Jollof rice to popularne danie nigeryjskie.',
      'Lagos to wielka metropolia.',
    ]
  },
  'ETH': {
    code: 'ETH', name: 'Etiopia', nameEn: 'Ethiopia', flag: '🇪🇹', icon: '☕',
    curiosities: [
      'Kawa została odkryta w Etiopii!',
      'Etiopia ma własny kalendarz.',
      'Lucy, najsłynniejszy szkielet człowieka, znaleziono tutaj.',
      'Etiopia nigdy nie była kolonią.',
      'Injera to etiopski chleb z ciasta.',
    ]
  },
  'TZA': {
    code: 'TZA', name: 'Tanzania', nameEn: 'Tanzania', flag: '🇹🇿', icon: '🦒',
    curiosities: [
      'Kilimandżaro to najwyższa góra Afryki!',
      'Serengeti to słynny park safari.',
      'Zanzibar to rajska wyspa przypraw.',
      'W Tanzanii żyją miliony flamingów.',
      'Tu można zobaczyć wielką migrację gnu.',
    ]
  },
  'GHA': {
    code: 'GHA', name: 'Ghana', nameEn: 'Ghana', flag: '🇬🇭', icon: '🍫',
    curiosities: [
      'Ghana jest jednym z największych producentów kakao!',
      'Słynne kolorowe trumny pochodzą z Ghany.',
      'Ghańczycy są bardzo gościnni.',
      'W Ghanie są zamki z czasów handlu niewolnikami.',
      'Kente to tradycyjna ghańska tkanina.',
    ]
  },
  // ============ NORTH AMERICA ============
  'USA': {
    code: 'USA', name: 'Stany Zjednoczone', nameEn: 'United States', flag: '🇺🇸', icon: '🗽',
    curiosities: [
      'USA ma 50 stanów i każdy jest inny!',
      'Statua Wolności to prezent od Francji.',
      'Hollywood produkuje najwięcej filmów.',
      'Wielki Kanion jest niesamowicie głęboki.',
      'Hamburger i hot dog to amerykańskie wynalazki.',
    ]
  },
  'CAN': {
    code: 'CAN', name: 'Kanada', nameEn: 'Canada', flag: '🇨🇦', icon: '🍁',
    curiosities: [
      'Kanada ma więcej jezior niż wszystkie inne kraje razem!',
      'Syrop klonowy pochodzi z Kanady.',
      'Niedźwiedzie polarne żyją na północy.',
      'Hokej to narodowy sport Kanady.',
      'Wodospad Niagara leży na granicy z USA.',
    ]
  },
  'MEX': {
    code: 'MEX', name: 'Meksyk', nameEn: 'Mexico', flag: '🇲🇽', icon: '🌮',
    curiosities: [
      'Meksyk ma 35 obiektów z listy UNESCO!',
      'Tacos i burrito pochodzą z Meksyku.',
      'Piramidy Majów są niesamowite.',
      'Dzień Zmarłych to kolorowe święto.',
      'Kakao i czekolada pochodzą z Meksyku.',
    ]
  },
  'CUB': {
    code: 'CUB', name: 'Kuba', nameEn: 'Cuba', flag: '🇨🇺', icon: '🚗',
    curiosities: [
      'Na Kubie jeżdżą stare, kolorowe samochody!',
      'Kuba jest słynna z cyguar i muzyki salsa.',
      'Hawana ma kolorowe kolonialne budynki.',
      'Kuba to wyspa na Karaibach.',
      'Kubańska kawa jest bardzo mocna.',
    ]
  },
  'JAM': {
    code: 'JAM', name: 'Jamajka', nameEn: 'Jamaica', flag: '🇯🇲', icon: '🎶',
    curiosities: [
      'Reggae i Bob Marley pochodzą z Jamajki!',
      'Jamajka słynie z szybkich sprinterów.',
      'Jamajskie plaże są rajskie.',
      'Jerk chicken to pikantne jamajskie danie.',
      'Jamajka produkuje słynną kawę Blue Mountain.',
    ]
  },
  'CRI': {
    code: 'CRI', name: 'Kostaryka', nameEn: 'Costa Rica', flag: '🇨🇷', icon: '🦜',
    curiosities: [
      'Kostaryka ma 5% wszystkich gatunków świata!',
      'Kostarykańczycy mówią "Pura Vida" - czyste życie.',
      'Tu żyją kolorowe żaby drzewlaki.',
      'Kostaryka nie ma armii.',
      'Lasy deszczowe są domem tukanów.',
    ]
  },
  // ============ SOUTH AMERICA ============
  'BRA': {
    code: 'BRA', name: 'Brazylia', nameEn: 'Brazil', flag: '🇧🇷', icon: '⚽',
    curiosities: [
      'Amazonia produkuje 20% tlenu na Ziemi!',
      'Brazylia pięć razy wygrała Mistrzostwa Świata w piłce nożnej.',
      'Karnawał w Rio to największa impreza świata.',
      'Statua Chrystusa stoi nad Rio de Janeiro.',
      'W Brazylii mówi się po portugalsku.',
    ]
  },
  'ARG': {
    code: 'ARG', name: 'Argentyna', nameEn: 'Argentina', flag: '🇦🇷', icon: '💃',
    curiosities: [
      'Argentyna ma lodowce, które wciąż rosną!',
      'Tango pochodzi z Buenos Aires.',
      'Argentyńskie steki są słynne na świecie.',
      'Patagonia ma niesamowite krajobrazy.',
      'Maradona był argentyńskim bohaterem.',
    ]
  },
  'PER': {
    code: 'PER', name: 'Peru', nameEn: 'Peru', flag: '🇵🇪', icon: '🦙',
    curiosities: [
      'Machu Picchu zostało zbudowane bez użycia kół!',
      'Lamy i alpaki żyją w Andach.',
      'Peruwiańska kuchnia jest jedną z najlepszych.',
      'Inkowie budowali niesamowite miasta.',
      'Peru ma fragment Amazonii.',
    ]
  },
  'COL': {
    code: 'COL', name: 'Kolumbia', nameEn: 'Colombia', flag: '🇨🇴', icon: '☕',
    curiosities: [
      'Kolumbia produkuje jedną z najlepszych kaw!',
      'Tu żyją kolorowe ptaki i motyle.',
      'Cartagena ma piękne kolonialne mury.',
      'Kolumbia ma góry, plaże i dżunglę.',
      'Szmaragdy kolumbijskie są najpiękniejsze.',
    ]
  },
  'CHL': {
    code: 'CHL', name: 'Chile', nameEn: 'Chile', flag: '🇨🇱', icon: '🗿',
    curiosities: [
      'Chile jest bardzo długie i wąskie!',
      'Na Wyspie Wielkanocnej stoją tajemnicze posągi Moai.',
      'Pustynia Atacama jest najsuchszym miejscem na Ziemi.',
      'Chile ma piękne góry Andy.',
      'Patagonia chilijska jest dzika i piękna.',
    ]
  },
  'ECU': {
    code: 'ECU', name: 'Ekwador', nameEn: 'Ecuador', flag: '🇪🇨', icon: '🐢',
    curiosities: [
      'Wyspy Galapagos należą do Ekwadoru!',
      'Ekwador leży dokładnie na równiku.',
      'Tu żyją gigantyczne żółwie.',
      'Banany ekwadorskie są eksportowane na cały świat.',
      'Quito to jedna z najwyżej położonych stolic.',
    ]
  },
  'VEN': {
    code: 'VEN', name: 'Wenezuela', nameEn: 'Venezuela', flag: '🇻🇪', icon: '💧',
    curiosities: [
      'Wenezuela ma najwyższy wodospad świata - Salto Ángel!',
      'Tu jest dużo ropy naftowej.',
      'Arepa to popularne wenezuelskie danie.',
      'Wenezuela ma piękne plaże karaibskie.',
      'W lasach żyją kolorowe papugi.',
    ]
  },
  'BOL': {
    code: 'BOL', name: 'Boliwia', nameEn: 'Bolivia', flag: '🇧🇴', icon: '🏔️',
    curiosities: [
      'Boliwia ma największą słoną pustynię świata!',
      'La Paz to najwyżej położona stolica.',
      'Jezioro Titicaca leży na granicy z Peru.',
      'Boliwia ma wiele rdzennych kultur.',
      'Lamy są ważnymi zwierzętami w Boliwii.',
    ]
  },
  // ============ OCEANIA ============
  'AUS': {
    code: 'AUS', name: 'Australia', nameEn: 'Australia', flag: '🇦🇺', icon: '🦘',
    curiosities: [
      'Australia jest jednocześnie kontynentem i krajem!',
      'Kangury i koale żyją tylko tutaj.',
      'Wielka Rafa Koralowa widoczna jest z kosmosu.',
      'W Australii są nietypowe zwierzęta jak dziobak.',
      'Outback to ogromna australijska pustynia.',
    ]
  },
  'NZL': {
    code: 'NZL', name: 'Nowa Zelandia', nameEn: 'New Zealand', flag: '🇳🇿', icon: '🥝',
    curiosities: [
      'Kiwi to ptak, który nie potrafi latać!',
      'Nowa Zelandia ma więcej owiec niż ludzi.',
      'Tu kręcono Władcę Pierścieni.',
      'Nowa Zelandia ma gejzery i gorące źródła.',
      'Maorysi to rdzenni mieszkańcy.',
    ]
  },
  'PNG': {
    code: 'PNG', name: 'Papua-Nowa Gwinea', nameEn: 'Papua New Guinea', flag: '🇵🇬', icon: '🦅',
    curiosities: [
      'Papua-Nowa Gwinea ma ponad 800 języków!',
      'Tu żyją piękne rajskie ptaki.',
      'Lasy deszczowe pokrywają większość kraju.',
      'Plemiona mają tradycyjne stroje i tańce.',
      'Papua ma wiele wulkanów.',
    ]
  },
  'FJI': {
    code: 'FJI', name: 'Fidżi', nameEn: 'Fiji', flag: '🇫🇯', icon: '🏝️',
    curiosities: [
      'Fidżi to ponad 330 wysp na Pacyfiku!',
      'Woda wokół wysp jest kryształowo czysta.',
      'Fidżi to raj dla nurków.',
      'Mieszkańcy są bardzo gościnni.',
      'Kokosy rosną na każdej wyspie.',
    ]
  },
  // ============ ADDITIONAL ISLANDS ============
  'CPV': {
    code: 'CPV', name: 'Zielony Przylądek', nameEn: 'Cape Verde', flag: '🇨🇻', icon: '🏝️',
    curiosities: [
      'Zielony Przylądek to 10 pięknych wysp na Atlantyku!',
      'Na wyspach mówi się po portugalsku.',
      'Muzyka morna pochodzi właśnie stąd.',
      'Wyspy mają wulkany i rajskie plaże.',
      'Żółwie morskie składają jaja na tutejszych plażach.',
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
