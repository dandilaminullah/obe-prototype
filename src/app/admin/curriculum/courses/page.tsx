"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Trash2,
  Pencil,
  ChevronDown,
  ChevronUp,
  Layers,
  Target,
  BookOpen,
  Activity,
  CheckSquare,
  Search,
  FileText,
  ListOrdered,
  Sliders,
  Save,
} from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function MataKuliahPage() {
  const { role, prodiId } = useUser();
  const [kurikulums, setKurikulums] = useState<any[]>([]);
  const [selectedKurikulum, setSelectedKurikulum] = useState<string>("");

  const [cpls, setCpls] = useState<any[]>([]);
  const [bks, setBks] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  const [courseCpls, setCourseCpls] = useState<any[]>([]);
  const [courseBks, setCourseBks] = useState<any[]>([]);
  const [cpmks, setCpmks] = useState<any[]>([]);
  const [subCpmks, setSubCpmks] = useState<any[]>([]);
  const [topikMateri, setTopikMateri] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupedBySemester, setIsGroupedBySemester] = useState(true);

  // SKS Weighting Mode (Batch Save)
  const [isSksWeightingMode, setIsSksWeightingMode] = useState(false);
  const [sksWeightDrafts, setSksWeightDrafts] = useState<
    Record<
      string,
      { sks_teori: number; sks_praktikum: number; sks_lapangan: number }
    >
  >({});
  const [savingSksWeights, setSavingSksWeights] = useState(false);

  // Auto-Generate Kode MK
  const [isCustomKode, setIsCustomKode] = useState(false);
  const generateNextCourseCode = (existingCourses: any[]) => {
    const nextNum = existingCourses.length + 1;
    return `MK${String(nextNum).padStart(2, "0")}`;
  };

  // Expanded states
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [expandedCpmk, setExpandedCpmk] = useState<string | null>(null);

  // Forms
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState<{
    id?: string;
    kode: string;
    nama: string;
    sks?: number | "";
    sks_teori?: number | "";
    sks_praktikum?: number | "";
    sks_lapangan?: number | "";
    kurikulum_id: string;
    semester?: number | "";
    sifat_mk?: string;
    rekognisi_mbkm: boolean;
    assigned_bks: string[];
    metode_pembelajaran?: string;
    tautan_mou: string;
  }>({
    kode: "",
    nama: "",
    sks: "",
    sks_teori: 0,
    sks_praktikum: 0,
    sks_lapangan: 0,
    kurikulum_id: "",
    semester: "",
    sifat_mk: "",
    rekognisi_mbkm: false,
    assigned_bks: [],
    metode_pembelajaran: "",
    tautan_mou: "",
  });

  const [isTopikModalOpen, setIsTopikModalOpen] = useState(false);
  const [topikForm, setTopikForm] = useState<{
    id?: string;
    mata_kuliah_id: string;
    urutan: number;
    nama: string;
    kedalaman_k: number;
    kedalaman_a: number;
    kedalaman_p: number;
  }>({
    mata_kuliah_id: "",
    urutan: 1,
    nama: "",
    kedalaman_k: 0,
    kedalaman_a: 0,
    kedalaman_p: 0,
  });

  const [isCpmkModalOpen, setIsCpmkModalOpen] = useState(false);
  const [cpmkForm, setCpmkForm] = useState<{
    id: string;
    kode: string;
    deskripsi: string;
    bobot: number;
    kedalaman_k: number;
    kedalaman_a: number;
    kedalaman_p: number;
    mata_kuliah_id: string;
    bk_id: string;
  }>({
    id: "",
    kode: "",
    deskripsi: "",
    bobot: 0,
    kedalaman_k: 0,
    kedalaman_a: 0,
    kedalaman_p: 0,
    mata_kuliah_id: "",
    bk_id: "",
  });

  const [isSubCpmkModalOpen, setIsSubCpmkModalOpen] = useState(false);
  const [subCpmkForm, setSubCpmkForm] = useState<{
    id: string;
    kode: string;
    deskripsi: string;
    bobot: number;
    metode_penilaian: string;
    instrumen_penilaian: string;
    cpmk_id: string;
  }>({
    id: "",
    kode: "",
    deskripsi: "",
    bobot: 0,
    metode_penilaian: "",
    instrumen_penilaian: "",
    cpmk_id: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, [role, prodiId]);

  useEffect(() => {
    if (selectedKurikulum) {
      fetchMappingData(selectedKurikulum);
    }
  }, [selectedKurikulum]);

  const handleToggleSksWeightingMode = () => {
    if (!isSksWeightingMode) {
      const initialDrafts: Record<
        string,
        { sks_teori: number; sks_praktikum: number; sks_lapangan: number }
      > = {};
      courses.forEach((c) => {
        initialDrafts[c.id] = {
          sks_teori: c.sks_teori ?? 0,
          sks_praktikum: c.sks_praktikum ?? 0,
          sks_lapangan: c.sks_lapangan ?? 0,
        };
      });
      setSksWeightDrafts(initialDrafts);
    }
    setIsSksWeightingMode(!isSksWeightingMode);
  };

  const handleBatchSaveSksWeights = async () => {
    setSavingSksWeights(true);
    try {
      const updatePromises = Object.entries(sksWeightDrafts).map(
        ([courseId, draft]) => {
          const t = Number(draft.sks_teori || 0);
          const p = Number(draft.sks_praktikum || 0);
          const k = Number(draft.sks_lapangan || 0);
          const total = t + p + k;
          return supabase
            .from("mata_kuliah")
            .update({
              sks_teori: t,
              sks_praktikum: p,
              sks_lapangan: k,
              sks: total,
            })
            .eq("id", courseId);
        },
      );

      await Promise.all(updatePromises);
      setIsSksWeightingMode(false);
      if (selectedKurikulum) fetchMappingData(selectedKurikulum, true);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan pembobotan SKS");
    } finally {
      setSavingSksWeights(false);
    }
  };

  useEffect(() => {
    if (selectedKurikulum) {
      fetchMappingData(selectedKurikulum);
    }
  }, [selectedKurikulum]);

  const fetchInitialData = async () => {
    let query = supabase
      .from("kurikulum")
      .select("*, prodi(nama)")
      .order("tahun_berlaku", { ascending: false });
    if (role === "ADMIN" && prodiId) {
      query = query.eq("prodi_id", prodiId);
    }
    const { data: kurData } = await query;
    if (kurData && kurData.length > 0) {
      setKurikulums(kurData);
      setSelectedKurikulum(kurData[0].id);
    } else {
      setKurikulums([]);
      setSelectedKurikulum("");
      setCourses([]);
      setCpls([]);
      setBks([]);
      setLoading(false);
    }
  };

  const fetchMappingData = async (kurikulumId: string, silent = false) => {
    if (!silent) setLoading(true);
    const [cplRes, bkRes, courseRes, mapBkRes, cpmkRes, subRes, topikRes] =
      await Promise.all([
        supabase
          .from("cpl")
          .select("*")
          .eq("kurikulum_id", kurikulumId)
          .order("kode"),
        supabase
          .from("bahan_kajian")
          .select("*")
          .eq("kurikulum_id", kurikulumId)
          .order("kode"),
        supabase
          .from("mata_kuliah")
          .select("*")
          .eq("kurikulum_id", kurikulumId)
          .order("kode"),
        supabase.from("mata_kuliah_bk").select("*"),
        supabase.from("cpmk").select("*").order("kode"),
        supabase.from("sub_cpmk").select("*").order("kode"),
        supabase
          .from("topik_materi_pembelajaran")
          .select("*")
          .order("urutan", { ascending: true }),
      ]);
    if (cplRes.data) setCpls(cplRes.data);
    if (bkRes.data) setBks(bkRes.data);
    if (courseRes.data) setCourses(courseRes.data);
    if (mapBkRes.data) setCourseBks(mapBkRes.data);
    if (cpmkRes.data) setCpmks(cpmkRes.data);
    if (subRes.data) setSubCpmks(subRes.data);
    if (topikRes.data) setTopikMateri(topikRes.data);
    setLoading(false);
  };

  // COURSE Handlers
  const handleCourseSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = Number(courseForm.sks_teori || 0);
    const p = Number(courseForm.sks_praktikum || 0);
    const k = Number(courseForm.sks_lapangan || 0);
    const calculatedSks =
      t + p + k > 0
        ? t + p + k
        : courseForm.sks !== "" &&
            courseForm.sks !== undefined &&
            courseForm.sks !== null
          ? Number(courseForm.sks)
          : 0;

    const payload = {
      kode: courseForm.kode,
      nama: courseForm.nama,
      sks: calculatedSks,
      sks_teori: t,
      sks_praktikum: p,
      sks_lapangan: k,
      kurikulum_id: courseForm.kurikulum_id,
      semester:
        courseForm.semester !== "" &&
        courseForm.semester !== undefined &&
        courseForm.semester !== null
          ? Number(courseForm.semester)
          : null,
      sifat_mk: courseForm.sifat_mk || null,
      rekognisi_mbkm: courseForm.rekognisi_mbkm,
      metode_pembelajaran: courseForm.metode_pembelajaran || null,
      tautan_mou:
        courseForm.metode_pembelajaran &&
        courseForm.metode_pembelajaran !== "REGULAR"
          ? courseForm.tautan_mou
          : null,
    };

    if (courseForm.id) {
      await supabase
        .from("mata_kuliah")
        .update(payload)
        .eq("id", courseForm.id);
      await supabase
        .from("mata_kuliah_bk")
        .delete()
        .eq("mata_kuliah_id", courseForm.id);

      if (courseForm.assigned_bks.length > 0) {
        await supabase.from("mata_kuliah_bk").insert(
          courseForm.assigned_bks.map((bkId) => ({
            mata_kuliah_id: courseForm.id,
            bk_id: bkId,
          })),
        );
      }
    } else {
      const { data } = await supabase
        .from("mata_kuliah")
        .insert([payload])
        .select("id")
        .single();

      if (data && courseForm.assigned_bks.length > 0) {
        await supabase.from("mata_kuliah_bk").insert(
          courseForm.assigned_bks.map((bkId) => ({
            mata_kuliah_id: data.id,
            bk_id: bkId,
          })),
        );
      }
    }

    setIsCourseModalOpen(false);
    if (selectedKurikulum) fetchMappingData(selectedKurikulum, true);
  };

  const handleCourseDelete = async (id: string) => {
    if (
      confirm(
        "Hapus mata kuliah ini beserta seluruh CPMK, Sub-CPMK, dan Topik Materi di dalamnya?",
      )
    ) {
      await supabase.from("mata_kuliah").delete().eq("id", id);
      if (selectedKurikulum) fetchMappingData(selectedKurikulum, true);
    }
  };

  // TOPIK MATERI Handlers
  const handleTopikSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      mata_kuliah_id: topikForm.mata_kuliah_id,
      urutan: Number(topikForm.urutan || 1),
      nama: topikForm.nama,
      kedalaman_k: Number(topikForm.kedalaman_k || 0),
      kedalaman_a: Number(topikForm.kedalaman_a || 0),
      kedalaman_p: Number(topikForm.kedalaman_p || 0),
    };

    if (topikForm.id) {
      await supabase
        .from("topik_materi_pembelajaran")
        .update(payload)
        .eq("id", topikForm.id);
    } else {
      await supabase.from("topik_materi_pembelajaran").insert([payload]);
    }
    setIsTopikModalOpen(false);
    if (selectedKurikulum) fetchMappingData(selectedKurikulum, true);
  };

  const handleTopikDelete = async (id: string) => {
    if (confirm("Hapus topik materi pembelajaran ini?")) {
      await supabase.from("topik_materi_pembelajaran").delete().eq("id", id);
      if (selectedKurikulum) fetchMappingData(selectedKurikulum, true);
    }
  };

  // CPMK Handlers
  const handleCpmkSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const k = Number(cpmkForm.kedalaman_k || 0);
    const a = Number(cpmkForm.kedalaman_a || 0);
    const p = Number(cpmkForm.kedalaman_p || 0);
    const totalPoints = k + a + p;
    const finalBobot =
      totalPoints > 0 ? totalPoints : Number(cpmkForm.bobot || 0);

    const payload = {
      kode: cpmkForm.kode,
      deskripsi: cpmkForm.deskripsi,
      bobot: finalBobot,
      kedalaman_k: k,
      kedalaman_a: a,
      kedalaman_p: p,
      bk_id: cpmkForm.bk_id || null,
    };

    if (cpmkForm.id) {
      await supabase.from("cpmk").update(payload).eq("id", cpmkForm.id);
    } else {
      await supabase.from("cpmk").insert([
        {
          ...payload,
          mata_kuliah_id: cpmkForm.mata_kuliah_id,
        },
      ]);
    }
    setIsCpmkModalOpen(false);
    if (selectedKurikulum) fetchMappingData(selectedKurikulum, true);
  };

  const handleCpmkDelete = async (id: string) => {
    if (confirm("Hapus CPMK ini beserta seluruh Sub-CPMK di dalamnya?")) {
      await supabase.from("cpmk").delete().eq("id", id);
      if (selectedKurikulum) fetchMappingData(selectedKurikulum, true);
    }
  };

  // Sub-CPMK Handlers
  const handleSubCpmkSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (subCpmkForm.id) {
      await supabase
        .from("sub_cpmk")
        .update({
          kode: subCpmkForm.kode,
          deskripsi: subCpmkForm.deskripsi,
          bobot: subCpmkForm.bobot,
          metode_penilaian: subCpmkForm.metode_penilaian,
          instrumen_penilaian: subCpmkForm.instrumen_penilaian,
        })
        .eq("id", subCpmkForm.id);
    } else {
      await supabase.from("sub_cpmk").insert([
        {
          kode: subCpmkForm.kode,
          deskripsi: subCpmkForm.deskripsi,
          bobot: subCpmkForm.bobot,
          metode_penilaian: subCpmkForm.metode_penilaian,
          instrumen_penilaian: subCpmkForm.instrumen_penilaian,
          cpmk_id: subCpmkForm.cpmk_id,
        },
      ]);
    }
    setIsSubCpmkModalOpen(false);
    if (selectedKurikulum) fetchMappingData(selectedKurikulum, true);
  };

  const handleSubCpmkDelete = async (id: string) => {
    if (confirm("Hapus Sub-CPMK ini?")) {
      await supabase.from("sub_cpmk").delete().eq("id", id);
      if (selectedKurikulum) fetchMappingData(selectedKurikulum, true);
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nama.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedAndGroupedCourses = React.useMemo(() => {
    if (!isGroupedBySemester) return filteredCourses;

    return [...filteredCourses].sort((a, b) => {
      const semA =
        a.semester !== null && a.semester !== undefined && a.semester !== ""
          ? Number(a.semester)
          : 999;
      const semB =
        b.semester !== null && b.semester !== undefined && b.semester !== ""
          ? Number(b.semester)
          : 999;

      const isNumA = !isNaN(semA) && semA !== 999;
      const isNumB = !isNaN(semB) && semB !== 999;

      if (isNumA && isNumB) return semA - semB;
      if (isNumA) return -1;
      if (isNumB) return 1;

      const valA = a.semester ? String(a.semester) : "";
      const valB = b.semester ? String(b.semester) : "";
      return valA.localeCompare(valB);
    });
  }, [filteredCourses, isGroupedBySemester]);

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">
        Loading data Mata Kuliah...
      </div>
    );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mata Kuliah</h1>
          <p className="text-gray-500">
            Kelola daftar Mata Kuliah, struktur semester, pemetaan CPL & BK,
            serta hierarki CPMK dan Sub-CPMK.
          </p>
        </div>
        <div className="flex flex-wrap items-center space-x-3">
          <select
            className="p-2 border rounded-md shadow-sm bg-white min-w-[200px]"
            value={selectedKurikulum}
            onChange={(e) => setSelectedKurikulum(e.target.value)}
          >
            {kurikulums.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama} ({k.prodi?.nama})
              </option>
            ))}
          </select>
          <Button
            variant={isSksWeightingMode ? "primary" : "outline"}
            className={
              isSksWeightingMode
                ? "bg-indigo-600 text-white"
                : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            }
            onClick={handleToggleSksWeightingMode}
          >
            <Sliders className="w-4 h-4 mr-2" /> Pembobotan SKS
          </Button>
          <Button
            onClick={() => {
              const autoKode = generateNextCourseCode(courses);
              setCourseForm({
                kode: autoKode,
                nama: "",
                sks: "",
                sks_teori: 0,
                sks_praktikum: 0,
                sks_lapangan: 0,
                kurikulum_id: selectedKurikulum,
                semester: "",
                sifat_mk: "",
                rekognisi_mbkm: false,
                assigned_bks: [],
                metode_pembelajaran: "",
                tautan_mou: "",
              });
              setIsCustomKode(false);
              setIsCourseModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Mata Kuliah
          </Button>
        </div>
      </div>

      {/* SKS Weighting Batch Save Banner */}
      {isSksWeightingMode && (
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3 text-indigo-900 text-sm">
            <Sliders className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <div>
              <strong className="font-bold">Mode Pembobotan SKS Aktif</strong>
              <p className="text-xs text-indigo-700">
                Isi pecahan SKS (Teori T, Praktikum P, Lapangan K) pada setiap
                row mata kuliah, lalu klik Simpan Pembobotan SKS.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSksWeightingMode(false)}
            >
              Batal
            </Button>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              onClick={handleBatchSaveSksWeights}
              disabled={savingSksWeights}
            >
              <Save className="w-4 h-4 mr-1.5" />
              {savingSksWeights ? "Menyimpan..." : "Simpan Pembobotan SKS"}
            </Button>
          </div>
        </div>
      )}

      {/* Filter / Search Bar & Grouping Button */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-primary"
            placeholder="Cari Mata Kuliah berdasarkan kode atau nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant={isGroupedBySemester ? "primary" : "outline"}
          onClick={() => setIsGroupedBySemester(!isGroupedBySemester)}
          className={
            isGroupedBySemester
              ? "bg-primary text-white border border-primary shadow-sm"
              : "border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50"
          }
        >
          <Layers className="w-4 h-4 mr-2" />
          Kelompokkan Semester
        </Button>
      </div>

      <div className="space-y-4">
        {sortedAndGroupedCourses.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-slate-500">
              {courses.length === 0
                ? "Belum ada data Mata Kuliah di kurikulum ini."
                : "Tidak ada Mata Kuliah yang sesuai pencarian."}
            </CardContent>
          </Card>
        )}

        {sortedAndGroupedCourses.map((course, idx) => {
          const isExpanded = expandedCourse === course.id;
          const courseBksData = courseBks
            .filter((m) => m.mata_kuliah_id === course.id)
            .map((m) => {
              const bk = bks.find((b) => b.id === m.bk_id);
              if (!bk) return null;
              const cpl = cpls.find((c) => c.id === bk.cpl_id);
              return { ...bk, cpl };
            })
            .filter(Boolean);
          const courseCpmks = cpmks.filter(
            (c) => c.mata_kuliah_id === course.id,
          );

          const hasSemester =
            course.semester !== null &&
            course.semester !== undefined &&
            course.semester !== "";
          const showHeader =
            isGroupedBySemester &&
            (idx === 0 ||
              sortedAndGroupedCourses[idx - 1].semester !== course.semester);

          return (
            <React.Fragment key={course.id}>
              {showHeader && (
                <div className="pt-6 pb-2 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center justify-center bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                        Semester {hasSemester ? course.semester : "Lainnya"}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {(() => {
                          const semesterCourses =
                            sortedAndGroupedCourses.filter(
                              (c) => c.semester === course.semester,
                            );
                          const wajibCount = semesterCourses.filter(
                            (c) => c.sifat_mk === "Wajib",
                          ).length;
                          const pilihanCount = semesterCourses.filter(
                            (c) => c.sifat_mk === "Pilihan",
                          ).length;
                          const mkwkCount = semesterCourses.filter(
                            (c) => c.sifat_mk === "MKWK",
                          ).length;
                          return `Wajib: ${wajibCount} • MKWK: ${mkwkCount} • Pilihan: ${pilihanCount} • Total: ${semesterCourses.length}`;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <Card className="overflow-hidden border border-slate-200 shadow-sm transition-all duration-200">
                {/* Course Header */}
                <div
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${isExpanded ? "bg-slate-50 border-b border-slate-100" : ""}`}
                  onClick={() =>
                    setExpandedCourse(isExpanded ? null : course.id)
                  }
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2.5 rounded-lg">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">
                        {course.kode} - {course.nama}
                      </h3>
                      <div className="flex flex-wrap items-center text-sm text-slate-500 gap-x-2 gap-y-1 mt-1">
                        {course.semester && (
                          <span>Semester {course.semester} •</span>
                        )}
                        <span>
                          {course.sks ||
                            (course.sks_teori || 0) +
                              (course.sks_praktikum || 0) +
                              (course.sks_lapangan || 0)}{" "}
                          SKS (T:{course.sks_teori || 0} P:
                          {course.sks_praktikum || 0} K:
                          {course.sks_lapangan || 0}) •
                        </span>
                        {course.sifat_mk && <span>{course.sifat_mk} •</span>}
                        {course.rekognisi_mbkm && (
                          <span className="text-emerald-600 font-semibold">
                            MBKM •
                          </span>
                        )}
                        <span className="font-semibold text-primary">
                          {courseCpmks.length} CPMK
                        </span>
                      </div>
                      {course.metode_pembelajaran &&
                        course.metode_pembelajaran !== "REGULAR" && (
                          <div className="mt-2 text-xs">
                            <span className="bg-purple-100 text-purple-700 font-semibold px-2 py-1 rounded">
                              IKU 5:{" "}
                              {course.metode_pembelajaran === "TBP"
                                ? "Team-Based Project"
                                : course.metode_pembelajaran === "CM"
                                  ? "Case Method"
                                  : course.metode_pembelajaran}
                            </span>
                            {course.tautan_mou && (
                              <a
                                href={course.tautan_mou}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-2 text-blue-500 hover:underline"
                              >
                                Lihat Dokumen MoU
                              </a>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCourseForm({
                          id: course.id,
                          kode: course.kode,
                          nama: course.nama,
                          sks: course.sks ?? "",
                          sks_teori: course.sks_teori ?? 0,
                          sks_praktikum: course.sks_praktikum ?? 0,
                          sks_lapangan: course.sks_lapangan ?? 0,
                          kurikulum_id: course.kurikulum_id,
                          semester: course.semester ?? "",
                          sifat_mk: course.sifat_mk ?? "",
                          rekognisi_mbkm: course.rekognisi_mbkm ?? false,
                          assigned_bks: courseBks
                            .filter((m) => m.mata_kuliah_id === course.id)
                            .map((m) => m.bk_id),
                          metode_pembelajaran: course.metode_pembelajaran ?? "",
                          tautan_mou: course.tautan_mou || "",
                        });
                        setIsCustomKode(true);
                        setIsCourseModalOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 text-slate-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseDelete(course.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Inline SKS Weighting Mode Form */}
                {isSksWeightingMode && (
                  <div
                    className="p-3 bg-indigo-50/80 border-t border-indigo-200 flex items-center justify-between flex-wrap gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center space-x-2 text-xs font-bold text-indigo-900">
                      <Sliders className="w-4 h-4 text-indigo-600" />
                      <span>Pembobotan SKS:</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1.5 text-xs">
                        <span className="font-semibold text-slate-700">
                          Teori (T):
                        </span>
                        <input
                          type="number"
                          min="0"
                          className="w-16 p-1 border border-indigo-300 rounded text-center font-bold text-slate-800 bg-white outline-none focus:ring-2 focus:ring-indigo-400"
                          value={sksWeightDrafts[course.id]?.sks_teori ?? 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setSksWeightDrafts((prev) => ({
                              ...prev,
                              [course.id]: {
                                ...(prev[course.id] || {
                                  sks_teori: 0,
                                  sks_praktikum: 0,
                                  sks_lapangan: 0,
                                }),
                                sks_teori: val,
                              },
                            }));
                          }}
                        />
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs">
                        <span className="font-semibold text-slate-700">
                          Praktikum (P):
                        </span>
                        <input
                          type="number"
                          min="0"
                          className="w-16 p-1 border border-indigo-300 rounded text-center font-bold text-slate-800 bg-white outline-none focus:ring-2 focus:ring-indigo-400"
                          value={sksWeightDrafts[course.id]?.sks_praktikum ?? 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setSksWeightDrafts((prev) => ({
                              ...prev,
                              [course.id]: {
                                ...(prev[course.id] || {
                                  sks_teori: 0,
                                  sks_praktikum: 0,
                                  sks_lapangan: 0,
                                }),
                                sks_praktikum: val,
                              },
                            }));
                          }}
                        />
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs">
                        <span className="font-semibold text-slate-700">
                          Lapangan (K):
                        </span>
                        <input
                          type="number"
                          min="0"
                          className="w-16 p-1 border border-indigo-300 rounded text-center font-bold text-slate-800 bg-white outline-none focus:ring-2 focus:ring-indigo-400"
                          value={sksWeightDrafts[course.id]?.sks_lapangan ?? 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setSksWeightDrafts((prev) => ({
                              ...prev,
                              [course.id]: {
                                ...(prev[course.id] || {
                                  sks_teori: 0,
                                  sks_praktikum: 0,
                                  sks_lapangan: 0,
                                }),
                                sks_lapangan: val,
                              },
                            }));
                          }}
                        />
                      </div>
                      <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                        Total:{" "}
                        {(sksWeightDrafts[course.id]?.sks_teori || 0) +
                          (sksWeightDrafts[course.id]?.sks_praktikum || 0) +
                          (sksWeightDrafts[course.id]?.sks_lapangan || 0)}{" "}
                        SKS
                      </div>
                    </div>
                  </div>
                )}

                {/* Course Content */}
                {isExpanded && (
                  <div className="p-6 bg-white space-y-8">
                    {/* Mapping Info */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                      <h4 className="text-sm font-bold text-slate-700 flex items-center">
                        <Layers className="w-4 h-4 mr-2 text-orange-500" />
                        Bahan Kajian (BK) & Pemetaan CPL
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {courseBksData.length > 0 ? (
                          courseBksData.map((bk: any) => (
                            <span
                              key={bk.id}
                              className="px-3 py-1.5 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 font-medium shadow-sm flex items-center space-x-2"
                            >
                              <span className="font-bold text-orange-700">
                                {bk.kode}
                              </span>
                              <span>- {bk.nama}</span>
                              {bk.cpl ? (
                                <span
                                  className="ml-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold border border-indigo-100"
                                  title={bk.cpl.deskripsi}
                                >
                                  {bk.cpl.kode}
                                </span>
                              ) : (
                                <span className="ml-1 px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded text-[10px]">
                                  Tanpa CPL
                                </span>
                              )}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400 italic">
                            Belum ada Bahan Kajian terhubung
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Topik Materi Pembelajaran Section */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <div>
                          <h4 className="font-bold text-slate-800 flex items-center text-base">
                            <ListOrdered className="w-5 h-5 mr-2 text-indigo-600" />
                            Topik Materi Pembelajaran (Kedalaman KAP)
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Topik materi dirancang berdasarkan CPMK dengan
                            pembobotan Kognitif (K), Afektif (A), dan
                            Psikomotorik (P).
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                          onClick={() => {
                            const courseTopikList = topikMateri.filter(
                              (t) => t.mata_kuliah_id === course.id,
                            );
                            setTopikForm({
                              mata_kuliah_id: course.id,
                              urutan: courseTopikList.length + 1,
                              nama: "",
                              kedalaman_k: 0,
                              kedalaman_a: 0,
                              kedalaman_p: 0,
                            });
                            setIsTopikModalOpen(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1.5" /> Tambah Topik
                          Materi
                        </Button>
                      </div>

                      {(() => {
                        const courseTopics = topikMateri.filter(
                          (t) => t.mata_kuliah_id === course.id,
                        );
                        const totalBobotKap = courseTopics.reduce(
                          (sum, t) =>
                            sum +
                            (Number(t.kedalaman_k || 0) +
                              Number(t.kedalaman_a || 0) +
                              Number(t.kedalaman_p || 0)),
                          0,
                        );
                        const estSks =
                          totalBobotKap > 0
                            ? (totalBobotKap / 4.76).toFixed(1)
                            : "0";

                        return (
                          <div className="space-y-3">
                            {courseTopics.length > 0 && (
                              <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm gap-2">
                                <span>
                                  Total Topik:{" "}
                                  <strong className="text-slate-800">
                                    {courseTopics.length} Topik
                                  </strong>
                                </span>
                                <span>
                                  Total Bobot KAP Kumulatif:{" "}
                                  <strong className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                    {totalBobotKap} Point
                                  </strong>
                                </span>
                                <span>
                                  Estimasi SKS Justifikasi:{" "}
                                  <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                    {estSks} SKS
                                  </strong>
                                </span>
                              </div>
                            )}

                            {courseTopics.length === 0 ? (
                              <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
                                Belum ada Topik Materi Pembelajaran untuk Mata
                                Kuliah ini.
                              </div>
                            ) : (
                              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                                <table className="w-full text-left border-collapse text-sm">
                                  <thead>
                                    <tr className="bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                                      <th className="py-2.5 px-3 w-12 text-center">
                                        No
                                      </th>
                                      <th className="py-2.5 px-3">
                                        Topik Materi Pembelajaran
                                      </th>
                                      <th className="py-2.5 px-3 text-center w-36">
                                        Kedalaman (K, A, P)
                                      </th>
                                      <th className="py-2.5 px-3 text-center w-24">
                                        Bobot
                                      </th>
                                      <th className="py-2.5 px-3 text-center w-24">
                                        Aksi
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {courseTopics.map((topik, idx) => {
                                      const topicWeight =
                                        Number(topik.kedalaman_k || 0) +
                                        Number(topik.kedalaman_a || 0) +
                                        Number(topik.kedalaman_p || 0);
                                      return (
                                        <tr
                                          key={topik.id}
                                          className="hover:bg-slate-50 transition-colors"
                                        >
                                          <td className="py-2.5 px-3 text-center font-bold text-slate-500">
                                            {idx + 1}
                                          </td>
                                          <td className="py-2.5 px-3 font-medium text-slate-800">
                                            {topik.nama}
                                          </td>
                                          <td className="py-2.5 px-3 text-center">
                                            <div className="inline-flex space-x-1 text-xs font-mono">
                                              <span
                                                className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-100"
                                                title="Kognitif"
                                              >
                                                K:{topik.kedalaman_k}
                                              </span>
                                              <span
                                                className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold border border-amber-100"
                                                title="Afektif"
                                              >
                                                A:{topik.kedalaman_a}
                                              </span>
                                              <span
                                                className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold border border-purple-100"
                                                title="Psikomotorik"
                                              >
                                                P:{topik.kedalaman_p}
                                              </span>
                                            </div>
                                          </td>
                                          <td className="py-2.5 px-3 text-center font-bold text-indigo-700">
                                            {topicWeight}
                                          </td>
                                          <td className="py-2.5 px-3 text-center">
                                            <div className="flex justify-center space-x-1">
                                              <button
                                                onClick={() => {
                                                  setTopikForm({
                                                    id: topik.id,
                                                    mata_kuliah_id: course.id,
                                                    urutan:
                                                      topik.urutan || idx + 1,
                                                    nama: topik.nama,
                                                    kedalaman_k:
                                                      topik.kedalaman_k,
                                                    kedalaman_a:
                                                      topik.kedalaman_a,
                                                    kedalaman_p:
                                                      topik.kedalaman_p,
                                                  });
                                                  setIsTopikModalOpen(true);
                                                }}
                                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                              >
                                                <Pencil className="w-3.5 h-3.5" />
                                              </button>
                                              <button
                                                onClick={() =>
                                                  handleTopikDelete(topik.id)
                                                }
                                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* CPMK Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                        <h4 className="font-bold text-slate-800 flex items-center text-lg">
                          <Activity className="w-5 h-5 mr-2 text-primary" />
                          Capaian Pembelajaran Mata Kuliah (CPMK)
                        </h4>
                        <Button
                          size="sm"
                          onClick={() => {
                            const assignedBkIds = courseBks
                              .filter((mbk) => mbk.mata_kuliah_id === course.id)
                              .map((mbk) => mbk.bk_id);
                            const availableBks = bks.filter((bk) =>
                              assignedBkIds.includes(bk.id),
                            );
                            setCpmkForm({
                              id: "",
                              kode: "",
                              deskripsi: "",
                              bobot: 0,
                              kedalaman_k: 0,
                              kedalaman_a: 0,
                              kedalaman_p: 0,
                              mata_kuliah_id: course.id,
                              bk_id:
                                availableBks.length > 0
                                  ? availableBks[0].id
                                  : "",
                            });
                            setIsCpmkModalOpen(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" /> Tambah CPMK
                        </Button>
                      </div>

                      {(() => {
                        const totalCpmkKap = courseCpmks.reduce(
                          (sum, c) =>
                            sum +
                            (Number(c.kedalaman_k || 0) +
                              Number(c.kedalaman_a || 0) +
                              Number(c.kedalaman_p || 0) ||
                              Number(c.bobot || 0)),
                          0,
                        );
                        return (
                          courseCpmks.length > 0 && (
                            <div className="flex flex-wrap items-center justify-between text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 gap-2 mb-3">
                              <span>
                                Total CPMK:{" "}
                                <strong className="text-slate-800">
                                  {courseCpmks.length} CPMK
                                </strong>
                              </span>
                              <span>
                                Total Bobot KAP CPMK Kumulatif:{" "}
                                <strong className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                  {totalCpmkKap} Point
                                </strong>
                              </span>
                            </div>
                          )
                        );
                      })()}

                      <div className="space-y-4">
                        {courseCpmks.length === 0 ? (
                          <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                            Belum ada CPMK untuk Mata Kuliah ini. Silakan
                            tambahkan CPMK pertama Anda.
                          </div>
                        ) : (
                          courseCpmks.map((cpmk) => {
                            const isCpmkExpanded = expandedCpmk === cpmk.id;
                            const cpmkSubs = subCpmks.filter(
                              (s) => s.cpmk_id === cpmk.id,
                            );
                            const cpmkWeight =
                              Number(cpmk.kedalaman_k || 0) +
                                Number(cpmk.kedalaman_a || 0) +
                                Number(cpmk.kedalaman_p || 0) ||
                              Number(cpmk.bobot || 0);

                            return (
                              <div
                                key={cpmk.id}
                                className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden"
                              >
                                <div
                                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                  onClick={() =>
                                    setExpandedCpmk(
                                      isCpmkExpanded ? null : cpmk.id,
                                    )
                                  }
                                >
                                  <div className="flex items-center space-x-4 flex-1">
                                    <div className="bg-primary text-white text-sm font-bold px-3 py-1.5 rounded-md text-center shadow-sm">
                                      {cpmk.kode}
                                    </div>
                                    <div className="flex flex-col flex-1 pr-4">
                                      <div className="text-sm font-medium text-slate-700 leading-relaxed">
                                        {cpmk.deskripsi}
                                      </div>
                                      {(() => {
                                        const linkedBk = bks.find(
                                          (b) => b.id === cpmk.bk_id,
                                        );
                                        return linkedBk ? (
                                          <div className="mt-1 flex items-center">
                                            <span
                                              className="inline-flex items-center text-[11px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200"
                                              title={`Bahan Kajian: ${linkedBk.nama}`}
                                            >
                                              <Layers className="w-3 h-3 mr-1 text-orange-500" />
                                              BK: {linkedBk.kode} -{" "}
                                              {linkedBk.nama}
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="mt-1 flex items-center">
                                            <span className="inline-flex items-center text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                              Belum dikaitkan Bahan Kajian
                                            </span>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                    <div className="inline-flex space-x-1 text-xs font-mono">
                                      <span
                                        className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-100"
                                        title="Kognitif"
                                      >
                                        K:{cpmk.kedalaman_k || 0}
                                      </span>
                                      <span
                                        className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold border border-amber-100"
                                        title="Afektif"
                                      >
                                        A:{cpmk.kedalaman_a || 0}
                                      </span>
                                      <span
                                        className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold border border-purple-100"
                                        title="Psikomotorik"
                                      >
                                        P:{cpmk.kedalaman_p || 0}
                                      </span>
                                    </div>
                                    <div className="text-xs font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full">
                                      Bobot: {cpmkWeight} Point
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2 pl-4 border-l border-slate-100 ml-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCpmkForm({
                                          id: cpmk.id,
                                          kode: cpmk.kode,
                                          deskripsi: cpmk.deskripsi,
                                          bobot: cpmk.bobot || 0,
                                          kedalaman_k: cpmk.kedalaman_k || 0,
                                          kedalaman_a: cpmk.kedalaman_a || 0,
                                          kedalaman_p: cpmk.kedalaman_p || 0,
                                          mata_kuliah_id: course.id,
                                          bk_id: cpmk.bk_id || "",
                                        });
                                        setIsCpmkModalOpen(true);
                                      }}
                                    >
                                      <Pencil className="w-4 h-4 text-slate-500" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCpmkDelete(cpmk.id);
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                    {isCpmkExpanded ? (
                                      <ChevronUp className="w-5 h-5 text-slate-400 ml-1" />
                                    ) : (
                                      <ChevronDown className="w-5 h-5 text-slate-400 ml-1" />
                                    )}
                                  </div>
                                </div>

                                {/* Sub-CPMK Section */}
                                {isCpmkExpanded && (
                                  <div className="p-5 bg-slate-50 border-t border-slate-200">
                                    <div className="flex flex-col mb-4 space-y-3">
                                      <div className="flex justify-between items-center">
                                        <h5 className="text-sm font-bold text-slate-700 flex items-center">
                                          <CheckSquare className="w-4 h-4 mr-2 text-emerald-600" />
                                          Indikator / Sub-CPMK
                                        </h5>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-8 text-xs bg-white"
                                          onClick={() => {
                                            setSubCpmkForm({
                                              id: "",
                                              kode: "",
                                              deskripsi: "",
                                              bobot: 0,
                                              metode_penilaian: "",
                                              instrumen_penilaian: "",
                                              cpmk_id: cpmk.id,
                                            });
                                            setIsSubCpmkModalOpen(true);
                                          }}
                                        >
                                          <Plus className="w-3 h-3 mr-1" />{" "}
                                          Tambah Sub-CPMK
                                        </Button>
                                      </div>

                                      {/* Weight Validation */}
                                      {(() => {
                                        const totalSubWeight = cpmkSubs.reduce(
                                          (sum, s) =>
                                            sum + Number(s.bobot || 0),
                                          0,
                                        );
                                        const isWeightValid =
                                          totalSubWeight === 100;
                                        return (
                                          <div className="w-full">
                                            <div className="flex justify-between text-xs font-semibold mb-1">
                                              <span
                                                className={
                                                  isWeightValid
                                                    ? "text-slate-600"
                                                    : "text-red-600"
                                                }
                                              >
                                                Total Bobot Sub-CPMK (Validasi
                                                100%)
                                              </span>
                                              <span
                                                className={
                                                  isWeightValid
                                                    ? "text-emerald-600"
                                                    : "text-red-600"
                                                }
                                              >
                                                {totalSubWeight}% / 100%
                                              </span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-2">
                                              <div
                                                className={`h-2 rounded-full ${isWeightValid ? "bg-emerald-500" : totalSubWeight > 100 ? "bg-red-500" : "bg-amber-500"}`}
                                                style={{
                                                  width: `${Math.min(totalSubWeight, 100)}%`,
                                                }}
                                              ></div>
                                            </div>
                                            {!isWeightValid &&
                                              cpmkSubs.length > 0 && (
                                                <p className="text-xs text-red-500 mt-1">
                                                  Total bobot Sub-CPMK harus
                                                  bernilai tepat 100%.
                                                </p>
                                              )}
                                          </div>
                                        );
                                      })()}
                                    </div>

                                    <div className="space-y-3 pl-3 border-l-2 border-emerald-200">
                                      {cpmkSubs.length === 0 ? (
                                        <div className="text-sm text-slate-400 italic py-2 pl-2">
                                          Belum ada Sub-CPMK.
                                        </div>
                                      ) : (
                                        cpmkSubs.map((sub) => (
                                          <div
                                            key={sub.id}
                                            className="flex flex-col p-4 bg-white border border-slate-200 shadow-sm rounded-lg ml-2 hover:border-emerald-200 transition-colors"
                                          >
                                            <div className="flex justify-between items-start">
                                              <div className="flex items-start space-x-3 flex-1">
                                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 mt-0.5">
                                                  {sub.kode}
                                                </span>
                                                <p className="text-sm text-slate-700 flex-1 leading-relaxed">
                                                  {sub.deskripsi}
                                                </p>
                                              </div>
                                              <div className="flex items-center space-x-2 ml-4">
                                                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                                                  Bobot: {sub.bobot}%
                                                </span>
                                                <div className="flex space-x-1 border-l border-slate-200 pl-2 ml-2">
                                                  <button
                                                    onClick={() => {
                                                      setSubCpmkForm({
                                                        id: sub.id,
                                                        kode: sub.kode,
                                                        deskripsi:
                                                          sub.deskripsi,
                                                        bobot: sub.bobot,
                                                        metode_penilaian:
                                                          sub.metode_penilaian ||
                                                          "",
                                                        instrumen_penilaian:
                                                          sub.instrumen_penilaian ||
                                                          "",
                                                        cpmk_id: cpmk.id,
                                                      });
                                                      setIsSubCpmkModalOpen(
                                                        true,
                                                      );
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                                  >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                  </button>
                                                  <button
                                                    onClick={() =>
                                                      handleSubCpmkDelete(
                                                        sub.id,
                                                      )
                                                    }
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                  >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                            {(sub.metode_penilaian ||
                                              sub.instrumen_penilaian) && (
                                              <div className="mt-3 flex flex-wrap gap-2">
                                                {sub.metode_penilaian && (
                                                  <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                                    Metode:{" "}
                                                    {sub.metode_penilaian}
                                                  </span>
                                                )}
                                                {sub.instrumen_penilaian && (
                                                  <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                    Instrumen:{" "}
                                                    {sub.instrumen_penilaian}
                                                  </span>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </React.Fragment>
          );
        })}
      </div>

      {/* MODALS */}
      {/* 1. Modal Tambah Mata Kuliah */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {courseForm.id ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
              </h2>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form
                id="courseForm"
                onSubmit={handleCourseSave}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Kurikulum
                  </label>
                  <select
                    disabled
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 outline-none"
                    value={courseForm.kurikulum_id}
                  >
                    {kurikulums.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama} ({p.prodi?.nama})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700">
                      Kode MK
                    </label>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {!isCustomKode ? "Kode Otomatis (Urutan)" : "Kustom"}
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      required
                      type="text"
                      readOnly={!isCustomKode}
                      className={`w-full p-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                        !isCustomKode
                          ? "bg-slate-100 font-bold text-primary cursor-default"
                          : "bg-white text-slate-800"
                      }`}
                      value={courseForm.kode}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, kode: e.target.value })
                      }
                      placeholder="Contoh: MK01"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!isCustomKode) {
                          setIsCustomKode(true);
                        } else {
                          setIsCustomKode(false);
                          if (!courseForm.id) {
                            setCourseForm((prev) => ({
                              ...prev,
                              kode: generateNextCourseCode(courses),
                            }));
                          }
                        }
                      }}
                      className={`absolute right-2 p-1.5 rounded-md transition-colors ${
                        isCustomKode
                          ? "text-primary bg-primary/10 hover:bg-primary/20"
                          : "text-slate-400 hover:text-primary hover:bg-slate-200"
                      }`}
                      title={
                        isCustomKode
                          ? "Kembali ke Kode Otomatis"
                          : "Kustomisasi Kode MK"
                      }
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Nama Mata Kuliah
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={courseForm.nama}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, nama: e.target.value })
                    }
                    placeholder="Contoh: Pemrograman Web"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">
                      Semester{" "}
                      <span className="text-slate-400 font-normal">
                        (Opsional)
                      </span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      value={courseForm.semester}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          semester:
                            e.target.value !== ""
                              ? parseInt(e.target.value)
                              : "",
                        })
                      }
                      placeholder="Misal: 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">
                      Sifat Mata Kuliah{" "}
                      <span className="text-slate-400 font-normal">
                        (Opsional)
                      </span>
                    </label>
                    <select
                      className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:border-primary"
                      value={courseForm.sifat_mk || ""}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          sifat_mk: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Pilih Sifat MK --</option>
                      <option value="Wajib">Wajib</option>
                      <option value="Pilihan">Pilihan</option>
                      <option value="MKWK">MKWK</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={courseForm.rekognisi_mbkm}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          rekognisi_mbkm: e.target.checked,
                        })
                      }
                      className="rounded text-primary focus:ring-primary border-slate-300"
                    />
                    <span>Mata Kuliah Rekognisi MBKM</span>
                  </label>
                </div>

                <div className="bg-slate-100 p-4 border border-slate-200 rounded-lg space-y-3 opacity-60">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-600">
                      Metode Pembelajaran (IKU 5)
                    </h4>
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                      Sementara Nonaktif
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-600">
                      Jenis Metode
                    </label>
                    <select
                      disabled
                      className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-200 text-slate-500 cursor-not-allowed outline-none"
                      value={courseForm.metode_pembelajaran || ""}
                    >
                      <option value="">
                        -- Pilih Metode Pembelajaran (Disabled) --
                      </option>
                      <option value="REGULAR">Reguler (Bukan TBP/CM)</option>
                      <option value="TBP">Team-Based Project (TBP)</option>
                      <option value="CM">Case Method (CM)</option>
                    </select>
                  </div>
                  {courseForm.metode_pembelajaran &&
                    courseForm.metode_pembelajaran !== "REGULAR" && (
                      <div>
                        <label className="block text-sm font-medium mb-1 text-slate-600">
                          Tautan Dokumen MoU/MoA Industri
                        </label>
                        <input
                          disabled
                          type="url"
                          className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-200 text-slate-500 cursor-not-allowed outline-none"
                          value={courseForm.tautan_mou}
                          placeholder="https://link-ke-dokumen-kerjasama..."
                        />
                      </div>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Target Bahan Kajian
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                    {[...bks]
                      .sort((a, b) =>
                        (a.kode || "").localeCompare(b.kode || "", undefined, {
                          numeric: true,
                          sensitivity: "base",
                        }),
                      )
                      .map((bk) => (
                        <label
                          key={bk.id}
                          className="flex items-center space-x-3 text-sm p-1 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-primary focus:ring-primary"
                            checked={courseForm.assigned_bks.includes(bk.id)}
                            onChange={(e) => {
                              if (e.target.checked)
                                setCourseForm({
                                  ...courseForm,
                                  assigned_bks: [
                                    ...courseForm.assigned_bks,
                                    bk.id,
                                  ],
                                });
                              else
                                setCourseForm({
                                  ...courseForm,
                                  assigned_bks: courseForm.assigned_bks.filter(
                                    (id) => id !== bk.id,
                                  ),
                                });
                            }}
                          />
                          <span>
                            <strong className="text-slate-800">
                              {bk.kode}
                            </strong>{" "}
                            - <span className="text-slate-600">{bk.nama}</span>
                          </span>
                        </label>
                      ))}
                    {bks.length === 0 && (
                      <span className="text-sm text-slate-400 italic">
                        Belum ada Bahan Kajian
                      </span>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3 rounded-b-xl">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCourseModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" form="courseForm">
                Simpan Mata Kuliah
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal CPMK */}
      {isCpmkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {cpmkForm.id ? "Edit CPMK" : "Tambah CPMK"}
              </h2>
            </div>
            <div className="p-6">
              <form
                id="cpmkForm"
                onSubmit={handleCpmkSave}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Kode CPMK
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={cpmkForm.kode}
                    onChange={(e) =>
                      setCpmkForm({ ...cpmkForm, kode: e.target.value })
                    }
                    placeholder="Contoh: CPMK-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Deskripsi Capaian
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={cpmkForm.deskripsi}
                    onChange={(e) =>
                      setCpmkForm({ ...cpmkForm, deskripsi: e.target.value })
                    }
                    placeholder="Deskripsikan capaian spesifik mata kuliah ini..."
                  />
                </div>

                {/* Selection of Bahan Kajian linked to this course */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 flex justify-between items-center">
                    <span>
                      Bahan Kajian (Mata Kuliah ini){" "}
                      <span className="text-red-500">*</span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      Hanya menampilkan BK di MK ini
                    </span>
                  </label>
                  {(() => {
                    const assignedBkIds = courseBks
                      .filter(
                        (mbk) => mbk.mata_kuliah_id === cpmkForm.mata_kuliah_id,
                      )
                      .map((mbk) => mbk.bk_id);
                    const availableBksForCourse = bks
                      .filter((bk) => assignedBkIds.includes(bk.id))
                      .sort((a, b) =>
                        (a.kode || "").localeCompare(b.kode || "", undefined, {
                          numeric: true,
                        }),
                      );

                    return (
                      <div className="space-y-1.5">
                        <select
                          required
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white text-sm"
                          value={cpmkForm.bk_id}
                          onChange={(e) =>
                            setCpmkForm({ ...cpmkForm, bk_id: e.target.value })
                          }
                        >
                          <option value="">-- Pilih Bahan Kajian --</option>
                          {availableBksForCourse.map((bk) => (
                            <option key={bk.id} value={bk.id}>
                              {bk.kode} - {bk.nama}
                            </option>
                          ))}
                        </select>
                        {availableBksForCourse.length === 0 && (
                          <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                            <strong>Peringatan:</strong> Mata Kuliah ini belum
                            dihubungkan dengan Bahan Kajian (BK) apapun. Silakan
                            hubungkan Bahan Kajian di form Edit Mata Kuliah
                            terlebih dahulu.
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-indigo-900">
                      Pembobotan Kedalaman (KAP)
                    </h4>
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded">
                      Bobot CPMK:{" "}
                      {Number(cpmkForm.kedalaman_k || 0) +
                        Number(cpmkForm.kedalaman_a || 0) +
                        Number(cpmkForm.kedalaman_p || 0)}{" "}
                      Point
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Tentukan tingkat kedalaman taksonomi untuk CPMK ini.
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-blue-700 mb-1">
                        Kognitif (K)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="6"
                        className="w-full p-2 border border-blue-200 rounded-md text-sm outline-none focus:border-blue-500 bg-white"
                        value={cpmkForm.kedalaman_k}
                        onChange={(e) =>
                          setCpmkForm({
                            ...cpmkForm,
                            kedalaman_k: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0-6"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-700 mb-1">
                        Afektif (A)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        className="w-full p-2 border border-amber-200 rounded-md text-sm outline-none focus:border-amber-500 bg-white"
                        value={cpmkForm.kedalaman_a}
                        onChange={(e) =>
                          setCpmkForm({
                            ...cpmkForm,
                            kedalaman_a: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0-5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-700 mb-1">
                        Psikomotorik (P)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        className="w-full p-2 border border-purple-200 rounded-md text-sm outline-none focus:border-purple-500 bg-white"
                        value={cpmkForm.kedalaman_p}
                        onChange={(e) =>
                          setCpmkForm({
                            ...cpmkForm,
                            kedalaman_p: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0-5"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3 rounded-b-xl">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCpmkModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" form="cpmkForm">
                Simpan CPMK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Sub-CPMK */}
      {isSubCpmkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {subCpmkForm.id ? "Edit Sub-CPMK" : "Tambah Sub-CPMK"}
              </h2>
            </div>
            <div className="p-6">
              <form
                id="subCpmkForm"
                onSubmit={handleSubCpmkSave}
                className="space-y-4"
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1 text-slate-700">
                      Kode Sub-CPMK
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      value={subCpmkForm.kode}
                      onChange={(e) =>
                        setSubCpmkForm({ ...subCpmkForm, kode: e.target.value })
                      }
                      placeholder="Contoh: Sub-CPMK 1.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700">
                      Bobot (%)
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      value={subCpmkForm.bobot}
                      onChange={(e) =>
                        setSubCpmkForm({
                          ...subCpmkForm,
                          bobot: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Deskripsi Sub-Capaian
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={subCpmkForm.deskripsi}
                    onChange={(e) =>
                      setSubCpmkForm({
                        ...subCpmkForm,
                        deskripsi: e.target.value,
                      })
                    }
                    placeholder="Indikator kinerja spesifik..."
                  />
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">
                    Informasi Asesmen (IKU 7)
                  </h4>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-600">
                      Metode Penilaian
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                      value={subCpmkForm.metode_penilaian}
                      onChange={(e) =>
                        setSubCpmkForm({
                          ...subCpmkForm,
                          metode_penilaian: e.target.value,
                        })
                      }
                      placeholder="Contoh: Team-Based Project, Kuis, dll"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-600">
                      Instrumen Penilaian
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                      value={subCpmkForm.instrumen_penilaian}
                      onChange={(e) =>
                        setSubCpmkForm({
                          ...subCpmkForm,
                          instrumen_penilaian: e.target.value,
                        })
                      }
                      placeholder="Contoh: Rubrik Penilaian Laporan"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3 rounded-b-xl">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsSubCpmkModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" form="subCpmkForm">
                Simpan Sub-CPMK
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Topik Materi Pembelajaran */}
      {isTopikModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {topikForm.id
                  ? "Edit Topik Materi Pembelajaran"
                  : "Tambah Topik Materi Pembelajaran"}
              </h2>
            </div>
            <div className="p-6">
              <form
                id="topikForm"
                onSubmit={handleTopikSave}
                className="space-y-4"
              >
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium mb-1 text-slate-700">
                      Urutan
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-primary"
                      value={topikForm.urutan}
                      onChange={(e) =>
                        setTopikForm({
                          ...topikForm,
                          urutan: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm font-medium mb-1 text-slate-700">
                      Nama Topik Materi Pembelajaran
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-primary"
                      value={topikForm.nama}
                      onChange={(e) =>
                        setTopikForm({ ...topikForm, nama: e.target.value })
                      }
                      placeholder="Contoh: Konsep dasar anatomi..."
                    />
                  </div>
                </div>

                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-indigo-900">
                      Pembobotan Kedalaman (KAP)
                    </h4>
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded">
                      Bobot Topik:{" "}
                      {Number(topikForm.kedalaman_k || 0) +
                        Number(topikForm.kedalaman_a || 0) +
                        Number(topikForm.kedalaman_p || 0)}{" "}
                      Point
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Tentukan tingkat kedalaman taksonomi untuk topik ini.
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-blue-700 mb-1">
                        Kognitif (K)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="6"
                        className="w-full p-2 border border-blue-200 rounded-md text-sm outline-none focus:border-blue-500 bg-white"
                        value={topikForm.kedalaman_k}
                        onChange={(e) =>
                          setTopikForm({
                            ...topikForm,
                            kedalaman_k: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0-6"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-700 mb-1">
                        Afektif (A)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        className="w-full p-2 border border-amber-200 rounded-md text-sm outline-none focus:border-amber-500 bg-white"
                        value={topikForm.kedalaman_a}
                        onChange={(e) =>
                          setTopikForm({
                            ...topikForm,
                            kedalaman_a: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0-5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-700 mb-1">
                        Psikomotorik (P)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        className="w-full p-2 border border-purple-200 rounded-md text-sm outline-none focus:border-purple-500 bg-white"
                        value={topikForm.kedalaman_p}
                        onChange={(e) =>
                          setTopikForm({
                            ...topikForm,
                            kedalaman_p: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0-5"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3 rounded-b-xl">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsTopikModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" form="topikForm">
                Simpan Topik
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
