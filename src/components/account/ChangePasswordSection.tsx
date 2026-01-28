import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const passwordSchema = z.object({
  newPassword: z.string().min(6, { message: 'Hasło musi mieć minimum 6 znaków' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Hasła nie są identyczne',
  path: ['confirmPassword'],
});

export function ChangePasswordSection() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = passwordSchema.safeParse({ newPassword, confirmPassword });
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof fieldErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        toast({
          title: 'Błąd',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Hasło zmienione!',
        description: 'Twoje hasło zostało pomyślnie zaktualizowane.',
      });

      // Reset form
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Password update error:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się zmienić hasła. Spróbuj ponownie.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-3xl shadow-card border border-border/50 p-6 md:p-8">
      <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        Bezpieczeństwo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="font-body flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            Nowe hasło
          </Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Minimum 6 znaków"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
            className="h-12 rounded-xl font-body"
          />
          {errors.newPassword && (
            <p className="text-sm text-destructive">{errors.newPassword}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmNewPassword" className="font-body flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            Potwierdź nowe hasło
          </Label>
          <Input
            id="confirmNewPassword"
            type="password"
            placeholder="Powtórz hasło"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            className="h-12 rounded-xl font-body"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={isLoading || (!newPassword && !confirmPassword)}
          className="w-full h-12 rounded-xl font-display"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Zapisywanie...
            </>
          ) : (
            'Zmień hasło'
          )}
        </Button>
      </form>
    </div>
  );
}
