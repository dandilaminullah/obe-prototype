---

# Architecture Design: OBE Management System (MVP)

## 1. Overview
Dokumen ini merancang arsitektur sistem **Outcome-Based Education (OBE)** yang berfokus pada pendekatan *Backward Design*. Sistem ini dirancang untuk memfasilitasi tiga tahap utama: perancangan kurikulum (**OBC**), pelaksanaan pembelajaran (**OBLT**), dan evaluasi ketercapaian kompetensi (**OBAE**).

## 2. Tech Stack
*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **State Management:** React Context API / Zustand (untuk simulasi data statis)
*   **Data Handling:** Static JSON Dummy Data

## 3. Data Structure & Hierarki
Berdasarkan standar sistem SaaS akademik, data dikelola dalam hierarki berikut:

| Level | Entitas Data | Deskripsi Operasional |
| :--- | :--- | :--- |
| **L1** | **Profil Lulusan (PEO)** | Deskripsi peran profesional (Contoh: Mobile Developer). |
| **L2** | **Capaian Pembelajaran (CPL)** | Pengetahuan, keterampilan, dan sikap yang mengacu pada KKNI. |
| **L3** | **Bahan Kajian (BK)** | Pokok materi keilmuan yang mendukung CPL. |
| **L4** | **Mata Kuliah (MK)** | Wadah pembelajaran yang memuat CPL dan Bahan Kajian. |
| **L5** | **CPMK & Sub-CPMK** | Penjabaran spesifik CPL di tingkat mata kuliah dan modul. |

## 4. Skema Data Statis (Dummy)
Sistem menggunakan struktur JSON untuk mensimulasikan relasi *one-to-many* dan *many-to-many* antar entitas:

```json
// public/data/curriculum.json
{
  "profiles": [
    { "id": "P1", "name": "Mobile Developer", "description": "Ahli pengembangan aplikasi mobile" }
  ],
  "cpl": [
    { "id": "CPL1", "code": "CPL-01", "description": "Mampu merancang antarmuka pengguna", "profileId": "P1" }
  ],
  "courses": [
    {
      "id": "MK1",
      "code": "INF101",
      "name": "Pemrograman Mobile I",
      "cpl_mapping": [
        { "cplId": "CPL1", "weight": 0.5 }
      ],
      "cpmk": [
        { "id": "CPMK1", "description": "Menguasai framework Flutter", "weight": 100 }
      ]
    }
  ]
}
```

## 5. Fitur Utama MVP
Sesuai rekomendasi pengembangan SaaS akademik, MVP ini akan mencakup:

1.  **Dashboard Kurikulum:** Visualisasi pemetaan Profil Lulusan ke CPL.
2.  **Matrix Mapping:** Antarmuka untuk memetakan CPL ke Mata Kuliah.
3.  **Digital RPS Builder:** Pengisian Sub-CPMK dan integrasi metode IKU 7 (*Case Method* atau *Team-Based Project*).
4.  **Simulasi Asesmen:** Penginputan nilai per Sub-CPMK (bukan nilai gelondongan) untuk menghitung ketercapaian CPL secara otomatis.

## 6. Alur Logika Perhitungan (OBAE)
Sistem mengimplementasikan fungsi agregasi linear untuk menghitung **Pencapaian CPL** mahasiswa:
*   Nilai CPL dihitung dari: `Σ (Nilai CPMK * Bobot Kontribusi MK terhadap CPL)`.
*   Data ini akan ditampilkan dalam radar chart untuk memudahkan evaluasi *Continuous Quality Improvement* (CQI).

## 7. Folder Structure (Next.js)
```text
/src
  /app
    /curriculum
      /profiles   # Management Profil Lulusan
      /mapping    # Matriks CPL - MK
    /academic
      /rps        # Digital RPS Builder
      /assessment # Input nilai berbasis Sub-CPMK
  /components     # UI Components (Table, Chart, Form)
  /hooks          # Logika kalkulasi OBE
  /store          # Pengelolaan data statis dummy
```

---

**Catatan Integrasi:** Meskipun MVP menggunakan data statis, arsitektur ini telah disiapkan untuk integrasi masa depan dengan **Neo Feeder PDDIKTI** dan **SISTER** melalui API sinkronisasi dua arah.
