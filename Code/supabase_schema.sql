-- Create Survey Profile Table 
CREATE TABLE IF NOT EXISTS public.survey_profiles (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    ten_don_vi VARCHAR(255) NOT NULL,
    dia_chi TEXT,
    nguoi_dung_dau VARCHAR(255),
    so_dien_thoai VARCHAR(50),
    email VARCHAR(255),
    so_can_bo INTEGER,
    
    -- Nested JSONB for sections
    ket_noi_internet JSONB DEFAULT '{}'::jsonb,
    thiet_bi_mang JSONB DEFAULT '[]'::jsonb,
    camera JSONB DEFAULT '[]'::jsonb,
    may_chu JSONB DEFAULT '[]'::jsonb,
    ung_dung JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.survey_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all access for now (assuming internal app)
CREATE POLICY "Allow all actions for authenticated users" ON public.survey_profiles
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow read access for anon" ON public.survey_profiles
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Allow insert access for anon" ON public.survey_profiles
    FOR INSERT
    TO anon
    WITH CHECK (true);
    
CREATE POLICY "Allow update access for anon" ON public.survey_profiles
    FOR UPDATE
    TO anon
    USING (true);

-- Create a storage bucket for Survey Images
INSERT INTO storage.buckets (id, name, public) VALUES ('survey_images', 'survey_images', true) ON CONFLICT DO NOTHING;

-- Policy for Storage
CREATE POLICY "Allow public uploads to survey_images" 
ON storage.objects 
FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'survey_images');

CREATE POLICY "Allow public read from survey_images" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'survey_images');
