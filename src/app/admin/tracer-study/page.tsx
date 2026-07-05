"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/context/UserContext";
import {
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  Clock,
  DollarSign,
  Award,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building,
  Target,
  FileSpreadsheet,
  Download,
  BarChart3,
  Edit3,
  Trash2,
  RefreshCw,
  HelpCircle,
  ChevronRight
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";

// Mock data for alumni 1 year post graduation (TS-1)
const initialAlumniTS1 = [
  {
    id: "alm-1",
    nim: "220101001",
    nama: "Budi Santoso",
    tahunLulus: "2025",
    status: "Bekerja FT",
    perusahaan: "PT Tech Innovate Indonesia",
    posisi: "Software Engineer",
    gaji: 8500000,
    masaTungguBulan: 2,
    verifikasi: "Terverifikasi"
  },
  {
    id: "alm-2",
    nim: "220101002",
    nama: "Siti Rahmawati",
    tahunLulus: "2025",
    status: "Studi Lanjut",
    perusahaan: "Institut Teknologi Bandung (S2)",
    posisi: "Mahasiswa Magister AI",
    gaji: 0,
    masaTungguBulan: 1,
    verifikasi: "Terverifikasi"
  },
  {
    id: "alm-3",
    nim: "220101003",
    nama: "Rian Hidayat",
    tahunLulus: "2025",
    status: "Wirausaha",
    perusahaan: "DevStudio Creative Tech",
    posisi: "Co-Founder / CEO",
    gaji: 9200000,
    masaTungguBulan: 0,
    verifikasi: "Terverifikasi"
  },
  {
    id: "alm-4",
    nim: "220101004",
    nama: "Dewi Lestari",
    tahunLulus: "2025",
    status: "Bekerja FT",
    perusahaan: "Bank Central Asia (BCA)",
    posisi: "IT Data Analyst",
    gaji: 7800000,
    masaTungguBulan: 3,
    verifikasi: "Terverifikasi"
  },
  {
    id: "alm-5",
    nim: "220101005",
    nama: "Fajar Nugraha",
    tahunLulus: "2025",
    status: "Bekerja FT",
    perusahaan: "Startup Software House",
    posisi: "Junior Web Developer",
    gaji: 4200000,
    masaTungguBulan: 7,
    verifikasi: "Terverifikasi"
  },
  {
    id: "alm-6",
    nim: "220101006",
    nama: "Maya Putri",
    tahunLulus: "2025",
    status: "Belum Bekerja",
    perusahaan: "-",
    posisi: "-",
    gaji: 0,
    masaTungguBulan: 12,
    verifikasi: "Belum Verifikasi"
  }
];

// Mock data for alumni 3-5 years (TS-3 - TS-5) Relevancy Analysis
const relevanceCompetencies = [
  { kompetensi: "Programming & Web Tech", skorKurikulum: 88, kebutuhanIndustri: 92, gap: -4 },
  { kompetensi: "Database & Cloud Infrastructure", skorKurikulum: 72, kebutuhanIndustri: 88, gap: -16 },
  { kompetensi: "AI / Machine Learning Tools", skorKurikulum: 65, kebutuhanIndustri: 85, gap: -20 },
  { kompetensi: "Softskills & Team Communication", skorKurikulum: 82, kebutuhanIndustri: 90, gap: -8 },
  { kompetensi: "Cybersecurity & Data Privacy", skorKurikulum: 70, kebutuhanIndustri: 82, gap: -12 }
];

const plRecommendations = [
  {
    id: "pl-rec-1",
    kodePL: "PL-01",
    namaPL: "Software Architect & Engineer",
    masukanIndustri: "Perlu penguatan skill DevOps, CI/CD pipeline, dan Cloud Architecture.",
    tindakanPL: "Penyesuaian indikator deskripsi PL-01 untuk memasukkan standar Cloud Native."
  },
  {
    id: "pl-rec-2",
    kodePL: "PL-03",
    namaPL: "Data & AI Specialist",
    masukanIndustri: "Permintaan pasar sangat tinggi pada LLM Orchestration & MLOps.",
    tindakanPL: "Perumusan Profil Lulusan baru spesialisasi AI & Analytics."
  }
];

export default function EvaluasiTracerStudyPage() {
  const { role, prodiId } = useUser();
  const [prodis, setProdis] = useState<any[]>([]);
  const [selectedProdi, setSelectedProdi] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Active Tab: "survei" | "iku2" | "relevansi"
  const [activeTab, setActiveTab] = useState<"survei" | "iku2" | "relevansi">("survei");

  // State Alumni TS-1
  const [alumniList, setAlumniList] = useState(initialAlumniTS1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  // UMR Benchmark setting (in IDR)
  const [umrBenchmark, setUmrBenchmark] = useState<number>(4500000); // Rp 4.500.000
  const umrStandard = umrBenchmark * 1.2; // 1.2 x UMR = Rp 5.400.000

  // Modal State
  const [showAlumniModal, setShowAlumniModal] = useState(false);
  const [alumniForm, setAlumniForm] = useState({
    nim: "",
    nama: "",
    tahunLulus: "2025",
    status: "Bekerja FT",
    perusahaan: "",
    posisi: "",
    gaji: 5000000,
    masaTungguBulan: 3,
    verifikasi: "Terverifikasi"
  });

  useEffect(() => {
    fetchProdi();
  }, [role, prodiId]);

  const fetchProdi = async () => {
    setLoading(true);
    const { data } = await supabase.from("prodi").select("*").order("nama");
    if (data && data.length > 0) {
      setProdis(data);
      setSelectedProdi(data[0].id);
    } else {
      setProdis([{ id: "default-prodi", nama: "S1 Teknik Informatika" }]);
      setSelectedProdi("default-prodi");
    }
    setLoading(false);
  };

  // Helper calculation for IKU 2 constant k per alumni
  const calculateConstantK = (item: typeof initialAlumniTS1[0]) => {
    if (item.status === "Belum Bekerja") return 0.0;
    if (item.status === "Studi Lanjut" || item.status === "Wirausaha") return 1.0;
    
    // Bekerja FT
    const meetsSalary = item.gaji >= umrStandard;
    const meetsWaitTime = item.masaTungguBulan <= 6;

    if (meetsSalary || meetsWaitTime) {
      return 1.0;
    }
    return 0.7;
  };

  // Compute overall IKU 2 metrics
  const totalAlumni = alumniList.length;
  const alumniWithK = alumniList.map(a => ({
    ...a,
    kValue: calculateConstantK(a)
  }));

  const totalK = alumniWithK.reduce((sum, a) => sum + a.kValue, 0);
  const iku2Score = totalAlumni > 0 ? Math.round((totalK / totalAlumni) * 100) : 0;

  const countK1 = alumniWithK.filter(a => a.kValue === 1.0).length;
  const countK07 = alumniWithK.filter(a => a.kValue === 0.7).length;
  const countK0 = alumniWithK.filter(a => a.kValue === 0.0).length;

  const avgWaitTime = Math.round(
    alumniList.reduce((sum, a) => sum + a.masaTungguBulan, 0) / (totalAlumni || 1)
  );

  const percentSalaryStandard = Math.round(
    (alumniList.filter(a => a.gaji >= umrStandard).length / (totalAlumni || 1)) * 100
  );

  // Chart data career breakdown
  const careerBreakdownData = [
    { name: "Bekerja FT", count: alumniList.filter(a => a.status === "Bekerja FT").length, color: "#3b82f6" },
    { name: "Wirausaha", count: alumniList.filter(a => a.status === "Wirausaha").length, color: "#8b5cf6" },
    { name: "Studi Lanjut", count: alumniList.filter(a => a.status === "Studi Lanjut").length, color: "#10b981" },
    { name: "Belum Bekerja", count: alumniList.filter(a => a.status === "Belum Bekerja").length, color: "#ef4444" }
  ];

  const kBreakdownData = [
    { name: "k = 1.0 (Memenuhi Standar)", value: countK1, fill: "#10b981" },
    { name: "k = 0.7 (Parsial)", value: countK07, fill: "#f59e0b" },
    { name: "k = 0.0 (Belum Kerja)", value: countK0, fill: "#ef4444" }
  ];

  // Filtered alumni
  const filteredAlumni = alumniWithK.filter(a => {
    const matchSearch = a.nama.toLowerCase().includes(searchQuery.toLowerCase()) || a.nim.includes(searchQuery);
    const matchStatus = statusFilter === "Semua" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAddAlumni = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumniForm.nim || !alumniForm.nama) {
      alert("NIM dan Nama Alumni wajib diisi.");
      return;
    }
    const newItem = { id: `alm-${Date.now()}`, ...alumniForm };
    setAlumniList([newItem, ...alumniList]);
    setAlumniForm({
      nim: "",
      nama: "",
      tahunLulus: "2025",
      status: "Bekerja FT",
      perusahaan: "",
      posisi: "",
      gaji: 5000000,
      masaTungguBulan: 3,
      verifikasi: "Terverifikasi"
    });
    setShowAlumniModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              IKU 2 Kemendikbudristek
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              Tracer Study TS-1 & TS-5
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Evaluasi Tracer Study & Kalkulasi IKU 2</h1>
          <p className="text-slate-500 text-sm">
            Manajemen pelacakan alumni 1 tahun setelah lulus, mesin hitung skor IKU 2, dan analisis relevansi 3-5 tahun lulusan
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
        </div>
      </div>

      {/* Top Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5 flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Skor Akhir IKU 2</p>
              <h3 className="text-2xl font-bold text-emerald-600">{iku2Score}% <span className="text-xs font-normal text-slate-400">Tercapai</span></h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Responden TS-1</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalAlumni} <span className="text-xs font-normal text-slate-500">Alumni</span></h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-5 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rerata Masa Tunggu</p>
              <h3 className="text-2xl font-bold text-purple-600">{avgWaitTime} <span className="text-xs font-normal text-slate-500">Bulan</span></h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5 flex items-center space-x-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">% Gaji ≥ 1.2 UMR</p>
              <h3 className="text-2xl font-bold text-slate-800">{percentSalaryStandard}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex space-x-6">
        <button
          onClick={() => setActiveTab("survei")}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 transition-colors border-b-2 ${
            activeTab === "survei"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manajemen Survei Alumni ({totalAlumni})</span>
        </button>

        <button
          onClick={() => setActiveTab("iku2")}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 transition-colors border-b-2 ${
            activeTab === "iku2"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Kalkulasi & Engine IKU 2</span>
        </button>

        <button
          onClick={() => setActiveTab("relevansi")}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 transition-colors border-b-2 ${
            activeTab === "relevansi"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analisis Relevansi Lulusan (3-5 Thn)</span>
        </button>
      </div>

      {/* TAB 1: MANAJEMEN SURVEI TS-1 */}
      {activeTab === "survei" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama alumni atau NIM..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="p-2 border border-slate-300 rounded-lg text-sm bg-white font-medium min-w-[150px]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Semua">Semua Status</option>
                <option value="Bekerja FT">Bekerja FT</option>
                <option value="Wirausaha">Wirausaha</option>
                <option value="Studi Lanjut">Studi Lanjut</option>
                <option value="Belum Bekerja">Belum Bekerja</option>
              </select>
            </div>

            <Button onClick={() => setShowAlumniModal(true)} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Tambah Responden TS-1</span>
            </Button>
          </div>

          {/* Table of Alumni TS-1 */}
          <Card className="border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="p-3.5 pl-6">Alumni & NIM</th>
                    <th className="p-3.5">Status Lulusan</th>
                    <th className="p-3.5">Perusahaan / Instansi</th>
                    <th className="p-3.5">Masa Tunggu</th>
                    <th className="p-3.5">Gaji / Bulan</th>
                    <th className="p-3.5">Bobot IKU 2 (k)</th>
                    <th className="p-3.5 pr-6 text-right">Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredAlumni.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 pl-6">
                        <p className="font-bold text-slate-900">{item.nama}</p>
                        <span className="text-xs text-slate-400 font-mono">NIM: {item.nim} | Lulus {item.tahunLulus}</span>
                      </td>
                      <td className="p-3.5">
                        {item.status === "Bekerja FT" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            Bekerja FT
                          </span>
                        )}
                        {item.status === "Wirausaha" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                            Wirausaha
                          </span>
                        )}
                        {item.status === "Studi Lanjut" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            Studi Lanjut
                          </span>
                        )}
                        {item.status === "Belum Bekerja" && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            Belum Bekerja
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <p className="font-medium text-slate-800">{item.perusahaan}</p>
                        <span className="text-xs text-slate-500">{item.posisi}</span>
                      </td>
                      <td className="p-3.5 font-medium">
                        {item.masaTungguBulan} Bulan
                      </td>
                      <td className="p-3.5 font-mono font-semibold">
                        {item.gaji > 0 ? `Rp ${item.gaji.toLocaleString("id-ID")}` : "-"}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded font-bold text-xs ${
                          item.kValue === 1.0 ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                          item.kValue === 0.7 ? "bg-amber-100 text-amber-800 border border-amber-300" :
                          "bg-red-100 text-red-800 border border-red-300"
                        }`}>
                          k = {item.kValue.toFixed(1)}
                        </span>
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {item.verifikasi}
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

      {/* TAB 2: KALKULASI & ENGINE IKU 2 */}
      {activeTab === "iku2" && (
        <div className="space-y-6">
          {/* Formula Rules & Live Benchmark Controller */}
          <Card className="border border-slate-200 bg-slate-50/50">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>Mesin Hitung Otomatis IKU 2 Kemendikbudristek</span>
                <span className="text-xs font-mono font-normal bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Formula: Skor IKU 2 = (Σ k / Total Responden) x 100%
                </span>
              </CardTitle>
              <CardDescription>
                Penetapan nilai konstanta bobot k didasarkan pada besaran gaji, masa tunggu, studi lanjut, atau status wirausaha.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                    Konstanta k = 1.0 (Penuh)
                  </span>
                  <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pt-1">
                    <li>Gaji ≥ 1.2 x UMR Regional</li>
                    <li>Masa Tunggu ≤ 6 Bulan</li>
                    <li>Studi Lanjut (Magister/Doktor)</li>
                    <li>Wirausaha Berizin / Mandiri</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded">
                    Konstanta k = 0.7 (Parsial)
                  </span>
                  <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pt-1">
                    <li>Gaji &lt; 1.2 x UMR Regional DAN</li>
                    <li>Masa Tunggu &gt; 6 Bulan</li>
                  </ul>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-red-700 uppercase bg-red-50 px-2 py-0.5 rounded">
                    Konstanta k = 0.0 (Nol)
                  </span>
                  <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pt-1">
                    <li>Alumni Belum Bekerja / Mencari Kerja</li>
                  </ul>
                </div>
              </div>

              {/* UMR Controller Input */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Benchmark UMR Regional Pasutri / Kota</h4>
                  <p className="text-xs text-slate-500">
                    Standar Minimum 1.2 x UMR saat ini: <strong className="text-primary font-mono">Rp {umrStandard.toLocaleString("id-ID")}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="text-xs font-medium text-slate-700">Set UMR (Rp):</label>
                  <input
                    type="number"
                    step={100000}
                    className="p-2 border border-slate-300 rounded-lg text-sm font-mono font-bold w-44 focus:ring-2 focus:ring-primary"
                    value={umrBenchmark}
                    onChange={(e) => setUmrBenchmark(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Distribution of k constant */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">Komposisi Distribusi Pembobotan (k)</CardTitle>
                <CardDescription>Visualisasi jumlah alumni berdasarkan bobot k hasil kalkulasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={kBreakdownData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" name="Jumlah Alumni" radius={[6, 6, 0, 0]}>
                        {kBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Chart 2: Career Pathway Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">Sebaran Jalur Karir Alumni (TS-1)</CardTitle>
                <CardDescription>Persentase pilihan karir alumni setelah 1 tahun kelulusan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={careerBreakdownData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" name="Jumlah Responden" radius={[6, 6, 0, 0]}>
                        {careerBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: ANALISIS RELEVANSI LULUSAN 3-5 TAHUN */}
      {activeTab === "relevansi" && (
        <div className="space-y-6">
          <Card className="border border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span>Analisis Relevansi & Skill Gap (Responden TS-3 s/d TS-5)</span>
              </CardTitle>
              <CardDescription>
                Hasil evaluasi lulusan dengan pengalaman kerja 3-5 tahun sebagai landasan perumusan dan pembaruan Profil Lulusan (PL)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {relevanceCompetencies.map((comp, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-bold text-slate-800">{comp.kompetensi}</h5>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        comp.gap <= -15 ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        Gap: {comp.gap}%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="flex justify-between mb-1 text-slate-600">
                          <span>Ketersediaan dalam Kurikulum</span>
                          <span className="font-bold">{comp.skorKurikulum}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${comp.skorKurikulum}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1 text-slate-600">
                          <span>Kebutuhan Riil Dunia Kerja</span>
                          <span className="font-bold">{comp.kebutuhanIndustri}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-600 h-full rounded-full" style={{ width: `${comp.kebutuhanIndustri}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations for Updating PL */}
          <Card className="border border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center space-x-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <span>Rekomendasi Pembaruan Profil Lulusan (PL)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plRecommendations.map((rec) => (
                  <div key={rec.id} className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 font-mono">
                        {rec.kodePL}
                      </span>
                      <h4 className="font-bold text-slate-900">{rec.namaPL}</h4>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1">
                      <p><strong>Masukan Mitra Industri & Alumni:</strong> {rec.masukanIndustri}</p>
                      <p className="text-emerald-800"><strong>Tindakan Perumusan PL:</strong> {rec.tindakanPL}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL TAMBAH ALUMNI TS-1 */}
      {showAlumniModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Tambah Data Alumni Responden TS-1</h3>
              <button onClick={() => setShowAlumniModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <form onSubmit={handleAddAlumni} className="p-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">NIM Alumni</label>
                  <input
                    type="text"
                    placeholder="220101007"
                    className="w-full p-2 border rounded-lg text-sm"
                    value={alumniForm.nim}
                    onChange={(e) => setAlumniForm({ ...alumniForm, nim: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tahun Lulus</label>
                  <input
                    type="text"
                    placeholder="2025"
                    className="w-full p-2 border rounded-lg text-sm"
                    value={alumniForm.tahunLulus}
                    onChange={(e) => setAlumniForm({ ...alumniForm, tahunLulus: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Lengkap Alumni</label>
                <input
                  type="text"
                  placeholder="Nama Alumni..."
                  className="w-full p-2 border rounded-lg text-sm"
                  value={alumniForm.nama}
                  onChange={(e) => setAlumniForm({ ...alumniForm, nama: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Status Lulusan</label>
                  <select
                    className="w-full p-2 border rounded-lg text-sm bg-white"
                    value={alumniForm.status}
                    onChange={(e) => setAlumniForm({ ...alumniForm, status: e.target.value })}
                  >
                    <option value="Bekerja FT">Bekerja FT</option>
                    <option value="Wirausaha">Wirausaha</option>
                    <option value="Studi Lanjut">Studi Lanjut</option>
                    <option value="Belum Bekerja">Belum Bekerja</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Masa Tunggu (Bulan)</label>
                  <input
                    type="number"
                    min={0}
                    max={24}
                    className="w-full p-2 border rounded-lg text-sm"
                    value={alumniForm.masaTungguBulan}
                    onChange={(e) => setAlumniForm({ ...alumniForm, masaTungguBulan: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Perusahaan / Instansi / Kampus S2</label>
                <input
                  type="text"
                  placeholder="PT GoTo Gojek Tokopedia / ITB..."
                  className="w-full p-2 border rounded-lg text-sm"
                  value={alumniForm.perusahaan}
                  onChange={(e) => setAlumniForm({ ...alumniForm, perusahaan: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Jabatan / Posisi</label>
                  <input
                    type="text"
                    placeholder="Backend Engineer..."
                    className="w-full p-2 border rounded-lg text-sm"
                    value={alumniForm.posisi}
                    onChange={(e) => setAlumniForm({ ...alumniForm, posisi: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Gaji / Bulan (Rp)</label>
                  <input
                    type="number"
                    step={500000}
                    className="w-full p-2 border rounded-lg text-sm font-mono"
                    value={alumniForm.gaji}
                    onChange={(e) => setAlumniForm({ ...alumniForm, gaji: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t">
                <Button type="button" variant="outline" onClick={() => setShowAlumniModal(false)}>Batal</Button>
                <Button type="submit">Simpan Responden</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
