-- Migration SQL for Topik Materi Pembelajaran & SKS Breakdown (TPK: Teori, Praktikum, Kerja Lapangan)

-- 1. Add SKS breakdown columns to mata_kuliah table
ALTER TABLE mata_kuliah ADD COLUMN IF NOT EXISTS sks_teori integer DEFAULT 0;
ALTER TABLE mata_kuliah ADD COLUMN IF NOT EXISTS sks_praktikum integer DEFAULT 0;
ALTER TABLE mata_kuliah ADD COLUMN IF NOT EXISTS sks_lapangan integer DEFAULT 0;

-- 2. Create table topik_materi_pembelajaran
CREATE TABLE IF NOT EXISTS topik_materi_pembelajaran (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  mata_kuliah_id uuid REFERENCES mata_kuliah(id) ON DELETE CASCADE NOT NULL,
  urutan integer DEFAULT 1,
  nama text NOT NULL,
  kedalaman_k integer DEFAULT 0, -- Kognitif
  kedalaman_a integer DEFAULT 0, -- Afektif
  kedalaman_p integer DEFAULT 0, -- Psikomotorik
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS on topik_materi_pembelajaran
ALTER TABLE topik_materi_pembelajaran ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations for anon" ON topik_materi_pembelajaran;
CREATE POLICY "Allow all operations for anon" ON topik_materi_pembelajaran FOR ALL USING (true) WITH CHECK (true);
