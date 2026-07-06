import json
import re

raw_json = '''[
  {
    "no": 1,
    "mata_kuliah": "Fundamental Kebidanan",
    "kode_bk": "BK 4",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 1",
    "deskripsi_cpmk": "Mampu menguraikan konsep bidan sebagai profesi, sejarah, filosofi bidan, paradigma, model praktik kebidanan, kajian perempuan dalam berbagai konteks berlandaskan nilai-nilai Islam dengan tepat",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 1,
    "mata_kuliah": "Fundamental Kebidanan",
    "kode_bk": "BK 4",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 2",
    "deskripsi_cpmk": "Mampu mengidentifikasi model and bentuk asuhan kebidanan serta menguasai konsep berpikir kritis dan reflektif dalam pelayanan kebidanan dengan tepat",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 2,
    "mata_kuliah": "Etika dan Hukum Kesehatan",
    "kode_bk": "BK 1",
    "cpl": "CPL 1",
    "kode_cpmk": "CPMK 3",
    "deskripsi_cpmk": "Mampu menguasai konsep etika, kode etik bidan nasional-internasional, peraturan/ hukum terkait praktik kebidanan dengan menghargai keanekaragaman budaya dengan tepat",
    "kedalaman_k": "K2",
    "kedalaman_a": "A3",
    "kedalaman_p": "P0"
  },
  {
    "no": 2,
    "mata_kuliah": "Etika dan Hukum Kesehatan",
    "kode_bk": "BK 1",
    "cpl": "CPL 1",
    "kode_cpmk": "CPMK 4",
    "deskripsi_cpmk": "Mampu menganalisis nilai personal dan profesional dalam menjalankan praktik kebidanan",
    "kedalaman_k": "K4",
    "kedalaman_a": "A3",
    "kedalaman_p": "P0"
  },
  {
    "no": 3,
    "mata_kuliah": "Anatomi",
    "kode_bk": "BK 5",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 5",
    "deskripsi_cpmk": "Mampu mendeskripsikan konsep dasar anatomi sistem tubuh manusia dengan tepat",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 4,
    "mata_kuliah": "Fisiologi",
    "kode_bk": "BK 5",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 6",
    "deskripsi_cpmk": "Mampu mendeskripsikan konsep dasar fisiologi sistem tubuh manusia dengan tepat",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 5,
    "mata_kuliah": "Biologi Reproduksi",
    "kode_bk": "BK 5",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 7",
    "deskripsi_cpmk": "Mampu menganalisis kajian fisiologi reproduksi manusia, embriologi, organogenesis dalam praktik kebidanan dengan tepat",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 5,
    "mata_kuliah": "Biologi Reproduksi",
    "kode_bk": "BK 5",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 8",
    "deskripsi_cpmk": "Mampu menganalisis kajian genetika dasar dan imunologi dasar dalam praktik kebidanan dengan tepat",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 6,
    "mata_kuliah": "Mikrobiologi dan Parasitologi",
    "kode_bk": "BK 5",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 9",
    "deskripsi_cpmk": "Mampu menguraikan mikrobiologi dan parasitologi yang terkait dalam praktik kebidanan dengan tepat",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 7,
    "mata_kuliah": "Fisika Kesehatan",
    "kode_bk": "BK 5",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 10",
    "deskripsi_cpmk": "Mampu menguraikan kajian fisika kesehatan dalam praktik kebidanan dengan tepat",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 7,
    "mata_kuliah": "Fisika Kesehatan",
    "kode_bk": "BK 5",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 11",
    "deskripsi_cpmk": "Mampu menganalisis kajian fisika kesehatan dan biokimia dalam studi kasus kebidanan dengan tepat",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 8,
    "mata_kuliah": "Biokimia",
    "kode_bk": "BK 5",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 12",
    "deskripsi_cpmk": "Mampu menguraikan kajian fisika kesehatan dalam praktik kebidanan dengan tepat",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 8,
    "mata_kuliah": "Biokimia",
    "kode_bk": "BK 5",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 13",
    "deskripsi_cpmk": "Mampu menganalisis kajian fisika kesehatan dan biokimia dalam studi kasus kebidanan dengan tepat",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 9,
    "mata_kuliah": "Farmakologi dalam Asuhan Kebidanan",
    "kode_bk": "BK 6",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 14",
    "deskripsi_cpmk": "Mampu mendeskripsikan konsep dasar dan prinsip farmakologi dengan tepat",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 9,
    "mata_kuliah": "Farmakologi dalam Asuhan Kebidanan",
    "kode_bk": "BK 6",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 15",
    "deskripsi_cpmk": "Mampu melakukan pengelolaan obat dalam asuhan kebidanan dengan tepat",
    "kedalaman_k": "K3",
    "kedalaman_a": "A2",
    "kedalaman_p": "P2"
  },
  {
    "no": 10,
    "mata_kuliah": "Keterampilan Dasar Kebidanan",
    "kode_bk": "BK 13",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 16",
    "deskripsi_cpmk": "Mampu mengaplikasikan konsep patient safety dan pengendalian infeksi",
    "kedalaman_k": "K3",
    "kedalaman_a": "A2",
    "kedalaman_p": "P2"
  },
  {
    "no": 10,
    "mata_kuliah": "Keterampilan Dasar Kebidanan",
    "kode_bk": "BK 22",
    "cpl": "CPL 5",
    "kode_cpmk": "CPMK 17",
    "deskripsi_cpmk": "Mampu menganalisis kebutuhan dasar manusia dengan tepat",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 10,
    "mata_kuliah": "Keterampilan Dasar Kebidanan",
    "kode_bk": "BK 23, BK 24, BK 25",
    "cpl": "CPL 5",
    "kode_cpmk": "CPMK 18",
    "deskripsi_cpmk": "Mampu mengaplikasikan keterampilan dasar praktik kebidanan dan bantuan hidup dasar dalam setting laboratorium klinik, simulasi, dan pengenalan awal di wahana praktik",
    "kedalaman_k": "K3",
    "kedalaman_a": "A3",
    "kedalaman_p": "P3"
  },
  {
    "no": 11,
    "mata_kuliah": "Komunikasi Kebidanan",
    "kode_bk": "BK 18",
    "cpl": "CPL 4",
    "kode_cpmk": "CPMK 19",
    "deskripsi_cpmk": "Mampu menganalisis konsep dasar dan teknik komunikasi serta menunjukan keterampilan komunikasi efektif dalam praktik kebidanan",
    "kedalaman_k": "K4",
    "kedalaman_a": "A3",
    "kedalaman_p": "P3"
  },
  {
    "no": 11,
    "mata_kuliah": "Komunikasi Kebidanan",
    "kode_bk": "BK 18",
    "cpl": "CPL 4",
    "kode_cpmk": "CPMK 20",
    "deskripsi_cpmk": "Mampu menunjukan implementasi nilai profesional bidan dalam konseling secara kritis dan etis",
    "kedalaman_k": "K3",
    "kedalaman_a": "A5",
    "kedalaman_p": "P3"
  },
  {
    "no": 11,
    "mata_kuliah": "Komunikasi Kebidanan",
    "kode_bk": "BK 21",
    "cpl": "CPL 4",
    "kode_cpmk": "CPMK 21",
    "deskripsi_cpmk": "Mampu menunjukan komunikasi interprofesional",
    "kedalaman_k": "K3",
    "kedalaman_a": "A4",
    "kedalaman_p": "P3"
  },
  {
    "no": 12,
    "mata_kuliah": "Profesionalisme dalam Kebidanan",
    "kode_bk": "BK 3",
    "cpl": "CPL 1",
    "kode_cpmk": "CPMK 22",
    "deskripsi_cpmk": "Mampu menganalisis tanggung jawab bidan dan pengembangan profesionalisme",
    "kedalaman_k": "K4",
    "kedalaman_a": "A3",
    "kedalaman_p": "P0"
  },
  {
    "no": 12,
    "mata_kuliah": "Profesionalisme dalam Kebidanan",
    "kode_bk": "BK 3",
    "cpl": "CPL 1",
    "kode_cpmk": "CPMK 23",
    "deskripsi_cpmk": "Mampu menerapkan manajemen dan dokumentasi kebidanan secara profesional dan komprehensif",
    "kedalaman_k": "K3",
    "kedalaman_a": "A4",
    "kedalaman_p": "P2"
  },
  {
    "no": 12,
    "mata_kuliah": "Profesionalisme dalam Kebidanan",
    "kode_bk": "BK 3",
    "cpl": "CPL 1",
    "kode_cpmk": "CPMK 24",
    "deskripsi_cpmk": "Mampu melakukan refleksi berkaitan dengan nilai profesional pada kasus kebidanan secara kritis",
    "kedalaman_k": "K4",
    "kedalaman_a": "A4",
    "kedalaman_p": "P0"
  },
  {
    "no": 12,
    "mata_kuliah": "Profesionalisme dalam Kebidanan",
    "kode_bk": "BK 20",
    "cpl": "CPL 4",
    "kode_cpmk": "CPMK 25",
    "deskripsi_cpmk": "Mampu mengaplikasikan kerja sama efektif intra dan interprofesional dalam pelayanan kebidanan",
    "kedalaman_k": "K3",
    "kedalaman_a": "A4",
    "kedalaman_p": "P3"
  },
  {
    "no": 13,
    "mata_kuliah": "Kebidanan Berbasis Bukti",
    "kode_bk": "BK 14",
    "cpl": "CPL 3",
    "kode_cpmk": "CPMK 26",
    "deskripsi_cpmk": "Mampu melakukan pencarian bukti ilmiah, critical appraisal, dan menghubungkan konsep dasar evidence based practice dan evidence based midwifery dengan benar",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P2"
  },
  {
    "no": 13,
    "mata_kuliah": "Kebidanan Berbasis Bukti",
    "kode_bk": "BK 16, BK 7, BK 8",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 27",
    "deskripsi_cpmk": "Mampu menyusun deskripsi saintifik evidence based practice dalam menganalisa informasi dan data",
    "kedalaman_k": "K5",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 14,
    "mata_kuliah": "Ilmu Dasar Kebidanan",
    "kode_bk": "BK 7",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 28",
    "deskripsi_cpmk": "mampu menguraikan konsep fisiologis Kehamilan, Persalinan, Nifas, menyusui serta kesejahteraan janin untuk menunjang diagnosis kebidanan",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 14,
    "mata_kuliah": "Ilmu Dasar Kebidanan",
    "kode_bk": "BK 7",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 29",
    "deskripsi_cpmk": "mampu menganalisis komplikasi obstetrik, penyakit dan kelainan dalam kasus maternal dengan tepat menggunakan alat tepat guna",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P2"
  },
  {
    "no": 15,
    "mata_kuliah": "Ilmu Kesehatan Anak",
    "kode_bk": "BK 8",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 30",
    "deskripsi_cpmk": "mampu mengidentifikasi konsep dasar perawatan, pertumbuhan, perkembangan pada bayi dan anak yang berkaitan dalam praktik pelayanan kebidanan dengan lengkap",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 15,
    "mata_kuliah": "Ilmu Kesehatan Anak",
    "kode_bk": "BK 8",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 31",
    "deskripsi_cpmk": "mampu menganalisis penyimpangan, penyakit dan masalah dan prinsip farmakoterapi pada bayi dan anak secara kritis, etis dan berbasis bukti.",
    "kedalaman_k": "K4",
    "kedalaman_a": "A3",
    "kedalaman_p": "P0"
  },
  {
    "no": 15,
    "mata_kuliah": "Ilmu Kesehatan Anak",
    "kode_bk": "BK 22, BK 23",
    "cpl": "CPL 4",
    "kode_cpmk": "CPMK 32",
    "deskripsi_cpmk": "mampu menganalisis kebutuhan dasar pada bayi dan anak normal dan dengan gangguan pertumbuhan dan perkembangan anak serta berkebutuhan khusus secara tepat",
    "kedalaman_k": "K4",
    "kedalaman_a": "A3",
    "kedalaman_p": "P0"
  },
  {
    "no": 16,
    "mata_kuliah": "Gizi dalam Kebidanan",
    "kode_bk": "BK 9",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 33",
    "deskripsi_cpmk": "mampu mengidentifikasi konsep dasar Gizi dalam praktik kebidanan secara kritis",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 16,
    "mata_kuliah": "Gizi dalam Kebidanan",
    "kode_bk": "BK 9",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 34",
    "deskripsi_cpmk": "mampu menganalisis kebutuhan dan pemenuhan gizi dalam praktik pelayanan kebidanan secara kritis",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 17,
    "mata_kuliah": "Psikologi dalam Praktik Kebidanan",
    "kode_bk": "BK 10",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 35",
    "deskripsi_cpmk": "mampu mengidentifikasi konsep teoritis konsep teoritis ilmu psikologi dalam praktik kebidanan dengan tepat",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 17,
    "mata_kuliah": "Psikologi dalam Praktik Kebidanan",
    "kode_bk": "BK 10",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 36",
    "deskripsi_cpmk": "mampu menganalisis kasus-kasus psikologi dalam praktik kebidanan pada maternal dan perinatal di seluruh siklus reproduksi",
    "kedalaman_k": "K4",
    "kedalaman_a": "A3",
    "kedalaman_p": "P0"
  },
  {
    "no": 17,
    "mata_kuliah": "Psikologi dalam Praktik Kebidanan",
    "kode_bk": "BK 10",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 37",
    "deskripsi_cpmk": "mampu merancang asuhan pelayanan kebidanan pada kasus psikologis dalam praktik kebidanan",
    "kedalaman_k": "K5",
    "kedalaman_a": "A3",
    "kedalaman_p": "P0"
  },
  {
    "no": 18,
    "mata_kuliah": "Asuhan Kebidanan pada Remaja, Pranikah dan Prakonsepsi",
    "kode_bk": "BK 11",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 38",
    "deskripsi_cpmk": "Mampu mengidentifikasi konsep dasar, filosofi, prinsip dan profesionalisme dalam asuhan kebidanan pada remaja, pra nikah dan pra konsepsi",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 18,
    "mata_kuliah": "Asuhan Kebidanan pada Remaja, Pranikah dan Prakonsepsi",
    "kode_bk": "BK 21",
    "cpl": "CPL 4",
    "kode_cpmk": "CPMK 39",
    "deskripsi_cpmk": "Mampu melakukan persiapan perencanaan kehamilan sehat",
    "kedalaman_k": "K3",
    "kedalaman_a": "A3",
    "kedalaman_p": "P2"
  },
  {
    "no": 18,
    "mata_kuliah": "Asuhan Kebidanan pada Remaja, Pranikah dan Prakonsepsi",
    "kode_bk": "BK 24, BK 25",
    "cpl": "CPL 5",
    "kode_cpmk": "CPMK 40",
    "deskripsi_cpmk": "Mampu mengintegrasikan asuhan kebidanan pada remaja, pranikah dan prakonsepsi berdasarkan evidence based dengan berlandaskan nilai-nilai Islam",
    "kedalaman_k": "K5",
    "kedalaman_a": "A4",
    "kedalaman_p": "P3"
  },
  {
    "no": 19,
    "mata_kuliah": "Asuhan Kebidanan pada Kehamilan",
    "kode_bk": "BK 7",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 41",
    "deskripsi_cpmk": "Mampu mengidentifikasi konsep dasar, filosofi, prinsip and profesionalisme dalam asuhan kebidanan kehamilan",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 19,
    "mata_kuliah": "Asuhan Kebidanan pada Kehamilan",
    "kode_bk": "BK 7",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 42",
    "deskripsi_cpmk": "Mampu menganalisis perubahan dan adaptasi fisiologis dalam kehamilan",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 19,
    "mata_kuliah": "Asuhan Kebidanan pada Kehamilan",
    "kode_bk": "BK 24, BK 25",
    "cpl": "CPL 5",
    "kode_cpmk": "CPMK 43",
    "deskripsi_cpmk": "Mampu mengintegrasikan Asuhan kebidanan pada kehamilan berdasarkan evidence base berlandaskan nilai-nilai Islam",
    "kedalaman_k": "K5",
    "kedalaman_a": "A4",
    "kedalaman_p": "P3"
  },
  {
    "no": 20,
    "mata_kuliah": "Asuhan Kebidanan pada Persalinan dan Bayi Baru Lahir",
    "kode_bk": "BK 7",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 44",
    "deskripsi_cpmk": "Mampu mengidentifikasi konsep dasar, filosofi, prinsip dan profesionalisme dalam asuhan kebidanan pada persalinan dan bayi baru lahir",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 20,
    "mata_kuliah": "Asuhan Kebidanan pada Persalinan dan Bayi Baru Lahir",
    "kode_bk": "BK 7",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 45",
    "deskripsi_cpmk": "Mampu menganalisis perubahan dan adaptasi fisiologis pada persalinan dan bayi baru lahir",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 20,
    "mata_kuliah": "Asuhan Kebidanan pada Persalinan dan Bayi Baru Lahir",
    "kode_bk": "BK 24, BK 25",
    "cpl": "CPL 5",
    "kode_cpmk": "CPMK 46",
    "deskripsi_cpmk": "Mampu mengintegrasikan Asuhan Kebidanan pada persalinan dan bayi baru lahir berdasarkan evidence based berlandaskan nilai-nilai Islam",
    "kedalaman_k": "K5",
    "kedalaman_a": "A4",
    "kedalaman_p": "P3"
  },
  {
    "no": 21,
    "mata_kuliah": "Asuhan Kebidanan pada Nifas dan Menyusui",
    "kode_bk": "BK 7",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 47",
    "deskripsi_cpmk": "Mampu mengidentifikasi konsep dasar, filosofi, prinsip dan profesionalisme dalam asuhan kebidanan pada nifas dan menyusui",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 21,
    "mata_kuliah": "Asuhan Kebidanan pada Nifas dan Menyusui",
    "kode_bk": "BK 7",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 48",
    "deskripsi_cpmk": "Mampu menganalisis perubahan dan adaptasi fisiologi pada nifas dan menyusui",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 21,
    "mata_kuliah": "Asuhan Kebidanan pada Nifas dan Menyusui",
    "kode_bk": "BK 24, BK 25",
    "cpl": "CPL 5",
    "kode_cpmk": "CPMK 49",
    "deskripsi_cpmk": "Mampu mengintegrasikan Asuhan kebidanan pada nifas dan menyusui berdasarkan evidence base berlandaskan nilai-nilai Islam",
    "kedalaman_k": "K5",
    "kedalaman_a": "A4",
    "kedalaman_p": "P3"
  },
  {
    "no": 22,
    "mata_kuliah": "Keluarga Berencana dan Pelayanan Kontrasepsi",
    "kode_bk": "BK 11",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 50",
    "deskripsi_cpmk": "Mampu mengidentifikasi konsep dasar, filosofi, prinsip dan profesionalisme pada KB dan Pelayanan Kontrasepsi",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 22,
    "mata_kuliah": "Keluarga Berencana dan Pelayanan Kontrasepsi",
    "kode_bk": "BK 11",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 51",
    "deskripsi_cpmk": "Mampu menganalisis KB dan pelayanan kontrasepsi dalam pandangan Islam",
    "kedalaman_k": "K4",
    "kedalaman_a": "A3",
    "kedalaman_p": "P0"
  },
  {
    "no": 22,
    "mata_kuliah": "Keluarga Berencana dan Pelayanan Kontrasepsi",
    "kode_bk": "BK 25",
    "cpl": "CPL 5",
    "kode_cpmk": "CPMK 52",
    "deskripsi_cpmk": "Mampu melaksanakan manajemen pelayanan kontrasepsi, kontrasepsi darurat dan asuhan pasca keguguran",
    "kedalaman_k": "K3",
    "kedalaman_a": "A3",
    "kedalaman_p": "P3"
  },
  {
    "no": 22,
    "mata_kuliah": "Keluarga Berencana dan Pelayanan Kontrasepsi",
    "kode_bk": "BK 25",
    "cpl": "CPL 5",
    "kode_cpmk": "CPMK 53",
    "deskripsi_cpmk": "Mampu mengintegrasikan pelayanan kontrasepsi berbagai metode berbasis evidence based",
    "kedalaman_k": "K5",
    "kedalaman_a": "A3",
    "kedalaman_p": "P3"
  },
  {
    "no": 23,
    "mata_kuliah": "Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah",
    "kode_bk": "BK 8",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 54",
    "deskripsi_cpmk": "Mampu mengidentifikasi konsep dasar, filosofi, prinsip dan profesionalisme dalam asuhan kebidanan bayi, balita dan anak pra sekolah",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 23,
    "mata_kuliah": "Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah",
    "kode_bk": "BK 8",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 55",
    "deskripsi_cpmk": "Mampu menganalisis perubahan dan adaptasi fisiologis pada bayi, balita dan anak pra sekolah",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 23,
    "mata_kuliah": "Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah",
    "kode_bk": "BK 25",
    "cpl": "CPL 5",
    "kode_cpmk": "CPMK 56",
    "deskripsi_cpmk": "Mampu mengintegrasikan asuhan kebidanan pada bayi, balita dan anak pra sekolah berdasarkan evidence based dan berlandaskan nilai-nilai islam",
    "kedalaman_k": "K5",
    "kedalaman_a": "A4",
    "kedalaman_p": "P3"
  },
  {
    "no": 23,
    "mata_kuliah": "Asuhan kebidanan pada Bayi, Balita dan Anak Pra Sekolah",
    "kode_bk": "BK 27",
    "cpl": "CPL 6",
    "kode_cpmk": "CPMK 57",
    "deskripsi_cpmk": "Mampu mendeteksi masalah dan kelainan yang biasa terjadi pada bayi, balita dan anak pra sekolah",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P2"
  },
  {
    "no": 24,
    "mata_kuliah": "Kesehatan Reproduksi dan Klimakterium",
    "kode_bk": "BK 11",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 58",
    "deskripsi_cpmk": "Mampu mengidentifikasi konsep dasar, filosofi, prinsip dan profesionalisme dalam kesehatan reproduksi dan klimakterium",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 24,
    "mata_kuliah": "Kesehatan Reproduksi dan Klimakterium",
    "kode_bk": "BK 25",
    "cpl": "CPL 5",
    "kode_cpmk": "CPMK 59",
    "deskripsi_cpmk": "Mampu mendeteksi masalah dan gangguan sistem reproduksi sepanjang siklus daur hidup perempuan",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P2"
  },
  {
    "no": 24,
    "mata_kuliah": "Kesehatan Reproduksi dan Klimakterium",
    "kode_bk": "BK 25",
    "cpl": "CPL 5",
    "kode_cpmk": "CPMK 60",
    "deskripsi_cpmk": "Mampu mengintegrasikan asuhan kebidanan pada kesehatan reproduksi, klimakterium dan abortus berdasarkan evidence based dan berlandaskan nilai-nilai islam",
    "kedalaman_k": "K5",
    "kedalaman_a": "A4",
    "kedalaman_p": "P3"
  },
  {
    "no": 25,
    "mata_kuliah": "Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana",
    "kode_bk": "BK 11",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 61",
    "deskripsi_cpmk": "Mampu menjelaskan konsep dasar kasus kritis",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 25,
    "mata_kuliah": "Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana",
    "kode_bk": "BK 30",
    "cpl": "CPL 7",
    "kode_cpmk": "CPMK 62",
    "deskripsi_cpmk": "Membangun jejaring dalam asuhan kebidanan pada situasi krisis dan bencana",
    "kedalaman_k": "K5",
    "kedalaman_a": "A4",
    "kedalaman_p": "P3"
  },
  {
    "no": 25,
    "mata_kuliah": "Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana",
    "kode_bk": "BK 30",
    "cpl": "CPL 7",
    "kode_cpmk": "CPMK 63",
    "deskripsi_cpmk": "Mampu memberikan asuhan kebidanan pada situasi kritis dan bencana",
    "kedalaman_k": "K3",
    "kedalaman_a": "A3",
    "kedalaman_p": "P3"
  },
  {
    "no": 25,
    "mata_kuliah": "Manajemen Pelayanan Kebidanan pada Situasi Krisis dan Bencana",
    "kode_bk": "BK 30",
    "cpl": "CPL 7",
    "kode_cpmk": "CPMK 64",
    "deskripsi_cpmk": "Mampu mengidentifikasi kebutuhan dan permasalahan ibu dan anak serta kesehatan reproduksi pada masa situasi krisis dan bencana",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 26,
    "mata_kuliah": "Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan",
    "kode_bk": "BK 7",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 65",
    "deskripsi_cpmk": "Mampu menguasai konsep kasus kompleks",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 26,
    "mata_kuliah": "Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan",
    "kode_bk": "BK 27",
    "cpl": "CPL 6",
    "kode_cpmk": "CPMK 66",
    "deskripsi_cpmk": "Mampu mengevaluasi asuhan pada ibu dan anak dalam kondisi rentan",
    "kedalaman_k": "K5",
    "kedalaman_a": "A3",
    "kedalaman_p": "P0"
  },
  {
    "no": 26,
    "mata_kuliah": "Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan",
    "kode_bk": "BK 27",
    "cpl": "CPL 6",
    "kode_cpmk": "CPMK 67",
    "deskripsi_cpmk": "Mampu menganalisa kebutuhan dan permasalahan ibu dan anak dalam kondisi rentan",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 26,
    "mata_kuliah": "Asuhan Kebidanan pada Kasus Kompleks dan Kelompok Rentan",
    "kode_bk": "BK 27",
    "cpl": "CPL 6",
    "kode_cpmk": "CPMK 68",
    "deskripsi_cpmk": "Mampu Mengidentifikasi kasus komplikasi pada maternal dan neonatal secara kritis",
    "kedalaman_k": "K2",
    "kedalaman_a": "A3",
    "kedalaman_p": "P0"
  },
  {
    "no": 27,
    "mata_kuliah": "Gawat darurat maternal dan neonatal",
    "kode_bk": "BK 7",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 69",
    "deskripsi_cpmk": "Mampu mengimplementasikan konsep kegawatdaruratan maternal neonatal",
    "kedalaman_k": "K3",
    "kedalaman_a": "A2",
    "kedalaman_p": "P2"
  },
  {
    "no": 27,
    "mata_kuliah": "Gawat darurat maternal dan neonatal",
    "kode_bk": "BK 26",
    "cpl": "CPL 6",
    "kode_cpmk": "CPMK 70",
    "deskripsi_cpmk": "Mampu menganalisis rujukan pada kasus kegawatdaruratan maternal dan neonatal",
    "kedalaman_k": "K4",
    "kedalaman_a": "A3",
    "kedalaman_p": "P2"
  },
  {
    "no": 27,
    "mata_kuliah": "Gawat darurat maternal dan neonatal",
    "kode_bk": "BK 26",
    "cpl": "CPL 6",
    "kode_cpmk": "CPMK 71",
    "deskripsi_cpmk": "Mampu mengidentifikasi kasus-cases kegawatdaruratan maternal dan neonatal",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 28,
    "mata_kuliah": "Early Clinical Exposure",
    "kode_bk": "BK 2",
    "cpl": "CPL 1",
    "kode_cpmk": "CPMK 72",
    "deskripsi_cpmk": "Mampu mengevaluasi dan implementasi pengetahuan keterampilan dasar kebidanan",
    "kedalaman_k": "K5",
    "kedalaman_a": "A3",
    "kedalaman_p": "P3"
  },
  {
    "no": 28,
    "mata_kuliah": "Early Clinical Exposure",
    "kode_bk": "BK 14",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 73",
    "deskripsi_cpmk": "Mampu mengevaluasi dan implementasi pengetahuan keterampilan kebidanan pada asuhan kebidanan remaja, pranikah, prakonsepsi",
    "kedalaman_k": "K5",
    "kedalaman_a": "A3",
    "kedalaman_p": "P3"
  },
  {
    "no": 28,
    "mata_kuliah": "Early Clinical Exposure",
    "kode_bk": "BK 14",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 74",
    "deskripsi_cpmk": "Mampu mengevaluasi dan implementasi pengetahuan keterampilan kebidanan pada asuhan kehamilan, persalinan, nifas dan bbl",
    "kedalaman_k": "K5",
    "kedalaman_a": "A3",
    "kedalaman_p": "P3"
  },
  {
    "no": 28,
    "mata_kuliah": "Early Clinical Exposure",
    "kode_bk": "BK 14",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 75",
    "deskripsi_cpmk": "Mampu mengevaluasi dan implementasi pengetahuan keterampilan kebidanan pada asuhan bayi, balita, anak prasekolah",
    "kedalaman_k": "K5",
    "kedalaman_a": "A3",
    "kedalaman_p": "P3"
  },
  {
    "no": 28,
    "mata_kuliah": "Early Clinical Exposure",
    "kode_bk": "BK 14",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 76",
    "deskripsi_cpmk": "Mampu mengevaluasi dan implementasi pengetahuan keterampilan kebidanan perimenopause",
    "kedalaman_k": "K5",
    "kedalaman_a": "A3",
    "kedalaman_p": "P3"
  },
  {
    "no": 28,
    "mata_kuliah": "Early Clinical Exposure",
    "kode_bk": "BK 15",
    "cpl": "CPL 3",
    "kode_cpmk": "CPMK 77",
    "deskripsi_cpmk": "Mampu mengevaluasi mutu praktik pelayanan kebidanan",
    "kedalaman_k": "K4",
    "kedalaman_a": "A3",
    "kedalaman_p": "P2"
  },
  {
    "no": 28,
    "mata_kuliah": "Early Clinical Exposure",
    "kode_bk": "BK 21",
    "cpl": "CPL 4",
    "kode_cpmk": "CPMK 78",
    "deskripsi_cpmk": "Mampu mendistribusikan promosi kesehatan, edukasi dan komunikasi",
    "kedalaman_k": "K4",
    "kedalaman_a": "A3",
    "kedalaman_p": "P2"
  },
  {
    "no": 29,
    "mata_kuliah": "Sistem dan teknologi informasi kesehatan",
    "kode_bk": "BK 16",
    "cpl": "CPL 3",
    "kode_cpmk": "CPMK 79",
    "deskripsi_cpmk": "Mampu mengimplementasikan sistem informasi dalam sistem kesehatan indonesia",
    "kedalaman_k": "K3",
    "kedalaman_a": "A2",
    "kedalaman_p": "P2"
  },
  {
    "no": 29,
    "mata_kuliah": "Sistem dan teknologi informasi kesehatan",
    "kode_bk": "BK 16",
    "cpl": "CPL 3",
    "kode_cpmk": "CPMK 80",
    "deskripsi_cpmk": "Mampu menganalisis teknologi kesehatan dan teknologi tepat guna",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 29,
    "mata_kuliah": "Sistem dan teknologi informasi kesehatan",
    "kode_bk": "BK 16",
    "cpl": "CPL 3",
    "kode_cpmk": "CPMK 81",
    "deskripsi_cpmk": "mampu mengimplementasikan data dan big data dalam penggunaan teknologi informasi",
    "kedalaman_k": "K3",
    "kedalaman_a": "A2",
    "kedalaman_p": "P2"
  },
  {
    "no": 29,
    "mata_kuliah": "Sistem dan teknologi informasi kesehatan",
    "kode_bk": "BK 16",
    "cpl": "CPL 3",
    "kode_cpmk": "CPMK 82",
    "deskripsi_cpmk": "Mampu mengimplementasikan teknologi informasi dan teknologi kesehatan dalam asuhan manajemen kebidanan",
    "kedalaman_k": "K3",
    "kedalaman_a": "A2",
    "kedalaman_p": "P2"
  },
  {
    "no": 29,
    "mata_kuliah": "Sistem dan teknologi informasi kesehatan",
    "kode_bk": "BK 16",
    "cpl": "CPL 3",
    "kode_cpmk": "CPMK 83",
    "deskripsi_cpmk": "Mampu mengimplementasikan etika dalam teknologi informasi",
    "kedalaman_k": "K3",
    "kedalaman_a": "A3",
    "kedalaman_p": "P0"
  },
  {
    "no": 30,
    "mata_kuliah": "Kebidanan Komunitas",
    "kode_bk": "BK 12",
    "cpl": "CPL 2",
    "kode_cpmk": "CPMK 84",
    "deskripsi_cpmk": "Mampu mengaplikasikan konsep kesehatan masyarakat dalam kasus pelayanan kebidanan",
    "kedalaman_k": "K3",
    "kedalaman_a": "A3",
    "kedalaman_p": "P2"
  },
  {
    "no": 30,
    "mata_kuliah": "Kebidanan Komunitas",
    "kode_bk": "BK 19",
    "cpl": "CPL 4",
    "kode_cpmk": "CPMK 85",
    "deskripsi_cpmk": "Mampu mengaplikasikan konsep sistem rujukan dalam pelayanan kebidanan",
    "kedalaman_k": "K3",
    "kedalaman_a": "A3",
    "kedalaman_p": "P2"
  },
  {
    "no": 30,
    "mata_kuliah": "Kebidanan Komunitas",
    "kode_bk": "BK 28",
    "cpl": "CPL 7",
    "kode_cpmk": "CPMK 86",
    "deskripsi_cpmk": "Mampu menganalisis konsep teoritis manajemen kebidanan di komunitas",
    "kedalaman_k": "K4",
    "kedalaman_a": "A3",
    "kedalaman_p": "P0"
  },
  {
    "no": 31,
    "mata_kuliah": "Manajemen dan Kepemimpinan dalam Pelayanan Kebidanan",
    "kode_bk": "BK 3",
    "cpl": "CPL 1",
    "kode_cpmk": "CPMK 87",
    "deskripsi_cpmk": "Mampu melaksanakan manajemen pengelolaan fasilitas pelayanan kebidanan pada setting laboratorium klinik",
    "kedalaman_k": "K3",
    "kedalaman_a": "A3",
    "kedalaman_p": "P3"
  },
  {
    "no": 31,
    "mata_kuliah": "Manajemen dan Kepemimpinan dalam Pelayanan Kebidanan",
    "kode_bk": "BK 15",
    "cpl": "CPL 3",
    "kode_cpmk": "CPMK 88",
    "deskripsi_cpmk": "Mampu mengimplementasikan teknologi dan inovasi dalam pelayanan kebidanan",
    "kedalaman_k": "K3",
    "kedalaman_a": "A2",
    "kedalaman_p": "P2"
  },
  {
    "no": 31,
    "mata_kuliah": "Manajemen dan Kepemimpinan dalam Pelayanan Kebidanan",
    "kode_bk": "BK 29",
    "cpl": "CPL 7",
    "kode_cpmk": "CPMK 89",
    "deskripsi_cpmk": "Mampu mengidentifikasi konsep teoritis manajemen kepemimpinan dalam pelayanan kebidanan",
    "kedalaman_k": "K2",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 32,
    "mata_kuliah": "Penelitian dalam Kebidanan",
    "kode_bk": "BK 16",
    "cpl": "CPL 3",
    "kode_cpmk": "CPMK 90",
    "deskripsi_cpmk": "Mampu menganalisis konsep penelitian dalam pelayanan kebidanan",
    "kedalaman_k": "K4",
    "kedalaman_a": "A2",
    "kedalaman_p": "P0"
  },
  {
    "no": 32,
    "mata_kuliah": "Penelitian dalam Kebidanan",
    "kode_bk": "BK 17",
    "cpl": "CPL 3",
    "kode_cpmk": "CPMK 91",
    "deskripsi_cpmk": "Mampu mengaplikasikan konsep metode penelitian dan biostatistik dalam penelitian kebidanan",
    "kedalaman_k": "K3",
    "kedalaman_a": "A2",
    "kedalaman_p": "P2"
  },
  {
    "no": 33,
    "mata_kuliah": "Skripsi",
    "kode_bk": "BK 16",
    "cpl": "CPL 3",
    "kode_cpmk": "CPMK 92",
    "deskripsi_cpmk": "Menyusun laporan karya ilmiah/Skripsi",
    "kedalaman_k": "K5",
    "kedalaman_a": "A3",
    "kedalaman_p": "P3"
  }
]'''

items = json.loads(raw_json)

def parse_num(val):
    if not val:
        return 0
    m = re.search(r'\d+', val)
    return int(m.group(0)) if m else 0

sql_output = []
sql_output.append("-- Seeder CPMK untuk Prodi Kebidanan")
sql_output.append("-- Dibuat otomatis berdasarkan JSON data CPMK (92 item)")
sql_output.append("")
sql_output.append("DO $$")
sql_output.append("DECLARE")
sql_output.append("  v_prodi_id uuid;")
sql_output.append("  v_kurikulum_id uuid;")
sql_output.append("  v_jurusan_id uuid;")
sql_output.append("  v_mk_id uuid;")
sql_output.append("  v_bk_id uuid;")
sql_output.append("  v_cpl_id uuid;")
sql_output.append("BEGIN")
sql_output.append("  -- 1. Dapatkan atau Buat Prodi Kebidanan")
sql_output.append("  SELECT id INTO v_prodi_id FROM prodi WHERE nama ILIKE '%Kebidanan%' LIMIT 1;")
sql_output.append("  IF v_prodi_id IS NULL THEN")
sql_output.append("    SELECT id INTO v_jurusan_id FROM jurusan LIMIT 1;")
sql_output.append("    IF v_jurusan_id IS NULL THEN")
sql_output.append("      v_jurusan_id := uuid_generate_v4();")
sql_output.append("      INSERT INTO jurusan (id, nama) VALUES (v_jurusan_id, 'Fakultas Ilmu Kesehatan');")
sql_output.append("    END IF;")
sql_output.append("    v_prodi_id := uuid_generate_v4();")
sql_output.append("    INSERT INTO prodi (id, nama, jurusan_id) VALUES (v_prodi_id, 'Kebidanan', v_jurusan_id);")
sql_output.append("  END IF;")
sql_output.append("")
sql_output.append("  -- 2. Dapatkan atau Buat Kurikulum Kebidanan")
sql_output.append("  SELECT id INTO v_kurikulum_id FROM kurikulum WHERE prodi_id = v_prodi_id LIMIT 1;")
sql_output.append("  IF v_kurikulum_id IS NULL THEN")
sql_output.append("    v_kurikulum_id := uuid_generate_v4();")
sql_output.append("    INSERT INTO kurikulum (id, prodi_id, nama, tahun_berlaku)")
sql_output.append("    VALUES (v_kurikulum_id, v_prodi_id, 'Kurikulum Kebidanan OBE 2024', 2024);")
sql_output.append("  END IF;")
sql_output.append("")
sql_output.append("  -- 3. Loop / Insert CPMK dan Relasinya")

# Group by mata_kuliah to calculate weights if needed, or set default 0.0
# Or calculate equal weights per mata_kuliah (100 / count_cpmk)

mk_counts = {}
for item in items:
    mk = item["mata_kuliah"]
    mk_counts[mk] = mk_counts.get(mk, 0) + 1

# Collect all unique BK and CPL codes
unique_bks = set()
unique_cpls = set()
for item in items:
    bks = [b.strip() for b in item["kode_bk"].split(",")]
    for b in bks:
        unique_bks.add(b)
    unique_cpls.add(item["cpl"].strip())

sql_output.append("  -- Ensure CPL records exist for Kurikulum")
for cpl in sorted(list(unique_cpls)):
    sql_output.append(f"  INSERT INTO cpl (id, kurikulum_id, kode, deskripsi) VALUES (uuid_generate_v4(), v_kurikulum_id, '{cpl}', '{cpl} Kebidanan') ON CONFLICT DO NOTHING;")

sql_output.append("")
sql_output.append("  -- Ensure Bahan Kajian (BK) records exist for Kurikulum")
for bk in sorted(list(unique_bks), key=lambda x: parse_num(x)):
    sql_output.append(f"  IF NOT EXISTS (SELECT 1 FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = '{bk}') THEN")
    sql_output.append(f"    INSERT INTO bahan_kajian (id, kurikulum_id, kode, nama) VALUES (uuid_generate_v4(), v_kurikulum_id, '{bk}', 'Bahan Kajian {bk}');")
    sql_output.append(f"  END IF;")

sql_output.append("")

for item in items:
    mk_nama = item["mata_kuliah"].replace("'", "''")
    cpmk_kode = item["kode_cpmk"].replace("'", "''")
    cpmk_desk = item["deskripsi_cpmk"].replace("'", "''")
    k_val = parse_num(item["kedalaman_k"])
    a_val = parse_num(item["kedalaman_a"])
    p_val = parse_num(item["kedalaman_p"])
    
    # Primary BK code (first one if multiple)
    bk_first = item["kode_bk"].split(",")[0].strip()
    
    # Calculate weight per CPMK under course (100 / count, rounded)
    count = mk_counts[item["mata_kuliah"]]
    bobot = round(100.0 / count, 2)
    
    sql_output.append(f"  -- CPMK: {cpmk_kode} ({mk_nama})")
    sql_output.append(f"  SELECT id INTO v_mk_id FROM mata_kuliah WHERE kurikulum_id = v_kurikulum_id AND nama = '{mk_nama}' LIMIT 1;")
    sql_output.append(f"  IF v_mk_id IS NULL THEN")
    sql_output.append(f"    v_mk_id := uuid_generate_v4();")
    sql_output.append(f"    INSERT INTO mata_kuliah (id, kurikulum_id, kode, nama, sks, semester, sifat_mk)")
    sql_output.append(f"    VALUES (v_mk_id, v_kurikulum_id, 'MK-{item['no']:02d}', '{mk_nama}', 3, 1, 'Wajib');")
    sql_output.append(f"  END IF;")
    
    sql_output.append(f"  SELECT id INTO v_bk_id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = '{bk_first}' LIMIT 1;")
    
    # Insert or update mata_kuliah_bk relation for all BKs listed
    for bk_single in [b.strip() for b in item["kode_bk"].split(",")]:
        sql_output.append(f"  INSERT INTO mata_kuliah_bk (mata_kuliah_id, bk_id)")
        sql_output.append(f"  SELECT v_mk_id, id FROM bahan_kajian WHERE kurikulum_id = v_kurikulum_id AND kode = '{bk_single}'")
        sql_output.append(f"  ON CONFLICT DO NOTHING;")

    sql_output.append(f"  INSERT INTO cpmk (id, kode, deskripsi, bobot, kedalaman_k, kedalaman_a, kedalaman_p, mata_kuliah_id, bk_id)")
    sql_output.append(f"  VALUES (uuid_generate_v4(), '{cpmk_kode}', '{cpmk_desk}', {bobot}, {k_val}, {a_val}, {p_val}, v_mk_id, v_bk_id);")
    sql_output.append("")

sql_output.append("END $$;")

with open("seeder_cpmk_kebidanan.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(sql_output))

print(f"Generated seeder_cpmk_kebidanan.sql with {len(items)} CPMK records successfully!")
