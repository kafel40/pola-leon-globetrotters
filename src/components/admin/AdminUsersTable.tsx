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
import { Users, ChevronLeft, ChevronRight, Loader2, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  newsletter_consent: boolean | null;
  marketing_consent: boolean | null;
}

const PAGE_SIZE = 10;

export function AdminUsersTable() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

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
        .select('id, email, full_name, created_at, newsletter_consent, marketing_consent')
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-body">{user.email}</TableCell>
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
