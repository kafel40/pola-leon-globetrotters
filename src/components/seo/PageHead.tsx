import { useEffect } from 'react';

interface PageHeadProps {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
}

export function PageHead({ 
  title, 
  description, 
  ogImage = '/og-image.png',
  ogType = 'website',
  canonicalUrl
}: PageHeadProps) {
  const siteName = 'Pola i Leon';
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update meta tags
    setMeta('description', description);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:image', ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`, true);
    setMeta('og:site_name', siteName, true);
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`);

    // Update canonical URL
    if (canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
    }

    // Cleanup - restore default title on unmount if needed
    return () => {
      // No cleanup needed - next page will set its own
    };
  }, [fullTitle, description, ogImage, ogType, canonicalUrl, baseUrl]);

  return null;
}
