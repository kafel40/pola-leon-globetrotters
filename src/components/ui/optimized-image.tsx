import { useState, useEffect, useRef, ImgHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean; // If true, loads immediately without lazy loading
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoadComplete?: () => void;
}

/**
 * OptimizedImage component with lazy loading and fade-in animation
 * Use priority={true} for above-the-fold images (hero, LCP)
 */
export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ 
    src, 
    alt, 
    className, 
    priority = false, 
    placeholder = 'empty',
    blurDataURL,
    onLoadComplete,
    ...props 
  }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
      if (priority) {
        setIsInView(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: '50px', // Start loading 50px before entering viewport
          threshold: 0.01,
        }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, [priority]);

    const handleLoad = () => {
      setIsLoaded(true);
      onLoadComplete?.();
    };

    // Generate blur placeholder style
    const placeholderStyle = placeholder === 'blur' && blurDataURL ? {
      backgroundImage: `url(${blurDataURL})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } : {};

    return (
      <div 
        ref={containerRef}
        className={cn(
          'relative overflow-hidden',
          !isLoaded && placeholder === 'blur' && 'bg-muted',
          className
        )}
        style={placeholderStyle}
      >
        {isInView && (
          <img
            ref={ref || imgRef}
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            onLoad={handleLoad}
            className={cn(
              'transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
              className
            )}
            {...props}
          />
        )}
        
        {/* Skeleton placeholder */}
        {!isLoaded && placeholder === 'empty' && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

/**
 * Hook to preload critical images
 */
export function useImagePreload(src: string) {
  useEffect(() => {
    const img = new Image();
    img.src = src;
  }, [src]);
}

/**
 * Preload multiple images
 */
export function preloadImages(srcs: string[]) {
  srcs.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}
