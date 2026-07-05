DO $$
DECLARE
  v_jurusan_id uuid := uuid_generate_v4();
  v_prodi_id uuid := uuid_generate_v4();
  v_kurikulum_id uuid := uuid_generate_v4();
  
  v_peo_1 uuid := uuid_generate_v4();
  v_peo_2 uuid := uuid_generate_v4();
  v_peo_3 uuid := uuid_generate_v4();
  
  v_cpl_1 uuid := uuid_generate_v4();
  v_cpl_2 uuid := uuid_generate_v4();
  v_cpl_3 uuid := uuid_generate_v4();
  v_cpl_4 uuid := uuid_generate_v4();
  
  v_bk_1 uuid := uuid_generate_v4();
  v_bk_2 uuid := uuid_generate_v4();
  v_bk_3 uuid := uuid_generate_v4();
  v_bk_4 uuid := uuid_generate_v4();
  v_bk_5 uuid := uuid_generate_v4();
  
  v_mk_1 uuid := uuid_generate_v4();
  v_mk_2 uuid := uuid_generate_v4();
  v_mk_3 uuid := uuid_generate_v4();
  
  v_cpmk_1 uuid := uuid_generate_v4();
  v_cpmk_2 uuid := uuid_generate_v4();
  
  v_sub_1_1 uuid := uuid_generate_v4();
  v_sub_1_2 uuid := uuid_generate_v4();
  v_sub_2_1 uuid := uuid_generate_v4();
  v_sub_2_2 uuid := uuid_generate_v4();
  
  v_mhs_1 uuid := uuid_generate_v4();
BEGIN
  -- 1. Master Data (Fakultas & Prodi)
  INSERT INTO jurusan (id, nama) VALUES (v_jurusan_id, 'Fakultas Ilmu Komputer');
  INSERT INTO prodi (id, nama, jurusan_id) VALUES (v_prodi_id, 'Sistem Informasi', v_jurusan_id);
  
  -- 2. Kurikulum
  INSERT INTO kurikulum (id, prodi_id, nama, tahun_berlaku, ketua_tim, landasan_filosofis, landasan_sosiologis, landasan_historis, landasan_hukum, visi, misi, tujuan, strategi, university_value, evaluasi_kurikulum, tracer_study) 
  VALUES (
    v_kurikulum_id, 
    v_prodi_id, 
    'Kurikulum OBE 2024', 
    2024, 
    'Dr. Budi Susanto, M.Kom', 
    'Kurikulum ini mengacu pada falsafah perenialisme, esensialisme, dan progresivisme dalam pendidikan tinggi.', 
    'Fondasi sosiologis kurikulum terkait analisis tentang saling kaitan antara individu dan masyarakat.', 
    'Secara historis program studi ini telah berevolusi dari kurikulum berbasis kompetensi menjadi OBE sejak 2020.', 
    'UU No 12 Tahun 2012, Permendikbud No 53 Tahun 2023 tentang Penjaminan Mutu.', 
    'Menjadi program studi unggulan dalam bidang sistem informasi enterprise di Asia Tenggara pada tahun 2030.', 
    'Menyelenggarakan pendidikan berkualitas, penelitian inovatif, dan pengabdian masyarakat di bidang SI.', 
    'Menghasilkan lulusan yang kompeten, beretika, dan mampu memecahkan masalah dengan teknologi.', 
    'Penerapan OBE, kemitraan dengan industri, dan pengembangan staf pengajar.', 
    'Integritas, Inovasi, Inklusivitas.', 
    'Evaluasi tahun 2023 menunjukkan perlunya penguatan pada aspek pemrograman cloud.', 
    'Tracer study 2023 menunjukkan 80% lulusan mendapat pekerjaan dalam waktu 3 bulan.'
  );

  -- 3. PEO (Profil Lulusan)
  INSERT INTO profil_lulusan (id, nama, deskripsi, kurikulum_id) VALUES 
  (v_peo_1, 'Information Systems Analyst', 'Profesional yang mampu menganalisis kebutuhan bisnis dan merancang solusi sistem informasi yang terintegrasi.', v_kurikulum_id),
  (v_peo_2, 'Data Scientist / Analyst', 'Ahli dalam mengelola dan menganalisis data besar untuk mendukung pengambilan keputusan strategis bisnis.', v_kurikulum_id),
  (v_peo_3, 'IT Project Manager', 'Pemimpin proyek TI yang mampu mengelola sumber daya, waktu, dan risiko dalam pengembangan sistem.', v_kurikulum_id);

  -- 4. CPL (Capaian Pembelajaran Lulusan)
  INSERT INTO cpl (id, kode, kategori, deskripsi, kurikulum_id, sdgs) VALUES 
  (v_cpl_1, 'S-01', 'Sikap', 'Menunjukkan sikap bertanggung jawab atas pekerjaan di bidang keahliannya secara mandiri.', v_kurikulum_id, ARRAY['SDG4', 'SDG8']),
  (v_cpl_2, 'KU-02', 'Keterampilan Umum', 'Mampu menunjukkan kinerja mandiri, bermutu, dan terukur.', v_kurikulum_id, ARRAY['SDG4', 'SDG9']),
  (v_cpl_3, 'KK-01', 'Keterampilan Khusus', 'Mampu menganalisis, merancang, dan mengimplementasikan sistem informasi organisasi.', v_kurikulum_id, ARRAY['SDG8', 'SDG9']),
  (v_cpl_4, 'P-03', 'Pengetahuan', 'Menguasai konsep teoritis arsitektur data dan manajemen basis data.', v_kurikulum_id, ARRAY['SDG9']);

  -- 5. PEO - CPL Mapping
  INSERT INTO profil_lulusan_cpl (profil_id, cpl_id) VALUES 
  (v_peo_1, v_cpl_1), (v_peo_2, v_cpl_1), (v_peo_3, v_cpl_1),
  (v_peo_1, v_cpl_2), (v_peo_3, v_cpl_2),
  (v_peo_1, v_cpl_3),
  (v_peo_2, v_cpl_4);

  -- 6. Bahan Kajian (Study Material)
  INSERT INTO bahan_kajian (id, kode, nama, deskripsi, kurikulum_id) VALUES
  (v_bk_1, 'BK-01', 'Analisis Proses Bisnis', 'Mempelajari pemodelan dan analisis proses bisnis organisasi.', v_kurikulum_id),
  (v_bk_2, 'BK-02', 'UML Modeling', 'Pemodelan berorientasi objek dengan Unified Modeling Language (UML).', v_kurikulum_id),
  (v_bk_3, 'BK-03', 'Database Architecture', 'Arsitektur database rasional dan non-relasional.', v_kurikulum_id),
  (v_bk_4, 'BK-04', 'SQL', 'Structured Query Language dan optimasi query.', v_kurikulum_id),
  (v_bk_5, 'BK-05', 'IT Governance & Risk Management', 'Tata kelola TI dan manajemen risiko dalam siklus proyek.', v_kurikulum_id);

  -- 7. Mata Kuliah
  INSERT INTO mata_kuliah (id, kode, nama, sks, semester, sifat_mk, rekognisi_mbkm, kurikulum_id, metode_pembelajaran, tautan_mou) VALUES
  (v_mk_1, 'SI101', 'Analisis & Perancangan Sistem', 3, 3, 'Wajib', true, v_kurikulum_id, 'CM', 'https://drive.google.com/contoh-mou-cm'),
  (v_mk_2, 'SI202', 'Manajemen Basis Data', 4, 2, 'Wajib', false, v_kurikulum_id, 'REGULAR', null),
  (v_mk_3, 'SI305', 'Manajemen Proyek TI', 2, 5, 'Wajib', true, v_kurikulum_id, 'TBP', 'https://drive.google.com/contoh-mou-tbp');

  -- 8. MK - CPL Mapping
  INSERT INTO mata_kuliah_cpl (mata_kuliah_id, cpl_id, bobot) VALUES
  (v_mk_1, v_cpl_3, 1.0),
  (v_mk_2, v_cpl_4, 1.0),
  (v_mk_3, v_cpl_1, 0.5), (v_mk_3, v_cpl_2, 0.5);

  -- 9. MK - BK Mapping
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id) VALUES
  (v_mk_1, v_bk_1), (v_mk_1, v_bk_2),
  (v_mk_2, v_bk_3), (v_mk_2, v_bk_4),
  (v_mk_3, v_bk_5);

  -- 10. CPMK
  INSERT INTO cpmk (id, kode, deskripsi, bobot, mata_kuliah_id) VALUES
  (v_cpmk_1, 'CPMK-1', 'Mampu memodelkan kebutuhan bisnis ke dalam diagram standar industri', 40.0, v_mk_1),
  (v_cpmk_2, 'CPMK-2', 'Mampu menyusun dokumen spesifikasi kebutuhan perangkat lunak', 60.0, v_mk_1);

  -- 11. Sub-CPMK
  INSERT INTO sub_cpmk (id, kode, deskripsi, bobot, metode_penilaian, instrumen_penilaian, cpmk_id) VALUES
  (v_sub_1_1, 'Sub-CPMK 1.1', 'Membuat diagram BPMN untuk proses bisnis berjalan', 20.0, 'Tugas Individu', 'Rubrik Penilaian Laporan', v_cpmk_1),
  (v_sub_1_2, 'Sub-CPMK 1.2', 'Merancang Use Case Diagram dan Class Diagram', 20.0, 'Tugas Individu', 'Rubrik Penilaian Laporan', v_cpmk_1),
  (v_sub_2_1, 'Sub-CPMK 2.1', 'Mengidentifikasi kebutuhan fungsional dan non-fungsional', 20.0, 'Kuis / Ujian Tertulis', 'Soal Pilihan Ganda/Essay', v_cpmk_2),
  (v_sub_2_2, 'Sub-CPMK 2.2', 'Menyelesaikan studi kasus nyata melalui laporan teknis', 40.0, 'Team-Based Project (IKU 7)', 'Rubrik Penilaian Proyek Kelompok', v_cpmk_2);

  -- 12. Mahasiswa
  INSERT INTO mahasiswa (id, nim, nama, prodi_id) VALUES
  (v_mhs_1, '1202200001', 'Alexandre Bintang', v_prodi_id);

  -- 13. Nilai
  INSERT INTO nilai (mahasiswa_id, sub_cpmk_id, nilai) VALUES
  (v_mhs_1, v_sub_1_1, 85),
  (v_mhs_1, v_sub_1_2, 80),
  (v_mhs_1, v_sub_2_1, 75),
  (v_mhs_1, v_sub_2_2, 92);
  
  -- 14. CQI
  INSERT INTO rencana_aksi_perbaikan (mata_kuliah_id, analisis_kesenjangan, rencana_perbaikan, target_semester, status) VALUES
  (v_mk_1, 'Sebagian besar kesulitan dalam Use Case.', 'Tambah asistensi lab.', 'Ganjil 2025', 'SUBMITTED');

END $$;
