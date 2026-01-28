import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { pl } from 'date-fns/locale';

interface ChartData {
  date: string;
  uniqueVisitors: number;
  pageViews: number;
}

type DateRange = '7d' | '14d' | '30d';

export function AdminVisitsChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('7d');

  useEffect(() => {
    fetchVisitsData();
  }, [dateRange]);

  const fetchVisitsData = async () => {
    setLoading(true);
    try {
      const days = dateRange === '7d' ? 7 : dateRange === '14d' ? 14 : 30;
      const startDate = startOfDay(subDays(new Date(), days - 1));
      const endDate = endOfDay(new Date());

      const { data: visits, error } = await supabase
        .from('page_visits')
        .select('visitor_id, created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching visits:', error);
        setData([]);
        return;
      }

      // Group by date
      const groupedData: Record<string, { visitors: Set<string>; views: number }> = {};

      // Initialize all dates in range
      for (let i = 0; i < days; i++) {
        const date = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd');
        groupedData[date] = { visitors: new Set(), views: 0 };
      }

      // Fill with actual data
      visits?.forEach((visit) => {
        const date = format(new Date(visit.created_at), 'yyyy-MM-dd');
        if (groupedData[date]) {
          groupedData[date].visitors.add(visit.visitor_id);
          groupedData[date].views++;
        }
      });

      // Convert to chart format
      const chartData: ChartData[] = Object.entries(groupedData).map(([date, values]) => ({
        date: format(new Date(date), 'd MMM', { locale: pl }),
        uniqueVisitors: values.visitors.size,
        pageViews: values.views,
      }));

      setData(chartData);
    } catch (error) {
      console.error('Error processing visits data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const totalViews = data.reduce((sum, d) => sum + d.pageViews, 0);
  const totalVisitors = data.reduce((sum, d) => sum + d.uniqueVisitors, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Wizyty na stronie
        </CardTitle>
        <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 dni</SelectItem>
            <SelectItem value="14d">14 dni</SelectItem>
            <SelectItem value="30d">30 dni</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-primary/10">
                <p className="text-2xl font-bold font-display text-primary">{totalVisitors}</p>
                <p className="text-sm text-muted-foreground font-body">Unikalni użytkownicy</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-2xl font-bold font-display">{totalViews}</p>
                <p className="text-sm text-muted-foreground font-body">Odsłony stron</p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="uniqueVisitors"
                    name="Unikalni użytkownicy"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    name="Odsłony"
                    stroke="hsl(var(--secondary-foreground))"
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {data.length === 0 && (
              <p className="text-center text-muted-foreground font-body mt-4">
                Brak danych o wizytach w wybranym okresie.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
