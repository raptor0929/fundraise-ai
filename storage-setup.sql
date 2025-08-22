-- Storage Buckets Setup for Fundraise Project
-- This file sets up storage buckets for uploading PDF and CSV files

-- Create bucket for general documents (PDF and CSV files)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true, -- public bucket for downloads
  52428800, -- 50MB file size limit
  ARRAY['application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
);

-- Create bucket specifically for pitch decks
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pitch-decks',
  'pitch-decks',
  true, -- public bucket for downloads
  52428800, -- 50MB file size limit
  ARRAY['application/pdf']
);

-- Create bucket specifically for funds lists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'funds-lists',
  'funds-lists',
  true, -- public bucket for downloads
  52428800, -- 50MB file size limit
  ARRAY['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
);

-- Create RLS policies for the documents bucket
-- Public read access, authenticated users can upload/update/delete their own files
CREATE POLICY "Public read access for documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create RLS policies for the pitch-decks bucket
-- Public read access, authenticated users can upload/update/delete their own files
CREATE POLICY "Public read access for pitch decks" ON storage.objects
  FOR SELECT USING (bucket_id = 'pitch-decks');

CREATE POLICY "Users can upload their own pitch decks" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'pitch-decks' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own pitch decks" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'pitch-decks' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own pitch decks" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'pitch-decks' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create RLS policies for the funds-lists bucket
-- Public read access, authenticated users can upload/update/delete their own files
CREATE POLICY "Public read access for funds lists" ON storage.objects
  FOR SELECT USING (bucket_id = 'funds-lists');

CREATE POLICY "Users can upload their own funds lists" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'funds-lists' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own funds lists" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'funds-lists' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own funds lists" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'funds-lists' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
