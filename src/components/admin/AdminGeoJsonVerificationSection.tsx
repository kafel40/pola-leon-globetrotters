import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronDown, ChevronRight, Search, CheckCircle2, XCircle, MapPinned } from 'lucide-react';
import { getPolishName } from '@/lib/countryNames';
import { getCountryCode } from '@/components/map/WorldMapLeaflet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Feature, FeatureCollection } from 'geojson';

interface CountryFromGeoJson {
  code: string;
  polishName: string;
  englishName: string;
  hasPolishName: boolean;
}

export function AdminGeoJsonVerificationSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);

  // Load GeoJSON data
  useEffect(() => {
    if (!isOpen) return;
    
    setLoading(true);
    fetch('/world-110m.geojson')
      .then(res => res.json())
      .then((data: FeatureCollection) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load GeoJSON:', err);
        setLoading(false);
      });
  }, [isOpen]);

  // Extract all countries from GeoJSON
  const countriesFromGeoJson = useMemo((): CountryFromGeoJson[] => {
    if (!geoData) return [];
    
    const countriesMap = new Map<string, CountryFromGeoJson>();
    
    geoData.features.forEach((feature: Feature) => {
      const code = getCountryCode(feature);
      const props = feature.properties || {};
      const englishName = props.ADMIN || props.NAME || props.name || 'Unknown';
      
      if (code && !countriesMap.has(code)) {
        const polishName = getPolishName(code);
        countriesMap.set(code, {
          code,
          polishName,
          englishName,
          hasPolishName: polishName !== code,
        });
      }
    });
    
    return Array.from(countriesMap.values()).sort((a, b) => 
      a.polishName.localeCompare(b.polishName, 'pl')
    );
  }, [geoData]);

  // Filter countries
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countriesFromGeoJson;
    const query = searchQuery.toLowerCase();
    return countriesFromGeoJson.filter(country => 
      country.polishName.toLowerCase().includes(query) ||
      country.englishName.toLowerCase().includes(query) ||
      country.code.toLowerCase().includes(query)
    );
  }, [countriesFromGeoJson, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = countriesFromGeoJson.length;
    const withPolish = countriesFromGeoJson.filter(c => c.hasPolishName).length;
    const withoutPolish = total - withPolish;
    return { total, withPolish, withoutPolish };
  }, [countriesFromGeoJson]);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="font-display flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPinned className="h-5 w-5" />
                Weryfikacja krajów z mapy
              </div>
              <div className="flex items-center gap-4">
                {!loading && geoData && (
                  <div className="flex gap-2 text-sm font-normal">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      {stats.total} krajów
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      {stats.withPolish} z polską nazwą
                    </Badge>
                    {stats.withoutPolish > 0 && (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                        {stats.withoutPolish} brak tłumaczenia
                      </Badge>
                    )}
                  </div>
                )}
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Szukaj kraju (po polsku, angielsku lub kodzie ISO)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Countries table */}
                <div className="max-h-[500px] overflow-y-auto border rounded-lg">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background">
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Nazwa polska</TableHead>
                        <TableHead>Nazwa angielska (GeoJSON)</TableHead>
                        <TableHead className="w-24">Kod ISO</TableHead>
                        <TableHead className="w-24 text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCountries.map((country, index) => (
                        <TableRow key={country.code}>
                          <TableCell className="text-muted-foreground text-sm">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {country.polishName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {country.englishName}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {country.code}
                            </code>
                          </TableCell>
                          <TableCell className="text-center">
                            {country.hasPolishName ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredCountries.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nie znaleziono krajów pasujących do wyszukiwania.
                  </div>
                )}

                {/* Legend */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Legenda:</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-muted-foreground">Polska nazwa dostępna</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-muted-foreground">Brak polskiej nazwy (wyświetlany kod)</span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  <p>
                    Ta lista pokazuje wszystkie kraje załadowane z pliku GeoJSON mapy. 
                    Kraje oznaczone na czerwono wymagają dodania polskiego tłumaczenia w pliku 
                    <code className="mx-1 bg-background px-1 rounded">src/lib/countryNames.ts</code>.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
