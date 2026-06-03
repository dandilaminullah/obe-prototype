-- =========================================================================
-- SCRIPT MIGRATION & SEEDER
-- Penyesuaian IKU (Kepmendiktisaintek Nomor 358/M/KEP/2025)
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. SQL COMMANDS (MIGRATION / ALTER TABLES)
-- -------------------------------------------------------------------------

-- Menambahkan tagging SDGs (IKU 7) pada tabel CPL
ALTER TABLE cpl 
ADD COLUMN IF NOT EXISTS sdgs text[];

-- Menambahkan metode pembelajaran (IKU 5) dan tautan MoU pada tabel Mata Kuliah
ALTER TABLE mata_kuliah 
ADD COLUMN IF NOT EXISTS metode_pembelajaran text default 'REGULAR',
ADD COLUMN IF NOT EXISTS tautan_mou text;

-- Membuat tabel Grading Audit Trail untuk riwayat perubahan nilai (IKU 11)
CREATE TABLE IF NOT EXISTS grading_audit_trail (
  id uuid primary key default uuid_generate_v4(),
  nilai_id uuid references nilai(id) on delete cascade not null,
  nilai_lama decimal(5,2) not null,
  nilai_baru decimal(5,2) not null,
  alasan text not null,
  ip_address text,
  user_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Membuat tabel Rencana Aksi Perbaikan untuk CQI / AMI
CREATE TABLE IF NOT EXISTS rencana_aksi_perbaikan (
  id uuid primary key default uuid_generate_v4(),
  mata_kuliah_id uuid references mata_kuliah(id) on delete cascade not null,
  analisis_kesenjangan text not null,
  rencana_perbaikan text not null,
  target_semester text not null,
  status text default 'DRAFT',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mengaktifkan RLS (Row Level Security) untuk tabel baru
ALTER TABLE grading_audit_trail ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for anon" ON grading_audit_trail FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE rencana_aksi_perbaikan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for anon" ON rencana_aksi_perbaikan FOR ALL USING (true) WITH CHECK (true);


-- -------------------------------------------------------------------------
-- 2. SEEDER DATA (DUMMY DATA)
-- -------------------------------------------------------------------------

-- Seeder untuk SDGs pada CPL yang sudah ada
-- (Pastikan data cpl sudah ada, ini akan mengupdate CPL teratas)
UPDATE cpl 
SET sdgs = ARRAY['SDG4', 'SDG8', 'SDG9'] 
WHERE id IN (
  SELECT id FROM cpl ORDER BY kode ASC LIMIT 1
);

UPDATE cpl 
SET sdgs = ARRAY['SDG5', 'SDG10'] 
WHERE id IN (
  SELECT id FROM cpl ORDER BY kode ASC OFFSET 1 LIMIT 1
);

-- Seeder untuk IKU 5 (Metode Pembelajaran TBP & CM) pada Mata Kuliah
UPDATE mata_kuliah 
SET 
  metode_pembelajaran = 'TBP', 
  tautan_mou = 'https://drive.google.com/file/d/contoh-mou-tbp/view'
WHERE id IN (
  SELECT id FROM mata_kuliah ORDER BY kode ASC LIMIT 1
);

UPDATE mata_kuliah 
SET 
  metode_pembelajaran = 'CM', 
  tautan_mou = 'https://drive.google.com/file/d/contoh-mou-cm/view'
WHERE id IN (
  SELECT id FROM mata_kuliah ORDER BY kode ASC OFFSET 1 LIMIT 1
);

-- Seeder untuk Rencana Aksi Perbaikan (CQI)
INSERT INTO rencana_aksi_perbaikan 
  (mata_kuliah_id, analisis_kesenjangan, rencana_perbaikan, target_semester, status)
SELECT 
  id, 
  'Berdasarkan evaluasi akhir semester, 45% mahasiswa mendapatkan nilai di bawah standar pada Sub-CPMK perancangan arsitektur sistem.', 
  'Menambahkan 2 sesi studi kasus riil (Case Method) dan asisten praktikum ekstra untuk pendampingan desain arsitektur.', 
  'Ganjil 2026/2027', 
  'SUBMITTED'
FROM mata_kuliah 
ORDER BY kode ASC 
LIMIT 1;

INSERT INTO rencana_aksi_perbaikan 
  (mata_kuliah_id, analisis_kesenjangan, rencana_perbaikan, target_semester, status)
SELECT 
  id, 
  'Capaian CPL pada aspek komunikasi dan kerja tim masih belum optimal karena kurangnya penugasan berkelompok.', 
  'Mengubah metode pengajaran menjadi Team-Based Project (TBP) dengan mitra industri lokal untuk proyek akhir.', 
  'Genap 2026/2027', 
  'APPROVED'
FROM mata_kuliah 
ORDER BY kode ASC 
OFFSET 2 LIMIT 1;
