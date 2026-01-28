import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHead } from '@/components/seo/PageHead';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Tag, Share2, Compass } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import DOMPurify from 'dompurify';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category_id: string | null;
  tags: string[];
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  category?: { name: string; slug: string } | null;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories(name, slug)
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setPost({
        ...data,
        category: data.blog_categories as { name: string; slug: string } | null
      });
    }
    setLoading(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || '',
          url,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link skopiowany!',
        description: 'Możesz go teraz wkleić i udostępnić.',
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <article className="py-12 md:py-20">
          <div className="container max-w-4xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-64 mb-8" />
            <Skeleton className="h-80 w-full rounded-2xl mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </article>
      </Layout>
    );
  }

  if (notFound) {
    return <Navigate to="/blog" replace />;
  }

  if (!post) return null;

  const pageTitle = post.meta_title || post.title;
  const pageDescription = post.meta_description || post.excerpt || `Przeczytaj artykuł: ${post.title}`;
  const ogImage = post.og_image_url || post.cover_image_url || '/og-image.png';

  return (
    <Layout>
      <PageHead 
        title={pageTitle}
        description={pageDescription}
        ogImage={ogImage}
        ogType="article"
      />

      <article className="py-12 md:py-20">
        <div className="container max-w-4xl">
          {/* Back link */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-body">Wróć do bloga</span>
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.category && (
                <Link to={`/blog?category=${post.category.slug}`}>
                  <Badge variant="secondary" className="text-sm">
                    {post.category.name}
                  </Badge>
                </Link>
              )}
              {post.published_at && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(post.published_at), 'd MMMM yyyy', { locale: pl })}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground font-body leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Cover image */}
          {post.cover_image_url && (
            <div className="relative rounded-2xl overflow-hidden mb-10">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Content - sanitized for XSS protection */}
          <div 
            className="prose prose-lg max-w-none font-body
              prose-headings:font-display prose-headings:text-foreground
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-img:rounded-xl
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
            "
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(post.content, {
                ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'a', 'img', 'blockquote', 'ul', 'ol', 'li', 'br', 'span', 'div', 'code', 'pre'],
                ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel']
              })
            }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-border">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {post.tags.map((tag) => (
                <Link key={tag} to={`/blog?tag=${tag}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="flex justify-center mt-10">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Udostępnij artykuł
            </Button>
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="py-12 bg-dreamy-lavender/30">
        <div className="container max-w-2xl text-center">
          <Compass className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-4">
            Odkrywaj świat z Polą i Leonem!
          </h2>
          <p className="text-muted-foreground font-body mb-6">
            Poznaj nasze bajki edukacyjne z różnych zakątków globu.
          </p>
          <Button asChild size="lg">
            <Link to="/mapa">Zobacz mapę przygód</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
