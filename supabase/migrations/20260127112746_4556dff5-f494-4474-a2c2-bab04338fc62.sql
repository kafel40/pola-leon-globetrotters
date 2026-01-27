-- Add INSERT policy for owned_ebooks so users can add ebooks to their library
CREATE POLICY "Users can add ebooks to their library" 
ON public.owned_ebooks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);