# Design System & UI Specs
**Project Name:** Azalea SPMI Manager

## 1. Global Tokens
### Colors (CSS / Tailwind Mapping)
* **Primary (Brand):** `#1A73E8` (GCP Blue) - Digunakan untuk aksi utama, tombol simpan, dan *state* aktif. Melambangkan profesionalisme dan teknologi *cloud* (selaras dengan infrastruktur GCP).
* **Secondary (Accent):** `#D81B60` (Azalea Pink) - Digunakan untuk elemen pembeda, notifikasi krusial, atau *badges*. Mewakili identitas "Azalea".
* **Surface/Background:** `#F8FAFC` (Slate 50) - Latar belakang utama aplikasi (*dashboard*). Memberikan kontras yang bersih dengan *card* berwarna putih murni (`#FFFFFF`).
* **Text (Main):** `#1E293B` (Slate 800) - Warna teks utama untuk keterbacaan tinggi.
* **Text (Muted):** `#64748B` (Slate 500) - Untuk teks pendukung, tabel sekunder, atau *placeholder*.
* **Semantic (Success):** `#10B981` (Emerald 500) - Status "Memenuhi SN Dikti" / Tiket Selesai (Closed).
* **Semantic (Warning):** `#F59E0B` (Amber 500) - Status "Menunggu Verifikasi" / Audit Sedang Berjalan.
* **Semantic (Danger):** `#EF4444` (Red 500) - Status "Belum Tercapai" / Indikator *Gap* / Peringatan Berkas Hilang.

### Typography
* **Heading Font:** `Plus Jakarta Sans` - Digunakan untuk judul halaman, angka metrik *dashboard*, dan label tebal. Memberikan kesan modern, geometris, dan formal untuk kampus.
* **Body Font:** `Inter` - Digunakan untuk data tabel, instrumen *form*, dan teks paragraf. Sangat optimal untuk keterbacaan data numerik (*tabular lining*).

## 2. Components Library
### 2.1 [Button]
* **Variants:** 
  * `Primary` (Solid GCP Blue - Aksi utama seperti "Submit Hasil Audit")
  * `Secondary` (Outline Blue - Aksi sekunder)
  * `Danger` (Solid Red - Untuk eskalasi tiket atau menolak tindakan korektif)
  * `Ghost` (Text only, muncul *background* saat *hover*)
* **States:** 
  * *Default*: Opacity 100%.
  * *Hover*: Darken 10% (transisi halus 150ms).
  * *Active*: Scale down 0.98.
  * *Disabled*: Opacity 50%, *unclickable*, *cursor not-allowed* (Penting saat form evaluasi belum lengkap).

### 2.2 [Status Badge]
Komponen kritikal untuk merepresentasikan tahapan siklus PPEPP.
* **Variants:** Bentuk kapsul (*rounded-full*), ukuran teks `xs`, ketebalan `font-semibold`.
* **States:**
  * *Success*: `bg-emerald-100 text-emerald-700`
  * *Warning*: `bg-amber-100 text-amber-700`
  * *Danger*: `bg-red-100 text-red-700`
  * *Neutral*: `bg-slate-100 text-slate-700` (Untuk status *Draf* Standar Mutu).

### 2.3 [Data Table / Evidence Vault Grid]
Mengingat ini adalah aplikasi audit (banyak data borang & bukti):
* **Design:** Clean white card (`#FFFFFF`), border halus (`#E2E8F0`), bayangan tipis (`shadow-sm`).
* **Interactions:** *Hover* pada baris tabel mengubah *background* menjadi `#F1F5F9`. *Header* tabel wajib bersifat *sticky* agar auditor tidak kehilangan konteks indikator saat *scroll* ke bawah.

## 3. Screen Breakpoints
* **Mobile (sm):** 320px - 640px (Responsif. Dioptimalkan untuk akses *read-only* Rektor via HP).
* **Tablet (md):** 641px - 1024px (Dioptimalkan untuk Auditor Internal yang membawa *iPad/Tablet* saat melakukan inspeksi lapangan/AMI).
* **Desktop (lg):** 1025px+ (Layar kerja utama untuk Kepala BPM dan Kaprodi dalam meracik standar & mengelola tiket).
