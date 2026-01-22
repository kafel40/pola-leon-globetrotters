// Internationalization configuration
export type Language = 'pl' | 'en' | 'es';

export const defaultLanguage: Language = 'pl';

export const translations = {
  pl: {
    nav: {
      home: 'Strona główna',
      map: 'Mapa świata',
      continents: 'Kontynenty',
      about: 'O Poli i Leonie',
      login: 'Zaloguj się',
      library: 'Moja biblioteka',
      menu: 'Menu',
    },
    home: {
      heroTitle: 'Odkrywaj świat z Polą i Leonem',
      heroSubtitle: 'Bajki edukacyjne z różnych zakątków świata dla dzieci 2-6 lat',
      cta: 'Wyrusz w podróż po świecie',
      whoAreThey: 'Kim są Pola i Leon?',
      polaDescription: 'Pola ma 4 lata i jest ciekawa świata. Uwielbia zadawać pytania i odkrywać nowe miejsca.',
      leonDescription: 'Leon ma 2 lata i jest pełen energii. Uczy się świata przez zabawę i przygody.',
      values: {
        education: 'Edukacja przez zabawę',
        geography: 'Odkrywanie geografii',
        emotions: 'Rozwój emocjonalny',
        safety: 'Bezpieczne treści',
      },
    },
    countries: {
      comingSoon: 'Wkrótce',
      available: 'Dostępne',
      buyStory: 'Kup bajkę',
      funFact: 'Ciekawostka geograficzna',
      adventure: 'Przygoda Poli i Leona',
    },
    about: {
      title: 'Poznaj Polę i Leona',
      subtitle: 'Dwójka rodzeństwa, która razem odkrywa świat',
    },
    footer: {
      rights: 'Wszelkie prawa zastrzeżone',
    },
  },
  en: {
    nav: {
      home: 'Home',
      map: 'World Map',
      continents: 'Continents',
      about: 'About Pola & Leon',
      login: 'Sign In',
      library: 'My Library',
      menu: 'Menu',
    },
    home: {
      heroTitle: 'Explore the World with Pola and Leon',
      heroSubtitle: 'Educational fairy tales from around the world for children aged 2-6',
      cta: 'Start your journey',
      whoAreThey: 'Who are Pola and Leon?',
      polaDescription: 'Pola is 4 years old and curious about the world. She loves asking questions and discovering new places.',
      leonDescription: 'Leon is 2 years old and full of energy. He learns about the world through play and adventures.',
      values: {
        education: 'Learning through play',
        geography: 'Discovering geography',
        emotions: 'Emotional development',
        safety: 'Safe content',
      },
    },
    countries: {
      comingSoon: 'Coming Soon',
      available: 'Available',
      buyStory: 'Buy Story',
      funFact: 'Fun Geography Fact',
      adventure: 'Pola and Leon\'s Adventure',
    },
    about: {
      title: 'Meet Pola and Leon',
      subtitle: 'A sibling duo discovering the world together',
    },
    footer: {
      rights: 'All rights reserved',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      map: 'Mapa del Mundo',
      continents: 'Continentes',
      about: 'Sobre Pola y León',
      login: 'Iniciar Sesión',
      library: 'Mi Biblioteca',
      menu: 'Menú',
    },
    home: {
      heroTitle: 'Explora el Mundo con Pola y León',
      heroSubtitle: 'Cuentos educativos de todo el mundo para niños de 2 a 6 años',
      cta: 'Comienza tu viaje',
      whoAreThey: '¿Quiénes son Pola y León?',
      polaDescription: 'Pola tiene 4 años y es curiosa sobre el mundo. Le encanta hacer preguntas y descubrir nuevos lugares.',
      leonDescription: 'León tiene 2 años y está lleno de energía. Aprende sobre el mundo a través del juego y las aventuras.',
      values: {
        education: 'Aprender jugando',
        geography: 'Descubriendo geografía',
        emotions: 'Desarrollo emocional',
        safety: 'Contenido seguro',
      },
    },
    countries: {
      comingSoon: 'Próximamente',
      available: 'Disponible',
      buyStory: 'Comprar Cuento',
      funFact: 'Dato Geográfico Curioso',
      adventure: 'La Aventura de Pola y León',
    },
    about: {
      title: 'Conoce a Pola y León',
      subtitle: 'Dos hermanos descubriendo el mundo juntos',
    },
    footer: {
      rights: 'Todos los derechos reservados',
    },
  },
} as const;

export function t(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}
