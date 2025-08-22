-- Update Storage Policies for Anonymous Uploads
-- This allows the dashboard to work without Supabase Auth

-- Drop existing policies for documents bucket
DROP POLICY IF EXISTS "Public read access for documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Drop existing policies for pitch-decks bucket
DROP POLICY IF EXISTS "Public read access for pitch decks" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own pitch decks" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own pitch decks" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own pitch decks" ON storage.objects;

-- Drop existing policies for funds-lists bucket
DROP POLICY IF EXISTS "Public read access for funds lists" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own funds lists" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own funds lists" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own funds lists" ON storage.objects;

-- Create new policies that allow anonymous uploads and public reads

-- Documents bucket policies
CREATE POLICY "Public read access for documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Anonymous upload for documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Anonymous update for documents" ON storage.objects
  FOR UPDATE USING (bucket_id = 'documents');

CREATE POLICY "Anonymous delete for documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents');

-- Pitch-decks bucket policies
CREATE POLICY "Public read access for pitch decks" ON storage.objects
  FOR SELECT USING (bucket_id = 'pitch-decks');

CREATE POLICY "Anonymous upload for pitch decks" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pitch-decks');

CREATE POLICY "Anonymous update for pitch decks" ON storage.objects
  FOR UPDATE USING (bucket_id = 'pitch-decks');

CREATE POLICY "Anonymous delete for pitch decks" ON storage.objects
  FOR DELETE USING (bucket_id = 'pitch-decks');

-- Funds-lists bucket policies
CREATE POLICY "Public read access for funds lists" ON storage.objects
  FOR SELECT USING (bucket_id = 'funds-lists');

CREATE POLICY "Anonymous upload for funds lists" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'funds-lists');

CREATE POLICY "Anonymous update for funds lists" ON storage.objects
  FOR UPDATE USING (bucket_id = 'funds-lists');

CREATE POLICY "Anonymous delete for funds lists" ON storage.objects
  FOR DELETE USING (bucket_id = 'funds-lists');
