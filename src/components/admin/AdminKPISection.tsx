import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Mail, Megaphone, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface KPIData {
  totalUsers: number;
  newsletterSubscribers: number;
  marketingConsents: number;
}

export function AdminKPISection() {
  const [kpi, setKpi] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        // Fetch total users count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch newsletter subscribers count (from profiles + newsletter_subscribers)
        const { count: profileNewsletterCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('newsletter_consent', true);

        const { count: subscribersCount } = await supabase
          .from('newsletter_subscribers')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        // Fetch marketing consents count
        const { count: marketingCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('marketing_consent', true);

        setKpi({
          totalUsers: usersCount || 0,
          newsletterSubscribers: (profileNewsletterCount || 0) + (subscribersCount || 0),
          marketingConsents: marketingCount || 0,
        });
      } catch (error) {
        console.error('Error fetching KPIs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpiItems = [
    {
      label: 'Zarejestrowani użytkownicy',
      value: kpi?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Subskrybenci Newslettera',
      value: kpi?.newsletterSubscribers || 0,
      icon: Mail,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Zgody marketingowe',
      value: kpi?.marketingConsents || 0,
      icon: Megaphone,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {kpiItems.map((item) => (
        <Card key={item.label}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${item.bgColor}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{item.value}</p>
                <p className="text-sm text-muted-foreground font-body">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
