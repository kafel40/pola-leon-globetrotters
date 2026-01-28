import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHead } from '@/components/seo/PageHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Calendar, Tag, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category_id: string | null;
  tags: string[];
  published_at: string | null;
  category?: { name: string; slug: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const POSTS_PER_PAGE = 9;

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedTag = searchParams.get('tag') || '';

  useEffect(() => {
    fetchCategories();
    fetchAllTags();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchQuery, selectedCategory, selectedTag]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('blog_categories')
      .select('id, name, slug')
      .order('name');
    setCategories(data || []);
  };

  const fetchAllTags = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('tags')
      .eq('is_published', true);
    
    const tagsSet = new Set<string>();
    data?.forEach(post => {
      post.tags?.forEach((tag: string) => tagsSet.add(tag));
    });
    setAllTags(Array.from(tagsSet).sort());
  };

  const fetchPosts = async () => {
    setLoading(true);
    
    let query = supabase
      .from('blog_posts')
      .select(`
        id, title, slug, excerpt, cover_image_url, category_id, tags, published_at,
        blog_categories(name, slug)
      `, { count: 'exact' })
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
    }

    if (selectedCategory) {
      const cat = categories.find(c => c.slug === selectedCategory);
      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    if (selectedTag) {
      query = query.contains('tags', [selectedTag]);
    }

    const from = (currentPage - 1) * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;
    
    const { data, count, error } = await query.range(from, to);

    if (!error) {
      setPosts(data?.map(post => ({
        ...post,
        category: post.blog_categories as Category | null
      })) || []);
      setTotalCount(count || 0);
    }
    
    setLoading(false);
  };

  const updateSearch = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <Layout>
      <PageHead 
        title="Blog podróżniczy"
        description="Odkrywaj świat z Polą i Leonem. Ciekawostki geograficzne, porady podróżnicze dla rodzin z dziećmi i inspiracje z różnych zakątków globu."
      />

      {/* Hero */}
      <section className="relative py-12 md:py-20 bg-hero overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-dreamy-lavender rounded-full opacity-40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-dreamy-mint rounded-full opacity-30 blur-3xl" />
        </div>
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-dreamy border border-border/50">
              <Compass className="h-4 w-4 text-accent-foreground" />
              <span className="text-sm font-body font-medium text-muted-foreground">
                Blog podróżniczy
              </span>
            </div>
            
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Podróże, kultura i <span className="text-gradient">ciekawostki ze świata</span>
            </h1>
            
            <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
              Poznaj świat razem z nami! Znajdziesz tu inspiracje podróżnicze, 
              ciekawostki geograficzne i pomysły na wspólne odkrywanie globu z dziećmi.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border/50">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj artykułów..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => updateSearch('q', e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={!selectedCategory ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSearch('category', '')}
              >
                Wszystkie
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSearch('category', cat.slug)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {allTags.slice(0, 10).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => updateSearch('tag', selectedTag === tag ? '' : tag)}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <Compass className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-bold mb-2">Brak artykułów</h2>
              <p className="text-muted-foreground font-body">
                {searchQuery || selectedCategory || selectedTag 
                  ? 'Nie znaleziono artykułów spełniających kryteria wyszukiwania.'
                  : 'Wkrótce pojawią się tu nowe artykuły podróżnicze!'}
              </p>
              {(searchQuery || selectedCategory || selectedTag) && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchParams(new URLSearchParams())}
                >
                  Wyczyść filtry
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden h-full transition-shadow hover:shadow-lg group">
                      <div className="relative h-48 bg-muted overflow-hidden">
                        {post.cover_image_url ? (
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dreamy-lavender to-dreamy-mint">
                            <Compass className="h-12 w-12 text-foreground/30" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {post.category && (
                            <Badge variant="secondary" className="text-xs">
                              {post.category.name}
                            </Badge>
                          )}
                          {post.published_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(post.published_at), 'd MMMM yyyy', { locale: pl })}
                            </span>
                          )}
                        </div>
                        <h2 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-muted-foreground font-body text-sm line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-xs text-muted-foreground">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('page', String(currentPage - 1));
                      setSearchParams(newParams);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Poprzednia
                  </Button>
                  <span className="text-sm text-muted-foreground font-body">
                    Strona {currentPage} z {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('page', String(currentPage + 1));
                      setSearchParams(newParams);
                    }}
                  >
                    Następna
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
