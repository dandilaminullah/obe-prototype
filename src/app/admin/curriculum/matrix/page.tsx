"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/Table";
import { Check, Info } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function MatrixCplBkMkPage() {
  const { role, prodiId } = useUser();
  const [kurikulums, setKurikulums] = useState<any[]>([]);
  const [selectedKurikulum, setSelectedKurikulum] = useState<string>("");

  const [courses, setCourses] = useState<any[]>([]);
  const [bks, setBks] = useState<any[]>([]);
  const [cpls, setCpls] = useState<any[]>([]);
  const [cpmks, setCpmks] = useState<any[]>([]);
  const [courseBks, setCourseBks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"cpl-bk" | "cpl-mk" | "cpl-cpmk">("cpl-bk");

  useEffect(() => {
    fetchInitialData();
  }, [role, prodiId]);

  useEffect(() => {
    if (selectedKurikulum) {
      fetchMatrixData(selectedKurikulum);
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
      setBks([]);
      setCpls([]);
      setCpmks([]);
      setLoading(false);
    }
  };

  const fetchMatrixData = async (kurikulumId: string) => {
    setLoading(true);
    const [courseRes, bkRes, cplRes, mapBkRes, cpmkRes] = await Promise.all([
      supabase
        .from("mata_kuliah")
        .select("*")
        .eq("kurikulum_id", kurikulumId)
        .order("kode"),
      supabase
        .from("bahan_kajian")
        .select("*")
        .eq("kurikulum_id", kurikulumId)
        .order("kode"),
      supabase
        .from("cpl")
        .select("*")
        .eq("kurikulum_id", kurikulumId)
        .order("kode"),
      supabase.from("mata_kuliah_bk").select("*"),
      supabase.from("cpmk").select("*").order("kode"),
    ]);
    if (courseRes.data) setCourses(courseRes.data);
    if (bkRes.data) setBks(bkRes.data);
    if (cplRes.data) setCpls(cplRes.data);
    if (mapBkRes.data) setCourseBks(mapBkRes.data);
    if (cpmkRes.data) setCpmks(cpmkRes.data);
    setLoading(false);
  };

  const formatCpmkDesc = (cpmk: any) => {
    if (!cpmk) return "-";
    const desc = cpmk.deskripsi || "";
    if (desc.includes("(K") || desc.includes("(A") || desc.includes("(P")) {
      return desc;
    }
    const hasK = cpmk.kedalaman_k !== undefined && cpmk.kedalaman_k !== null;
    const hasA = cpmk.kedalaman_a !== undefined && cpmk.kedalaman_a !== null;
    const hasP = cpmk.kedalaman_p !== undefined && cpmk.kedalaman_p !== null;

    if (hasK || hasA || hasP) {
      const kVal = cpmk.kedalaman_k ?? 0;
      const aVal = cpmk.kedalaman_a ?? 0;
      const pVal = cpmk.kedalaman_p ?? 0;
      return `${desc} (K${kVal}; A${aVal}; P${pVal})`;
    }
    return desc;
  };

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">Loading Matriks...</div>
    );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Matriks Kaitan Kurikulum
          </h1>
          <p className="text-gray-500">
            Visualisasi dan pemetaan hubungan antara Capaian Pembelajaran
            Lulusan (CPL), Bahan Kajian (BK), Mata Kuliah (MK), dan CPMK.
          </p>
        </div>
        <div>
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
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto">
        <button
          className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === "cpl-bk" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          onClick={() => setActiveTab("cpl-bk")}
        >
          Matriks CPL - BK
        </button>
        <button
          className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === "cpl-mk" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          onClick={() => setActiveTab("cpl-mk")}
        >
          Matriks CPL - MK
        </button>
        <button
          className={`py-2.5 px-4 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === "cpl-cpmk" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          onClick={() => setActiveTab("cpl-cpmk")}
        >
          Matriks CPL - CPMK
        </button>
      </div>

      {/* TAB 1: Matriks CPL - BK */}
      {activeTab === "cpl-bk" && (
        <Card>
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">
                  Matriks Kaitan CPL – BK
                </CardTitle>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Tabel 22. Matriks Kaitan CPL-BK
                </p>
              </div>
              <div className="flex items-center text-xs text-slate-500 bg-blue-50 text-blue-700 p-2 rounded-md border border-blue-100 w-fit">
                <Info className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span>
                  Pemetaan Bahan Kajian (BK) per Mata Kuliah ke Capaian
                  Pembelajaran Lulusan (CPL)
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table className="border-collapse">
              <TableHeader>
                <TableRow className="bg-slate-100/90 hover:bg-slate-100/90">
                  <TableHead
                    className="w-16 text-center font-bold text-slate-800 border border-slate-200"
                    rowSpan={2}
                  >
                    NO
                  </TableHead>
                  <TableHead
                    className="min-w-[220px] font-bold text-slate-800 border border-slate-200 p-3"
                    rowSpan={2}
                  >
                    MATA KULIAH
                  </TableHead>
                  <TableHead
                    className="w-28 text-center font-bold text-slate-800 border border-slate-200 p-3"
                    rowSpan={2}
                  >
                    KODE BK
                  </TableHead>
                  <TableHead
                    className="text-center font-bold text-slate-800 border border-slate-200 p-2"
                    colSpan={cpls.length || 1}
                  >
                    CAPAIAN PEMBELAJARAN LULUSAN
                  </TableHead>
                </TableRow>
                <TableRow className="bg-slate-100/90 hover:bg-slate-100/90">
                  {cpls.map((cpl) => (
                    <TableHead
                      key={cpl.id}
                      className="text-center font-bold text-slate-800 border border-slate-200 p-2 min-w-[85px] hover:bg-blue-200/70 transition-colors cursor-help group relative"
                      title={`${cpl.kode}: ${cpl.deskripsi}`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span>{cpl.kode}</span>
                        {/* Custom Floating Tooltip */}
                        <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 w-60 p-2.5 bg-slate-900 text-white text-xs font-normal rounded-lg shadow-xl z-50 pointer-events-none text-left">
                          <div className="font-bold text-blue-300 text-sm mb-0.5">
                            {cpl.kode}
                          </div>
                          <div className="text-slate-200 text-xs leading-snug">
                            {cpl.deskripsi}
                          </div>
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                        </div>
                      </div>
                    </TableHead>
                  ))}
                  {cpls.length === 0 && (
                    <TableHead className="text-center font-bold text-slate-800 border border-slate-200 p-2">
                      -
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course, courseIdx) => {
                  const assignedBks = courseBks
                    .filter((m) => m.mata_kuliah_id === course.id)
                    .map((m) => bks.find((b) => b.id === m.bk_id))
                    .filter(Boolean);

                  if (assignedBks.length === 0) {
                    return (
                      <TableRow
                        key={course.id}
                        className="hover:bg-slate-50/80"
                      >
                        <TableCell className="text-center font-medium border border-slate-200 text-slate-700">
                          {courseIdx + 1}
                        </TableCell>
                        <TableCell className="font-medium border border-slate-200 text-slate-800">
                          {course.nama}
                        </TableCell>
                        <TableCell className="text-center border border-slate-200 text-slate-400 font-medium">
                          -
                        </TableCell>
                        {cpls.map((cpl) => (
                          <TableCell
                            key={cpl.id}
                            className="text-center border border-slate-200 text-slate-300"
                          >
                            -
                          </TableCell>
                        ))}
                        {cpls.length === 0 && (
                          <TableCell className="text-center border border-slate-200 text-slate-300">
                            -
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  }

                  return assignedBks.map((bk, bkIdx) => (
                    <TableRow
                      key={`${course.id}-${bk.id}`}
                      className="hover:bg-slate-50/80"
                    >
                      {bkIdx === 0 && (
                        <>
                          <TableCell
                            rowSpan={assignedBks.length}
                            className="text-center font-medium border border-slate-200 text-slate-700 align-middle"
                          >
                            {courseIdx + 1}
                          </TableCell>
                          <TableCell
                            rowSpan={assignedBks.length}
                            className="font-medium border border-slate-200 text-slate-800 align-middle"
                          >
                            {course.nama}
                          </TableCell>
                        </>
                      )}
                      <TableCell
                        className="text-center font-semibold border border-slate-200 text-blue-700 bg-blue-50/30 hover:bg-blue-100/80 transition-colors cursor-help group relative"
                        title={`${bk?.kode}: ${bk?.nama}`}
                      >
                        <span>{bk?.kode}</span>
                        {/* Custom Floating Tooltip */}
                        <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-60 p-2.5 bg-slate-900 text-white text-xs font-normal rounded-lg shadow-xl z-50 pointer-events-none text-left">
                          <div className="font-bold text-blue-300 text-sm mb-0.5">
                            {bk?.kode}
                          </div>
                          <div className="text-slate-200 text-xs leading-snug mb-1">
                            {bk?.nama}
                          </div>
                          {bk?.cpl_id && (
                            <div className="text-[11px] text-emerald-300 border-t border-slate-700 pt-1 mt-1">
                              Target CPL:{" "}
                              <span className="font-semibold">
                                {cpls.find((c) => c.id === bk.cpl_id)?.kode ||
                                  "-"}
                              </span>
                            </div>
                          )}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                        </div>
                      </TableCell>
                      {cpls.map((cpl) => {
                        const isLinked = bk?.cpl_id === cpl.id;
                        return (
                          <TableCell
                            key={cpl.id}
                            className={`text-center border border-slate-200 p-2 transition-colors group relative ${isLinked ? "hover:bg-emerald-100/60 cursor-help" : "hover:bg-slate-100/50"}`}
                            title={
                              isLinked
                                ? `${cpl.kode} (${cpl.deskripsi}) terhubung via ${bk?.kode} - ${bk?.nama}`
                                : undefined
                            }
                          >
                            {isLinked ? (
                              <>
                                <Check className="w-5 h-5 text-emerald-600 font-extrabold mx-auto stroke-[3] group-hover:scale-110 transition-transform" />
                                {/* Custom Tooltip for Checkmark Cell */}
                                <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-60 p-2.5 bg-slate-900 text-white text-xs font-normal rounded-lg shadow-xl z-50 pointer-events-none text-left">
                                  <div className="font-bold text-emerald-400 text-xs mb-1 flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />{" "}
                                    Terhubung
                                  </div>
                                  <div className="text-slate-200 text-[11px] leading-snug">
                                    <span className="font-semibold text-white">
                                      {cpl.kode}
                                    </span>{" "}
                                    terhubung melalui Bahan Kajian{" "}
                                    <span className="font-semibold text-blue-300">
                                      {bk?.kode}
                                    </span>{" "}
                                    ({bk?.nama})
                                  </div>
                                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                                </div>
                              </>
                            ) : null}
                          </TableCell>
                        );
                      })}
                      {cpls.length === 0 && (
                        <TableCell className="text-center border border-slate-200 text-slate-300">
                          -
                        </TableCell>
                      )}
                    </TableRow>
                  ));
                })}
                {courses.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={cpls.length + 3}
                      className="text-center py-8 text-slate-500"
                    >
                      Belum ada data Mata Kuliah di kurikulum ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: Matriks CPL - MK */}
      {activeTab === "cpl-mk" && (
        <Card>
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">
                  Matriks Kaitan CPL - MK
                </CardTitle>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Tabel 23. Matriks Kaitan CPL-MK
                </p>
              </div>
              <div className="flex items-center text-xs text-slate-500 bg-blue-50 text-blue-700 p-2 rounded-md border border-blue-100 w-fit">
                <Info className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span>
                  Pemetaan Kaitan Capaian Pembelajaran Lulusan (CPL) dan Mata
                  Kuliah (MK)
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table className="border-collapse">
              <TableHeader>
                <TableRow className="bg-slate-100/90 hover:bg-slate-100/90">
                  <TableHead
                    className="w-16 text-center font-bold text-slate-800 border border-slate-200"
                    rowSpan={2}
                  >
                    NO
                  </TableHead>
                  <TableHead
                    className="min-w-[220px] font-bold text-slate-800 border border-slate-200 p-3"
                    rowSpan={2}
                  >
                    MATA KULIAH
                  </TableHead>
                  <TableHead
                    className="text-center font-bold text-slate-800 border border-slate-200 p-2"
                    colSpan={cpls.length || 1}
                  >
                    CAPAIAN PEMBELAJARAN LULUSAN
                  </TableHead>
                </TableRow>
                <TableRow className="bg-slate-100/90 hover:bg-slate-100/90">
                  {cpls.map((cpl) => (
                    <TableHead
                      key={cpl.id}
                      className="text-center font-bold text-slate-800 border border-slate-200 p-2 min-w-[85px] hover:bg-blue-200/70 transition-colors cursor-help group relative"
                      title={`${cpl.kode}: ${cpl.deskripsi}`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span>{cpl.kode}</span>
                        {/* Custom Floating Tooltip */}
                        <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 w-60 p-2.5 bg-slate-900 text-white text-xs font-normal rounded-lg shadow-xl z-50 pointer-events-none text-left">
                          <div className="font-bold text-blue-300 text-sm mb-0.5">
                            {cpl.kode}
                          </div>
                          <div className="text-slate-200 text-xs leading-snug">
                            {cpl.deskripsi}
                          </div>
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                        </div>
                      </div>
                    </TableHead>
                  ))}
                  {cpls.length === 0 && (
                    <TableHead className="text-center font-bold text-slate-800 border border-slate-200 p-2">
                      -
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course, courseIdx) => {
                  const assignedBks = courseBks
                    .filter((m) => m.mata_kuliah_id === course.id)
                    .map((m) => bks.find((b) => b.id === m.bk_id))
                    .filter(Boolean);

                  if (assignedBks.length === 0) {
                    return (
                      <TableRow
                        key={course.id}
                        className="hover:bg-slate-50/80"
                      >
                        <TableCell className="text-center font-medium border border-slate-200 text-slate-700">
                          {courseIdx + 1}
                        </TableCell>
                        <TableCell className="font-medium border border-slate-200 text-slate-800">
                          {course.nama}
                        </TableCell>
                        {cpls.map((cpl) => (
                          <TableCell
                            key={cpl.id}
                            className="text-center border border-slate-200 text-slate-300"
                          >
                            -
                          </TableCell>
                        ))}
                        {cpls.length === 0 && (
                          <TableCell className="text-center border border-slate-200 text-slate-300">
                            -
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  }

                  return assignedBks.map((bk, bkIdx) => (
                    <TableRow
                      key={`${course.id}-${bk.id}`}
                      className="hover:bg-slate-50/80"
                    >
                      {bkIdx === 0 && (
                        <>
                          <TableCell
                            rowSpan={assignedBks.length}
                            className="text-center font-medium border border-slate-200 text-slate-700 align-middle"
                          >
                            {courseIdx + 1}
                          </TableCell>
                          <TableCell
                            rowSpan={assignedBks.length}
                            className="font-medium border border-slate-200 text-slate-800 align-middle"
                          >
                            {course.nama}
                          </TableCell>
                        </>
                      )}
                      {cpls.map((cpl) => {
                        const isLinked = bk?.cpl_id === cpl.id;
                        return (
                          <TableCell
                            key={cpl.id}
                            className={`text-center border border-slate-200 p-2 transition-colors group relative ${isLinked ? "hover:bg-emerald-100/60 cursor-help" : "hover:bg-slate-100/50"}`}
                            title={
                              isLinked
                                ? `${cpl.kode} (${cpl.deskripsi}) dipetakan pada MK ${course.nama}`
                                : undefined
                            }
                          >
                            {isLinked ? (
                              <>
                                <Check className="w-5 h-5 text-emerald-600 font-extrabold mx-auto stroke-[3] group-hover:scale-110 transition-transform" />
                                {/* Custom Tooltip for Checkmark Cell */}
                                <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-60 p-2.5 bg-slate-900 text-white text-xs font-normal rounded-lg shadow-xl z-50 pointer-events-none text-left">
                                  <div className="font-bold text-emerald-400 text-xs mb-1 flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />{" "}
                                    Dipetakan
                                  </div>
                                  <div className="text-slate-200 text-[11px] leading-snug">
                                    <span className="font-semibold text-white">
                                      {cpl.kode}
                                    </span>{" "}
                                    terhubung dengan{" "}
                                    <span className="font-semibold text-amber-200">
                                      {course.nama}
                                    </span>
                                    {bk?.kode ? ` via ${bk.kode}` : ""}
                                  </div>
                                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                                </div>
                              </>
                            ) : null}
                          </TableCell>
                        );
                      })}
                      {cpls.length === 0 && (
                        <TableCell className="text-center border border-slate-200 text-slate-300">
                          -
                        </TableCell>
                      )}
                    </TableRow>
                  ));
                })}
                {courses.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={cpls.length + 2}
                      className="text-center py-8 text-slate-500"
                    >
                      Belum ada data Mata Kuliah di kurikulum ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      {/* TAB 3: Matriks CPL - CPMK */}
      {activeTab === "cpl-cpmk" && (
        <Card>
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">
                  Matriks Kaitan CPL – CPMK
                </CardTitle>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Tabel 24. Matriks Kaitan CPL-CPMK
                </p>
              </div>
              <div className="flex items-center text-xs text-slate-500 bg-blue-50 text-blue-700 p-2 rounded-md border border-blue-100 w-fit">
                <Info className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span>
                  Pemetaan Bahan Kajian (BK), Capaian Pembelajaran Lulusan (CPL), dan CPMK per Mata Kuliah
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table className="border-collapse">
              <TableHeader>
                <TableRow className="bg-slate-100/90 hover:bg-slate-100/90">
                  <TableHead className="w-16 text-center font-bold text-slate-800 border border-slate-200">
                    NO
                  </TableHead>
                  <TableHead className="min-w-[220px] font-bold text-slate-800 border border-slate-200 p-3">
                    MATA KULIAH
                  </TableHead>
                  <TableHead className="w-28 text-center font-bold text-slate-800 border border-slate-200 p-3">
                    KODE BK
                  </TableHead>
                  <TableHead className="w-28 text-center font-bold text-slate-800 border border-slate-200 p-3">
                    CPL
                  </TableHead>
                  <TableHead className="w-32 text-center font-bold text-slate-800 border border-slate-200 p-3">
                    CPMK
                  </TableHead>
                  <TableHead className="min-w-[320px] font-bold text-slate-800 border border-slate-200 p-3">
                    DESKRIPSI CPMK
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course, courseIdx) => {
                  const courseCpmks = cpmks.filter(
                    (c) => c.mata_kuliah_id === course.id
                  );
                  const courseBkMaps = courseBks.filter(
                    (m) => m.mata_kuliah_id === course.id
                  );
                  const courseBkList = courseBkMaps
                    .map((m) => bks.find((b) => b.id === m.bk_id))
                    .filter(Boolean);

                  if (courseCpmks.length === 0) {
                    const bkCodes =
                      courseBkList.map((b) => b.kode).join(", ") || "-";
                    const cplCodes =
                      Array.from(
                        new Set(
                          courseBkList
                            .map((b) => cpls.find((c) => c.id === b.cpl_id)?.kode)
                            .filter(Boolean)
                        )
                      ).join(", ") || "-";

                    return (
                      <TableRow key={course.id} className="hover:bg-slate-50/80">
                        <TableCell className="text-center font-medium border border-slate-200 text-slate-700 align-middle">
                          {courseIdx + 1}
                        </TableCell>
                        <TableCell className="font-medium border border-slate-200 text-slate-800 align-middle p-3">
                          {course.nama}
                        </TableCell>
                        <TableCell className="text-center font-medium border border-slate-200 text-slate-700 align-middle p-3">
                          {bkCodes}
                        </TableCell>
                        <TableCell className="text-center font-medium border border-slate-200 text-slate-700 align-middle p-3">
                          {cplCodes}
                        </TableCell>
                        <TableCell className="text-center border border-slate-200 text-slate-400 align-middle p-3">
                          -
                        </TableCell>
                        <TableCell className="border border-slate-200 text-slate-400 align-middle p-3">
                          Belum ada data CPMK
                        </TableCell>
                      </TableRow>
                    );
                  }

                  const groups: { bk: any; cpl: any; cpmks: any[] }[] = [];
                  courseCpmks.forEach((cpmk) => {
                    const bk =
                      bks.find((b) => b.id === cpmk.bk_id) ||
                      courseBkList[0] ||
                      null;
                    const cpl = bk?.cpl_id
                      ? cpls.find((c) => c.id === bk.cpl_id)
                      : null;
                    const key = bk ? bk.id : "no-bk";

                    let group = groups.find(
                      (g) => (g.bk ? g.bk.id : "no-bk") === key
                    );
                    if (!group) {
                      group = { bk, cpl, cpmks: [] };
                      groups.push(group);
                    }
                    group.cpmks.push(cpmk);
                  });

                  let globalIdxInCourse = 0;
                  const totalCourseRows = courseCpmks.length;

                  return groups.map((group) => {
                    return group.cpmks.map((cpmk, cpmkIdxInGroup) => {
                      const isFirstRowInCourse = globalIdxInCourse === 0;
                      const isFirstRowInGroup = cpmkIdxInGroup === 0;
                      globalIdxInCourse++;

                      return (
                        <TableRow
                          key={cpmk.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          {isFirstRowInCourse && (
                            <>
                              <TableCell
                                rowSpan={totalCourseRows}
                                className="text-center font-medium border border-slate-200 text-slate-700 align-middle"
                              >
                                {courseIdx + 1}
                              </TableCell>
                              <TableCell
                                rowSpan={totalCourseRows}
                                className="font-medium border border-slate-200 text-slate-800 align-middle p-3"
                              >
                                {course.nama}
                              </TableCell>
                            </>
                          )}
                          {isFirstRowInGroup && (
                            <>
                              <TableCell
                                rowSpan={group.cpmks.length}
                                className="text-center font-semibold border border-slate-200 text-blue-700 bg-blue-50/30 hover:bg-blue-100/80 transition-colors cursor-help group relative align-middle p-3"
                                title={group.bk ? `${group.bk.kode}: ${group.bk.nama}` : undefined}
                              >
                                <span>{group.bk?.kode || "-"}</span>
                                {group.bk && (
                                  <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-60 p-2.5 bg-slate-900 text-white text-xs font-normal rounded-lg shadow-xl z-50 pointer-events-none text-left">
                                    <div className="font-bold text-blue-300 text-sm mb-0.5">
                                      {group.bk.kode}
                                    </div>
                                    <div className="text-slate-200 text-xs leading-snug">
                                      {group.bk.nama}
                                    </div>
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell
                                rowSpan={group.cpmks.length}
                                className="text-center font-semibold border border-slate-200 text-slate-800 hover:bg-slate-100/70 transition-colors cursor-help group relative align-middle p-3"
                                title={group.cpl ? `${group.cpl.kode}: ${group.cpl.deskripsi}` : undefined}
                              >
                                <span>{group.cpl?.kode || "-"}</span>
                                {group.cpl && (
                                  <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-60 p-2.5 bg-slate-900 text-white text-xs font-normal rounded-lg shadow-xl z-50 pointer-events-none text-left">
                                    <div className="font-bold text-emerald-300 text-sm mb-0.5">
                                      {group.cpl.kode}
                                    </div>
                                    <div className="text-slate-200 text-xs leading-snug">
                                      {group.cpl.deskripsi}
                                    </div>
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                                  </div>
                                )}
                              </TableCell>
                            </>
                          )}
                          <TableCell className="text-center font-semibold border border-slate-200 text-blue-700 bg-blue-50/20 hover:bg-blue-100/60 transition-colors align-middle p-3">
                            {cpmk.kode}
                          </TableCell>
                          <TableCell className="border border-slate-200 text-slate-800 p-3 text-sm leading-relaxed align-middle">
                            {formatCpmkDesc(cpmk)}
                          </TableCell>
                        </TableRow>
                      );
                    });
                  });
                })}

                {courses.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-slate-500"
                    >
                      Belum ada data Mata Kuliah di kurikulum ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
