import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, Ticket } from 'lucide-react';

interface Voucher {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_price: number;
  max_uses: number | null;
  max_uses_per_user: number;
  used_count: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  ebook_id: string | null;
  created_at: string;
}

interface EbookOption {
  id: string;
  title: string;
}

export function AdminVouchersSection() {
  const { toast } = useToast();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [ebooks, setEbooks] = useState<EbookOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('10');
  const [minPrice, setMinPrice] = useState('0');
  const [maxUses, setMaxUses] = useState('');
  const [maxUsesPerUser, setMaxUsesPerUser] = useState('1');
  const [validFrom, setValidFrom] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [ebookId, setEbookId] = useState<string>('all');

  useEffect(() => {
    fetchVouchers();
    fetchEbooks();
  }, []);

  const fetchVouchers = async () => {
    const { data, error } = await supabase
      .from('vouchers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Błąd', description: 'Nie udało się pobrać voucherów', variant: 'destructive' });
    } else {
      setVouchers((data as Voucher[]) || []);
    }
    setLoading(false);
  };

  const fetchEbooks = async () => {
    const { data } = await supabase
      .from('ebooks')
      .select('id, title')
      .order('title');

    if (data) {
      setEbooks(data);
    }
  };

  const resetForm = () => {
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('10');
    setMinPrice('0');
    setMaxUses('');
    setMaxUsesPerUser('1');
    setValidFrom(new Date().toISOString().split('T')[0]);
    setValidUntil('');
    setIsActive(true);
    setEbookId('all');
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const voucherData = {
        code: code.toUpperCase().trim(),
        discount_type: discountType as 'percentage' | 'fixed',
        discount_value: parseFloat(discountValue) || 0,
        min_price: parseFloat(minPrice) || 0,
        max_uses: maxUses ? parseInt(maxUses) : null,
        max_uses_per_user: parseInt(maxUsesPerUser) || 1,
        valid_from: new Date(validFrom).toISOString(),
        valid_until: validUntil ? new Date(validUntil + 'T23:59:59').toISOString() : null,
        is_active: isActive,
        ebook_id: ebookId === 'all' ? null : ebookId,
      };

      if (editingId) {
        const { error } = await supabase
          .from('vouchers')
          .update(voucherData)
          .eq('id', editingId);

        if (error) throw error;
        toast({ title: 'Sukces', description: 'Voucher został zaktualizowany' });
      } else {
        const { error } = await supabase
          .from('vouchers')
          .insert(voucherData);

        if (error) {
          if (error.message?.includes('idx_vouchers_code_unique')) {
            toast({ title: 'Błąd', description: 'Kod o tej nazwie już istnieje', variant: 'destructive' });
            setSaving(false);
            return;
          }
          throw error;
        }
        toast({ title: 'Sukces', description: 'Voucher został utworzony' });
      }

      resetForm();
      fetchVouchers();
    } catch (error: any) {
      console.error('Save voucher error:', error);
      toast({ title: 'Błąd', description: error.message || 'Nie udało się zapisać vouchera', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (voucher: Voucher) => {
    setCode(voucher.code);
    setDiscountType(voucher.discount_type);
    setDiscountValue(String(voucher.discount_value));
    setMinPrice(String(voucher.min_price));
    setMaxUses(voucher.max_uses ? String(voucher.max_uses) : '');
    setMaxUsesPerUser(String(voucher.max_uses_per_user));
    setValidFrom(voucher.valid_from.split('T')[0]);
    setValidUntil(voucher.valid_until ? voucher.valid_until.split('T')[0] : '');
    setIsActive(voucher.is_active);
    setEbookId(voucher.ebook_id || 'all');
    setEditingId(voucher.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten voucher?')) return;

    const { error } = await supabase.from('vouchers').delete().eq('id', id);

    if (error) {
      toast({ title: 'Błąd', description: 'Nie udało się usunąć vouchera', variant: 'destructive' });
    } else {
      toast({ title: 'Usunięto', description: 'Voucher został usunięty' });
      fetchVouchers();
    }
  };

  const getStatusBadge = (voucher: Voucher) => {
    if (!voucher.is_active) {
      return <Badge variant="secondary">Nieaktywny</Badge>;
    }
    if (voucher.valid_until && new Date(voucher.valid_until) < new Date()) {
      return <Badge variant="destructive">Wygasły</Badge>;
    }
    if (voucher.max_uses && voucher.used_count >= voucher.max_uses) {
      return <Badge variant="outline">Wykorzystany</Badge>;
    }
    return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">Aktywny</Badge>;
  };

  const getEbookTitle = (ebookId: string | null) => {
    if (!ebookId) return 'Wszystkie';
    const ebook = ebooks.find(e => e.id === ebookId);
    return ebook?.title || 'Nieznana';
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            {isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {isEditing ? 'Edytuj voucher' : 'Nowy voucher'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voucher-code">Kod vouchera</Label>
              <Input
                id="voucher-code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="np. LATO2025"
                required
                className="font-mono uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Typ zniżki</Label>
                <Select value={discountType} onValueChange={(v) => setDiscountType(v as 'percentage' | 'fixed')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Procentowa (%)</SelectItem>
                    <SelectItem value="fixed">Kwotowa (PLN)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount-value">
                  Wartość {discountType === 'percentage' ? '(%)' : '(PLN)'}
                </Label>
                <Input
                  id="discount-value"
                  type="number"
                  step={discountType === 'percentage' ? '1' : '0.01'}
                  min="0"
                  max={discountType === 'percentage' ? '100' : undefined}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-price">Min. cena bajki (PLN)</Label>
              <Input
                id="min-price"
                type="number"
                step="0.01"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Kod zadziała tylko na bajki o cenie równej lub wyższej</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max-uses">Maks. użyć (ogólnie)</Label>
                <Input
                  id="max-uses"
                  type="number"
                  min="1"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Bez limitu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-uses-per-user">Maks. użyć / użytkownik</Label>
                <Input
                  id="max-uses-per-user"
                  type="number"
                  min="1"
                  value={maxUsesPerUser}
                  onChange={(e) => setMaxUsesPerUser(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valid-from">Ważny od</Label>
                <Input
                  id="valid-from"
                  type="date"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valid-until">Ważny do</Label>
                <Input
                  id="valid-until"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  placeholder="Bezterminowo"
                />
                <p className="text-xs text-muted-foreground">Puste = bezterminowo</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dotyczy bajki</Label>
              <Select value={ebookId} onValueChange={setEbookId}>
                <SelectTrigger>
                  <SelectValue placeholder="Wszystkie bajki" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie bajki</SelectItem>
                  {ebooks.map((ebook) => (
                    <SelectItem key={ebook.id} value={ebook.id}>
                      {ebook.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Switch
                id="voucher-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="voucher-active">Aktywny</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Zapisywanie...
                  </>
                ) : (
                  <>
                    <Ticket className="mr-2 h-4 w-4" />
                    {isEditing ? 'Zaktualizuj' : 'Utwórz voucher'}
                  </>
                )}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Anuluj
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Vouchers list */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Vouchery ({vouchers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : vouchers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Brak voucherów. Utwórz pierwszy!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kod</TableHead>
                    <TableHead>Zniżka</TableHead>
                    <TableHead>Użycia</TableHead>
                    <TableHead>Bajka</TableHead>
                    <TableHead>Ważność</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vouchers.map((voucher) => (
                    <TableRow key={voucher.id}>
                      <TableCell className="font-mono font-semibold">
                        {voucher.code}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          voucher.discount_type === 'percentage'
                            ? 'border-primary/30 text-primary'
                            : 'border-accent-foreground/30 text-accent-foreground'
                        }>
                          {voucher.discount_type === 'percentage'
                            ? `${voucher.discount_value}%`
                            : `${voucher.discount_value.toFixed(2)} PLN`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {voucher.used_count}
                          {voucher.max_uses ? `/${voucher.max_uses}` : ''}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground truncate max-w-[120px] block">
                          {getEbookTitle(voucher.ebook_id)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {voucher.valid_until
                            ? new Date(voucher.valid_until).toLocaleDateString('pl-PL')
                            : '∞'}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(voucher)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(voucher)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(voucher.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
