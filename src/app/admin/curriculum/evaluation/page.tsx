"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/context/UserContext";
import {
  ClipboardCheck,
  Calendar,
  Users,
  FileText,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  TrendingUp,
  Layers,
  Edit3,
  Trash2,
  Download
} from "lucide-react";

// Mock initial data for procedures, evaluated elements, findings & CQI cycle
const initialProcedures = [
  {
    id: "proc-1",
    tanggal: "2026-05-15",
    jenis: "Rapat Tim Kurikulum Internal",
    agenda: "Evaluasi Relevansi Bahan Kajian & Capaian CPL Kurikulum 2024",
    peserta: "Dr. Irwan (Kaprodi), Anita M.T., Budi Ph.D., Perwakilan KBK AI & Data",
    beritaAcara: "Disetujui untuk merestrukturisasi MK Pemrograman Lanjut dan menambah topik Large Language Models (LLM) pada Bahan Kajian AI.",
    status: "Selesai",
    dokumen: "BA-Rapat-Kurikulum-May2026.pdf"
  },
  {
    id: "proc-2",
    tanggal: "2026-06-02",
    jenis: "Lokakarya Evaluasi Stakeholder & Industri",
    agenda: "Review Keselarasan Profil Lulusan dengan Kebutuhan Dunia Kerja (IKU 2)",
    peserta: "Tim Kurikulum Prodi, 5 Mitra Industri (Tech Lead / HRD), 3 Alumni TS-3",
    beritaAcara: "Mitra industri menyarankan penguatan pemahaman Cloud Infrastructure and DevOps pada mata kuliah pilihan semester 6.",
    status: "Selesai",
    dokumen: "BA-Lokakarya-Mitra-2026.pdf"
  }
];

const initialElements = [
  {
    id: "elem-1",
    kodeMK: "IF3101",
    namaMK: "Pemrograman Web & Seluler",
    sks: 4,
    relevansi: "Sesuai",
    efektivitas: "Tinggi",
    cplScore: 82,
    catatan: "Materi framework Next.js & React Native sangat relevan dengan industri.",
    status: "Tetap Diterapkan"
  },
  {
    id: "elem-2",
    kodeMK: "IF2204",
    namaMK: "Basis Data Tradisional",
    sks: 3,
    relevansi: "Perlu Update",
    efektivitas: "Sedang",
    cplScore: 64,
    catatan: "Terlalu banyak fokus pada RDBMS legacy, perlu penambahan materi NoSQL & Vector DB.",
    status: "Revisi Materi"
  },
  {
    id: "elem-3",
    kodeMK: "IF1105",
    namaMK: "Pengantar Komputasi Obsolete",
    sks: 2,
    relevansi: "Obsolete",
    efektivitas: "Rendah",
    cplScore: 52,
    catatan: "Konten materi overlap 70% dengan Algoritma Pemrograman I.",
    status: "Rekomendasi Dihapus"
  },
  {
    id: "elem-4",
    kodeMK: "IF4102",
    namaMK: "Keamanan Informasi & Cyber Security",
    sks: 3,
    relevansi: "Sesuai",
    efektivitas: "Tinggi",
    cplScore: 78,
    catatan: "Sangat diminati mahasiswa, namun praktikum butuh server sandbox dedicated.",
    status: "Tetap Diterapkan"
  }
];

const initialRecommendations = [
  {
    id: "rec-1",
    tindakan: "Revisi Struktur & Silabus MK",
    targetMK: "IF2204 - Basis Data",
    perubahan: "Integrasi materi NoSQL, MongoDB, dan Vector Database untuk AI Apps",
    targetSemester: "Semester Ganjil 2026/2027",
    pic: "Budi Ph.D. (KBK Data Science)",
    status: "Disetujui Prodi"
  },
  {
    id: "rec-2",
    tindakan: "Penghapusan MK & Migrasi SKS",
    targetMK: "IF1105 - Pengantar Komputasi Obsolete",
    perubahan: "Hapus MK IF1105, 2 SKS dialokasikan ke MK baru Cloud Native Engineering",
    targetSemester: "Semester Ganjil 2026/2027",
    pic: "Tim Pengembang Kurikulum",
    status: "Disetujui Prodi"
  },
  {
    id: "rec-3",
    tindakan: "Penambahan Mata Kuliah Baru",
    targetMK: "MK Pilihan - Generative AI & Prompt Engineering",
    perubahan: "Mata kuliah baru 3 SKS merespon masukan mitra industri lokakarya",
    targetSemester: "Semester Genap 2026/2027",
    pic: "Anita M.T. (KBK AI)",
    status: "Draft"
  }
];

export default function EvaluasiKurikulumPage() {
  const { role, prodiId } = useUser();
  const [prodis, setProdis] = useState<any[]>([]);
  const [selectedProdi, setSelectedProdi] = useState<string>("");
  const [kurikulums, setKurikulums] = useState<any[]>([]);
  const [selectedKurikulum, setSelectedKurikulum] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"cqi" | "mekanisme" | "unsur" | "rekomendasi">("cqi");

  // State arrays
  const [procedures, setProcedures] = useState(initialProcedures);
  const [elements, setElements] = useState(initialElements);
  const [recommendations, setRecommendations] = useState(initialRecommendations);

  // Modals state
  const [showProcModal, setShowProcModal] = useState(false);
  const [showElemModal, setShowElemModal] = useState(false);
  const [showRecModal, setShowRecModal] = useState(false);

  // Form states
  const [procForm, setProcForm] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    jenis: "Rapat Tim Kurikulum Internal",
    agenda: "",
    peserta: "",
    beritaAcara: "",
    status: "Selesai",
    dokumen: "Dokumen-Evaluasi.pdf"
  });

  const [elemForm, setElemForm] = useState({
    kodeMK: "",
    namaMK: "",
    sks: 3,
    relevansi: "Sesuai",
    efektivitas: "Tinggi",
    cplScore: 75,
    catatan: "",
    status: "Tetap Diterapkan"
  });

  const [recForm, setRecForm] = useState({
    tindakan: "Revisi Struktur & Silabus MK",
    targetMK: "",
    perubahan: "",
    targetSemester: "Semester Ganjil 2026/2027",
    pic: "",
    status: "Draft"
  });

  // Search & Filters
  const [elemSearch, setElemSearch] = useState("");
  const [elemFilterRelevansi, setElemFilterRelevansi] = useState("Semua");

  useEffect(() => {
    fetchProdiAndKurikulum();
  }, [role, prodiId]);

  const fetchProdiAndKurikulum = async () => {
    setLoading(true);
    // Fetch prodi list
    const { data: prodiData } = await supabase.from("prodi").select("*").order("nama");
    if (prodiData && prodiData.length > 0) {
      setProdis(prodiData);
      setSelectedProdi(prodiData[0].id);
    } else {
      setProdis([{ id: "default-prodi", nama: "S1 Teknik Informatika" }]);
      setSelectedProdi("default-prodi");
    }

    // Fetch kurikulum list
    const { data: kurData } = await supabase.from("kurikulum").select("*").order("tahun_berlaku", { ascending: false });
    if (kurData && kurData.length > 0) {
      setKurikulums(kurData);
      setSelectedKurikulum(kurData[0].id);
    } else {
      setKurikulums([{ id: "kur-2024", nama: "Kurikulum OBE 2024 (Aktif)", tahun_berlaku: "2024" }]);
      setSelectedKurikulum("kur-2024");
    }
    setLoading(false);
  };

  // Handlers for adding item
  const handleAddProcedure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!procForm.agenda || !procForm.peserta) {
      alert("Agenda dan Peserta wajib diisi.");
      return;
    }
    const newItem = { id: `proc-${Date.now()}`, ...procForm };
    setProcedures([newItem, ...procedures]);
    setProcForm({
      tanggal: new Date().toISOString().split("T")[0],
      jenis: "Rapat Tim Kurikulum Internal",
      agenda: "",
      peserta: "",
      beritaAcara: "",
      status: "Selesai",
      dokumen: "Dokumen-Evaluasi.pdf"
    });
    setShowProcModal(false);
  };

  const handleAddElement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!elemForm.kodeMK || !elemForm.namaMK) {
      alert("Kode MK dan Nama MK wajib diisi.");
      return;
    }
    const newItem = { id: `elem-${Date.now()}`, ...elemForm };
    setElements([newItem, ...elements]);
    setElemForm({
      kodeMK: "",
      namaMK: "",
      sks: 3,
      relevansi: "Sesuai",
      efektivitas: "Tinggi",
      cplScore: 75,
      catatan: "",
      status: "Tetap Diterapkan"
    });
    setShowElemModal(false);
  };

  const handleAddRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recForm.targetMK || !recForm.perubahan) {
      alert("Target MK dan Perubahan wajib diisi.");
      return;
    }
    const newItem = { id: `rec-${Date.now()}`, ...recForm };
    setRecommendations([newItem, ...recommendations]);
    setRecForm({
      tindakan: "Revisi Struktur & Silabus MK",
      targetMK: "",
      perubahan: "",
      targetSemester: "Semester Ganjil 2026/2027",
      pic: "",
      status: "Draft"
    });
    setShowRecModal(false);
  };

  // Filtered elements
  const filteredElements = elements.filter(el => {
    const matchSearch = el.namaMK.toLowerCase().includes(elemSearch.toLowerCase()) || el.kodeMK.toLowerCase().includes(elemSearch.toLowerCase());
    const matchFilter = elemFilterRelevansi === "Semua" || el.relevansi === elemFilterRelevansi;
    return matchSearch && matchFilter;
  });

  // Calculate CQI Metrics
  const totalElements = elements.length;
  const elementsNeedRevision = elements.filter(e => e.relevansi !== "Sesuai").length;
  const approvedRecommendations = recommendations.filter(r => r.status === "Disetujui Prodi").length;
  const cqiCompletionPercentage = Math.round(((totalElements - elementsNeedRevision + approvedRecommendations) / (totalElements + recommendations.length)) * 100);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              Internal Prodi Analytics
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Siklus CQI Aktif
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Evaluasi Kurikulum Prodi</h1>
          <p className="text-slate-500 text-sm">
            Dokumentasi peninjauan berkala, evaluasi butir kurikulum lama, dan perumusan rekomendasi kurikulum baru
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            className="p-2 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium"
            value={selectedProdi}
            onChange={(e) => setSelectedProdi(e.target.value)}
          >
            {prodis.map(p => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>

          <select
            className="p-2 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium"
            value={selectedKurikulum}
            onChange={(e) => setSelectedKurikulum(e.target.value)}
          >
            {kurikulums.map(k => (
              <option key={k.id} value={k.id}>{k.nama || `Kurikulum ${k.tahun_berlaku}`}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Mekanisme Rapat</p>
              <h3 className="text-2xl font-bold text-slate-800">{procedures.length} <span className="text-xs text-slate-500 font-normal">Sesi</span></h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-5 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Butir Dievaluasi</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalElements} <span className="text-xs text-slate-500 font-normal">Mata Kuliah</span></h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5 flex items-center space-x-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Perlu Perbaikan</p>
              <h3 className="text-2xl font-bold text-amber-600">{elementsNeedRevision} <span className="text-xs text-slate-500 font-normal">Butir</span></h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5 flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status CQI Loop</p>
              <h3 className="text-2xl font-bold text-emerald-600">{cqiCompletionPercentage}% <span className="text-xs text-slate-500 font-normal">Closed</span></h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex space-x-6">
        <button
          onClick={() => setActiveTab("cqi")}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 transition-colors border-b-2 ${
            activeTab === "cqi"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Status CQI & Siklus Mutu</span>
        </button>

        <button
          onClick={() => setActiveTab("mekanisme")}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 transition-colors border-b-2 ${
            activeTab === "mekanisme"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Mekanisme Evaluasi ({procedures.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("unsur")}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 transition-colors border-b-2 ${
            activeTab === "unsur"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Unsur yang Dievaluasi ({elements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("rekomendasi")}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 transition-colors border-b-2 ${
            activeTab === "rekomendasi"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Hasil & Rekomendasi ({recommendations.length})</span>
        </button>
      </div>

      {/* TAB 1: STATUS CQI & SIKLUS MUTU */}
      {activeTab === "cqi" && (
        <div className="space-y-6">
          {/* Cycle Stepper */}
          <Card className="border border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Posisi Siklus Continuous Quality Improvement (CQI)</span>
                <span className="text-xs font-normal text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Fase Saat Ini: Check & Act (Evaluasi & Tindakan Perbaikan)
                </span>
              </CardTitle>
              <CardDescription>
                Mekanisme perbaikan berkelanjutan berbasis bukti (Evidence-based Quality Improvement) sesuai standar SN-Dikti & OBE.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4 relative">
                {/* Step 1: PLAN */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                      1
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">Terselesaikan</span>
                  </div>
                  <h4 className="font-bold text-slate-800">PLAN (Perancangan)</h4>
                  <p className="text-xs text-slate-500 mt-1">Perumusan CPL, Bahan Kajian, & Struktur Kurikulum 2024</p>
                </div>

                {/* Step 2: DO */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                      2
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">Terselesaikan</span>
                  </div>
                  <h4 className="font-bold text-slate-800">DO (Pelaksanaan)</h4>
                  <p className="text-xs text-slate-500 mt-1">Pelaksanaan Perkuliahan, Praktikum, & Asesmen CPMK</p>
                </div>

                {/* Step 3: CHECK (Active) */}
                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 relative shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs shadow">
                      3
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary text-white animate-pulse">Sedang Berjalan</span>
                  </div>
                  <h4 className="font-bold text-primary">CHECK (Evaluasi Internal)</h4>
                  <p className="text-xs text-slate-600 mt-1">Analisis Ketercapaian CPL, Relevansi MK, & Feedback Industri</p>
                </div>

                {/* Step 4: ACT */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                      4
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Tahap Berikutnya</span>
                  </div>
                  <h4 className="font-bold text-emerald-800">ACT (Tindak Lanjut)</h4>
                  <p className="text-xs text-slate-600 mt-1">Penerapan Perbaikan Silabus, Pengesahan Kurikulum Baru 2026</p>
                </div>
              </div>

              {/* Progress Detail */}
              <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">Tingkat Kesiapan Penutupan Loop CQI (Closing The Loop)</span>
                  <span className="font-bold text-primary">{cqiCompletionPercentage}%</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${cqiCompletionPercentage}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />
                  Evaluasi internal telah mencakup {totalElements} mata kuliah dan menyepakati {approvedRecommendations} rekomendasi perbaikan resmi.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Key Audit Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>Ringkasan Temuan Evaluasi Inti</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <h5 className="font-semibold text-amber-900">1. Relevansi Teknologi Vector & NoSQL DB</h5>
                  <p className="text-amber-800 text-xs mt-1">
                    Mata kuliah Basis Data (IF2204) belum memasukkan materi Vector Database yang dibutuhkan untuk aplikasi AI modern.
                  </p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <h5 className="font-semibold text-red-900">2. Redundansi Konten MK Legacy</h5>
                  <p className="text-red-800 text-xs mt-1">
                    MK Pengantar Komputasi (IF1105) diidentifikasi memiliki 70% materi overlapping dengan Algoritma Pemrograman.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-semibold text-blue-900">3. Tingginya Permintaan Skill Generative AI</h5>
                  <p className="text-blue-800 text-xs mt-1">
                    Lokakarya mitra industri merekomendasikan pembukaan mata kuliah pilihan Prompt Engineering & Generative AI Apps.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Langkah Tindak Lanjut Terjadwal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-3 p-3 bg-slate-50 border rounded-lg">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg font-bold text-xs">A-1</div>
                  <div>
                    <h5 className="font-semibold text-slate-800">Penyusunan Draft Silabus MK Baru</h5>
                    <p className="text-xs text-slate-500">Target: Juli 2026 | PIC: KBK AI & Data Science</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-slate-50 border rounded-lg">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg font-bold text-xs">A-2</div>
                  <div>
                    <h5 className="font-semibold text-slate-800">Review oleh Senat Fakultas / Tim Penjaminan Mutu</h5>
                    <p className="text-xs text-slate-500">Target: Agustus 2026 | PIC: Dekanat & GPM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-slate-50 border rounded-lg">
                  <div className="p-2 bg-purple-100 text-purple-700 rounded-lg font-bold text-xs">A-3</div>
                  <div>
                    <h5 className="font-semibold text-slate-800">Pengesahan SK Kurikulum Perbaikan 2026/2027</h5>
                    <p className="text-xs text-slate-500">Target: September 2026 | PIC: Rektor / Warek I</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: MEKANISME EVALUASI */}
      {activeTab === "mekanisme" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Dokumentasi Prosedur Evaluasi</h3>
              <p className="text-xs text-slate-500">Catatan rapat tim kurikulum, lokakarya mitra, dan berita acara evaluasi</p>
            </div>
            <Button onClick={() => setShowProcModal(true)} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Tambah Sesi Evaluasi</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {procedures.map((proc) => (
              <Card key={proc.id} className="border border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mt-1">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                            {proc.jenis}
                          </span>
                          <span className="text-xs text-slate-400">• {proc.tanggal}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{proc.agenda}</h4>
                      </div>
                    </div>

                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 self-start md:self-auto">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      {proc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3 rounded-lg border">
                      <p className="font-semibold text-slate-700 flex items-center mb-1">
                        <Users className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        Peserta & Evaluator:
                      </p>
                      <p className="text-slate-600 leading-relaxed">{proc.peserta}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border">
                      <p className="font-semibold text-slate-700 flex items-center mb-1">
                        <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        Berita Acara & Temuan Kunci:
                      </p>
                      <p className="text-slate-600 leading-relaxed">{proc.beritaAcara}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end items-center space-x-3 pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400 flex items-center">
                      <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {proc.dokumen}
                    </span>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Unduh Berita Acara
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: UNSUR YANG DIEVALUASI */}
      {activeTab === "unsur" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari kode atau nama mata kuliah..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                  value={elemSearch}
                  onChange={(e) => setElemSearch(e.target.value)}
                />
              </div>

              <select
                className="p-2 border border-slate-300 rounded-lg text-sm bg-white font-medium min-w-[150px]"
                value={elemFilterRelevansi}
                onChange={(e) => setElemFilterRelevansi(e.target.value)}
              >
                <option value="Semua">Semua Relevansi</option>
                <option value="Sesuai">Sesuai</option>
                <option value="Perlu Update">Perlu Update</option>
                <option value="Obsolete">Obsolete</option>
              </select>
            </div>

            <Button onClick={() => setShowElemModal(true)} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Tambah Peninjauan MK</span>
            </Button>
          </div>

          {/* Table of evaluated elements */}
          <Card className="border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="p-3.5 pl-6">Mata Kuliah</th>
                    <th className="p-3.5">SKS</th>
                    <th className="p-3.5">Relevansi Materi</th>
                    <th className="p-3.5">Efektivitas MK</th>
                    <th className="p-3.5">Rata-rata Nilai CPL</th>
                    <th className="p-3.5">Catatan Peninjauan internal</th>
                    <th className="p-3.5 pr-6 text-right">Rekomendasi Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredElements.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 pl-6">
                        <p className="font-bold text-slate-900">{item.namaMK}</p>
                        <span className="text-xs text-slate-400 font-mono">{item.kodeMK}</span>
                      </td>
                      <td className="p-3.5 font-medium">{item.sks} SKS</td>
                      <td className="p-3.5">
                        {item.relevansi === "Sesuai" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            Sesuai Industri
                          </span>
                        )}
                        {item.relevansi === "Perlu Update" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                            Perlu Perbaikan
                          </span>
                        )}
                        {item.relevansi === "Obsolete" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            Obsolete / Usang
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          item.efektivitas === "Tinggi" ? "bg-blue-100 text-blue-800" :
                          item.efektivitas === "Sedang" ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-700"
                        }`}>
                          {item.efektivitas}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold">
                        <span className={item.cplScore >= 70 ? "text-emerald-600" : "text-amber-600"}>
                          {item.cplScore}%
                        </span>
                      </td>
                      <td className="p-3.5 max-w-xs text-xs text-slate-600 leading-relaxed">
                        {item.catatan}
                      </td>
                      <td className="p-3.5 pr-6 text-right font-medium text-xs">
                        <span className="px-2.5 py-1 rounded border bg-slate-50 text-slate-800 font-medium">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: HASIL & REKOMENDASI */}
      {activeTab === "rekomendasi" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Daftar Rekomendasi Perbaikan Kurikulum Baru</h3>
              <p className="text-xs text-slate-500">Catatan temuan konkret dan rencana aksi perubahan struktur kurikulum</p>
            </div>
            <Button onClick={() => setShowRecModal(true)} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Tambah Rekomendasi</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="border border-slate-200 hover:shadow-sm">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800">
                        {rec.tindakan}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">• {rec.targetSemester}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{rec.targetMK}</h4>
                    <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">{rec.perubahan}</p>
                    <p className="text-xs text-slate-400 font-medium pt-1">PIC: {rec.pic}</p>
                  </div>

                  <div className="flex items-center space-x-3 self-end md:self-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      rec.status === "Disetujui Prodi" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: TAMBAH PROSEDUR MEKANISME */}
      {showProcModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Tambah Sesi / Prosedur Evaluasi</h3>
              <button onClick={() => setShowProcModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <form onSubmit={handleAddProcedure} className="p-5 space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Tanggal Evaluasi</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg text-sm"
                  value={procForm.tanggal}
                  onChange={(e) => setProcForm({ ...procForm, tanggal: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Jenis Kegiatan</label>
                <select
                  className="w-full p-2 border rounded-lg text-sm bg-white"
                  value={procForm.jenis}
                  onChange={(e) => setProcForm({ ...procForm, jenis: e.target.value })}
                >
                  <option value="Rapat Tim Kurikulum Internal">Rapat Tim Kurikulum Internal</option>
                  <option value="Lokakarya Evaluasi Stakeholder & Industri">Lokakarya Evaluasi Stakeholder & Industri</option>
                  <option value="Audit Mutu Internal Kurikulum">Audit Mutu Internal Kurikulum</option>
                  <option value="Review KBK & Dosen Pengampu">Review KBK & Dosen Pengampu</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Agenda & Topik Bahasan</label>
                <input
                  type="text"
                  placeholder="Misal: Evaluasi Relevansi Bahan Kajian Artificial Intelligence..."
                  className="w-full p-2 border rounded-lg text-sm"
                  value={procForm.agenda}
                  onChange={(e) => setProcForm({ ...procForm, agenda: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Peserta & Evaluator</label>
                <textarea
                  rows={2}
                  placeholder="Daftar peserta / perwakilan KBK..."
                  className="w-full p-2 border rounded-lg text-sm"
                  value={procForm.peserta}
                  onChange={(e) => setProcForm({ ...procForm, peserta: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Ringkasan Berita Acara & Temuan</label>
                <textarea
                  rows={3}
                  placeholder="Catatan hasil rapat & kesepakatan..."
                  className="w-full p-2 border rounded-lg text-sm"
                  value={procForm.beritaAcara}
                  onChange={(e) => setProcForm({ ...procForm, beritaAcara: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowProcModal(false)}>Batal</Button>
                <Button type="submit">Simpan Sesi Evaluasi</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TAMBAH UNSUR DIEVALUASI */}
      {showElemModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Tambah Peninjauan Butir MK</h3>
              <button onClick={() => setShowElemModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <form onSubmit={handleAddElement} className="p-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Kode MK</label>
                  <input
                    type="text"
                    placeholder="IF3101"
                    className="w-full p-2 border rounded-lg text-sm"
                    value={elemForm.kodeMK}
                    onChange={(e) => setElemForm({ ...elemForm, kodeMK: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">SKS</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    className="w-full p-2 border rounded-lg text-sm"
                    value={elemForm.sks}
                    onChange={(e) => setElemForm({ ...elemForm, sks: parseInt(e.target.value) || 3 })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Mata Kuliah</label>
                <input
                  type="text"
                  placeholder="Pemrograman Seluler Lanjut..."
                  className="w-full p-2 border rounded-lg text-sm"
                  value={elemForm.namaMK}
                  onChange={(e) => setElemForm({ ...elemForm, namaMK: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Relevansi Materi</label>
                  <select
                    className="w-full p-2 border rounded-lg text-sm bg-white"
                    value={elemForm.relevansi}
                    onChange={(e) => setElemForm({ ...elemForm, relevansi: e.target.value })}
                  >
                    <option value="Sesuai">Sesuai</option>
                    <option value="Perlu Update">Perlu Update</option>
                    <option value="Obsolete">Obsolete</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Efektivitas MK</label>
                  <select
                    className="w-full p-2 border rounded-lg text-sm bg-white"
                    value={elemForm.efektivitas}
                    onChange={(e) => setElemForm({ ...elemForm, efektivitas: e.target.value })}
                  >
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Catatan Peninjauan</label>
                <textarea
                  rows={3}
                  placeholder="Kelemahan/keunggulan silabus saat ini..."
                  className="w-full p-2 border rounded-lg text-sm"
                  value={elemForm.catatan}
                  onChange={(e) => setElemForm({ ...elemForm, catatan: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowElemModal(false)}>Batal</Button>
                <Button type="submit">Simpan Peninjauan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: TAMBAH REKOMENDASI */}
      {showRecModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Tambah Rekomendasi Perbaikan</h3>
              <button onClick={() => setShowRecModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <form onSubmit={handleAddRecommendation} className="p-5 space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Jenis Tindakan Perbaikan</label>
                <select
                  className="w-full p-2 border rounded-lg text-sm bg-white"
                  value={recForm.tindakan}
                  onChange={(e) => setRecForm({ ...recForm, tindakan: e.target.value })}
                >
                  <option value="Revisi Struktur & Silabus MK">Revisi Struktur & Silabus MK</option>
                  <option value="Penghapusan MK & Migrasi SKS">Penghapusan MK & Migrasi SKS</option>
                  <option value="Penambahan Mata Kuliah Baru">Penambahan Mata Kuliah Baru</option>
                  <option value="Penggabungan (Merger) Mata Kuliah">Penggabungan (Merger) Mata Kuliah</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Target MK / Bahan Kajian</label>
                <input
                  type="text"
                  placeholder="Misal: IF2204 - Basis Data..."
                  className="w-full p-2 border rounded-lg text-sm"
                  value={recForm.targetMK}
                  onChange={(e) => setRecForm({ ...recForm, targetMK: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Uraian Rencana Perubahan</label>
                <textarea
                  rows={3}
                  placeholder="Detail perubahan materi, bobot SKS, atau silabus baru..."
                  className="w-full p-2 border rounded-lg text-sm"
                  value={recForm.perubahan}
                  onChange={(e) => setRecForm({ ...recForm, perubahan: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Target Semester Implementasi</label>
                  <input
                    type="text"
                    placeholder="Semester Ganjil 2026/2027"
                    className="w-full p-2 border rounded-lg text-sm"
                    value={recForm.targetSemester}
                    onChange={(e) => setRecForm({ ...recForm, targetSemester: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">PIC Penanggung Jawab</label>
                  <input
                    type="text"
                    placeholder="Ketua KBK / Dosen"
                    className="w-full p-2 border rounded-lg text-sm"
                    value={recForm.pic}
                    onChange={(e) => setRecForm({ ...recForm, pic: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowRecModal(false)}>Batal</Button>
                <Button type="submit">Simpan Rekomendasi</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
