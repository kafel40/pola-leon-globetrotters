import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Loader2, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface OrderHistoryItem {
  id: string;
  ebook_id: string;
  country_slug: string;
  purchased_at: string;
  price_at_purchase: number;
  ebook?: {
    title: string;
    country_slug: string;
  };
}

// Map country slugs to Polish names
const countryNames: Record<string, string> = {
  'polska': 'Polska',
  'wlochy': 'Włochy',
  'francja': 'Francja',
  'hiszpania': 'Hiszpania',
  'niemcy': 'Niemcy',
  'grecja': 'Grecja',
  'wielka-brytania': 'Wielka Brytania',
  'portugalia': 'Portugalia',
  'holandia': 'Holandia',
  'belgia': 'Belgia',
  'austria': 'Austria',
  'szwajcaria': 'Szwajcaria',
  'czechy': 'Czechy',
  'japonia': 'Japonia',
  'chiny': 'Chiny',
  'indie': 'Indie',
  'usa': 'USA',
  'kanada': 'Kanada',
  'meksyk': 'Meksyk',
  'brazylia': 'Brazylia',
  'argentyna': 'Argentyna',
  'australia': 'Australia',
  'egipt': 'Egipt',
  'maroko': 'Maroko',
  'rpa': 'RPA',
};

export function OrderHistorySection() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        // Fetch owned ebooks with ebook details
        const { data: ownedEbooks, error: ownedError } = await supabase
          .from('owned_ebooks')
          .select('id, ebook_id, country_slug, purchased_at, price_at_purchase')
          .eq('user_id', user.id)
          .order('purchased_at', { ascending: false });

        if (ownedError) throw ownedError;

        // Fetch ebook titles
        if (ownedEbooks && ownedEbooks.length > 0) {
          const ebookIds = ownedEbooks.map(o => o.ebook_id);
          const { data: ebooks } = await supabase
            .from('ebooks')
            .select('id, title, country_slug')
            .in('id', ebookIds);

          const ordersWithTitles = ownedEbooks.map(order => ({
            ...order,
            ebook: ebooks?.find(e => e.id === order.ebook_id)
          }));

          setOrders(ordersWithTitles);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getCountryName = (slug: string) => {
    return countryNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined || price === 0) {
      return 'Darmowa';
    }
    return `${price.toFixed(2)} zł`;
  };

  if (loading) {
    return (
      <Card className="bg-card rounded-3xl shadow-card border border-border/50 p-6 md:p-8 mb-6">
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card rounded-3xl shadow-card border border-border/50 p-6 md:p-8 mb-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Moje Bajki / Historia
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-body">Nie masz jeszcze żadnych bajek w bibliotece.</p>
            <p className="text-sm mt-2">Odkryj świat z Polą i Leonem!</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kraj</TableHead>
                  <TableHead>Nazwa przygody</TableHead>
                  <TableHead className="text-right">Cena</TableHead>
                  <TableHead className="text-right">Data aktywacji</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="font-medium">{getCountryName(order.country_slug)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-body">{order.ebook?.title || 'Bajka'}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={order.price_at_purchase === 0 ? 'secondary' : 'default'}>
                        {formatPrice(order.price_at_purchase)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {format(new Date(order.purchased_at), 'd MMM yyyy', { locale: pl })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
