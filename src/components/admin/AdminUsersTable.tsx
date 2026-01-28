import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, ChevronLeft, ChevronRight, Loader2, Check, X, Trash2, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  newsletter_consent: boolean | null;
  marketing_consent: boolean | null;
  is_deleted: boolean | null;
  deleted_at: string | null;
}

const PAGE_SIZE = 10;

export function AdminUsersTable() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Get total count
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setTotalCount(count || 0);

      // Get paginated data
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, email, full_name, created_at, newsletter_consent, marketing_consent, is_deleted, deleted_at')
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const canGoBack = page > 0;
  const canGoForward = page < totalPages - 1;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleSoftDelete = async (userId: string) => {
    if (!confirm('Czy na pewno chcesz oznaczyć tego użytkownika jako usuniętego?')) return;
    
    setActionLoading(userId);
    try {
      const { error } = await supabase.rpc('admin_soft_delete_user', { _user_id: userId });
      
      if (error) throw error;
      
      toast({
        title: 'Użytkownik usunięty',
        description: 'Konto zostało oznaczone jako usunięte.',
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się usunąć użytkownika.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestore = async (userId: string) => {
    if (!confirm('Czy na pewno chcesz przywrócić tego użytkownika?')) return;
    
    setActionLoading(userId);
    try {
      const { error } = await supabase.rpc('admin_restore_user', { _user_id: userId });
      
      if (error) throw error;
      
      toast({
        title: 'Użytkownik przywrócony',
        description: 'Konto zostało przywrócone.',
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się przywrócić użytkownika.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Users className="h-5 w-5" />
          Użytkownicy ({totalCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 font-body">
            Brak zarejestrowanych użytkowników.
          </p>
        ) : (
          <>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-display">Email</TableHead>
                    <TableHead className="font-display">Imię i Nazwisko</TableHead>
                    <TableHead className="font-display">Data rejestracji</TableHead>
                    <TableHead className="font-display text-center">Newsletter</TableHead>
                    <TableHead className="font-display text-center">Marketing</TableHead>
                    <TableHead className="font-display text-center">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className={user.is_deleted ? 'opacity-50 bg-muted/30' : ''}>
                      <TableCell className="font-body">
                        {user.email}
                        {user.is_deleted && (
                          <span className="ml-2 text-xs text-destructive">(usunięty)</span>
                        )}
                      </TableCell>
                      <TableCell className="font-body">
                        {user.full_name || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="font-body">{formatDate(user.created_at)}</TableCell>
                      <TableCell className="text-center">
                        {user.newsletter_consent ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {user.marketing_consent ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {user.is_deleted ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRestore(user.user_id)}
                            disabled={actionLoading === user.user_id}
                          >
                            {actionLoading === user.user_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RotateCcw className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSoftDelete(user.user_id)}
                            disabled={actionLoading === user.user_id}
                          >
                            {actionLoading === user.user_id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-destructive" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground font-body">
                Strona {page + 1} z {totalPages || 1}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!canGoBack}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!canGoForward}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
