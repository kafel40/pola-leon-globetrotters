import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageHead } from '@/components/seo/PageHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, Heart, Send, Home } from 'lucide-react';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Imię jest wymagane').max(100, 'Imię może mieć maksymalnie 100 znaków'),
  email: z.string().trim().email('Nieprawidłowy adres email').max(255, 'Email może mieć maksymalnie 255 znaków'),
  subject: z.string().trim().min(1, 'Temat jest wymagany').max(200, 'Temat może mieć maksymalnie 200 znaków'),
  message: z.string().trim().min(10, 'Wiadomość musi mieć minimum 10 znaków').max(2000, 'Wiadomość może mieć maksymalnie 2000 znaków'),
});

const subjectOptions = [
  { value: 'opinia', label: 'Opinia' },
  { value: 'sugestia', label: 'Sugestia' },
  { value: 'problem', label: 'Problem techniczny' },
  { value: 'inny', label: 'Inny temat' },
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const validation = contactSchema.safeParse({ name, email, subject, message });
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({
        title: 'Błąd walidacji',
        description: firstError.message,
        variant: 'destructive',
      });
      return;
    }

    setSending(true);

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert({
          name: validation.data.name,
          email: validation.data.email,
          subject: validation.data.subject,
          message: validation.data.message,
          newsletter_consent: newsletterConsent,
        });

      if (dbError) throw dbError;

      // Send notification email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: validation.data.name,
          email: validation.data.email,
          subject: validation.data.subject,
          message: validation.data.message,
          newsletterConsent,
        },
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't throw - message was saved, just email failed
      }

      // If user opted in for newsletter, subscribe them
      if (newsletterConsent) {
        await supabase.functions.invoke('subscribe-newsletter', {
          body: { email: validation.data.email },
        });
      }

      setSent(true);
      toast({
        title: 'Wiadomość wysłana!',
        description: 'Dziękujemy za kontakt. Odpowiemy najszybciej jak to możliwe.',
      });

      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setNewsletterConsent(false);
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się wysłać wiadomości. Spróbuj ponownie.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <PageHead 
        title="Kontakt"
        description="Skontaktuj się z zespołem Pola i Leon. Chętnie odpowiemy na pytania, rozwiążemy problemy lub wysłuchamy Twoich sugestii."
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
              <Mail className="h-4 w-4 text-accent-foreground" />
              <span className="text-sm font-body font-medium text-muted-foreground">
                Kontakt
              </span>
            </div>
            
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Napisz do nas <span className="text-gradient">- chętnie pomożemy!</span>
            </h1>
            
            <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
              Chętnie rozwiążemy Twoje problemy lub wysłuchamy sugestii. Jeśli chcesz nam 
              coś podpowiedzieć lub podzielić się swoją opinią - napisz do nas! 
              Każda wiadomość pomaga nam tworzyć lepsze miejsce dla rodzin.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container">
          <div className="max-w-xl mx-auto">
            {sent ? (
              <Card className="text-center py-12">
                <CardContent className="space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-dreamy-mint mx-auto">
                    <Heart className="h-10 w-10 text-foreground/70" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Dziękujemy za wiadomość!
                  </h2>
                  <p className="text-muted-foreground font-body">
                    Odpowiemy najszybciej jak to możliwe. Sprawdź swoją skrzynkę pocztową.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={() => setSent(false)}>
                      Wyślij kolejną wiadomość
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/">
                        <Home className="mr-2 h-4 w-4" />
                        Powrót do strony głównej
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Formularz kontaktowy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Imię *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Twoje imię"
                        required
                        maxLength={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="twoj@email.pl"
                        required
                        maxLength={255}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Temat *</Label>
                      <Select value={subject} onValueChange={setSubject} required>
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Wybierz temat wiadomości" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.label}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Wiadomość *</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Twoja wiadomość..."
                        rows={5}
                        required
                        maxLength={2000}
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {message.length}/2000 znaków
                      </p>
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <Checkbox
                        id="newsletter"
                        checked={newsletterConsent}
                        onCheckedChange={(checked) => setNewsletterConsent(!!checked)}
                      />
                      <Label htmlFor="newsletter" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                        Chcę otrzymywać newsletter z poradami dla rodziców i informacjami o nowych bajkach
                      </Label>
                    </div>

                    <Button type="submit" disabled={sending} className="w-full font-display" size="lg">
                      {sending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Wysyłanie...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Wyślij wiadomość
                        </>
                      )}
                    </Button>

                    <div className="flex justify-center pt-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/">
                          <Home className="mr-2 h-4 w-4" />
                          Powrót do strony głównej
                        </Link>
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center pt-2">
                      Wysyłając wiadomość, akceptujesz naszą{' '}
                      <a href="/prawne?tab=polityka" className="underline hover:text-foreground">
                        politykę prywatności
                      </a>.
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
