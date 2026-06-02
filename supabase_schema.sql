-- Enable UUID extension
create extension if not exists "uuid-ossp";

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

-- RLS (Row Level Security) Configuration
-- For MVP, we will allow all access (anon/authenticated) to these tables

alter table jurusan enable row level security;
create policy "Allow all operations for anon" on jurusan for all using (true) with check (true);

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
