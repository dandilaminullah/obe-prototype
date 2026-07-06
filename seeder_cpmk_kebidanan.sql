-- ============================================================================
-- SEEDER DATA CPMK PRODI KEBIDANAN
-- Menambahkan Master Prodi Kebidanan, Kurikulum Kebidanan, CPL, Bahan Kajian,
-- Mata Kuliah, serta 92 CPMK beserta Kedalaman KAP (Kognitif, Afektif, Psikomotorik).
-- ============================================================================

DO $$
DECLARE
  v_prodi_id uuid;
  v_kurikulum_id uuid;
  v_jurusan_id uuid;
  v_mk_id uuid;
  v_bk_id uuid;
BEGIN
  -- 1. Dapatkan atau Buat Prodi Kebidanan
  SELECT id INTO v_prodi_id FROM prodi WHERE nama ILIKE '%Kebidanan%' LIMIT 1;
  IF v_prodi_id IS NULL THEN
    SELECT id INTO v_jurusan_id FROM jurusan LIMIT 1;
    IF v_jurusan_id IS NULL THEN
      v_jurusan_id := uuid_generate_v4();
      INSERT INTO jurusan (id, nama) VALUES (v_jurusan_id, 'Fakultas Ilmu Kesehatan');
    END IF;
    v_prodi_id := uuid_generate_v4();
    INSERT INTO prodi (id, nama, jurusan_id) VALUES (v_prodi_id, 'Kebidanan', v_jurusan_id);
  END IF;

  -- 2. Dapatkan atau Buat Kurikulum Kebidanan
  SELECT id INTO v_kurikulum_id FROM kurikulum WHERE prodi_id = v_prodi_id LIMIT 1;
  IF v_kurikulum_id IS NULL THEN
    v_kurikulum_id := uuid_generate_v4();
    INSERT INTO kurikulum (id, prodi_id, nama, tahun_berlaku)
    VALUES (v_kurikulum_id, v_prodi_id, 'Kurikulum Kebidanan OBE 2024', 2024);
  END IF;

  -- 3. Inisialisasi CPL Kebidanan
  IF NOT EXISTS (SELECT 1 FROM cpl WHERE kurikulum_id = v_kurikulum_id AND kode = 'CPL 2') THEN
    INSERT INTO cpl (id, kurikulum_id, kode, deskripsi) VALUES (uuid_generate_v4(), v_kurikulum_id, 'CPL 2', 'CPL 2 Kebidanan');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM cpl WHERE kurikulum_id = v_kurikulum_id AND kode = 'CPL 1') THEN
    INSERT INTO cpl (id, kurikulum_id, kode, deskripsi) VALUES (uuid_generate_v4(), v_kurikulum_id, 'CPL 1', 'CPL 1 Kebidanan');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM cpl WHERE kurikulum_id = v_kurikulum_id AND kode = 'CPL 5') THEN
    INSERT INTO cpl (id, kurikulum_id, kode, deskripsi) VALUES (uuid_generate_v4(), v_kurikulum_id, 'CPL 5', 'CPL 5 Kebidanan');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM cpl WHERE kurikulum_id = v_kurikulum_id AND kode = 'CPL 4') THEN
    INSERT INTO cpl (id, kurikulum_id, kode, deskripsi) VALUES (uuid_generate_v4(), v_kurikulum_id, 'CPL 4', 'CPL 4 Kebidanan');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM cpl WHERE kurikulum_id = v_kurikulum_id AND kode = 'CPL 3') THEN
    INSERT INTO cpl (id, kurikulum_id, kode, deskripsi) VALUES (uuid_generate_v4(), v_kurikulum_id, 'CPL 3', 'CPL 3 Kebidanan');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM cpl WHERE kurikulum_id = v_kurikulum_id AND kode = 'CPL 6') THEN
    INSERT INTO cpl (id, kurikulum_id, kode, deskripsi) VALUES (uuid_generate_v4(), v_kurikulum_id, 'CPL 6', 'CPL 6 Kebidanan');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM cpl WHERE kurikulum_id = v_kurikulum_id AND kode = 'CPL 7') THEN
    INSERT INTO cpl (id, kurikulum_id, kode, deskripsi) VALUES (uuid_generate_v4(), v_kurikulum_id, 'CPL 7', 'CPL 7 Kebidanan');
  END IF;

  -- 4. Inisialisasi Bahan Kajian (BK) Kebidanan
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 1') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 1', 'Bahan Kajian BK 1');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 2') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 2', 'Bahan Kajian BK 2');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 3') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 3', 'Bahan Kajian BK 3');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 4') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 4', 'Bahan Kajian BK 4');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 5', 'Bahan Kajian BK 5');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 6') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 6', 'Bahan Kajian BK 6');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 7', 'Bahan Kajian BK 7');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 8') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 8', 'Bahan Kajian BK 8');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 9') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 9', 'Bahan Kajian BK 9');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 10') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 10', 'Bahan Kajian BK 10');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 11') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 11', 'Bahan Kajian BK 11');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 12') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 12', 'Bahan Kajian BK 12');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 13') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 13', 'Bahan Kajian BK 13');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 14') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 14', 'Bahan Kajian BK 14');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 15') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 15', 'Bahan Kajian BK 15');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 16', 'Bahan Kajian BK 16');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 17') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 17', 'Bahan Kajian BK 17');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 18') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 18', 'Bahan Kajian BK 18');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 19') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 19', 'Bahan Kajian BK 19');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 20') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 20', 'Bahan Kajian BK 20');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 21') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 21', 'Bahan Kajian BK 21');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 22') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 22', 'Bahan Kajian BK 22');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 23') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 23', 'Bahan Kajian BK 23');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 24') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 24', 'Bahan Kajian BK 24');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 25', 'Bahan Kajian BK 25');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 26') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 26', 'Bahan Kajian BK 26');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 27') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 27', 'Bahan Kajian BK 27');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 28') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 28', 'Bahan Kajian BK 28');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 29') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 29', 'Bahan Kajian BK 29');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 30') THEN
    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, 'BK 30', 'Bahan Kajian BK 30');
  END IF;

  -- 5. Insert CPMK dan Pemetaan ke Mata Kuliah & BK
  -- MK: Fundamental Kebidanan | CPMK: CPMK 1
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Fundamental Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-01', 'Fundamental Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 4'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 4' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 1', 'Mampu menguraikan konsep bidan sebagai profesi, sejarah, filosofi bidan, paradigma, model praktik kebidanan, kajian perempuan dalam berbagai konteks berlandaskan nilai-nilai Islam dengan tepat', 50.00, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Fundamental Kebidanan | CPMK: CPMK 2
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Fundamental Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-01', 'Fundamental Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 4'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 4' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 2', 'Mampu mengidentifikasi model and bentuk asuhan kebidanan serta menguasai konsep berpikir kritis dan reflektif dalam pelayanan kebidanan dengan tepat', 50.00, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Etika dan Hukum Kesehatan | CPMK: CPMK 3
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Etika dan Hukum Kesehatan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-02', 'Etika dan Hukum Kesehatan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 1'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 1' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 3', 'Mampu menguasai konsep etika, kode etik bidan nasional-internasional, peraturan/ hukum terkait praktik kebidanan dengan menghargai keanekaragaman budaya dengan tepat', 50.00, 2, 3, 0, v_mk_id, v_bk_id);

  -- MK: Etika dan Hukum Kesehatan | CPMK: CPMK 4
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Etika dan Hukum Kesehatan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-02', 'Etika dan Hukum Kesehatan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 1'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 1' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 4', 'Mampu menganalisis nilai personal dan profesional dalam menjalankan praktik kebidanan', 50.00, 4, 3, 0, v_mk_id, v_bk_id);

  -- MK: Anatomi | CPMK: CPMK 5
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Anatomi' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-03', 'Anatomi', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 5', 'Mampu mendeskripsikan konsep dasar anatomi sistem tubuh manusia dengan tepat', 100.00, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Fisiologi | CPMK: CPMK 6
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Fisiologi' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-04', 'Fisiologi', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 6', 'Mampu mendeskripsikan konsep dasar fisiologi sistem tubuh manusia dengan tepat', 100.00, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Biologi Reproduksi | CPMK: CPMK 7
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Biologi Reproduksi' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-05', 'Biologi Reproduksi', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 7', 'Mampu menganalisis kajian fisiologi reproduksi manusia, embriologi, organogenesis dalam praktik kebidanan dengan tepat', 50.00, 4, 2, 0, v_mk_id, v_bk_id);

  -- MK: Biologi Reproduksi | CPMK: CPMK 8
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Biologi Reproduksi' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-05', 'Biologi Reproduksi', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 8', 'Mampu menganalisis kajian genetika dasar dan imunologi dasar dalam praktik kebidanan dengan tepat', 50.00, 4, 2, 0, v_mk_id, v_bk_id);

  -- MK: Mikrobiologi dan Parasitologi | CPMK: CPMK 9
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Mikrobiologi dan Parasitologi' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-06', 'Mikrobiologi dan Parasitologi', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 9', 'Mampu menguraikan mikrobiologi dan parasitologi yang terkait dalam praktik kebidanan dengan tepat', 100.00, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Fisika Kesehatan | CPMK: CPMK 10
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Fisika Kesehatan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-07', 'Fisika Kesehatan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 10', 'Mampu menguraikan kajian fisika kesehatan dalam praktik kebidanan dengan tepat', 50.00, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Fisika Kesehatan | CPMK: CPMK 11
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Fisika Kesehatan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-07', 'Fisika Kesehatan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 11', 'Mampu menganalisis kajian fisika kesehatan dan biokimia dalam studi kasus kebidanan dengan tepat', 50.00, 4, 2, 0, v_mk_id, v_bk_id);

  -- MK: Biokimia | CPMK: CPMK 12
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Biokimia' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-08', 'Biokimia', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 12', 'Mampu menguraikan kajian fisika kesehatan dalam praktik kebidanan dengan tepat', 50.00, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Biokimia | CPMK: CPMK 13
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Biokimia' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-08', 'Biokimia', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 5' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 13', 'Mampu menganalisis kajian fisika kesehatan dan biokimia dalam studi kasus kebidanan dengan tepat', 50.00, 4, 2, 0, v_mk_id, v_bk_id);

  -- MK: Farmakologi dalam Asuhan Kebidanan | CPMK: CPMK 14
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Farmakologi dalam Asuhan Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-09', 'Farmakologi dalam Asuhan Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 6'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 6' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 14', 'Mampu mendeskripsikan konsep dasar dan prinsip farmakologi dengan tepat', 50.00, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Farmakologi dalam Asuhan Kebidanan | CPMK: CPMK 15
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Farmakologi dalam Asuhan Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-09', 'Farmakologi dalam Asuhan Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 6'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 6' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 15', 'Mampu melakukan pengelolaan obat dalam asuhan kebidanan dengan tepat', 50.00, 3, 2, 2, v_mk_id, v_bk_id);

  -- MK: Keterampilan Dasar Kebidanan | CPMK: CPMK 16
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Keterampilan Dasar Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-10', 'Keterampilan Dasar Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 13'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 13' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 16', 'Mampu mengaplikasikan konsep patient safety dan pengendalian infeksi', 33.33, 3, 2, 2, v_mk_id, v_bk_id);

  -- MK: Keterampilan Dasar Kebidanan | CPMK: CPMK 17
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Keterampilan Dasar Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-10', 'Keterampilan Dasar Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 22'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 22' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 17', 'Mampu menganalisis kebutuhan dasar manusia dengan tepat', 33.33, 4, 2, 0, v_mk_id, v_bk_id);

  -- MK: Keterampilan Dasar Kebidanan | CPMK: CPMK 18
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Keterampilan Dasar Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-10', 'Keterampilan Dasar Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 23'
  ON CONFLICT DO NOTHING;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 24'
  ON CONFLICT DO NOTHING;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 23' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 18', 'Mampu mengaplikasikan keterampilan dasar praktik kebidanan dan bantuan hidup dasar dalam setting laboratorium klinik, simulasi, dan pengenalan awal di wahana praktik', 33.33, 3, 3, 3, v_mk_id, v_bk_id);

  -- MK: Komunikasi Kebidanan | CPMK: CPMK 19
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Komunikasi Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-11', 'Komunikasi Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 18'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 18' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 19', 'Mampu menganalisis konsep dasar dan teknik komunikasi serta menunjukan keterampilan komunikasi efektif dalam praktik kebidanan', 33.33, 4, 3, 3, v_mk_id, v_bk_id);

  -- MK: Komunikasi Kebidanan | CPMK: CPMK 20
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Komunikasi Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-11', 'Komunikasi Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 18'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 18' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 20', 'Mampu menunjukan implementasi nilai profesional bidan dalam konseling secara kritis dan etis', 33.33, 3, 5, 3, v_mk_id, v_bk_id);

  -- MK: Komunikasi Kebidanan | CPMK: CPMK 21
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Komunikasi Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-11', 'Komunikasi Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 21'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 21' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 21', 'Mampu menunjukan komunikasi interprofesional', 33.33, 3, 4, 3, v_mk_id, v_bk_id);

  -- MK: Profesionalisme dalam Kebidanan | CPMK: CPMK 22
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Profesionalisme dalam Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-12', 'Profesionalisme dalam Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 3'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 3' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 22', 'Mampu menganalisis tanggung jawab bidan dan pengembangan profesionalisme', 25.00, 4, 3, 0, v_mk_id, v_bk_id);

  -- MK: Profesionalisme dalam Kebidanan | CPMK: CPMK 23
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Profesionalisme dalam Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-12', 'Profesionalisme dalam Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 3'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 3' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 23', 'Mampu menerapkan manajemen dan dokumentasi kebidanan secara profesional dan komprehensif', 25.00, 3, 4, 2, v_mk_id, v_bk_id);

  -- MK: Profesionalisme dalam Kebidanan | CPMK: CPMK 24
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Profesionalisme dalam Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-12', 'Profesionalisme dalam Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 3'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 3' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 24', 'Mampu melakukan refleksi berkaitan dengan nilai profesional pada kasus kebidanan secara kritis', 25.00, 4, 4, 0, v_mk_id, v_bk_id);

  -- MK: Profesionalisme dalam Kebidanan | CPMK: CPMK 25
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Profesionalisme dalam Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-12', 'Profesionalisme dalam Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 20'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 20' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 25', 'Mampu mengaplikasikan kerja sama efektif intra dan interprofesional dalam pelayanan kebidanan', 25.00, 3, 4, 3, v_mk_id, v_bk_id);

  -- MK: Kebidanan Berbasis Bukti | CPMK: CPMK 26
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Kebidanan Berbasis Bukti' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-13', 'Kebidanan Berbasis Bukti', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 14'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 14' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 26', 'Mampu melakukan pencarian bukti ilmiah, critical appraisal, dan menghubungkan konsep dasar evidence based practice dan evidence based midwifery dengan benar', 50.00, 4, 2, 2, v_mk_id, v_bk_id);

  -- MK: Kebidanan Berbasis Bukti | CPMK: CPMK 27
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Kebidanan Berbasis Bukti' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-13', 'Kebidanan Berbasis Bukti', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16'
  ON CONFLICT DO NOTHING;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7'
  ON CONFLICT DO NOTHING;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 8'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 27', 'Mampu menyusun deskripsi saintifik evidence based practice dalam menganalisa informasi dan data', 50.00, 5, 2, 0, v_mk_id, v_bk_id);

  -- MK: Ilmu Dasar Kebidanan | CPMK: CPMK 28
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Ilmu Dasar Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-14', 'Ilmu Dasar Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 28', 'mampu menguraikan konsep fisiologis Kehamilan, Persalinan, Nifas, menyusui serta kesejahteraan janin untuk menunjang diagnosis kebidanan', 50.00, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Ilmu Dasar Kebidanan | CPMK: CPMK 29
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Ilmu Dasar Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-14', 'Ilmu Dasar Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 29', 'mampu menganalisis komplikasi obstetrik, penyakit dan kelainan dalam kasus maternal dengan tepat menggunakan alat tepat guna', 50.00, 4, 2, 2, v_mk_id, v_bk_id);

  -- MK: Ilmu Kesehatan Anak | CPMK: CPMK 30
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Ilmu Kesehatan Anak' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-15', 'Ilmu Kesehatan Anak', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 8'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 8' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 30', 'mampu mengidentifikasi konsep dasar perawatan, pertumbuhan, perkembangan pada bayi dan anak yang berkaitan dalam praktik pelayanan kebidanan dengan lengkap', 33.33, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Ilmu Kesehatan Anak | CPMK: CPMK 31
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Ilmu Kesehatan Anak' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-15', 'Ilmu Kesehatan Anak', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 8'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 8' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 31', 'mampu menganalisis penyimpangan, penyakit dan masalah dan prinsip farmakoterapi pada bayi dan anak secara kritis, etis dan berbasis bukti.', 33.33, 4, 3, 0, v_mk_id, v_bk_id);

  -- MK: Ilmu Kesehatan Anak | CPMK: CPMK 32
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Ilmu Kesehatan Anak' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-15', 'Ilmu Kesehatan Anak', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 22'
  ON CONFLICT DO NOTHING;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 23'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 22' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 32', 'mampu menganalisis kebutuhan dasar pada bayi dan anak normal dan dengan gangguan pertumbuhan dan perkembangan anak serta berkebutuhan khusus secara tepat', 33.33, 4, 3, 0, v_mk_id, v_bk_id);

  -- MK: Gizi dalam Kebidanan | CPMK: CPMK 33
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Gizi dalam Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-16', 'Gizi dalam Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 9'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 9' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 33', 'mampu mengidentifikasi konsep dasar Gizi dalam praktik kebidanan secara kritis', 50.00, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Gizi dalam Kebidanan | CPMK: CPMK 34
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Gizi dalam Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-16', 'Gizi dalam Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 9'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 9' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 34', 'mampu menganalisis kebutuhan dan pemenuhan gizi dalam praktik pelayanan kebidanan secara kritis', 50.00, 4, 2, 0, v_mk_id, v_bk_id);

  -- MK: Psikologi dalam Praktik Kebidanan | CPMK: CPMK 35
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Psikologi dalam Praktik Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-17', 'Psikologi dalam Praktik Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 10'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 10' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 35', 'mampu mengidentifikasi konsep teoritis konsep teoritis ilmu psikologi dalam praktik kebidanan dengan tepat', 33.33, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Psikologi dalam Praktik Kebidanan | CPMK: CPMK 36
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Psikologi dalam Praktik Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-17', 'Psikologi dalam Praktik Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 10'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 10' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 36', 'mampu menganalisis kasus-kasus psikologi dalam praktik kebidanan pada maternal dan perinatal di seluruh siklus reproduksi', 33.33, 4, 3, 0, v_mk_id, v_bk_id);

  -- MK: Psikologi dalam Praktik Kebidanan | CPMK: CPMK 37
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Psikologi dalam Praktik Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-17', 'Psikologi dalam Praktik Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 10'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 10' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 37', 'mampu merancang asuhan pelayanan kebidanan pada kasus psikologis dalam praktik kebidanan', 33.33, 5, 3, 0, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Remaja, Pranikah dan Prakonsepsi | CPMK: CPMK 38
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Remaja, Pranikah dan Prakonsepsi' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-18', 'Asuhan Kebidanan pada Remaja, Pranikah dan Prakonsepsi', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 11'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 11' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 38', 'Mampu mengidentifikasi konsep dasar, filosofi, prinsip dan profesionalisme dalam asuhan kebidanan pada remaja, pra nikah dan pra konsepsi', 33.33, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Remaja, Pranikah dan Prakonsepsi | CPMK: CPMK 39
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Remaja, Pranikah dan Prakonsepsi' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-18', 'Asuhan Kebidanan pada Remaja, Pranikah dan Prakonsepsi', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 21'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 21' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 39', 'Mampu melakukan persiapan perencanaan kehamilan sehat', 33.33, 3, 3, 2, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Remaja, Pranikah dan Prakonsepsi | CPMK: CPMK 40
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Remaja, Pranikah dan Prakonsepsi' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-18', 'Asuhan Kebidanan pada Remaja, Pranikah dan Prakonsepsi', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 24'
  ON CONFLICT DO NOTHING;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 24' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 40', 'Mampu mengintegrasikan asuhan kebidanan pada remaja, pranikah dan prakonsepsi berdasarkan evidence based dengan berlandaskan nilai-nilai Islam', 33.33, 5, 4, 3, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Kehamilan | CPMK: CPMK 41
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Kehamilan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-19', 'Asuhan Kebidanan pada Kehamilan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 41', 'Mampu mengidentifikasi konsep dasar, filosofi, prinsip and profesionalisme dalam asuhan kebidanan kehamilan', 33.33, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Kehamilan | CPMK: CPMK 42
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Kehamilan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-19', 'Asuhan Kebidanan pada Kehamilan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 42', 'Mampu menganalisis perubahan dan adaptasi fisiologis dalam kehamilan', 33.33, 4, 2, 0, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Kehamilan | CPMK: CPMK 43
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Kehamilan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-19', 'Asuhan Kebidanan pada Kehamilan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 24'
  ON CONFLICT DO NOTHING;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 24' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 43', 'Mampu mengintegrasikan Asuhan kebidanan pada kehamilan berdasarkan evidence base berlandaskan nilai-nilai Islam', 33.33, 5, 4, 3, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Persalinan dan Bayi Baru Lahir | CPMK: CPMK 44
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Persalinan dan Bayi Baru Lahir' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-20', 'Asuhan Kebidanan pada Persalinan dan Bayi Baru Lahir', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 44', 'Mampu mengidentifikasi konsep dasar, filosofi, prinsip dan profesionalisme dalam asuhan kebidanan pada persalinan dan bayi baru lahir', 33.33, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Persalinan dan Bayi Baru Lahir | CPMK: CPMK 45
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Persalinan dan Bayi Baru Lahir' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-20', 'Asuhan Kebidanan pada Persalinan dan Bayi Baru Lahir', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 45', 'Mampu menganalisis perubahan dan adaptasi fisiologis pada persalinan dan bayi baru lahir', 33.33, 4, 2, 0, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Persalinan dan Bayi Baru Lahir | CPMK: CPMK 46
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Persalinan dan Bayi Baru Lahir' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-20', 'Asuhan Kebidanan pada Persalinan dan Bayi Baru Lahir', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 24'
  ON CONFLICT DO NOTHING;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 24' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 46', 'Mampu mengintegrasikan Asuhan Kebidanan pada persalinan dan bayi baru lahir berdasarkan evidence based berlandaskan nilai-nilai Islam', 33.33, 5, 4, 3, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Nifas dan Menyusui | CPMK: CPMK 47
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Nifas dan Menyusui' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-21', 'Asuhan Kebidanan pada Nifas dan Menyusui', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 47', 'Mampu mengidentifikasi konsep dasar, filosofi, prinsip dan profesionalisme dalam asuhan kebidanan pada nifas dan menyusui', 33.33, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Nifas dan Menyusui | CPMK: CPMK 48
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Nifas dan Menyusui' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-21', 'Asuhan Kebidanan pada Nifas dan Menyusui', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 48', 'Mampu menganalisis perubahan dan adaptasi fisiologi pada nifas dan menyusui', 33.33, 4, 2, 0, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Nifas dan Menyusui | CPMK: CPMK 49
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Nifas dan Menyusui' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-21', 'Asuhan Kebidanan pada Nifas dan Menyusui', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 24'
  ON CONFLICT DO NOTHING;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 24' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 49', 'Mampu mengintegrasikan Asuhan kebidanan pada nifas dan menyusui berdasarkan evidence base berlandaskan nilai-nilai Islam', 33.33, 5, 4, 3, v_mk_id, v_bk_id);

  -- MK: Keluarga Berencana dan Pelayanan Kontrasepsi | CPMK: CPMK 50
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Keluarga Berencana dan Pelayanan Kontrasepsi' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-22', 'Keluarga Berencana dan Pelayanan Kontrasepsi', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 11'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 11' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 50', 'Mampu mengidentifikasi konsep dasar, filosofi, prinsip dan profesionalisme pada KB dan Pelayanan Kontrasepsi', 25.00, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Keluarga Berencana dan Pelayanan Kontrasepsi | CPMK: CPMK 51
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Keluarga Berencana dan Pelayanan Kontrasepsi' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-22', 'Keluarga Berencana dan Pelayanan Kontrasepsi', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 11'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 11' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 51', 'Mampu menganalisis KB dan pelayanan kontrasepsi dalam pandangan Islam', 25.00, 4, 3, 0, v_mk_id, v_bk_id);

  -- MK: Keluarga Berencana dan Pelayanan Kontrasepsi | CPMK: CPMK 52
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Keluarga Berencana dan Pelayanan Kontrasepsi' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-22', 'Keluarga Berencana dan Pelayanan Kontrasepsi', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 52', 'Mampu melaksanakan manajemen pelayanan kontrasepsi, kontrasepsi darurat dan asuhan pasca keguguran', 25.00, 3, 3, 3, v_mk_id, v_bk_id);

  -- MK: Keluarga Berencana dan Pelayanan Kontrasepsi | CPMK: CPMK 53
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Keluarga Berencana dan Pelayanan Kontrasepsi' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-22', 'Keluarga Berencana dan Pelayanan Kontrasepsi', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 53', 'Mampu mengintegrasikan pelayanan kontrasepsi berbagai metode berbasis evidence based', 25.00, 5, 3, 3, v_mk_id, v_bk_id);

  -- MK: Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah | CPMK: CPMK 54
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-23', 'Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 8'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 8' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 54', 'Mampu mengidentifikasi konsep dasar, filosofi, prinsip dan profesionalisme dalam asuhan kebidanan bayi, balita dan anak pra sekolah', 25.00, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah | CPMK: CPMK 55
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-23', 'Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 8'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 8' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 55', 'Mampu menganalisis perubahan dan adaptasi fisiologis pada bayi, balita dan anak pra sekolah', 25.00, 4, 2, 0, v_mk_id, v_bk_id);

  -- MK: Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah | CPMK: CPMK 56
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-23', 'Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 56', 'Mampu mengintegrasikan asuhan kebidanan pada bayi, balita dan anak pra sekolah berdasarkan evidence based dan berlandaskan nilai-nilai islam', 25.00, 5, 4, 3, v_mk_id, v_bk_id);

  -- MK: Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah | CPMK: CPMK 57
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-23', 'Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 27'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 27' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 57', 'Mampu mendeteksi masalah dan kelainan yang biasa terjadi pada bayi, balita dan anak pra sekolah', 25.00, 4, 2, 2, v_mk_id, v_bk_id);

  -- MK: Kesehatan Reproduksi dan Klimakterium | CPMK: CPMK 58
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Kesehatan Reproduksi dan Klimakterium' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-24', 'Kesehatan Reproduksi dan Klimakterium', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 11'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 11' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 58', 'Mampu mengidentifikasi konsep dasar, filosofi, prinsip dan profesionalisme dalam kesehatan reproduksi dan klimakterium', 33.33, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Kesehatan Reproduksi dan Klimakterium | CPMK: CPMK 59
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Kesehatan Reproduksi dan Klimakterium' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-24', 'Kesehatan Reproduksi dan Klimakterium', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 59', 'Mampu mendeteksi masalah dan gangguan sistem reproduksi sepanjang siklus daur hidup perempuan', 33.33, 4, 2, 2, v_mk_id, v_bk_id);

  -- MK: Kesehatan Reproduksi dan Klimakterium | CPMK: CPMK 60
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Kesehatan Reproduksi dan Klimakterium' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-24', 'Kesehatan Reproduksi dan Klimakterium', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 25' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 60', 'Mampu mengintegrasikan asuhan kebidanan pada kesehatan reproduksi, klimakterium dan abortus berdasarkan evidence based dan berlandaskan nilai-nilai islam', 33.33, 5, 4, 3, v_mk_id, v_bk_id);

  -- MK: Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana | CPMK: CPMK 61
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-25', 'Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 11'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 11' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 61', 'Mampu menjelaskan konsep dasar kasus kritis', 25.00, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana | CPMK: CPMK 62
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-25', 'Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 30'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 30' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 62', 'Membangun jejaring dalam asuhan kebidanan pada situasi krisis dan bencana', 25.00, 5, 4, 3, v_mk_id, v_bk_id);

  -- MK: Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana | CPMK: CPMK 63
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-25', 'Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 30'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 30' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 63', 'Mampu memberikan asuhan kebidanan pada situasi kritis dan bencana', 25.00, 3, 3, 3, v_mk_id, v_bk_id);

  -- MK: Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana | CPMK: CPMK 64
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-25', 'Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 30'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 30' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 64', 'Mampu mengidentifikasi kebutuhan dan permasalahan ibu dan anak serta kesehatan reproduksi pada masa situasi krisis dan bencana', 25.00, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan | CPMK: CPMK 65
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-26', 'Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 65', 'Mampu menguasai konsep kasus kompleks', 25.00, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan | CPMK: CPMK 66
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-26', 'Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 27'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 27' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 66', 'Mampu mengevaluasi asuhan pada ibu dan anak dalam kondisi rentan', 25.00, 5, 3, 0, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan | CPMK: CPMK 67
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-26', 'Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 27'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 27' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 67', 'Mampu menganalisa kebutuhan dan permasalahan ibu dan anak dalam kondisi rentan', 25.00, 4, 2, 0, v_mk_id, v_bk_id);

  -- MK: Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan | CPMK: CPMK 68
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-26', 'Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 27'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 27' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 68', 'Mampu Mengidentifikasi kasus komplikasi pada maternal dan neonatal secara kritis', 25.00, 2, 3, 0, v_mk_id, v_bk_id);

  -- MK: Gawat darurat maternal dan neonatal | CPMK: CPMK 69
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Gawat darurat maternal dan neonatal' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-27', 'Gawat darurat maternal dan neonatal', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 7' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 69', 'Mampu mengimplementasikan konsep kegawatdaruratan maternal neonatal', 33.33, 3, 2, 2, v_mk_id, v_bk_id);

  -- MK: Gawat darurat maternal dan neonatal | CPMK: CPMK 70
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Gawat darurat maternal dan neonatal' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-27', 'Gawat darurat maternal dan neonatal', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 26'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 26' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 70', 'Mampu menganalisis rujukan pada kasus kegawatdaruratan maternal dan neonatal', 33.33, 4, 3, 2, v_mk_id, v_bk_id);

  -- MK: Gawat darurat maternal dan neonatal | CPMK: CPMK 71
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Gawat darurat maternal dan neonatal' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-27', 'Gawat darurat maternal dan neonatal', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 26'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 26' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 71', 'Mampu mengidentifikasi kasus-cases kegawatdaruratan maternal dan neonatal', 33.33, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Early Clinical Exposure | CPMK: CPMK 72
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Early Clinical Exposure' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-28', 'Early Clinical Exposure', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 2'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 2' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 72', 'Mampu mengevaluasi dan implementasi pengetahuan keterampilan dasar kebidanan', 14.29, 5, 3, 3, v_mk_id, v_bk_id);

  -- MK: Early Clinical Exposure | CPMK: CPMK 73
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Early Clinical Exposure' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-28', 'Early Clinical Exposure', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 14'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 14' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 73', 'Mampu mengevaluasi dan implementasi pengetahuan keterampilan kebidanan pada asuhan kebidanan remaja, pranikah, prakonsepsi', 14.29, 5, 3, 3, v_mk_id, v_bk_id);

  -- MK: Early Clinical Exposure | CPMK: CPMK 74
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Early Clinical Exposure' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-28', 'Early Clinical Exposure', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 14'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 14' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 74', 'Mampu mengevaluasi dan implementasi pengetahuan keterampilan kebidanan pada asuhan kehamilan, persalinan, nifas dan bbl', 14.29, 5, 3, 3, v_mk_id, v_bk_id);

  -- MK: Early Clinical Exposure | CPMK: CPMK 75
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Early Clinical Exposure' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-28', 'Early Clinical Exposure', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 14'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 14' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 75', 'Mampu mengevaluasi dan implementasi pengetahuan keterampilan kebidanan pada asuhan bayi, balita, anak prasekolah', 14.29, 5, 3, 3, v_mk_id, v_bk_id);

  -- MK: Early Clinical Exposure | CPMK: CPMK 76
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Early Clinical Exposure' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-28', 'Early Clinical Exposure', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 14'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 14' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 76', 'Mampu mengevaluasi dan implementasi pengetahuan keterampilan kebidanan perimenopause', 14.29, 5, 3, 3, v_mk_id, v_bk_id);

  -- MK: Early Clinical Exposure | CPMK: CPMK 77
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Early Clinical Exposure' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-28', 'Early Clinical Exposure', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 15'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 15' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 77', 'Mampu mengevaluasi mutu praktik pelayanan kebidanan', 14.29, 4, 3, 2, v_mk_id, v_bk_id);

  -- MK: Early Clinical Exposure | CPMK: CPMK 78
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Early Clinical Exposure' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-28', 'Early Clinical Exposure', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 21'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 21' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 78', 'Mampu mendistribusikan promosi kesehatan, edukasi dan komunikasi', 14.29, 4, 3, 2, v_mk_id, v_bk_id);

  -- MK: Sistem dan teknologi informasi kesehatan | CPMK: CPMK 79
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Sistem dan teknologi informasi kesehatan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-29', 'Sistem dan teknologi informasi kesehatan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 79', 'Mampu mengimplementasikan sistem informasi dalam sistem kesehatan indonesia', 20.00, 3, 2, 2, v_mk_id, v_bk_id);

  -- MK: Sistem dan teknologi informasi kesehatan | CPMK: CPMK 80
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Sistem dan teknologi informasi kesehatan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-29', 'Sistem dan teknologi informasi kesehatan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 80', 'Mampu menganalisis teknologi kesehatan dan teknologi tepat guna', 20.00, 4, 2, 0, v_mk_id, v_bk_id);

  -- MK: Sistem dan teknologi informasi kesehatan | CPMK: CPMK 81
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Sistem dan teknologi informasi kesehatan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-29', 'Sistem dan teknologi informasi kesehatan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 81', 'mampu mengimplementasikan data dan big data dalam penggunaan teknologi informasi', 20.00, 3, 2, 2, v_mk_id, v_bk_id);

  -- MK: Sistem dan teknologi informasi kesehatan | CPMK: CPMK 82
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Sistem dan teknologi informasi kesehatan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-29', 'Sistem dan teknologi informasi kesehatan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 82', 'Mampu mengimplementasikan teknologi informasi dan teknologi kesehatan dalam asuhan manajemen kebidanan', 20.00, 3, 2, 2, v_mk_id, v_bk_id);

  -- MK: Sistem dan teknologi informasi kesehatan | CPMK: CPMK 83
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Sistem dan teknologi informasi kesehatan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-29', 'Sistem dan teknologi informasi kesehatan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 83', 'Mampu mengimplementasikan etika dalam teknologi informasi', 20.00, 3, 3, 0, v_mk_id, v_bk_id);

  -- MK: Kebidanan Komunitas | CPMK: CPMK 84
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Kebidanan Komunitas' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-30', 'Kebidanan Komunitas', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 12'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 12' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 84', 'Mampu mengaplikasikan konsep kesehatan masyarakat dalam kasus pelayanan kebidanan', 33.33, 3, 3, 2, v_mk_id, v_bk_id);

  -- MK: Kebidanan Komunitas | CPMK: CPMK 85
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Kebidanan Komunitas' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-30', 'Kebidanan Komunitas', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 19'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 19' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 85', 'Mampu mengaplikasikan konsep sistem rujukan dalam pelayanan kebidanan', 33.33, 3, 3, 2, v_mk_id, v_bk_id);

  -- MK: Kebidanan Komunitas | CPMK: CPMK 86
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Kebidanan Komunitas' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-30', 'Kebidanan Komunitas', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 28'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 28' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 86', 'Mampu menganalisis konsep teoritis manajemen kebidanan di komunitas', 33.33, 4, 3, 0, v_mk_id, v_bk_id);

  -- MK: Manajemen dan Kepemimpinan dalam Pelayanan Kebidanan | CPMK: CPMK 87
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Manajemen dan Kepemimpinan dalam Pelayanan Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-31', 'Manajemen dan Kepemimpinan dalam Pelayanan Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 3'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 3' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 87', 'Mampu melaksanakan manajemen pengelolaan fasilitas pelayanan kebidanan pada setting laboratorium klinik', 33.33, 3, 3, 3, v_mk_id, v_bk_id);

  -- MK: Manajemen dan Kepemimpinan dalam Pelayanan Kebidanan | CPMK: CPMK 88
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Manajemen dan Kepemimpinan dalam Pelayanan Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-31', 'Manajemen dan Kepemimpinan dalam Pelayanan Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 15'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 15' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 88', 'Mampu mengimplementasikan teknologi dan inovasi dalam pelayanan kebidanan', 33.33, 3, 2, 2, v_mk_id, v_bk_id);

  -- MK: Manajemen dan Kepemimpinan dalam Pelayanan Kebidanan | CPMK: CPMK 89
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Manajemen dan Kepemimpinan dalam Pelayanan Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-31', 'Manajemen dan Kepemimpinan dalam Pelayanan Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 29'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 29' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 89', 'Mampu mengidentifikasi konsep teoritis manajemen kepemimpinan dalam pelayanan kebidanan', 33.33, 2, 2, 0, v_mk_id, v_bk_id);

  -- MK: Penelitian dalam Kebidanan | CPMK: CPMK 90
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Penelitian dalam Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-32', 'Penelitian dalam Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 90', 'Mampu menganalisis konsep penelitian dalam pelayanan kebidanan', 50.00, 4, 2, 0, v_mk_id, v_bk_id);

  -- MK: Penelitian dalam Kebidanan | CPMK: CPMK 91
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Penelitian dalam Kebidanan' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-32', 'Penelitian dalam Kebidanan', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 17'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 17' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 91', 'Mampu mengaplikasikan konsep metode penelitian dan biostatistik dalam penelitian kebidanan', 50.00, 3, 2, 2, v_mk_id, v_bk_id);

  -- MK: Skripsi | CPMK: CPMK 92
  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = 'Skripsi' LIMIT 1;
  IF v_mk_id IS NULL THEN
    v_mk_id := uuid_generate_v4();
    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)
    VALUES (v_mk_id, v_kurikulum_id, 'MK-33', 'Skripsi', 3, 1, 'Wajib');
  END IF;
  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)
  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16'
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = 'BK 16' LIMIT 1;
  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)
  VALUES (uuid_generate_v4(), 'CPMK 92', 'Menyusun laporan karya ilmiah/Skripsi', 100.00, 5, 3, 3, v_mk_id, v_bk_id);

END $$;