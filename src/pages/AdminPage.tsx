import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Edit, Upload, BookOpen, LayoutDashboard, Users, Megaphone, FileText, Palette, Globe } from 'lucide-react';
import { countries } from '@/data/countries';
import { Link, Navigate } from 'react-router-dom';
import { AdminKPISection } from '@/components/admin/AdminKPISection';
import { AdminUsersTable } from '@/components/admin/AdminUsersTable';
import { AdminAnnouncementSection } from '@/components/admin/AdminAnnouncementSection';
import { AdminVisitsChart } from '@/components/admin/AdminVisitsChart';
import { AdminBlogSection } from '@/components/admin/AdminBlogSection';
import { AdminCountriesSection } from '@/components/admin/AdminCountriesSection';
import { AdminGeoJsonVerificationSection } from '@/components/admin/AdminGeoJsonVerificationSection';

interface Ebook {
  id: string;
  title: string;
  slug: string;
  country_slug: string;
  description: string | null;
  age_group: string | null;
  cover_image_url: string | null;
  pdf_url: string | null;
  epub_url: string | null;
  audio_url: string | null;
  coloring_page_url: string | null;
  price: number | null;
  is_published: boolean | null;
  created_at: string;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();

  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [countrySlug, setCountrySlug] = useState('');
  const [description, setDescription] = useState('');
  const [ageGroup, setAgeGroup] = useState('2-6');
  const [price, setPrice] = useState('0');
  const [isPublished, setIsPublished] = useState(true);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [epubFile, setEpubFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coloringFile, setColoringFile] = useState<File | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchEbooks();
    }
  }, [isAdmin]);

  const fetchEbooks = async () => {
    const { data, error } = await supabase
      .from('ebooks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Błąd', description: 'Nie udało się pobrać bajek', variant: 'destructive' });
    } else {
      setEbooks(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setCountrySlug('');
    setDescription('');
    setAgeGroup('2-6');
    setPrice('0');
    setIsPublished(true);
    setCoverFile(null);
    setPdfFile(null);
    setEpubFile(null);
    setAudioFile(null);
    setColoringFile(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
      .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
      .replace(/ś/g, 's').replace(/ź/g, 'z').replace(/ż/g, 'z')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    console.log(`Uploading file to: ${fileName}`);
    
    const { error } = await supabase.storage
      .from('ebooks')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      toast({ 
        title: 'Błąd uploadu', 
        description: `Nie udało się przesłać pliku ${file.name}: ${error.message}`, 
        variant: 'destructive' 
      });
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log(`File uploaded successfully: ${fileName}`);

    // For covers, return public URL (allowed by storage policy)
    // For pdf/epub, return just the path - access is controlled via edge function
    if (folder === 'covers') {
      const { data } = supabase.storage.from('ebooks').getPublicUrl(fileName);
      return data.publicUrl;
    } else {
      return fileName; // Store just the path for secure access via edge function
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let coverUrl = null;
      let pdfUrl = null;
      let epubUrl = null;
      let audioUrl = null;
      let coloringUrl = null;

      if (coverFile) {
        coverUrl = await uploadFile(coverFile, 'covers');
      }
      if (pdfFile) {
        pdfUrl = await uploadFile(pdfFile, 'pdf');
      }
      if (epubFile) {
        epubUrl = await uploadFile(epubFile, 'epub');
      }
      if (audioFile) {
        audioUrl = await uploadFile(audioFile, 'audio');
      }
      if (coloringFile) {
        coloringUrl = await uploadFile(coloringFile, 'coloring');
      }

      const ebookData = {
        title,
        slug: slug || generateSlug(title),
        country_slug: countrySlug,
        description,
        age_group: ageGroup,
        price: parseFloat(price) || 0,
        is_published: isPublished,
        ...(coverUrl && { cover_image_url: coverUrl }),
        ...(pdfUrl && { pdf_url: pdfUrl }),
        ...(epubUrl && { epub_url: epubUrl }),
        ...(audioUrl && { audio_url: audioUrl }),
        ...(coloringUrl && { coloring_page_url: coloringUrl }),
      };

      console.log('Saving ebook data:', ebookData);
      
      if (editingId) {
        const { data, error } = await supabase
          .from('ebooks')
          .update(ebookData)
          .eq('id', editingId)
          .select();

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        console.log('Updated ebook:', data);
        toast({ title: 'Sukces', description: 'Bajka została zaktualizowana' });
      } else {
        const { data, error } = await supabase
          .from('ebooks')
          .insert(ebookData)
          .select();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('Inserted ebook:', data);
        toast({ title: 'Sukces', description: 'Bajka została dodana' });
      }

      resetForm();
      fetchEbooks();
    } catch (error: any) {
      console.error('Save error:', error);
      toast({ 
        title: 'Błąd zapisu', 
        description: `Nie udało się zapisać bajki: ${error.message}`, 
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (ebook: Ebook) => {
    setTitle(ebook.title);
    setSlug(ebook.slug);
    setCountrySlug(ebook.country_slug);
    setDescription(ebook.description || '');
    setAgeGroup(ebook.age_group || '2-6');
    setPrice(String(ebook.price || 0));
    setIsPublished(ebook.is_published || false);
    setEditingId(ebook.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę bajkę?')) return;

    const { error } = await supabase.from('ebooks').delete().eq('id', id);

    if (error) {
      toast({ title: 'Błąd', description: 'Nie udało się usunąć bajki', variant: 'destructive' });
    } else {
      toast({ title: 'Usunięto', description: 'Bajka została usunięta' });
      fetchEbooks();
    }
  };

  if (authLoading || adminLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/logowanie" replace />;
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Brak dostępu</h1>
          <p className="text-muted-foreground mb-4">Nie masz uprawnień administratora.</p>
          <Button asChild>
            <Link to="/">Wróć na stronę główną</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const availableCountries = countries.filter(c => c.status === 'available');

  return (
    <Layout>
      <section className="py-12 bg-hero min-h-screen">
        <div className="container">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Panel Administratora
            </h1>
            <p className="text-muted-foreground">Zarządzaj serwisem Poli i Leona</p>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-flex">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="countries" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Kraje</span>
              </TabsTrigger>
              <TabsTrigger value="ebooks" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Bajki</span>
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Blog</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Użytkownicy</span>
              </TabsTrigger>
              <TabsTrigger value="announcement" className="flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                <span className="hidden sm:inline">Ogłoszenia</span>
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard">
              <AdminKPISection />
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <AdminVisitsChart />
                <AdminAnnouncementSection />
              </div>
            </TabsContent>

            {/* Countries Tab */}
            <TabsContent value="countries" className="space-y-6">
              <AdminCountriesSection />
              <AdminGeoJsonVerificationSection />
            </TabsContent>

            {/* Blog Tab */}
            <TabsContent value="blog">
              <AdminBlogSection />
            </TabsContent>

            {/* Ebooks Tab */}
            <TabsContent value="ebooks">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Form */}
                <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  {isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  {isEditing ? 'Edytuj bajkę' : 'Dodaj nową bajkę'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tytuł bajki</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (!editingId) setSlug(generateSlug(e.target.value));
                      }}
                      placeholder="np. Przygoda w Krakowie"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="np. przygoda-w-krakowie"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Kraj</Label>
                    <Select value={countrySlug} onValueChange={setCountrySlug} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz kraj" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCountries.map((country) => (
                          <SelectItem key={country.id} value={country.slug}>
                            {country.flagEmoji} {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Opis przygody</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Krótki opis przygody Poli i Leona..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ageGroup">Grupa wiekowa</Label>
                      <Select value={ageGroup} onValueChange={setAgeGroup}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2-4">2-4 lata</SelectItem>
                          <SelectItem value="2-6">2-6 lat</SelectItem>
                          <SelectItem value="4-6">4-6 lat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Cena (PLN)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="cover">Okładka (JPG/PNG)</Label>
                      <Input
                        id="cover"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pdf">Plik PDF</Label>
                      <Input
                        id="pdf"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="epub">Plik EPUB</Label>
                      <Input
                        id="epub"
                        type="file"
                        accept=".epub"
                        onChange={(e) => setEpubFile(e.target.files?.[0] || null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="audio">Audiobook (MP3)</Label>
                      <Input
                        id="audio"
                        type="file"
                        accept=".mp3,audio/*"
                        onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coloring" className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Kolorowanka (PDF/Obraz)
                      </Label>
                      <Input
                        id="coloring"
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => setColoringFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Switch
                      id="published"
                      checked={isPublished}
                      onCheckedChange={setIsPublished}
                    />
                    <Label htmlFor="published">Opublikowana</Label>
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
                          <Upload className="mr-2 h-4 w-4" />
                          {isEditing ? 'Zaktualizuj' : 'Dodaj bajkę'}
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

            {/* Ebooks list */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Lista bajek ({ebooks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : ebooks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Brak bajek. Dodaj pierwszą!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {ebooks.map((ebook) => (
                      <div
                        key={ebook.id}
                        className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow"
                      >
                        {ebook.cover_image_url && (
                          <img
                            src={ebook.cover_image_url}
                            alt={ebook.title}
                            className="w-16 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{ebook.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {countries.find(c => c.slug === ebook.country_slug)?.flagEmoji}{' '}
                            {countries.find(c => c.slug === ebook.country_slug)?.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              ebook.is_published 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {ebook.is_published ? 'Opublikowana' : 'Szkic'}
                            </span>
                            {ebook.pdf_url && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                PDF
                              </span>
                            )}
                            {ebook.epub_url && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                EPUB
                              </span>
                            )}
                            {ebook.audio_url && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                                🎧 Audio
                              </span>
                            )}
                            {ebook.price && ebook.price > 0 && (
                              <span className="text-xs text-muted-foreground">
                                {ebook.price} PLN
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(ebook)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(ebook.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <AdminUsersTable />
        </TabsContent>

        {/* Announcement Tab */}
        <TabsContent value="announcement">
          <AdminAnnouncementSection />
        </TabsContent>
      </Tabs>
        </div>
      </section>
    </Layout>
  );
}
