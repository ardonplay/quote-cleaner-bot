-- Create table for processed files
CREATE TABLE IF NOT EXISTS public.processed_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  original_content TEXT NOT NULL,
  processed_content TEXT NOT NULL,
  original_line_count INTEGER NOT NULL,
  processed_line_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.processed_files ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public app)
CREATE POLICY "Anyone can insert processed files" 
ON public.processed_files 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to view processed files
CREATE POLICY "Anyone can view processed files" 
ON public.processed_files 
FOR SELECT 
USING (true);

-- Create index for faster queries
CREATE INDEX idx_processed_files_created_at ON public.processed_files(created_at DESC);