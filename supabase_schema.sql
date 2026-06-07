-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 0. User Roles Enum
create type user_role as enum ('ADMIN', 'DOSEN', 'AUDITOR');

-- 0.1 Table Users
create table users (
  id uuid primary key default uuid_generate_v4(),
  nama text not null,
  email text unique not null,
  role user_role not null default 'DOSEN',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1. Table Jurusan
create table jurusan (
  id uuid primary key default uuid_generate_v4(),
  nama text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Table Prodi
create table prodi (
  id uuid primary key default uuid_generate_v4(),
  nama text not null,
  jurusan_id uuid references jurusan(id) on delete cascade not null,
  batas_kelulusan_cpl decimal(5,2) default 60.0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Table Profil Lulusan (PEO)
create table profil_lulusan (
  id uuid primary key default uuid_generate_v4(),
  nama text not null,
  deskripsi text not null,
  prodi_id uuid references prodi(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Table CPL (PLO)
create table cpl (
  id uuid primary key default uuid_generate_v4(),
  kode text not null,
  kategori text not null,
  deskripsi text not null,
  sdgs text[], -- IKU 7: Tagging SDGs (e.g. ['SDG4', 'SDG8'])
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Junction Table: PEO to CPL (Many-to-Many)
create table profil_lulusan_cpl (
  id uuid primary key default uuid_generate_v4(),
  profil_id uuid references profil_lulusan(id) on delete cascade not null,
  cpl_id uuid references cpl(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(profil_id, cpl_id)
);

-- 5. Table Bahan Kajian (BK)
create table bahan_kajian (
  id uuid primary key default uuid_generate_v4(),
  kode text not null,
  nama text not null,
  deskripsi text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Junction Table: PEO to BK (Many-to-Many)
create table profil_lulusan_bk (
  id uuid primary key default uuid_generate_v4(),
  profil_id uuid references profil_lulusan(id) on delete cascade not null,
  bk_id uuid references bahan_kajian(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(profil_id, bk_id)
);

-- 6. Table Mata Kuliah (Course)
create table mata_kuliah (
  id uuid primary key default uuid_generate_v4(),
  kode text not null,
  nama text not null,
  sks integer not null default 3,
  prodi_id uuid references prodi(id) on delete cascade not null,
  metode_pembelajaran text default 'REGULAR', -- 'REGULAR', 'TBP' (Team-Based Project), 'CM' (Case Method)
  tautan_mou text, -- IKU 5: Tautan dokumen kerjasama jika metode TBP/CM
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Junction Table: Mata Kuliah to BK
create table mata_kuliah_bk (
  id uuid primary key default uuid_generate_v4(),
  mata_kuliah_id uuid references mata_kuliah(id) on delete cascade not null,
  bk_id uuid references bahan_kajian(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(mata_kuliah_id, bk_id)
);

-- 7. Matrix Mata Kuliah - CPL (Mapping Course to CPL with weight)
create table mata_kuliah_cpl (
  id uuid primary key default uuid_generate_v4(),
  mata_kuliah_id uuid references mata_kuliah(id) on delete cascade not null,
  cpl_id uuid references cpl(id) on delete cascade not null,
  bobot decimal(5,2) not null default 0.0,
  unique(mata_kuliah_id, cpl_id)
);

-- 7. Table CPMK
create table cpmk (
  id uuid primary key default uuid_generate_v4(),
  kode text not null,
  deskripsi text not null,
  bobot decimal(5,2) not null default 0.0,
  mata_kuliah_id uuid references mata_kuliah(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Table Sub-CPMK
create table sub_cpmk (
  id uuid primary key default uuid_generate_v4(),
  kode text not null,
  deskripsi text not null,
  bobot decimal(5,2) not null default 0.0,
  metode_penilaian text,
  instrumen_penilaian text,
  cpmk_id uuid references cpmk(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Table Mahasiswa
create table mahasiswa (
  id uuid primary key default uuid_generate_v4(),
  nim text not null unique,
  nama text not null,
  prodi_id uuid references prodi(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Table Nilai Asesmen
create table nilai (
  id uuid primary key default uuid_generate_v4(),
  mahasiswa_id uuid references mahasiswa(id) on delete cascade not null,
  sub_cpmk_id uuid references sub_cpmk(id) on delete cascade not null,
  nilai decimal(5,2) not null default 0.0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(mahasiswa_id, sub_cpmk_id)
);

-- 11. Table Grading Audit Trail (IKU 11)
create table grading_audit_trail (
  id uuid primary key default uuid_generate_v4(),
  nilai_id uuid references nilai(id) on delete cascade not null,
  nilai_lama decimal(5,2) not null,
  nilai_baru decimal(5,2) not null,
  alasan text not null,
  ip_address text,
  user_id text, -- Identifier dosen/pengguna yang mengubah
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Table Rencana Aksi Perbaikan (CQI/AMI)
create table rencana_aksi_perbaikan (
  id uuid primary key default uuid_generate_v4(),
  mata_kuliah_id uuid references mata_kuliah(id) on delete cascade not null,
  analisis_kesenjangan text not null,
  rencana_perbaikan text not null,
  target_semester text not null,
  status text default 'DRAFT',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) Configuration
-- For MVP, we will allow all access (anon/authenticated) to these tables

alter table jurusan enable row level security;
create policy "Allow all operations for anon" on jurusan for all using (true) with check (true);

alter table users enable row level security;
create policy "Allow all operations for anon" on users for all using (true) with check (true);

alter table prodi enable row level security;
create policy "Allow all operations for anon" on prodi for all using (true) with check (true);

alter table profil_lulusan enable row level security;
create policy "Allow all operations for anon" on profil_lulusan for all using (true) with check (true);

alter table cpl enable row level security;
create policy "Allow all operations for anon" on cpl for all using (true) with check (true);

alter table mata_kuliah enable row level security;
create policy "Allow all operations for anon" on mata_kuliah for all using (true) with check (true);

alter table mata_kuliah_cpl enable row level security;
create policy "Allow all operations for anon" on mata_kuliah_cpl for all using (true) with check (true);

alter table cpmk enable row level security;
create policy "Allow all operations for anon" on cpmk for all using (true) with check (true);

alter table sub_cpmk enable row level security;
create policy "Allow all operations for anon" on sub_cpmk for all using (true) with check (true);

alter table mahasiswa enable row level security;
create policy "Allow all operations for anon" on mahasiswa for all using (true) with check (true);

alter table nilai enable row level security;
create policy "Allow all operations for anon" on nilai for all using (true) with check (true);

alter table profil_lulusan_cpl enable row level security;
create policy "Allow all operations for anon" on profil_lulusan_cpl for all using (true) with check (true);

alter table bahan_kajian enable row level security;
create policy "Allow all operations for anon" on bahan_kajian for all using (true) with check (true);

alter table profil_lulusan_bk enable row level security;
create policy "Allow all operations for anon" on profil_lulusan_bk for all using (true) with check (true);

alter table mata_kuliah_bk enable row level security;
create policy "Allow all operations for anon" on mata_kuliah_bk for all using (true) with check (true);

alter table grading_audit_trail enable row level security;
create policy "Allow all operations for anon" on grading_audit_trail for all using (true) with check (true);

alter table rencana_aksi_perbaikan enable row level security;
create policy "Allow all operations for anon" on rencana_aksi_perbaikan for all using (true) with check (true);
