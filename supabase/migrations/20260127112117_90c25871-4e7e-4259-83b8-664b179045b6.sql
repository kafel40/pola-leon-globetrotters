-- Add audio_url column to ebooks table for audiobook support
ALTER TABLE public.ebooks ADD COLUMN audio_url TEXT;