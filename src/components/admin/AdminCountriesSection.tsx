import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useCountryStatuses, type CountryStatusType } from '@/hooks/useCountryStatuses';
import { Loader2, ChevronDown, ChevronRight, Globe, Search, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getPolishName } from '@/lib/countryNames';

const STATUS_OPTIONS: { value: CountryStatusType; label: string; color: string }[] = [
  { value: 'available', label: 'Dostępne', color: 'bg-green-500' },
  { value: 'coming_soon', label: 'Wkrótce', color: 'bg-yellow-500' },
  { value: 'soon', label: 'Niebawem', color: 'bg-orange-400' },
  { value: 'none', label: 'Brak', color: 'bg-gray-400' },
];

const STATUS_BADGE_VARIANTS: Record<CountryStatusType, string> = {
  available: 'bg-green-100 text-green-800 border-green-200',
  coming_soon: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  soon: 'bg-orange-100 text-orange-800 border-orange-200',
  none: 'bg-gray-100 text-gray-600 border-gray-200',
};

export function AdminCountriesSection() {
  const { countryStatuses, loading, updateStatus } = useCountryStatuses();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingCountry, setUpdatingCountry] = useState<string | null>(null);

  // Sort by Polish name and filter
  const sortedCountries = useMemo(() => {
    return [...countryStatuses].sort((a, b) => {
      const nameA = getPolishName(a.country_code);
      const nameB = getPolishName(b.country_code);
      return nameA.localeCompare(nameB, 'pl');
    });
  }, [countryStatuses]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return sortedCountries;
    const query = searchQuery.toLowerCase();
    return sortedCountries.filter(country => {
      const polishName = getPolishName(country.country_code);
      return polishName.toLowerCase().includes(query) ||
        country.country_code.toLowerCase().includes(query);
    });
  }, [sortedCountries, searchQuery]);

  const handleStatusChange = async (countryCode: string, newStatus: CountryStatusType) => {
    setUpdatingCountry(countryCode);
    await updateStatus(countryCode, newStatus);
    setUpdatingCountry(null);
  };

  const statusCounts = useMemo(() => {
    return countryStatuses.reduce((acc, country) => {
      acc[country.status] = (acc[country.status] || 0) + 1;
      return acc;
    }, {} as Record<CountryStatusType, number>);
  }, [countryStatuses]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="font-display flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Zarządzanie krajami ({countryStatuses.length})
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2 text-sm font-normal">
                  <Badge variant="outline" className={STATUS_BADGE_VARIANTS.available}>
                    {statusCounts.available || 0} dostępnych
                  </Badge>
                  <Badge variant="outline" className={STATUS_BADGE_VARIANTS.coming_soon}>
                    {statusCounts.coming_soon || 0} wkrótce
                  </Badge>
                  <Badge variant="outline" className={STATUS_BADGE_VARIANTS.soon}>
                    {statusCounts.soon || 0} niebawem
                  </Badge>
                </div>
                {isOpen ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj kraju..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Countries list */}
            <div className="max-h-[500px] overflow-y-auto space-y-1 pr-2">
              {filteredCountries.map((country) => (
                <div
                  key={country.country_code}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-medium">{getPolishName(country.country_code)}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({country.country_code})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {updatingCountry === country.country_code && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    <Select
                      value={country.status}
                      onValueChange={(value) => handleStatusChange(country.country_code, value as CountryStatusType)}
                      disabled={updatingCountry === country.country_code}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${option.color}`} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}

              {filteredCountries.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nie znaleziono krajów pasujących do wyszukiwania.
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Legenda:</p>
              <div className="flex flex-wrap gap-4 text-sm">
                {STATUS_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${option.color}`} />
                    <span className="text-muted-foreground">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
