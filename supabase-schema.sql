-- Schema untuk Aplikasi Al Muttaqin Master Chef

-- 1. Tabel Participants (Peserta)
CREATE TABLE public.participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    dish_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Judges (Juri/Pengawas)
CREATE TABLE public.judges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'judge',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Scores (Nilai)
CREATE TABLE public.scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
    judge_id UUID NOT NULL REFERENCES public.judges(id) ON DELETE CASCADE,
    taste INTEGER NOT NULL,
    presentation INTEGER NOT NULL,
    creativity INTEGER NOT NULL,
    total INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Memastikan satu juri hanya bisa memberikan nilai satu kali kepada peserta yang sama
    UNIQUE(participant_id, judge_id) 
);

-- 4. Tabel Violation Definitions (Jenis Pelanggaran)
CREATE TABLE public.violation_definitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    penalty_points INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabel Violation Records (Catatan Pelanggaran)
CREATE TABLE public.violation_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
    supervisor_id UUID NOT NULL REFERENCES public.judges(id) ON DELETE CASCADE,
    violation_id UUID NOT NULL REFERENCES public.violation_definitions(id) ON DELETE CASCADE,
    penalty_applied INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Keamanan (Row Level Security)
-- Mengaktifkan RLS
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violation_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violation_records ENABLE ROW LEVEL SECURITY;

-- Membuat policy anonim (mengizinkan akses publik untuk baca/tulis tanpa login)
CREATE POLICY "Allow everything for everyone" ON public.participants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow everything for everyone" ON public.judges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow everything for everyone" ON public.scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow everything for everyone" ON public.violation_definitions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow everything for everyone" ON public.violation_records FOR ALL USING (true) WITH CHECK (true);

-- 7. Mengaktifkan Realtime untuk Dashboard Live
-- Ini diperlukan agar aplikasi bisa mendengarkan perubahan tabel secara instan (WebSocket)
ALTER PUBLICATION supabase_realtime ADD TABLE public.participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.judges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.violation_definitions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.violation_records;
