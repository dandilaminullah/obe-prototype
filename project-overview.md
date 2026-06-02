--------------------------------------------------------------------------------
Project Overview: OBE-Integrated Academic SaaS
1. Visi dan Filosofi Proyek
Proyek ini bertujuan membangun sistem manajemen akademik yang beralih dari paradigma tradisional (berorientasi input) ke paradigma Outcome-Based Education (OBE) yang berpusat pada mahasiswa (student-centered)
,
. Sistem ini mengimplementasikan prinsip constructive alignment, di mana capaian pembelajaran, aktivitas kelas, dan instrumen asesmen dirancang secara harmonis
.
2. Proses Bisnis Utama (The OBE Lifecycle)
Sistem harus memfasilitasi siklus hidup kurikulum yang terdiri dari empat tahap utama:
A. Perancangan Kurikulum (Outcome-Based Curriculum - OBC)
Tahap ini menggunakan pendekatan backward design (desain mundur) untuk memastikan relevansi setiap mata kuliah
.
Penetapan Profil Lulusan (PEO): Mendefinisikan peran profesional lulusan beberapa tahun setelah lulus
.
Perumusan CPL (PLO): Menjabarkan pengetahuan, keterampilan, dan sikap spesifik mahasiswa saat lulus berdasarkan standar KKNI dan SN Dikti
.
Pemetaan Matriks:
Relasi one-to-many antara Profil Lulusan ke CPL
.
Relasi many-to-many antara CPL dengan Bahan Kajian (Body of Knowledge) dan Mata Kuliah
,
.
Transisi Kurikulum: Sistem harus menyediakan algoritma untuk menentukan apakah mata kuliah lama harus dipertahankan, diintegrasikan, atau dihapus berdasarkan keterkaitannya dengan CPL baru
.
B. Pelaksanaan Pembelajaran (Outcome-Based Learning and Teaching - OBLT)
Fokus pada digitalisasi rencana pembelajaran dan metode interaktif.
Penyusunan RPS Digital: Dosen menjabarkan CPL menjadi CPMK dan Sub-CPMK
,
.
Validasi Bobot: Sistem secara otomatis memvalidasi bahwa total bobot Sub-CPMK setara dengan 100% bobot CPMK
.
Kepatuhan IKU 7: Mengintegrasikan metode Case Method atau Team-Based Project dengan bobot evaluasi minimal 50% dari total nilai mata kuliah
,
.
C. Penilaian dan Evaluasi (Outcome-Based Assessment and Evaluation - OBAE)
Transisi dari nilai "gelondongan" ke penilaian berbasis kompetensi spesifik.
Input Nilai Berbasis Rubrik: Dosen menginput nilai per butir instrumen penilaian yang ditautkan ke Sub-CPMK/CPMK tertentu
.
Kalkulasi CPL Real-Time: Sistem menghitung ketercapaian CPL melalui fungsi agregasi linear dari nilai CPMK yang mendukungnya, dikalikan bobot kontribusi mata kuliah tersebut
,
.
Visualisasi Capaian: Dashboard yang menyajikan laporan capaian CPL per mahasiswa, per angkatan (cohort), dan per mata kuliah dalam bentuk radar chart
,
.
D. Perbaikan Berkelanjutan (Continuous Quality Improvement - CQI)
Menutup siklus pembelajaran dengan evaluasi berbasis data.
Gap Analysis: Mengidentifikasi kesenjangan antara target pencapaian (threshold) dengan hasil riil di lapangan
.
Workflow Pengendalian: Memicu rencana aksi perbaikan oleh Kaprodi jika capaian kelas berada di bawah standar mutu
.
3. Integrasi Sistem Penjaminan Mutu (SPMI)
Proses bisnis di atas harus dibungkus dalam siklus PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan)
,
:
Penetapan: Input standar CPL dan batas kelulusan minimal (threshold)
,
.
Evaluasi: Menyediakan Auditor Portal untuk Audit Mutu Internal (AMI) guna memverifikasi keselarasan kurikulum secara langsung di sistem
,
.
4. Ekosistem Integrasi Nasional
Agar operasional secara teknis, SaaS ini memiliki tiga gerbang sinkronisasi utama
:
PDDIKTI Neo Feeder: Sinkronisasi dua arah untuk data KRS, kelas, dan nilai akhir yang sudah teragregasi dari komponen OBE
,
.
SISTER Cloud: Memfasilitasi laporan Beban Kerja Dosen (BKD) dengan fitur "Auto-Package" yang menyatukan RPS OBE dan portofolio nilai sebagai bukti kinerja
,
.
IKU Dashboard: Melaporkan pencapaian IKU 7 (metode kelas) dan IKU 6 (kemitraan industri dalam proyek kelas) secara otomatis
,
.

---

---

Tujuan Teknis MVP: Membangun fondasi data relasional yang kuat antara PEO-CPL-CPMK-Nilai sehingga AI agent dapat melakukan analisis tren kompetensi tanpa kehilangan konteks hierarki data kurikulum
